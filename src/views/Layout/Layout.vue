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
    const menuStatus = computed(() => context.root.$store.state.isCollapse);

    return {
      menuStatus
    };
  }
};
</script>

<style scoped lang="scss">
</style>