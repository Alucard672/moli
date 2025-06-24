// 轮播图管理 API
const db = () => window.cloudbase.database()

export async function fetchBanners() {
  const res = await db().collection('banners').orderBy('sort', 'asc').get()
  return (res.data || []).map(item => ({
    ...(item.data || item),
    _id: item._id
  }))
}

export async function addBanner(data) {
  const banner = {
    title: data.title,
    imageFileID: data.imageFileID || '',
    imgUrl: data.imgUrl || '',
    linkUrl: data.linkUrl || '',
    sort: data.sort || 0,
    isActive: data.isActive || false,
    isBase64: data.isBase64 || false,
    createTime: new Date(),
    updateTime: new Date()
  }
  return db().collection('banners').add({ data: banner })
}

export async function updateBanner(id, data) {
  const banner = {
    title: data.title,
    imageFileID: data.imageFileID || '',
    imgUrl: data.imgUrl || '',
    linkUrl: data.linkUrl || '',
    sort: data.sort || 0,
    isActive: data.isActive || false,
    isBase64: data.isBase64 || false,
    updateTime: new Date()
  }
  return db().collection('banners').doc(id).update({ data: banner })
}

export async function deleteBanner(id) {
  return db().collection('banners').doc(id).remove()
} 