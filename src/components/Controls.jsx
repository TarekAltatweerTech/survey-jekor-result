function SoundIcon({ muted }) {
  return muted ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5l4.5 4V5Zm4.2 5.1 4.7 4.7m0-4.7-4.7 4.7" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5l4.5 4V5Zm4 4a4.2 4.2 0 0 1 0 6m2.8-8.5a7.8 7.8 0 0 1 0 11" /></svg>
  );
}

export default function Controls({ muted, fullscreen, onMute, onFullscreen, onReplay }) {
  return (
    <aside className="show-controls" aria-label="أدوات العرض">
      <button type="button" onClick={onMute} aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'} title="الصوت (M)">
        <SoundIcon muted={muted} />
      </button>
      <button type="button" onClick={onFullscreen} aria-label={fullscreen ? 'إنهاء ملء الشاشة' : 'ملء الشاشة'} title="ملء الشاشة (F)">
        {fullscreen ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4m11-5v5h5M9 20v-5H4m11 5v-5h5" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M9 20H4v-5m11 5h5v-5" /></svg>
        )}
      </button>
      <button type="button" onClick={onReplay} aria-label="إعادة العرض" title="إعادة العرض (R)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8V3m0 0h5M5 3l3.2 3.2A8 8 0 1 1 4 13" /></svg>
      </button>
    </aside>
  );
}
