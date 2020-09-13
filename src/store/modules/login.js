const state = {
  isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false
}
const getters = {
  isCollapse: state => state.isCollapse
}
const mutations = {
  SET_COLLAPSE(state) {
    state.isCollapse = !state.isCollapse;
    // 保存菜单栏的收起/展开状态
    sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
  }
}
const actions = {
  login(context, payload) {
    return new Promise((resolve, reject) => {
      // 接口
      Login(payload).then(result => {
        resolve(result);
      }).catch(error => {
        reject(error);
      })
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
