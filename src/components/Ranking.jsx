import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { formatCount, formatDecimal, formatInteger, formatPercentage } from '../lib/format';
import { Flourish, Seal } from './Ornaments';
import ProductImage from './ProductImage';
import StarBar from './StarBar';

const MEDAL_CLASSES = ['gold', 'silver', 'bronze'];
const EASE = [0.2, 0.8, 0.2, 1];
const FILL_SECONDS = 1.5;
const MAX_ROWS = 8;

// The most voted product comes first; the winner and then the better rated one settle a tie.
function byVotes(winnerId) {
  return (a, b) =>
    b.votes - a.votes
    || (b.id === winnerId) - (a.id === winnerId)
    || b.avg_rating - a.avg_rating;
}

function WinnerHero({ winner }) {
  return (
    <motion.header
      className="ranking-hero"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
    >
      <motion.div
        className="ranking-hero__plate"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 135, damping: 13, delay: 0.1 }}
      >
        <ProductImage src={winner.image} name={winner.name} />
      </motion.div>
      <div className="ranking-hero__copy">
        <span className="winner-badge"><Seal /> المنتج الفائز</span>
        <motion.h1
          initial={{ clipPath: 'inset(-30% 0% -40% 100%)' }}
          animate={{ clipPath: 'inset(-30% 0% -40% 0%)' }}
          transition={{ duration: 0.85, delay: 0.3, ease: EASE }}
        >
          {winner.name}
        </motion.h1>
        <p>
          {formatPercentage(winner.vote_pct)} من {formatInteger(100)} · {formatCount(winner.votes, 'votes')}
        </p>
      </div>
    </motion.header>
  );
}

function VoteMeter({ item, delay }) {
  const percent = Math.min(100, Math.max(0, Number(item.vote_pct) || 0));
  const score = useMotionValue(0);
  const scoreText = useTransform(score, formatPercentage);

  useEffect(() => {
    const controls = animate(score, percent, { duration: FILL_SECONDS, delay, ease: EASE });
    return () => controls.stop();
  }, [score, percent, delay]);

  return (
    <div className="vote-meter">
      <div className="vote-meter__score">
        <motion.strong>{scoreText}</motion.strong>
        <span>من {formatInteger(100)}</span>
        <small>{formatCount(item.votes, 'votes')}</small>
      </div>
      <div className="vote-meter__track" aria-hidden="true">
        <motion.i
          initial={{ width: 0 }}
          animate={{ width: percent + '%' }}
          transition={{ duration: FILL_SECONDS, delay, ease: EASE }}
        />
      </div>
    </div>
  );
}

function RankingRow({ item, index, winnerId }) {
  const medal = MEDAL_CLASSES[index] || 'plain';
  const isWinner = item.id === winnerId;
  const entrance = 0.35 + index * 0.13;

  return (
    <motion.li
      className={'ranking-row ' + (isWinner ? 'ranking-row--winner' : '')}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.48, delay: entrance, ease: EASE }}
    >
      <span className={'rank-medallion rank-medallion--' + medal}>{formatInteger(index + 1)}</span>
      <ProductImage src={item.image} name={item.name} className="ranking-row__image" />
      <div className="ranking-row__name">
        <strong>{item.name}</strong>
        {isWinner && <span>اختيار الجمهور</span>}
      </div>
      <VoteMeter item={item} delay={entrance + 0.2} />
      <div className="ranking-row__rating">
        <div className="ranking-row__rating-summary">
          <StarBar value={item.avg_rating} delay={entrance + 0.2} compact />
          <strong>{formatDecimal(item.avg_rating)}</strong>
        </div>
        <span>{formatCount(item.ratings_count, 'ratings')}</span>
      </div>
    </motion.li>
  );
}

export default function Ranking({ data }) {
  const winner = data.winner || data.ranking[0];

  if (!winner) return null;

  const ranking = [...data.ranking].sort(byVotes(winner.id)).slice(0, MAX_ROWS);

  return (
    <motion.section className="screen ranking-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <motion.div
        className="reveal-flash"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.15, ease: 'easeOut' }}
        aria-hidden="true"
      />
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
            <h2>ترتيب المنتجات حسب الأصوات</h2>
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
