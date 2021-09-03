import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./../components/Home.vue"
const routes = [{
  path: "/",
  component: Home,
  redirect: "/welcome",
  meta: {
    title: '首页'
  },
  children: [{
    path: "/welcome",
    meta: {
      title: '欢迎页'
    },
    component: () => import('./../views/Welcome.vue'),
  }, {
    path: "/system/user",
    meta: {
      title: '用户管理'
    },
    component: () => import('./../views/User.vue')
  }, {
    path: "/system/menu",
    meta: {
      title: '菜单管理'
    },
    component: () => import('./../views/User.vue')
  }, {
    path: "/system/role",
    meta: {
      title: '角色管理'
    },
    component: () => import('./../views/User.vue')
  }, {
    path: "/system/dept",
    meta: {
      title: '部门管理'
    },
    component: () => import('./../views/User.vue')
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