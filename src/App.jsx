import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import Controls from './components/Controls';
import Countdown from './components/Countdown';
import Fireworks from './components/Fireworks';
import Ranking from './components/Ranking';
import ReadyScreen from './components/ReadyScreen';
import WinnerReveal from './components/WinnerReveal';
import { fetchResults } from './lib/api';
import { ShowAudio } from './lib/audio';
import { demoResults } from './lib/demo';
import { countdownSeconds, isDemoMode } from './lib/format';

const SHOW_SECONDS = countdownSeconds();
const DEMO_MODE = isDemoMode();

function LoadingScreen() {
  return (
    <section className="screen status-screen" aria-live="polite">
      <div className="stage-frame" aria-hidden="true" />
      <span className="loader-mark" aria-hidden="true"><i /><i /></span>
      <h1>نحضّر النتائج</h1>
      <p>لحظات قليلة وتبدأ أمسية الكشف</p>
    </section>
  );
}

function ErrorScreen({ message, onRetry }) {
  return (
    <section className="screen status-screen" role="alert">
      <div className="stage-frame" aria-hidden="true" />
      <span className="error-mark" aria-hidden="true">!</span>
      <h1>تعذّر عرض النتائج</h1>
      <p>{message}</p>
      <button type="button" className="retry-button" onClick={onRetry}>إعادة المحاولة</button>
    </section>
  );
}

export default function App() {
  const [phase, setPhase] = useState('loading');
  const [results, setResults] = useState(null);
  const [presentedResults, setPresentedResults] = useState(null);
  const [error, setError] = useState('');
  const [timeline, setTimeline] = useState(null);
  const [now, setNow] = useState(() => performance.now());
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement));
  const [idle, setIdle] = useState(false);
  const [starting, setStarting] = useState(false);

  const resultsRef = useRef(null);
  const audioRef = useRef(null);
  const requestRef = useRef(null);
  const startingRef = useRef(false);
  const revealedRef = useRef(false);
  const idleTimerRef = useRef(null);

  const applyResults = useCallback((data) => {
    resultsRef.current = data;
    setResults(data);
  }, []);

  const loadResults = useCallback(async ({ quiet = false } = {}) => {
    if (requestRef.current) requestRef.current.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    if (!quiet) {
      setPhase('loading');
      setError('');
    }

    try {
      const data = DEMO_MODE ? demoResults : await fetchResults({ signal: controller.signal });
      if (controller.signal.aborted) return null;
      applyResults(data);
      if (!quiet) setPhase('ready');
      return data;
    } catch (loadError) {
      if (loadError.name === 'AbortError') return null;
      if (!quiet) {
        setError(loadError.message || 'حدث خطأ غير متوقع.');
        setPhase('error');
      }
      return null;
    }
  }, [applyResults]);

  useEffect(() => {
    const audio = new ShowAudio();
    audioRef.current = audio;
    void audio.load();
    void loadResults();

    return () => {
      requestRef.current?.abort();
      audio.destroy();
    };
  }, [loadResults]);

  useEffect(() => {
    if (!timeline) return undefined;
    let frame;

    const updateClock = (time) => {
      if (!revealedRef.current && time >= timeline.revealPerf) {
        revealedRef.current = true;
        setPresentedResults(resultsRef.current);
        setPhase('reveal');
      } else if (!revealedRef.current) {
        setNow(time);
      }

      if (time >= timeline.revealPerf + 5500) {
        setPhase('ranking');
        return;
      }

      frame = requestAnimationFrame(updateClock);
    };

    frame = requestAnimationFrame(updateClock);
    return () => cancelAnimationFrame(frame);
  }, [timeline]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen?.().catch(() => {});
    } else {
      void document.documentElement.requestFullscreen?.().catch(() => {});
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      audioRef.current?.setMuted(next);
      return next;
    });
  }, []);

  const startShow = useCallback(async () => {
    if (startingRef.current || phase !== 'ready' || !resultsRef.current?.winner) return;
    startingRef.current = true;
    setStarting(true);
    void document.documentElement.requestFullscreen?.().catch(() => {});
    void loadResults({ quiet: true });

    const showTimeline = await audioRef.current.startShow(SHOW_SECONDS);
    revealedRef.current = false;
    setNow(showTimeline.startPerf);
    setTimeline({ ...showTimeline, seconds: SHOW_SECONDS });
    setPhase('countdown');
    setStarting(false);
    startingRef.current = false;
  }, [loadResults, phase]);

  const replay = useCallback(() => {
    audioRef.current?.stop();
    revealedRef.current = false;
    startingRef.current = false;
    setStarting(false);
    setTimeline(null);
    setPresentedResults(null);
    if (resultsRef.current) {
      setPhase('ready');
      void loadResults({ quiet: true });
    } else {
      void loadResults();
    }
  }, [loadResults]);

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    const showControls = () => {
      setIdle(false);
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => setIdle(true), 3000);
    };

    showControls();
    window.addEventListener('pointermove', showControls, { passive: true });
    window.addEventListener('pointerdown', showControls, { passive: true });
    return () => {
      window.clearTimeout(idleTimerRef.current);
      window.removeEventListener('pointermove', showControls);
      window.removeEventListener('pointerdown', showControls);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        toggleMute();
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFullscreen();
      } else if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        replay();
      } else if ((event.code === 'Space' || event.key === 'Enter') && phase === 'ready') {
        event.preventDefault();
        void startShow();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, replay, startShow, toggleFullscreen, toggleMute]);

  const showData = presentedResults || results;

  return (
    <main className={'app app--' + phase + (idle ? ' is-idle' : '')}>
      <div className="ambient-glow" aria-hidden="true" />
      {timeline && (phase === 'reveal' || phase === 'ranking') && (
        <Fireworks originTime={timeline.revealPerf} />
      )}
      <LayoutGroup>
        <AnimatePresence mode="sync">
          {phase === 'loading' && <motion.div key="loading" className="phase"><LoadingScreen /></motion.div>}
          {phase === 'error' && <motion.div key="error" className="phase"><ErrorScreen message={error} onRetry={() => loadResults()} /></motion.div>}
          {phase === 'ready' && results && <motion.div key="ready" className="phase"><ReadyScreen data={results} onStart={startShow} starting={starting} /></motion.div>}
          {phase === 'countdown' && timeline && (
            <motion.div key="countdown" className="phase">
              <Countdown now={now} startPerf={timeline.startPerf} revealPerf={timeline.revealPerf} seconds={timeline.seconds} />
            </motion.div>
          )}
          {phase === 'reveal' && showData && timeline && (
            <motion.div key="reveal" className="phase"><WinnerReveal data={showData} /></motion.div>
          )}
          {phase === 'ranking' && showData && <motion.div key="ranking" className="phase"><Ranking data={showData} /></motion.div>}
        </AnimatePresence>
      </LayoutGroup>
      <Controls muted={muted} fullscreen={fullscreen} onMute={toggleMute} onFullscreen={toggleFullscreen} onReplay={replay} />
    </main>
  );
}
