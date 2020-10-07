import { GetCategory, GetCategoryAll } from "@/api/news.js";
import { reactive } from "@vue/composition-api";
import service from "@/utils/request.js";
export function common() {
  const categoryItem = reactive({
    item: []
  });

  // 获取分类
  const getInfoCategory = () => {
    GetCategory({})
      .then(result => {
        categoryItem.item = result.data.data.data;
      })
      .catch(error => { });
  }

  // 获取全部分类
  const getInfoCategoryAll = () => {
    GetCategoryAll({})
      .then(result => {
        categoryItem.item = result.data.data;
      })
      .catch(error => { });
  }

  return {
    getInfoCategory,
    getInfoCategoryAll,
    categoryItem
  }
}

/**
 * 获取七牛云token
 * @param {
 * ak 七牛云的密钥ak type: string
 * sk 七牛云的密钥sk type: string
 * buckety 七牛云存储空间名称
 * } params
 */
export function QiniuToken(data) {
  return service.request({
    method: "post",
    url: "/uploadImgToken/",
    data
  });
}

/**
 * 请求用户表格数据
 */
export function LoadTableData(params) {
  return service.request({
    method: params.method || "post",
    url: params.url,
    data: params.data || {}
  });
}
