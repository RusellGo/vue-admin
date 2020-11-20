<template>
  <div>
    <el-select v-model="data.selectValue" @change="selectOne">
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
    config: { type: Object, default: () => {} },
    selectData: { type: Object, default: () => {} },
  },
  setup(props, context) {
    const data = reactive({
      selectValue: "",
      initOptions: [],
      options: [
        { value: "truename", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" },
        { value: "id", label: "ID" },
        { value: "title", label: "标题" },
      ],
    });

    /**
     * 初始化下拉选择
     */
    const initOption = () => {
      let initData = props.config.init;
      let optionArr = [];
      if (initData.length === 0) {
        console.warn("使用SelectVue组件需要传递参数");
        return false;
      }
      initData.forEach((item) => {
        let arr = data.options.filter((ele) => ele.value == item);
        if (arr.length > 0) {
          optionArr.push(arr[0]);
        }
      });
      if (optionArr.length === 0 || optionArr.length < initData.length) {
        console.warn("传入数据不匹配或传入了不匹配的数据项");
        return false;
      }
      // 初始化赋值
      data.initOptions = optionArr;
      // 初始化搜索类型
      data.selectValue = optionArr[0].value;

      context.emit("update:selectData", optionArr[0]);
    };

    /**
     * 选择触发
     */
    const selectOne = (value) => {
      let filterData = data.options.filter((item) => item.value == value)[0];
      context.emit("update:selectData", filterData);
    };

    /**
     * 生命周期钩子
     */
    onMounted(() => {
      initOption();
    });

    return {
      data,
      selectOne,
    };
  },
};
</script>

<style scoped>
</style>

<!--
  组件目录位置：src>components>Select>index.vue
  组件引用方式：import SelectVue from "@/components/Select"
  <SelectVue :config="data.configOption" />

  参数配置：
  configOption: {
    init: ["name", "phone"]
  }
  类型：
  configOption: Object
  init: Array
    可配置的数据：name, phone, email, id, title
-->