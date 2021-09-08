import { createApp } from 'vue'
import ElementPlus from "element-plus"
import App from './App.vue'
import router from "./router"
import request from "./utils/request"
import storage from './utils/storage'
import api from './api'
import store from "./store"
import 'element-plus/dist/index.css'
import Vue2OrgTree from './components/orgTree/main'

const app = createApp(App);
app.directive('has', function (el, binding) {
  if (!store.state.actionList.includes(binding.value)) {
    el.style = 'display:none';
    setTimeout(() => {
      el.parentNode && el.parentNode.removeChild(el);
    }, 0)
  }
})
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api
app.use(router).use(store).use(ElementPlus).use(Vue2OrgTree).mount('#app')
