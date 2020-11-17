import router from "./router.js";
import store from "../store/index.js";

import { getToken, removeToken, removeUsername } from "@/utils/app.js";

const whiteRouter = ["/login"];

// 路由守卫
router.beforeEach((to, from, next) => {
  // 这里直接使用getToken()方法获取token会存在一些问题：当人为输入token值时，通过url也能跳转
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
      /**
       * 1.什么时候处理动态路由
       * 2.以什么条件处理
       */
      // 用户登录时 判断用户的权限
      if (store.getters["app/roles"].length === 0) {
        // 如果状态 没有权限 就获取一次用户的权限 并取得权限值
        store.dispatch("permission/getRoles").then(response => {
          // 修改 角色权限状态
          store.commit("app/SET_ROLES", response);
          // response 获取到的用户角色
          // dispatch 创建路由的actions
          store.dispatch("permission/createRouter", response).then(response => {
            let newRouters = store.getters["permission/newRouters"];
            let allRouters = store.getters["permission/allRouters"];
            // 更新路由参数
            router.options.routes = allRouters;
            // 添加动态路由
            router.addRoutes(newRouters);
            next({ ...to, replace: true });
          }).catch();
        }).catch(error => { })
      } else {
        next();
      }
      // next();
    }
  } else {
    if (whiteRouter.indexOf(to.path) !== -1) {
      next(); // to
    } else {
      next("/login");
    }
  }
})