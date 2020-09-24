import { GetCategory } from "@/api/news.js";
const state = {
  qiniuUrl: "http://www-web-jshtml-cn-idva7mx.web-jshtml.cn/"
}
const getters = {
  qiniuUrl: state => state.qiniuUrl
}
const actions = {
  getInfoCategory(context, payload) {
    return new Promise((resolve, reject) => {
      GetCategory(payload)
        .then(result => {
          resolve(result.data.data.data);
        })
        .catch(error => {
          reject(error);
        });
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions
}
