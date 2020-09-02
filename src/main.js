import Vue from "vue";
// Vue3.0体验版
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router/router.js";
import store from "./store/index.js";
// element-ui 全局导入
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 登录页面 路由跳转时 导航守卫
import "./router/premit.js";
// 自定义全局组件
import "./icons/index.js";
// 自定义全局方法
// import global from "@/utils/global.js";

// Vue.use(global);
Vue.use(ElementUI);
Vue.use(VueCompositionApi);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
