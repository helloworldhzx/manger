import axios from "axios";
import { ElMessage } from "element-plus";
import config from "./../config";
const TOKEN_ERROR = "token验证失败，请重新登录"
const NETWORKE_ERROR = "网络异常，请稍后再试"
const service  = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

service.interceptors.request.use((req) => {
  const { headers } = req;
  if(!headers.Authorization) headers.Authorization = 'zz'
  return req
})

service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data;
  if(code === 200){
    return data;
  } else if(code === 50001){
    ElMessage.error(TOKEN_ERROR);
    return Promise.reject(TOKEN_ERROR)
  } else{
    ElMessage.error(msg || NETWORKE_ERROR);
    return Promise.reject(msg || NETWORKE_ERROR)
  }
})

function request(option){
  option.method = option.method || 'get'
  if(option.method.toLowerCase()==='get'){
    option.params = option.data
  }

  if(config.env === 'prod'){
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }
  console.log(option)
  return service(option)
}

['get', 'post', 'put', 'delete', 'patch'].forEach(item => {
  request[item] = (url, data, option) => {
    return request({
      method: item,
      url,
      data,
      ...option
    })
  }
})

export default request