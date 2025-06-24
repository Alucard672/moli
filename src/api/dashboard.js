const db = () => window.cloudbase.database()

export async function getArticleCount() {
  const res = await db().collection('articles').count()
  return res.total
}
export async function getCategoryCount() {
  const res = await db().collection('categories').count()
  return res.total
}
export async function getBannerCount() {
  const res = await db().collection('banners').count()
  return res.total
}
export async function getRecentArticles(limit = 5) {
  const res = await db().collection('articles').orderBy('createdAt', 'desc').limit(limit).get()
  return res.data
} 