const state = {
  /**
   * 当点击编辑详情时，已存储了值，不刷新页面时，值一直存在Vuex中
   * 刷新页面后，从sessionStorage里取值
   */
  id: "" || sessionStorage.getItem("infoId"),
  title: "" || sessionStorage.getItem("infoTitle")
}
const getters = {
  infoId: state => state.id,
  infoTitle: state => state.title
}
const mutations = {
  // SET_ID(state, value) {
  //   state.id = value;
  //   // HTML5本地存储
  //   sessionStorage.setItem("infoId", value);
  // },
  // SET_TITLE(state, value) {
  //   state.title = value;
  //   // HTML5本地存储
  //   sessionStorage.setItem("infoTitle", value);
  // },

  // 设置state并本地存储
  UPDATE_STATE_VALUE(state, params) {
    for (let key in params) {
      state[key] = params[key].value;
      if (params[key].session) {
        sessionStorage.setItem(params[key].sessionKey, params[key].value);
      }
    }
  }
}
const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
