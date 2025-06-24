import COS from 'cos-js-sdk-v5'

// 实例化 COS，临时密钥由后端接口签发
const cos = new COS({
  getAuthorization: function (options, callback) {
    // 建议用后端接口获取临时密钥
    fetch('/api/cos-sts').then(res => res.json()).then(data => {
      callback({
        TmpSecretId: data.credentials.tmpSecretId,
        TmpSecretKey: data.credentials.tmpSecretKey,
        XCosSecurityToken: data.credentials.sessionToken,
        StartTime: data.startTime,
        ExpiredTime: data.expiredTime
      })
    })
  }
})

export function uploadToCos(file) {
  return new Promise((resolve, reject) => {
    const ext = file.name.split('.').pop()
    const key = `uploads/${Date.now()}_${Math.floor(Math.random()*10000)}.${ext}`
    cos.putObject({
      Bucket: 'moli-1317160766', // 你的桶名
      Region: 'ap-shanghai',      // 桶所在地域
      Key: key,
      Body: file,
      onProgress: function (progressData) {
        // 可选：进度回调
      }
    }, function (err, data) {
      if (err) {
        reject(err)
      } else {
        // 拼接图片访问地址
        const url = `https://moli-1317160766.cos.ap-shanghai.myqcloud.com/${key}`
        resolve(url)
      }
    })
  })
} 