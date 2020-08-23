<template>
  <div id="header-wrap">头部</div>
</template>

<script>
export default {
  name: "Header"
};
</script>

<style scoped lang="scss">
@import "~@/styles/config.scss";
#header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: $navMenu;
  height: 75px;
  background-color: #fff;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
}
</style>