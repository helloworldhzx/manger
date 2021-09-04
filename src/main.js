import { createApp } from 'vue'
import ElementPlus from "element-plus"
import App from './App.vue'
import router from "./router"
import request from "./utils/request"
import storage from './utils/storage'
import api from './api'
import store from "./store"
import 'element-plus/dist/index.css'

const app = createApp(App);
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api
app.use(router).use(store).use(ElementPlus).mount('#app')
