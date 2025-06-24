// 分类管理 API
const db = () => window.cloudbase.database()

export async function fetchCategories() {
  const res = await db().collection('categories').orderBy('parent', 'asc').orderBy('id', 'asc').get()
  return (res.data || []).map(item => ({
    ...(item.data || item),
    _id: item._id
  }))
}

export async function addCategory(data) {
  return db().collection('categories').add({ data })
}

export async function updateCategory(id, data) {
  return db().collection('categories').doc(id).update({ data })
}

export async function deleteCategory(id) {
  return db().collection('categories').doc(id).remove()
} 