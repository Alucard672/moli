import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import cloudbase from '@cloudbase/js-sdk'
import router from './router'

// 初始化 cloudbase
const cloudbaseApp = cloudbase.init({
  env: 'cloud1-3gczd9wwc26ab81f', // 你的云开发环境ID，若有多个环境请改为实际ID
  region: 'ap-shanghai' // 建议加上 region，与你 COS 桶一致
})
window.cloudbase = cloudbaseApp
// 兼容匿名登录
if (cloudbaseApp.auth && cloudbaseApp.auth().hasOwnProperty('anonymousAuthProvider')) {
  cloudbaseApp.auth().anonymousAuthProvider().signIn()
} else {
  cloudbaseApp.auth().signInAnonymously()
}

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
