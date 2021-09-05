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
  getAllUserList() {
    return request({
      url: '/user/alllist',
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
  getMenuList(data) {
    return request({
      url: '/menu/list',
      method: 'get',
      data
    })
  },
  getPermissionMenu() {
    return request({
      url: '/menu/permissionList',
      method: 'get'
    })
  },
  menuSubmit(data) {
    return request({
      url: '/menu/operate',
      method: 'post',
      data
    })
  },
  getAllRoleList() {
    return request({
      url: '/role/allList',
      method: 'get',
    })
  },
  getRoleList(data) {
    return request({
      url: '/role/list',
      method: 'get',
      data
    })
  },
  roleSubmit(data) {
    return request({
      url: '/role/operate',
      method: 'post',
      data
    })
  },
  updatePermission(data) {
    return request({
      url: '/role/update/permission',
      method: 'post',
      data
    })
  },
  getDeptList(data) {
    return request({
      url: '/dept/list',
      method: 'get',
      data
    })
  },
  deptSubmit(data) {
    return request({
      url: '/dept/operate',
      method: 'post',
      data
    })
  },
}
export default api