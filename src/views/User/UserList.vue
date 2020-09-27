<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <label for="">关键字：</label>
          <div class="content-wrap">
            <el-row :gutter="16">
              <el-col :span="3">
                <select-vue :config="data.configOption" />
              </el-col>
              <el-col :span="5">
                <el-input
                  v-model="data.inputValue"
                  placeholder="请输入搜索关键字"
                ></el-input>
              </el-col>
              <el-col :span="15">
                <el-button>搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" class="pull-right">添加用户</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reactive } from "@vue/composition-api";
import SelectVue from "@/components/Select";
export default {
  name: "UserList",
  components: {
    SelectVue
  },
  setup(props, context) {
    const data = reactive({
      configOption: ["name", "phone", "email"],
      inputValue: ""
    });

    return {
      data
    };
  }
};
</script>

<style scoped lang="scss">
@import "~@/styles/config.scss";
.label-wrap {
  @include labelDom(right, 80, 40);
}
</style>