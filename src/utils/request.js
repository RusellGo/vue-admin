import axios from "axios";
// 导入element-ui的消息提示对象
import { Message } from "element-ui";

// 创建axios
// Vue3.0后台管理系统API地址：http://www.web-jshtml.cn/productApi

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";

const service = axios.create({
  baseURL: BASEURL,
  timeout: 15000 // 超时设置
});

// 请求拦截
service.interceptors.request.use(function (config) {
  // 请求之前做些什么
  // Token

  // 最终目的就是在请求头添加参数
  // config.headers["Token"] = "1111";
  // config.headers["userID"] = "2222";

  return config;
}, function (error) {
  // 请求错误做些什么
  return Promise.reject(error);
})

// 响应拦截
service.interceptors.response.use(function (result) {
  // 对响应数据做些什么
  if (result.data.resCode !== 0) {
    Message.error(result.data.message);
    return Promise.reject(result.data);
  } else {
    return result;
  }
}, function (error) {
  // 响应错误做些什么
  return Promise.reject(error);
})

export default service;
