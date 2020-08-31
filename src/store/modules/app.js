import { Login } from "@/api/login.js";
import { setToken, setUsername, removeToken, getUsername, getToken, removeUsername } from "@/utils/app.js";

const state = {
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  token: getToken() || "",
  username: getUsername() || ""
}
const getters = {
  isCollapse: state => state.isCollapse
}
const mutations = {
  SET_COLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    // 保存菜单栏的收起/展开状态
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  },
  SET_TOKEN(state, value) {
    state.token = value;
  },
  SET_USERNAME(state, value) {
    state.username = value;
  },
}
const actions = {
  login(context, payload) {
    return new Promise((resolve, reject) => {
      Login(payload).then(result => {
        let data = result.data.data;
        context.commit("SET_TOKEN", data.token);
        context.commit("SET_USERNAME", data.username);
        setToken(data.token);
        setUsername(data.username);
        resolve(result);
      }).catch(error => {
        reject(error);
      })
    })
  },
  exit(context) {
    return new Promise((resolve, reject) => {
      removeToken();
      removeUsername();
      context.commit("SET_TOKEN", "");
      context.commit("SET_USERNAME", "");
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};