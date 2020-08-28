import router from "./router.js";

import { getToken } from "@/utils/app.js";

const whiteRouter = ["/login"];

// 路由守卫
router.beforeEach((to, from, next) => {
  if (getToken()) {
    // 路由动态添加 分配菜单 每个角色分配不同的菜单
    next();
  } else {
    if (whiteRouter.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login');
    }
  }
})