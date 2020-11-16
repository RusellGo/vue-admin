import { GetUserRole } from "@/api/login.js";

const state = {
  roles: []
}
const getters = {
  roles: state => state.roles
}
const mutations = {
  SET_ROLES(state, playload) {
    state.roles = playload.role;
  }
}
const actions = {
  /**
   * 获取用户角色
   * @param {*} context 
   * @param {*} playload 
   */
  getRoles(context, playload) {
    return new Promise((resolve, reject) => {
      GetUserRole({}).then(response => {
        let responseData = response.data.data
        // 修改 角色权限状态
        context.commit("SET_ROLES", responseData);
        // resolve传递值
        resolve(responseData);
      }).catch(error => {
        reject(error);
      });
    })
  },
  /**
   * 创建动态路由
   * @param {*} context 
   * @param {*} playload 
   */
  createRouter(context, playload) {
    return new Promise((resolve, reject) => {

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
