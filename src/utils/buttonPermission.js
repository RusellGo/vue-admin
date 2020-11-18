import store from "../store/index.js";

/**
 * 将这个方法设置成全局方法
 * @param {*需要做权限设置的按钮位置传入的权限} permission 
 */
export function buttonPermission(permission) {
  if (store.getters["app/roles"].includes("admin")) {
    return true;
  }
  let button = store.getters["app/buttonPermission"];
  return button.indexOf(permission) !== -1;
}
