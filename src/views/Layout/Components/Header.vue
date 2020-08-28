<template>
  <div id="header-wrap">
    <div class="header-icon pull-left" @click="navMenuState">
      <svg-icon iconClass="menu" class-name="menu" />
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <img class="pull-left" src="~@/assets/logo.png" alt />
        {{ username }}
      </div>
      <div class="header-icon pull-left">
        <svg-icon iconClass="exit" class-name="exit" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
export default {
  name: "Header",
  setup(props, context) {
    const navMenuState = () => {
      // 使用Vuex 状态管理 提交mutation
      context.root.$store.commit("app/SET_COLLAPSE");
    };
    const username = computed(() => context.root.$store.state.app.username);

    return {
      navMenuState,
      username
    };
  }
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
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
}
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
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
    width: 40px;
    height: 40px;
    margin: 18px 10px;
    @include webkit(border-radius, 50%);
  }
  + .header-icon {
    padding: 0 28px;
  }
}
</style>