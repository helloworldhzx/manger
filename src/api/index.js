import request from "../utils/request";

const api = {
  login(params){
    return request({
      url: '/user/login',
      method: 'post',
      data: params
    })
  },
  getMuneList(){
    return request({
      url: '/menu/list',
      method: 'get'
    })
  }
}
export default api