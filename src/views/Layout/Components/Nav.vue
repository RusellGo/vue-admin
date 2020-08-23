<template>
  <div id="nav-wrap">菜单</div>
</template>

<script>
export default {
  name: "Nav"
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
}
</style>