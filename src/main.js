import Vue from "vue";
// Vue3.0体验版
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router/router.js";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
