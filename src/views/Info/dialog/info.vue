<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    width="580px"
    @opened="openDialog"
  >
    <el-form :model="data.form" ref="addInfo">
      <el-form-item label="类型：" :label-width="data.formLabelWidth" prop="category">
        <el-select v-model="data.form.category" placeholder="请选择活动区域">
          <el-option
            v-for="item in data.categoryOptions"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" :label-width="data.formLabelWidth" prop="title">
        <el-input v-model="data.form.title" placeholder="请输入标题" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="概况：" :label-width="data.formLabelWidth" prop="content">
        <el-input
          type="textarea"
          v-model="data.form.content"
          placeholder="请输入内容"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" :loading="data.submitLoading" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { AddInfo } from "@/api/news.js";
import { ref, reactive, watchEffect } from "@vue/composition-api";
export default {
  name: "DialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    category: {
      type: Array,
      default: () => {}
    }
  },
  setup(props, context) {
    /**
     * 数据
     */
    const data = reactive({
      dialog_info_flag: false, // 弹框显示/隐藏
      formLabelWidth: "70px", // label宽度
      form: {
        // 表单双向数据绑定
        category: "",
        title: "",
        content: ""
      },
      categoryOptions: [], // 弹框类型
      submitLoading: false //按钮加载动画
    });

    watchEffect(() => {
      data.dialog_info_flag = props.flag;
    });

    /**
     * 方法
     */
    // 点击新增按钮
    const openDialog = () => {
      data.categoryOptions = props.category;
    };
    // 关闭弹框
    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      context.emit("update:flag", false);
      // 回调时需要做逻辑处理的时候， 就不能用修饰器
    };
    // 重置表单
    const resetForm = () => {
      context.refs.addInfo.resetFields();
      // data.form.category = "";
      // data.form.title = "";
      // data.form.content = "";
    };
    // 确定新增
    const submit = () => {
      if (data.form.category == "") {
        context.root.$message({
          message: "分类不能为空",
          type: "error"
        });
        return false;
      }
      if (data.form.title == "") {
        context.root.$message({
          message: "标题不能为空",
          type: "error"
        });
        return false;
      }
      if (data.form.content == "") {
        context.root.$message({
          message: "内容不能为空",
          type: "error"
        });
        return false;
      }
      let requestData = {
        categoryId: data.form.category,
        title: data.form.title,
        content: data.form.content
      };
      data.submitLoading = true;
      AddInfo(requestData)
        .then(result => {
          context.root.$message({
            message: result.data.message,
            type: "success"
          });
          data.submitLoading = false;
          // 添加成功刷新
          context.emit("get-list");
          // 重置表单
          resetForm();
        })
        .catch(error => {
          data.submitLoading = false;
          // 重置表单
          resetForm();
        });
    };

    return {
      data,
      openDialog,
      close,
      submit
    };
  }
};
</script>

<style scoped lang="scss">
</style>