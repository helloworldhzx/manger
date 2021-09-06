import { createStore } from 'vuex';
import mutations from "./mutations";
import storage from "@/utils/storage"
const state = {
  userInfo: storage.getItem('userInfo') || {},
  actionList: storage.getItem('actionList') || {},
  menuList: storage.getItem('menuList') || {},
}

const store = createStore({
  state,
  mutations
})

export default store