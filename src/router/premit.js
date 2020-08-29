import router from "./router.js";
import store from "../store/index.js";

import { getToken, removeToken, removeUsername } from "@/utils/app.js";

const whiteRouter = ["/login"];

// 路由守卫
router.beforeEach((to, from, next) => {
  // 这里直接使用getToken()方法获取token会存在一些问题：当认为输入token值时，通过url也能跳转
  // if (getToken()) {
  if (store.state.app.token) {
    if (to.path === "/login") {
      removeToken();
      removeUsername();
      store.commit("app/SET_TOKEN", "");
      store.commit("app/SET_USERNAME", "");
      next();
    } else {
      // 获取用户角色
      // 动态分布路由权限
      next();
    }
  } else {
    if (whiteRouter.indexOf(to.path) !== -1) {
      next();
    } else {
      next("/login");
    }
  }
})