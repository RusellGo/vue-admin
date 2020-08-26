<template>
  <div id="header-wrap">
    <div class="header-icon pull-left">
      <svg-icon iconClass="menu" class-name="menu" />
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <img class="pull-left" src="~@/assets/logo.png" alt />管理员
      </div>
      <div class="header-icon pull-left">
        <svg-icon iconClass="exit" class-name="exit" />
      </div>
    </div>
  </div>
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
  line-height: 75px;
  background-color: #fff;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.1);
}
svg {
  margin-bottom: -8px;
  font-size: 25px;
  cursor: pointer;
}
.header-icon {
  padding: 0 32px;
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  img {
    width: 60px;
    margin: auto 0;
  }
  + .header-icon {
    padding: 0 28px;
  }
}
</style>