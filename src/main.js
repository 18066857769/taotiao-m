import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载全局样式
import '../src/styes/icon.less'

//  加载全局样式
import '../src/styes/index.less'
// 加载vant核心组件库
import Vant from 'vant'

// 加载vant全局样式
import 'vant/lib/index.css'
// 加载动态设置REM基准值
import 'amfe-flexible'
import './utils/dayjs'
Vue.config.productionTip = false

// 注册使用vant组件库
Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
