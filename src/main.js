import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import 'element-ui/lib/theme-chalk/index.css'

// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器的样式并在 Vue 中绑定
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import dayjs from 'dayjs'
import axios from 'axios'

Vue.prototype.$dayjs = dayjs

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 配置拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

// 使用富文本编辑器
Vue.use(VueQuillEditor)

// 导入 element 全部组件
// import ElementUI from 'element-ui'
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
