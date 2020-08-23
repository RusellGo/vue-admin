<template>
  <div id="main-wrap">
    <router-view></router-view>
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
  position: fixed;
  top: 75px;
  left: $navMenu;
  right: 0;
  bottom: 0;
  border: 30px solid #f7f7f7;
  border-right: none;
  border-bottom: none;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
</style>