<template>
  <!-- 新增弹窗 -->
  <el-dialog title="新增" :visible.sync="dialog_info_flag" @close="close" width="580px">
    <el-form :model="form">
      <el-form-item label="类型：" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="formLabelWidth">
        <el-input v-model="form.name" placeholder="请输入标题" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="概况：" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="form.name" placeholder="请输入内容" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" @click="dialogFormVisible = false">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { ref, reactive, watchEffect } from "@vue/composition-api";
export default {
  name: "DialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const dialog_info_flag = ref(false);
    const formLabelWidth = ref("70px");
    const form = reactive({
      name: "",
      region: "",
      date1: "",
      date2: "",
      delivery: false,
      type: [],
      resource: "",
      desc: ""
    });

    watchEffect(() => {
      dialog_info_flag.value = props.flag;
    });

    //
    const close = () => {
      dialog_info_flag.value = false;
      context.emit("update:flag", false);
      // 回调时需要做逻辑处理的时候， 就不能用修饰器
    };

    return {
      dialog_info_flag,
      formLabelWidth,
      form,
      close
    };
  }
};
</script>

<style scoped lang="scss">
</style>