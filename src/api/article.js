// 文章管理 API
const db = () => window.cloudbase.database()

export async function fetchArticles({ page = 1, pageSize = 10, title = '' }) {
  const query = db().collection('articles')
  let _query = query
  if (title) {
    _query = _query.where({ 'data.title': db().RegExp({ regexp: title, options: 'i' }) })
  }
  const totalRes = await _query.count()
  const total = totalRes.total
  const dataRes = await _query.orderBy('data.createTime', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get()
  const data = (dataRes.data || []).map(item => {
    const d = item.data || {}
    return {
      ...d,
      _id: item._id,
      _openid: item._openid,
      title: d.title || d.articleTitle || '',
      mainCategoryName: d.mainCategoryName || d.category_name || '',
      createdAt: d.createdAt || d.createTime || '',
    }
  })
  return { data, total }
}

export async function addArticle(data) {
  const now = new Date()
  const article = {
    title: data.title,
    mainCategory: data.mainCategory || data.category_id || '',
    mainCategoryName: data.mainCategoryName || data.category_name || '',
    content: data.content,
    coverUrl: data.coverUrl || '',
    summary: data.summary || '',
    createTime: now,
    publishTime: now,
    author: 'admin'
  }
  return db().collection('articles').add({ data: article })
}

export async function updateArticle(id, data) {
  return db().collection('articles').doc(id).update({ data })
}

export async function deleteArticle(id) {
  return db().collection('articles').doc(id).remove()
} 