import service from "@/utils/request.js";

/**
 * 获取角色
 */
export function GetRole(data) {
  return service.request({
    method: "post",
    url: "/role/",
    data
  })
}

/**
 * 用户添加
 */
export function UserAdd(data) {
  return service.request({
    method: "post",
    url: "/user/add/",
    data
  })
}

/**
 * 用户删除
 */
export function UserDelete(data) {
  return service.request({
    method: "post",
    url: "/user/delete/",
    data
  })
}

/**
 * 用户禁启用
 * @param {} data 
 */
export function UserActives(data) {
  return service.request({
    method: "post",
    url: "/user/actives/",
    data
  })
}

/**
 * 用户编辑
 * @param {*} data 
 */
export function UserEdit(data) {
  return service.request({
    method: "post",
    url: "/user/edit/",
    data
  })
}
