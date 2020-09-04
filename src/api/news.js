import service from "@/utils/request.js";
/**
 * 列表
 */
/**
 * 新增
 */
/**
 * 编辑
 */
/**
 * 删除
 */
/**
 * 一级分类添加
 */
export function AddFirstCategory(data) {
  return service.request({
    method: "post",
    url: "/news/addFirstCategory/",
    data
  });
}
/**
 * 获取信息分类
 */
export function GetCategory(data) {
  return service.request({
    method: "post",
    url: "/news/getCategory/",
    data
  })
}
