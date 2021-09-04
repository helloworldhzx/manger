import request from "../utils/request";

const api = {
  login(params) {
    return request({
      url: '/user/login',
      method: 'post',
      data: params
    })
  },
  getUserList(params) {
    return request({
      url: '/user/list',
      method: 'get',
      data: params
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
  getMenuList(data) {
    return request({
      url: '/menu/list',
      method: 'get',
      data
    })
  },
  menuSubmit(data) {
    return request({
      url: '/menu/operate',
      method: 'post',
      data
    })
  },
  getRoleList() {
    return request({
      url: '/role/allList',
      method: 'get',
      mock: true
    })
  },
  getDeptList() {
    return request({
      url: '/dept/list',
      method: 'get',
      mock: true
    })
  },
}
export default api