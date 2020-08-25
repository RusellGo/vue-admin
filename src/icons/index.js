import Vue from "vue";
import SvgIcon from "./SvgIcon.vue";

Vue.component("svg-icon", SvgIcon);

/**
 * require.context：读取指定目录的所有文件
 * 参数一：目录
 * 参数二：是否遍历子集
 * 参数三：定义遍历规则
 */
const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => {
  console.log(requireContext.keys());
  return requireContext.keys().map(requireContext);
}
requireAll(req);