import { createApp } from 'vue'
import ElementPlus from "element-plus"
import App from './App.vue'
import router from "./router"
import request from "./utils/request"
import 'element-plus/dist/index.css'

console.log('环境变量', import.meta.env)

const app = createApp(App);
app.config.globalProperties.$request = request
app.use(router).use(ElementPlus).mount('#app')
