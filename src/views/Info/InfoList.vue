<template>
  <div>
    <!-- 选项/操作 -->
    
</template>

<script>
import { ref, reactive } from "@vue/composition-api";
export default {
  name: "InfoList",
  setup(props, context) {
    // 类型
    const options = reactive([
      {
        value: 1,
        label: "国际信息"
      },
      {
        value: 2,
        label: "国内信息"
      },
      {
        value: 3,
        label: "行业信息"
      }
    ]);
    const value = ref("");
    // 日期
    const value2 = ref("");
    // 关键字
    const searchOptions = reactive([
      {
        value: "id",
        label: "ID"
      },
      {
        value: "title",
        label: "标题"
      }
    ]);
    const search_keyword = ref("id");
    const search_keyWork = ref("");

    // 表格数据
   

    return {
      options,
      value,
      value2,
      searchOptions,
      search_keyword,
      search_keyWork,
      tableData,
      handleSizeChange,
      handleCurrentChange
    };
  }
};
</script>

<style scoped lang="scss">

</style>