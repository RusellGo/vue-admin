<template>
  <div id="layout" :class="[menuStatus ? 'close' : 'open']">
    <layout-header></layout-header>
    <layout-main></layout-main>
    <layout-nav></layout-nav>
  </div>
</template>

<script>
import { ref, computed } from "@vue/composition-api";
import LayoutHeader from "./Components/Header.vue";
import LayoutMain from "./Components/Main.vue";
import LayoutNav from "./Components/Nav.vue";
export default {
  name: "Layout",
  components: {
    LayoutHeader,
    LayoutMain,
    LayoutNav
  },
  setup(props, context) {
    // 计算属性监听Vuex状态
    const menuStatus = computed(() => context.root.$store.state.app.isCollapse);

    return {
      menuStatus
    };
  }
};
</script>

<style scoped lang="scss">
</style>