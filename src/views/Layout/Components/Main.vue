<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">
        <!-- 子路由渲染区 -->
        <keep-alive>
          <!-- 需要缓存的 -->
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <!-- 不需要缓存 -->
        <router-view v-if="!$route.meta.keepAlive" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/composition-api";
export default {
  name: "Main",
  setup(props, context) {},
};
</script>

<style scoped lang="scss">
@import "~@/styles/config.scss";
#main-wrap {
  height: 100vh;
  // position: fixed;
  // top: 75px;
  // left: $navMenu;
  // right: 0;
  // bottom: 0;
  // border: 30px solid #f7f7f7;
  // border-right: none;
  // border-bottom: none;
  // box-sizing: border-box;
  // -webkit-box-sizing: border-box;
}
.main-content {
  width: 100%;
  height: 100%;
  padding-top: $layoutHeader + 30;
  padding-left: $navMenu + 30;
  padding-right: 30px;
  background-color: #f7f7f7;
  @include webkit(box-sizing, border-box);
  @include webkit(transition, all 0.3s ease 0s);
}
.open {
  .main-content {
    padding-left: $navMenu + 30;
  }
}
.close {
  .main-content {
    padding-left: $navMenuMin + 30;
  }
}
.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0 30px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  background-color: #fff;
  overflow: auto;
}
</style>