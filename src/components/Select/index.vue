<template>
  <div>
    <el-select v-model="data.selectValue">
      <el-option
        v-for="item in data.initOptions"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { onMounted, reactive } from "@vue/composition-api";
export default {
  name: "SelectVue",
  props: {
    config: { type: Array, default: () => [] }
  },
  setup(props, context) {
    const data = reactive({
      selectValue: "",
      initOptions: [],
      options: [
        { value: "name", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" },
        { value: "id", label: "ID" },
        { value: "title", label: "标题" }
      ]
    });

    /**
     * 初始化下拉选择
     */
    let initOption = () => {
      let optionArr = [];
      props.config.forEach(item => {
        let arr = data.options.filter(ele => ele.value == item)[0];
        optionArr.push(arr);
      });
      // 初始化赋值
      data.initOptions = optionArr;
      // 初始化搜索类型
      data.selectValue = optionArr[0].value;
    };

    /**
     * 生命周期钩子
     */
    onMounted(() => {
      initOption();
    });
    return {
      data
    };
  }
};
</script>

<style scoped>
</style>