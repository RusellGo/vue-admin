import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import app from "./modules/app.js";
import login from "./modules/login.js";
import common from "./modules/common.js";

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: { app, login, common }
});
