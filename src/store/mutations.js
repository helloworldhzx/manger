import storage from './../utils/storage'

export default {
  saveUserInfo(state, payload) {
    state.userInfo = payload;
    storage.setItem('userInfo', payload)
  },
  saveActionList(state, payload) {
    state.actionList = payload;
    storage.setItem('actionList', payload)
  },
  saveMenuList(state, payload) {
    state.menuList = payload;
    storage.setItem('menuList', payload)
  }
}