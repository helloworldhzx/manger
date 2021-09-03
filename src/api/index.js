import request from "../utils/request";

const api = {
  login(params) {
    return request({
      url: '/user/login',
      method: 'post',
      data: params
    })
  },
  getMenuList() {
    return request({
      url: '/menu/list',
      method: 'get'
    })
  },
  getUserList(params) {
    return request({
      url: '/user/list',
      method: 'get',
      data: params
    })
  },
  getRoleList() {
    return request({
      url: '/role/allList',
      method: 'get'
    })
  },
  getDeptList() {
    return request({
      url: '/dept/list',
      method: 'get'
    })
  },
  userSubmit(data) {
    return request({
      url: '/user/operate',
      method: 'post',
      data
    })
  },
  userDel(data) {
    return request({
      url: '/user/delete',
      method: 'post',
      data
    })
  },
}
export default api