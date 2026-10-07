import { motion } from 'motion/react';
import { formatCount, formatDecimal, formatPercentage } from '../lib/format';
import { Seal } from './Ornaments';
import ProductImage from './ProductImage';
import StarBar from './StarBar';

export default function WinnerReveal({ data }) {
  const winner = data.winner || data.ranking[0];

  if (!winner) return null;

  return (
    <motion.section className="screen winner-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="reveal-flash"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.15, ease: 'easeOut' }}
        aria-hidden="true"
      />
      <p className="winner-screen__kicker">والمنتج الفائز هو</p>
      <div className="winner-visual">
        <div className="winner-rays" aria-hidden="true" />
        <motion.div
          className="winner-plate-wrap"
          layoutId="winner-plate"
          initial={{ opacity: 0, scale: 0.6, y: 34 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 135, damping: 13, delay: 0.1 }}
        >
          <ProductImage src={winner.image} name={winner.name} className="winner-product" />
          <motion.div
            className="winner-seal"
            initial={{ opacity: 0, scale: 1.7, rotate: 18 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.58 }}
          >
            <Seal draw />
            <span>المنتج الفائز</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="winner-copy">
        <motion.h1
          layoutId="winner-name"
          initial={{ clipPath: 'inset(-30% 100% -40% 0%)', y: 14 }}
          animate={{ clipPath: 'inset(-30% 0% -40% 0%)', y: 0 }}
          transition={{ duration: 0.85, delay: 0.58, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {winner.name}
        </motion.h1>
        <motion.div
          className="winner-stats"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.02, duration: 0.55 }}
        >
          <span>{formatCount(winner.votes, 'votes')}</span>
          <i aria-hidden="true" />
          <span>{formatPercentage(winner.vote_pct)}٪ من المشاركين</span>
          <i aria-hidden="true" />
          <span className="winner-rating"><StarBar value={winner.avg_rating} delay={1.12} compact /> {formatDecimal(winner.avg_rating)}</span>
        </motion.div>
      </div>
    </motion.section>
  );
}
