<template>
  <div id="layout">
    <layout-header></layout-header>
    <layout-main></layout-main>
    <layout-nav></layout-nav>
  </div>
</template>

<script>
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
  setup() {}
};
</script>

<style scoped lang="scss">
</style>