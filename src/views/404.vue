<template>
  <div class="page404">
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "Page404",
  computed: {
    message() {
      return "404 The webmaster said that you can not enter this page...";
    },
  },
};
</script>

<style scoped lang="scss">
.page404 {
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>