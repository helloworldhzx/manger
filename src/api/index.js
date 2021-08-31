import request from "../utils/request";

const api = {
  login(params){
    return request({
      url: '/user/login',
      method: 'post',
      data: params
    })
  }
}
export default api