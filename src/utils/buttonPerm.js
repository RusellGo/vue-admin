import Vue from "vue";
import store from "../store/index.js";

// 自定义指令 处理按钮级权限
Vue.directive("btnPerm", {
  // 父级未渲染
  bind: function (el, binding, vnode) {
    // 此处是操作DOM元素 使用原生js处理
    if (!binding.def.hasBtnPerm(binding.value)) {
      el.style.display = "none";
    }
  },
  // 此处才能 操作父节点
  inserted: function () { },
  update: function () { },
  componentUpdated: function () { },
  unbind: function () { },
  hasBtnPerm: function (permission) {
    if (store.getters["app/roles"].includes("admin")) {
      return true;
    }
    let button = store.getters["app/buttonPermission"];
    return button.indexOf(permission) !== -1;
  }
})