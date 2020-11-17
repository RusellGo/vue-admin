import { GetUserRole } from "@/api/login.js";
import { defaultRouterMap, asyncRouterMap } from "@/router/router.js";

// 判断用户角色与路由配置是否匹配
function hasPermission(roles, router) {
  if (router.meta && router.meta.role) {
    return roles.some(item => router.meta.role.indexOf(item) >= 0);
  }

  // 用户角色：["业务员", "技术员", "部门经理"]
  // 路由配置：["业务员"]
}

const state = {
  newRouters: [],
  allRouters: defaultRouterMap
}
const getters = {
  newRouters: state => state.newRouters, // 匹配成功的路由
  allRouters: state => state.allRouters // 所有的路由
}
const mutations = {
  SET_ROUTER(state, playload) {
    state.newRouters = playload;
    state.allRouters = defaultRouterMap.concat(playload);
  }
}
const actions = {
  /**
   * 获取用户角色
   * @param {*} context 
   * @param {*} playload 
   */
  getRoles(context, playload) {
    return new Promise((resolve, reject) => {
      GetUserRole({}).then(response => {
        let responseData = response.data.data
        // resolve传递值 将请求结果返回到下一步then方法
        resolve(responseData);
      }).catch(error => {
        reject(error);
      });
    })
  },
  /**
   * 创建动态路由
   * @param {*} context 
   * @param {*} playload 
   */
  createRouter(context, playload) {
    return new Promise((resolve, reject) => {
      let role = playload.role;
      // 超管
      if (role.includes("admin")) {
        // 更新路由
        context.commit("SET_ROUTER", asyncRouterMap);
      } else {
        // 普通管理员
        // 根据角色权限 过滤匹配的路由
        let newRouters = asyncRouterMap.filter(item => {

          if (hasPermission(role, item)) {

            // 优先判断 
            if (item.children && item.children.length > 0) {

              // 对路由第二层即子路由的判断
              item.children = item.children.filter(child => {
                if (hasPermission(role, child)) {
                  return true;
                }
              })

            }

            return true;
          }

          // arr.includes(value) 表示判断arr数组中是否有value这个元素，有 返回true，没有 返回false
          // return role.includes(item.meta.system);
        });
        // 更新路由
        context.commit("SET_ROUTER", newRouters);
      }
      // 路由匹配成功并拼接好完整的路由后 调用成功的回调
      resolve();
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
