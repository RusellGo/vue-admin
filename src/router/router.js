import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login/Login.vue")
  },
  {
    path: "/layout",
    name: "Layout",
    component: () => import("../views/Layout/Layout.vue"),
    children: [
      {
        path: "/layout",
        redirect: "/layout/console"
      },
      {
        path: "/layout/console",
        name: "Console",
        component: () => import("../views/Console/Console.vue")
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
