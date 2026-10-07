import { motion } from 'motion/react';
import { formatCount, formatDecimal, formatInteger } from '../lib/format';
import { Flourish, Seal } from './Ornaments';
import ProductImage from './ProductImage';
import StarBar from './StarBar';

const MEDAL_CLASSES = ['gold', 'silver', 'bronze'];

function WinnerHero({ winner }) {
  return (
    <motion.header
      className="ranking-hero"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
    >
      <motion.div layoutId="winner-plate" className="ranking-hero__plate">
        <ProductImage src={winner.image} name={winner.name} />
      </motion.div>
      <div className="ranking-hero__copy">
        <span className="winner-badge"><Seal /> المنتج الفائز</span>
        <motion.h1 layoutId="winner-name">{winner.name}</motion.h1>
        <p>{formatCount(winner.votes, 'votes')} · تقييم {formatDecimal(winner.avg_rating)} من ٥</p>
      </div>
    </motion.header>
  );
}

function RankingRow({ item, index, winnerId }) {
  const medal = MEDAL_CLASSES[index] || 'plain';
  const isWinner = item.id === winnerId;

  return (
    <motion.li
      className={'ranking-row ' + (isWinner ? 'ranking-row--winner' : '')}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.48, delay: 0.35 + index * 0.13, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <span className={'rank-medallion rank-medallion--' + medal}>{formatInteger(item.rank || index + 1)}</span>
      <ProductImage src={item.image} name={item.name} className="ranking-row__image" />
      <div className="ranking-row__name">
        <strong>{item.name}</strong>
        {isWinner && <span>اختيار الجمهور</span>}
      </div>
      <div className="ranking-row__rating">
        <div className="ranking-row__rating-summary">
          <StarBar value={item.avg_rating} delay={0.5 + index * 0.13} />
          <strong>{formatDecimal(item.avg_rating)}</strong>
        </div>
        <span>{formatCount(item.ratings_count, 'ratings')}</span>
      </div>
      <span className="ranking-row__votes">{formatCount(item.votes, 'votes')}</span>
    </motion.li>
  );
}

export default function Ranking({ data }) {
  const winner = data.winner || data.ranking[0];
  const ranking = data.ranking.slice(0, 8);

  if (!winner) return null;

  return (
    <motion.section className="screen ranking-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <WinnerHero winner={winner} />
      <motion.div
        className="ranking-sheet"
        style={{ '--row-count': ranking.length }}
        initial={{ opacity: 0, y: '22vh' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 17, delay: 0.08 }}
      >
        <div className="ranking-sheet__frame" aria-hidden="true" />
        <header className="ranking-sheet__heading">
          <div>
            <span>النتائج النهائية</span>
            <h2>ترتيب المنتجات حسب التقييم</h2>
            <Flourish />
          </div>
          <p>شارك <strong>{formatCount(data.total_responses, 'people')}</strong></p>
        </header>
        <ol className="ranking-list">
          {ranking.map((item, index) => (
            <RankingRow key={item.id} item={item} index={index} winnerId={winner.id} />
          ))}
        </ol>
      </motion.div>
    </motion.section>
  );
}
