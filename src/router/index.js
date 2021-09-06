import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./../components/Home.vue"
import utils from "../utils/utils"
import storage from "../utils/storage"
import API from "../api"
const routes = [{
  name: "home",
  path: "/",
  component: Home,
  redirect: "/welcome",
  meta: {
    title: '首页'
  },
  children: [{
    name: "Welcome",
    path: "/welcome",
    meta: {
      title: '欢迎页'
    },
    component: () => import('./../views/Welcome.vue'),
  }]
},
{
  name: "Login",
  path: "/login",
  component: () => import('./../views/Login.vue'),
}, {
  name: "404",
  path: "/404",
  component: () => import('./../views/404.vue'),
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export async function loadAsyncRoutes() {
  const userInfo = storage.getItem("userInfo") || {}
  if (userInfo.token) {
    const { menuList } = await API.getPermissionMenu();
    const routers = utils.generateRoute(menuList)
    routers.forEach(item => {
      const url = `../views/${item.component}.vue`
      item.component = () => import(url)
      router.addRoute("home", item)
    })
  }

}

await loadAsyncRoutes();
/* function checkPermission(path) {
  let hasPermission = router.getRoutes().filter(route => route.path == path).length;
  if (hasPermission) {
    return true;
  } else {
    return false;
  }
} */
router.beforeEach((to, from, next) => {
  if (router.hasRoute(to.name)) {
    document.title = to.meta.title;
    next()
  } else {
    next('/404')
  }
})
export default router