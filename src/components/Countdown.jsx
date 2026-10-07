import { AnimatePresence, motion } from 'motion/react';
import { formatInteger } from '../lib/format';

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Countdown({ now, startPerf, revealPerf, seconds }) {
  const remainingMs = Math.max(0, Math.min(seconds * 1000, revealPerf - now));
  const numeral = Math.max(1, Math.ceil(remainingMs / 1000));
  const progress = Math.min(1, Math.max(0, remainingMs / (seconds * 1000)));
  const isFinal = remainingMs <= 3000;
  const elapsed = Math.max(0, now - startPerf);

  return (
    <motion.section
      className={'screen countdown-screen ' + (isFinal ? 'countdown-screen--final' : '')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ '--dim-progress': Math.min(1, Math.max(0, (elapsed - (seconds - 3) * 1000) / 3000)) }}
    >
      <div className="countdown-screen__vignette" aria-hidden="true" />
      <p className="countdown-screen__label">استعدوا للكشف عن الفائز</p>
      <div className="countdown-clock">
        <svg className="countdown-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="countdown-ring__track" cx="50" cy="50" r={RADIUS} />
          <circle
            className="countdown-ring__progress"
            cx="50"
            cy="50"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={numeral}
            className="countdown-clock__number"
            initial={{ opacity: 0, scale: 1.38, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.68, filter: 'blur(10px)' }}
            transition={{ duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {formatInteger(numeral)}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="countdown-dots" aria-hidden="true"><i /><i /><i /></div>
    </motion.section>
  );
}
