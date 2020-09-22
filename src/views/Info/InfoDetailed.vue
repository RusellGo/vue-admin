<template>
  <div></div>
</template>

<script>
import { ref } from "@vue/composition-api";
export default {
  name: "InfoDetailed",
  setup(props, context) {
    let id = context.root.$route.query.id;
    console.log(id);
  }
};
</script>

<style scoped lang="scss">
</style>