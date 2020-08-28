<template>
  <div id="nav-wrap">
    <h1 class="logo">
      <img src="~@/assets/logo.png" alt="logo" />
    </h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      text-color="#fff"
      active-text-color="#fff"
      router
    >
      <template v-for="(item, index) in routers">
        <el-submenu :key="item.id" :index="index + ''" v-if="!item.hidden">
          <!-- 一级菜单 -->
          <template slot="title" :index="item.path">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
            <span slot="title">{{ item.meta.name}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.id"
            :index="subItem.path"
          >{{ subItem.meta.name }}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { ref, reactive, computed } from "@vue/composition-api";
export default {
  name: "Nav",
  setup(props, context) {
    // 计算属性监听Vuex状态
    const isCollapse = computed(() => context.root.$store.state.app.isCollapse);
    const routers = reactive(context.root.$router.options.routes);

    return {
      isCollapse,
      routers
    };
  }
};
</script>

<style scoped lang="scss">
@import "~@/styles/config.scss";
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  @include webkit(transition, all 0.3s ease 0s);
  svg {
    font-size: 20px;
    margin-right: 10px;
  }
}
.logo {
  text-align: center;
  img {
    margin: auto;
    width: 92px;
    @include webkit(transition, all 0.3s ease 0s);
  }
}
.el-menu-vertical-demo {
  border: none;
}
.open {
  #nav-wrap {
    width: $navMenu;
    .logo img {
      width: 92px;
    }
  }
}
.close {
  #nav-wrap {
    width: $navMenuMin;
    .logo img {
      width: 64px;
    }
  }
}
</style>