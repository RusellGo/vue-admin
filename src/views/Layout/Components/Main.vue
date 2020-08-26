<template>
  <div id="main-wrap">
    <div class="main-content">
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main"
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
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  background-color: #f7f7f7;
}
.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 0 30px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  background-color: #fff;
}
</style>