<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    width="700px"
    @opened="openDialog"
  >
    <el-form :model="data.form" ref="addInfo">
      <el-form-item
        label="用户名："
        :label-width="data.formLabelWidth"
        prop="username"
      >
        <el-input placeholder="请输入用户名" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="姓名："
        :label-width="data.formLabelWidth"
        prop="realname"
      >
        <el-input placeholder="请输入姓名" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号："
        :label-width="data.formLabelWidth"
        prop="phone"
      >
        <el-input placeholder="请输入手机号" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="地区："
        :label-width="data.formLabelWidth"
        prop="address"
      >
        <!-- 省、市、县地区联动 组件 -->
        <city-picker
          :cityPickerLevel="['province', 'city', 'area', 'street']"
          :cityPickerData.sync="data.cityPickerData"
        />
      </el-form-item>
      <el-form-item
        label="是否启用："
        :label-width="data.formLabelWidth"
        prop="status"
      >
      </el-form-item>
      <el-form-item
        label="角色："
        :label-width="data.formLabelWidth"
        prop="role"
      >
      </el-form-item>
    </el-form>
    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="danger" :loading="data.submitLoading" @click="submit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { AddInfo } from "@/api/news.js";
import { ref, reactive, watchEffect } from "@vue/composition-api";
import CityPicker from "@/components/CityPicker";
export default {
  name: "DialogInfo",
  components: {
    CityPicker
  },
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
      formLabelWidth: "90px", // label宽度
      form: {
        // 表单双向数据绑定
        category: "",
        title: "",
        content: ""
      },
      categoryOptions: [], // 弹框类型
      submitLoading: false, //按钮加载动画

      // 城市数据
      cityPickerdata: {
        // province: "",
        // city: "",
        // area: "",
        // street: ""
      }
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