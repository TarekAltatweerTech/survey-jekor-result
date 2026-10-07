import { motion } from 'motion/react';

function Stars() {
  return Array.from({ length: 5 }, (_, index) => (
    <svg key={index} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2.7 2.84 5.75 6.35.92-4.6 4.48 1.09 6.32L12 17.18l-5.68 2.99 1.09-6.32-4.6-4.48 6.35-.92L12 2.7Z" />
    </svg>
  ));
}

export default function StarBar({ value, delay = 0, compact = false }) {
  const percent = Math.min(100, Math.max(0, (Number(value) / 5) * 100));

  return (
    <div className={'star-bar ' + (compact ? 'star-bar--compact' : '')} aria-label={'التقييم ' + value + ' من 5'}>
      <div className="star-bar__track"><Stars /></div>
      <motion.div
        className="star-bar__fill"
        initial={{ width: 0 }}
        animate={{ width: percent + '%' }}
        transition={{ duration: 0.85, delay, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="star-bar__fill-stars"><Stars /></div>
      </motion.div>
    </div>
  );
}
