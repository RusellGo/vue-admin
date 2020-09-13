import { GetCategory } from "@/api/news.js";
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
  actions
}
