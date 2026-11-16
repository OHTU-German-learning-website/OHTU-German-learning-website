export function sortNewsArticles(articles = []) {
  return [...articles].sort((a, b) => {
    const pinOrder =
      Number(Boolean(b.is_pinned)) - Number(Boolean(a.is_pinned));
    if (pinOrder !== 0) return pinOrder;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}
