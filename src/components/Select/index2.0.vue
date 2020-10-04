<template>
  <div id="SelectVue">
    <el-select v-model="selectValue">
      <el-option
        v-for="item in initOptions"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "SelectVue",
  data() {
    return {
      selectValue: "",
      initOptions: [],
      options: [
        { value: "name", label: "姓名" },
        { value: "phone", label: "手机号" },
        { value: "email", label: "邮箱" },
        { value: "id", label: "ID" },
        { value: "title", label: "标题" }
      ]
    };
  },
  methods: {
    /**
     * 初始化下拉选择
     */
    initOption() {
      let initData = this.config.init;
      let optionArr = [];
      if (initData.length === 0) {
        console.warn("使用SelectVue组件需要传递参数");
        return false;
      }
      initData.forEach(item => {
        let arr = this.options.filter(ele => ele.value == item);
        if (arr.length > 0) {
          optionArr.push(arr[0]);
        }
      });
      if (optionArr.length === 0 || optionArr.length < initData.length) {
        console.warn("传入数据不匹配或传入了不匹配的数据项");
        return false;
      }
      // 初始化赋值
      this.initOptions = optionArr;
      // 初始化搜索类型
      this.selectValue = optionArr[0].value;
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    config: {
      handler(newValue, oldValue) {
        console.log(newValue);
        this.initOption();
      },
      immediate: true // 组件初始化时，立即监听config
    }
  }
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