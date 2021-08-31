
const env = import.meta.env.MODE || 'prod';
const envConfig = {
  dev: {
    baseApi: "/api",
    mockApi: "https://www.fastmock.site/mock/71d3ed355c636cf7cdf0da018b729e18/api"
  },
  test: {
    baseApi: "/api",
    mockApi: ""
  },
  prod: {
    baseApi: "/api",
    mockApi: ""
  }
}

export default {
  env,
  mock: false,
  ...envConfig[env]
}