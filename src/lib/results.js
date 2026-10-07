// The server's `vote_pct` divides by every response of the survey, which also counts answers
// given to products removed since. The screen needs each product's share of the votes shown
// on it, so the shares always add up to 100.
export function withVoteShares(data) {
  const votesOf = (item) => Number(item.votes) || 0;
  const totalVotes = data.ranking.reduce((sum, item) => sum + votesOf(item), 0);
  const share = (item) => ({
    ...item,
    vote_pct: totalVotes > 0 ? (votesOf(item) * 100) / totalVotes : 0,
  });

  return {
    ...data,
    winner: data.winner ? share(data.winner) : null,
    ranking: data.ranking.map(share),
  };
}
