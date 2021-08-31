import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./../components/Home.vue"
import Welcome from "./../views/Welcome.vue"
const routes = [{
  path: "/",
  component: Home,
  redirect: "/welcome",
  children: [{
    path: "/welcome",
    component: Welcome,
  }]
},
{
  path: "/login",
  component: () => import('./../views/Login.vue'),
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router