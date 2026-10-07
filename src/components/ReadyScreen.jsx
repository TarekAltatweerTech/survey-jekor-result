import { motion } from 'motion/react';
import logo from '../assets/jekor-logo.png';
import { formatCount } from '../lib/format';
import { Flourish } from './Ornaments';

export default function ReadyScreen({ data, onStart, starting }) {
  const hasWinner = Boolean(data.winner);

  return (
    <motion.section
      className="screen ready-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5 }}
    >
      <div className="stage-frame" aria-hidden="true" />
      <motion.img
        className="brand-logo"
        src={logo}
        alt="جيكور"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      />

      <motion.div
        className="ready-screen__content"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.14, duration: 0.65 }}
      >
        <p className="brand-eyebrow"><span />{data.title}<span /></p>
        <h1>لحظة إعلان المنتج الفائز</h1>
        <Flourish />
        <p className="ready-screen__responses">
          شارك <strong>{formatCount(data.total_responses, 'people')}</strong> في الاستبيان
        </p>

        {hasWinner ? (
          <>
            <motion.button
              className="reveal-button"
              type="button"
              onClick={onStart}
              disabled={starting}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.985 }}
            >
              <span>{starting ? 'يتم التحضير…' : 'ابدأ العد التنازلي'}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 8 7-8 7V5Z" /></svg>
            </motion.button>
            <p className="keyboard-hint">أو اضغط <kbd>مسافة</kbd></p>
          </>
        ) : (
          <div className="no-votes" role="status">
            <strong>لا توجد أصوات بعد</strong>
            <span>ستظهر النتيجة هنا بعد وصول أول مشاركة</span>
          </div>
        )}
      </motion.div>
      <p className="ready-screen__footer">النتائج النهائية · جيكور</p>
    </motion.section>
  );
}
