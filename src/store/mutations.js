import storage from './../utils/storage'

export default {
  saveUserInfo(state, payload){
    console.log(state)
    state.userInfo = payload;
    storage.setItem('userInfo', payload)
  }
}