import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./../components/Home.vue"
import Welcome from "./../components/Welcome.vue"
import Login from "./../components/Login.vue"
const routes = [{
  path: "/",
  component: Home,
  redirect: "/welcome",
  children: [{
    path: "/welcome",
    component: Welcome,
  },{
    path: "/login",
    component: Login,
  }]
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router