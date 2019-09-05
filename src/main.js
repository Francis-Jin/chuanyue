// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import store from './store/store'
import router from './router'
import iView from 'iview'
import axios from 'axios'
import Qs from 'qs'
import ElementUi from 'element-ui'
import Vant, {Toast, ImagePreview} from 'vant'

// 引入接口配置文件
import * as api from './api/api'

// 使用ui框架的 CSS
import 'iview/dist/styles/iview.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'vant/lib/index.css'

// 引入rem
import './common/rem'
import GLOBAL from './components/Globel'
import share from './common/share'
Vue.use(share)
Vue.prototype.GLOBAL = GLOBAL

Vue.prototype.$imagePreview = ImagePreview
Vue.prototype.$api = api
Vue.prototype.$axios = axios
Vue.prototype.$Qs = Qs
// 启用
Vue.use(Vuex)
Vue.use(iView)
Vue.use(ElementUi)
Vue.use(Vant)

// 是否阻止启动生产消息
Vue.config.productionTip = false
Vue.prototype.$toast = Toast

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
