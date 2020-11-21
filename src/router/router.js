import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

/**
 *
 * 1.系统分配
 * 2.角色分配
 */
/**
 * 1.默认路由
 * 2.动态路由
 */

// 路由懒加载
const Layout = () => import("../views/Layout/Layout.vue");

/**
 * 默认路由
 */
// 要动态创建路由 将默认路由导出
export const defaultRouterMap = [
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
    component: Layout,
    meta: {
      name: "控制台",
      icon: "console"
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
  // 404页面
  {
    path: "/page404",
    meta: {
      name: "404",
      icon: "404"
    },
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/404",
        component: () => import("../views/404.vue"),
        meta: {
          name: "404"
        }
      }
    ]
  }
];

/**
 * 动态路由
 * 角色：业务员，技术员，部门经理
 */
// 将路由导出
export const asyncRouterMap = [
  /**
   * 信息管理
   */
  {
    path: "/info",
    name: "Info",
    component: Layout,
    meta: {
      role: ["业务员"],
      system: "信息功能",
      name: "信息管理",
      icon: "info"
    },
    children: [
      {
        path: "/infoList",
        name: "InfoList",
        component: () => import("../views/Info/InfoList.vue"),
        meta: {
          keepAlive: true,
          role: ["业务员"],
          name: "信息列表"
        }
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        component: () => import("../views/Info/InfoCategory.vue"),
        meta: {
          keepAlive: true,
          role: ["业务员"],
          name: "信息分类"
        }
      },
      {
        path: "/infoDetailed",
        name: "InfoDetailed",
        hidden: true,
        component: () => import("../views/Info/InfoDetailed.vue"),
        meta: {
          keepAlive: true,
          role: ["业务员"],
          name: "信息详情"
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
    component: Layout,
    meta: {
      role: ["业务员"],
      system: "用户功能",
      name: "用户管理",
      icon: "user"
    },
    children: [
      {
        path: "/userList",
        name: "UserList",
        component: () => import("../views/User/UserList.vue"),
        meta: {
          role: ["业务员"],
          name: "用户列表"
        }
      }
    ]
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  }
]

const routes = defaultRouterMap;

const router = new VueRouter({
  routes
});

export default router;
