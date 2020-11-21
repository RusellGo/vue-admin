import { Login, Logout } from "@/api/login.js";
import { setToken, setUsername, removeToken, getUsername, getToken, removeUsername } from "@/utils/app.js";

const state = {
  isCollapse: false || JSON.parse(sessionStorage.getItem("isCollapse")),
  token: "" || getToken(),
  username: "" || getUsername(),
  roles: [],
  buttonPermission: []
}
const getters = {
  isCollapse: state => state.isCollapse,
  roles: state => state.roles,
  buttonPermission: state => state.buttonPermission
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
  SET_ROLES(state, playload) {
    state.roles = playload;
  },
  SET_BUTTON(state, playload) {
    state.buttonPermission = playload;
  }
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
  logout(context) {
    return new Promise((resolve, reject) => {
      Logout().then(response => {
        let data = response.data;
        removeToken();
        removeUsername();
        context.commit("SET_TOKEN", "");
        context.commit("SET_USERNAME", "");
        context.commit("SET_ROLES", []);
        resolve(data);
      }).catch(error => { });
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
