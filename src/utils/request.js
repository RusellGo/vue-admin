import axios from "axios";

// 创建axios
// Vue3.0后台管理系统API地址：http://www.web-jshtml.cn/productApi

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";

const service = axios.create({
  baseURL: BASEURL,
  timeout: 1000
});

// 请求拦截
service.interceptors.request.use(function (config) {
  // 请求之前做些什么
  return config;
}, function (error) {
  // 请求错误做些什么
  return Promise.reject(error);
})

// 响应拦截
service.interceptors.response.use(function (result) {
  // 对向应数据做些什么
  return result;
}, function (error) {
  // 响应错误做些什么
  return Promise.reject(error);
})

export default service;
