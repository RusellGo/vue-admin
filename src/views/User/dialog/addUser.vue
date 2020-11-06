<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="新增"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    width="700px"
    @opened="openDialog"
  >
    <el-form :model="data.form" :rules="rules" status-icon ref="addUser">
      <el-form-item
        label="用户名："
        :label-width="data.formLabelWidth"
        prop="username"
      >
        <el-input
          type="text"
          v-model="data.form.username"
          placeholder="请输入邮箱"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="密码："
        :label-width="data.formLabelWidth"
        prop="password"
      >
        <el-input
          type="password"
          v-model="data.form.password"
          placeholder="请输入6~20数字、字母组合"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="姓名："
        :label-width="data.formLabelWidth"
        prop="truename"
      >
        <el-input
          type="text"
          v-model="data.form.truename"
          placeholder="请输入姓名"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="手机号："
        :label-width="data.formLabelWidth"
        prop="phone"
      >
        <el-input
          type="text"
          v-model.number="data.form.phone"
          placeholder="请输入手机号"
          minlength="11"
          maxlength="11"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="地区："
        :label-width="data.formLabelWidth"
        prop="region"
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
        <el-radio v-model="data.form.status" label="1">禁用</el-radio>
        <el-radio v-model="data.form.status" label="2">启用</el-radio>
      </el-form-item>

      <el-form-item
        label="角色类型："
        :label-width="data.formLabelWidth"
        prop="role"
      >
        <el-checkbox-group v-model="data.form.role">
          <el-checkbox
            v-for="role in data.getRoleType"
            :key="role.role"
            :label="role.name"
          ></el-checkbox>
        </el-checkbox-group>
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
import sha1 from "js-sha1";
import { GetRole, UserAdd } from "@/api/user.js";
// 引入特殊字符处理函数 以及表单输入验证函数
import { stripscript, validateEmail, validatePass } from "@/utils/validate.js";
import {
  ref,
  reactive,
  watchEffect,
  onBeforeMount
} from "@vue/composition-api";
import CityPicker from "@/components/CityPicker";
// 中央事件总线
import EventBus from "@/utils/bus.js";
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
    // 事件总线注册方法
    // EventBus.$on("test", data => {
    //   console.log(data);
    // });
    // 验证用户名/邮箱
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        //验证邮箱格式
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        //验证密码格式
        callback(new Error("密码为6至20位的数字、字母组合"));
      } else if (value.length !== stripscript(value).length) {
        // 用户输入特殊字符 对比过滤前后长度是否一致
        callback(new Error("密码为6至20位的数字、字母组合"));
      } else {
        callback();
      }
    };
    // 验证手机号
    let validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback();
        return;
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else if (value.toString().length !== 11) {
        callback(new Error("长度有误"));
      } else {
        callback();
      }
    };
    // 表单验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      phone: [{ validator: validatePhone, trigger: "blur" }]
    });

    /**
     * 数据
     */
    const data = reactive({
      // 弹框显示/隐藏
      dialog_info_flag: false,
      // label宽度
      formLabelWidth: "90px",
      // 表单双向数据绑定
      form: {
        username: "",
        password: "",
        truename: "",
        phone: "",
        region: "",
        status: "1",
        role: []
      },
      // 城市数据
      cityPickerData: {
        province: "",
        city: "",
        area: "",
        street: ""
      },
      // 获取角色类型
      getRoleType: [],
      //按钮加载动画
      submitLoading: false
    });

    /**
     * 获取角色
     */
    const getRole = () => {
      GetRole({})
        .then(response => {
          data.getRoleType = response.data.data;
        })
        .catch(error => {});
    };

    /**
     * 点击新增按钮 弹出对话框后进行的操作
     */
    const openDialog = () => {
      getRole();
    };

    watchEffect(() => {
      data.dialog_info_flag = props.flag;
    });

    // 关闭弹框
    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      context.emit("update:flag", false);
      // 回调时需要做逻辑处理的时候， 就不能用修饰器
    };
    // 重置表单
    const resetForm = () => {
      data.cityPickerData = {
        province: "",
        city: "",
        area: "",
        street: ""
      };
      context.refs.addUser.resetFields();
    };
    // 确定新增
    const submit = () => {
      data.submitLoading = true;
      if (!data.form.username) {
        context.root.$message({
          message: "用户名不能为空",
          type: "error"
        });
        return false;
      }
      if (!data.form.password) {
        context.root.$message({
          message: "密码不能为空",
          type: "error"
        });
        return false;
      }
      if (data.form.role.length === 0) {
        context.root.$message({
          message: "请选择角色类型",
          type: "error"
        });
        return false;
      }

      context.refs["addUser"].validate(valid => {
        // 表单验证通过
        if (valid) {
          // 此处角色类型要从数组转换为字符串，且不能影响页面，对数据做出转换前需要进行数据的深拷贝
          // 深拷贝 使用JSON.parse(JSON.stringify(data)) 但对象中function、undefined、Symbol类型的数据将会丢失
          // 浅拷贝 Object.asign({}, data.form) 拷贝出来就是一个对象

          let requestData = JSON.parse(JSON.stringify(data.form));
          requestData.role = requestData.role.join();
          requestData.region = JSON.stringify(data.cityPickerData);
          requestData.password = sha1(requestData.password);
          // 用户添加接口
          UserAdd(requestData)
            .then(response => {
              context.root.$message({
                message: response.data.message,
                type: "success"
              });
              data.submitLoading = false;
              resetForm();
            })
            .catch(error => {
              data.submitLoading = false;
            });
        } else {
          console.log("error add!!");
          return false;
        }
      });
    };

    return {
      rules,
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