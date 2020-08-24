import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login/Login.vue"),
    hidden: true,
    meta: {
      name: "登录"
    }
  },
  /**
   * 控制台
   */
  {
    path: "/console",
    name: "Console",
    redirect: "/index",
    component: () => import("../views/Layout/Layout.vue"),
    meta: {
      name: "控制台"
    },
    children: [
      {
        path: "/index",
        name: "Index",
        component: () => import("../views/Console/Console.vue"),
        meta: {
          name: "首页"
        }
      }
    ]
  },
  /**
   * 信息管理
   */
  {
    path: "/info",
    name: "Info",
    component: () => import("../views/Layout/Layout.vue"),
    meta: {
      name: "信息管理"
    },
    children: [
      {
        path: "/infoList",
        name: "InfoList",
        component: () => import("../views/Info/InfoList.vue"),
        meta: {
          name: "信息列表"
        }
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        component: () => import("../views/Info/InfoCategory.vue"),
        meta: {
          name: "信息分类"
        }
      }
    ]
  },
  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    component: () => import("../views/Layout/Layout.vue"),
    meta: {
      name: "用户管理"
    },
    children: [
      {
        path: "/userList",
        name: "UserList",
        component: () => import("../views/User/UserList.vue"),
        meta: {
          name: "用户列表"
        }
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
