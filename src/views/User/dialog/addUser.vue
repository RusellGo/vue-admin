<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="新增"
    width="700px"
    :visible.sync="data.dialog_info_flag"
    @close="close"
    @opened="openDialog"
  >
    <el-form :model="data.form" :rules="data.rules" status-icon ref="addUser">
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
        label="角色："
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
import { GetRole, GetSystem, UserAdd, UserEdit } from "@/api/user.js";
// 引入特殊字符处理函数 以及表单输入验证函数
import { stripscript, validateEmail, validatePass } from "@/utils/validate.js";
import {
  ref,
  reactive,
  watchEffect,
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
} from "@vue/composition-api";
import CityPicker from "@/components/CityPicker";
// 中央事件总线
import EventBus from "@/utils/bus.js";
export default {
  name: "DialogInfo",
  components: {
    CityPicker,
  },
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: Object,
      default: () => {},
    },
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
      /**
       * 业务逻辑：
       *  1.编辑状态：
       *    需要校验：data.form.id存在，密码不为空时
       *    不需要校验：data.form.id存在，密码为空时
       *
       *  2.添加状态
       *    需要校验：data.form.id不存在时
       */
      if (data.form.id && value) {
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
      } else if (!data.form.id) {
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
      } else {
        callback();
      }

      // if (value === "") {
      //   callback(new Error("请输入密码"));
      // } else if (validatePass(value)) {
      //   //验证密码格式
      //   callback(new Error("密码为6至20位的数字、字母组合"));
      // } else if (value.length !== stripscript(value).length) {
      //   // 用户输入特殊字符 对比过滤前后长度是否一致
      //   callback(new Error("密码为6至20位的数字、字母组合"));
      // } else {
      //   callback();
      // }
    };
    // 验证手机号(简单验证)
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
    // 验证角色
    let validateRole = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };

    /**
     * 数据
     */
    const data = reactive({
      // 弹框显示/隐藏
      dialog_info_flag: false,
      // label宽度
      formLabelWidth: "100px",
      // 表单双向数据绑定
      form: {
        username: "",
        password: "",
        truename: "",
        phone: "",
        region: "",
        status: "1",
        role: [],
      },
      // 城市数据
      cityPickerData: {
        province: "",
        city: "",
        area: "",
        street: "",
      },
      // 获取角色类型
      getRoleType: [],
      //按钮加载动画
      submitLoading: false,
      // 表单验证
      rules: {
        username: [
          { validator: validateUsername, required: true, trigger: "blur" },
        ],
        password: [
          { validator: validatePassword, required: true, trigger: "blur" },
        ],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "change" }],
      },
    });

    /**
     * 获取角色
     */
    const getRole = () => {
      GetRole({})
        .then((response) => {
          data.getRoleType = response.data.data;
        })
        .catch((error) => {});
    };

    /**
     * 点击新增按钮 弹出对话框后进行的操作
     */
    const openDialog = () => {
      // 进行一次角色请求
      getRole();

      // 初识值处理
      let editData = props.editData;
      if (editData.id) {
        editData.role = editData.role.split(",");
      } else {
        data.form.id && delete data.form.id;
      }
      for (let key in editData) {
        data.form[key] = editData.id ? editData[key] : "";
      }
      // 处理编辑时电话号码为字符串的问题
      data.form.phone = data.form.phone
        ? Number(data.form.phone)
        : data.form.phone;
    };

    watchEffect(() => {
      data.dialog_info_flag = props.flag;
    });

    // 关闭弹框
    const close = () => {
      data.dialog_info_flag = false;
      resetForm();
      context.emit("update:flag", false);
      context.emit("update:editData", {});
    };
    // 重置表单
    const resetForm = () => {
      data.cityPickerData = {
        province: "",
        city: "",
        area: "",
        street: "",
      };
      context.refs.addUser.resetFields();
    };
    // 确定新增
    const submit = () => {
      data.submitLoading = true;
      if (!data.form.username) {
        context.root.$message({
          message: "用户名不能为空",
          type: "error",
        });
        data.submitLoading = false;
        return false;
      }
      if (!data.form.id && !data.form.password) {
        context.root.$message({
          message: "密码不能为空",
          type: "error",
        });
        data.submitLoading = false;
        return false;
      }
      if (data.form.role.length === 0) {
        context.root.$message({
          message: "请选择角色类型",
          type: "error",
        });
        data.submitLoading = false;
        return false;
      }

      context.refs["addUser"].validate((valid) => {
        // 表单验证通过
        if (valid) {
          // 此处角色类型要从数组转换为字符串，且不能影响页面，对数据做出转换前需要进行数据的深拷贝
          // 深拷贝 使用JSON.parse(JSON.stringify(data)) 但对象中function、undefined、Symbol类型的数据将会丢失
          // 浅拷贝 Object.asign({}, data.form) 拷贝出来就是一个对象
          let requestData = JSON.parse(JSON.stringify(data.form));
          requestData.role = requestData.role.join();
          requestData.region = JSON.stringify(data.cityPickerData);

          // 添加状态：需要加密
          // 编辑状态：值存在，需要加密；否则删除

          // 存在id为修改 不存在id为添加
          if (requestData.id) {
            // if (!requestData.password) {
            //   delete requestData.password;
            // } else {
            //   requestData.password = sha1(requestData.password);
            // }
            // 对密码进行处理
            requestData.password
              ? (requestData.password = sha1(requestData.password))
              : delete requestData.password;
            userEdit(requestData);
          } else {
            // 对密码进行处理
            requestData.password = sha1(requestData.password);
            userAdd(requestData);
          }
        } else {
          data.submitLoading = false;
          console.log("error add!!");
          return false;
        }
      });
    };

    // 添加方法 用户添加接口调用
    const userAdd = (requestData) => {
      UserAdd(requestData)
        .then((response) => {
          context.root.$message({
            message: response.data.message,
            type: "success",
          });
          data.submitLoading = false;
          close();
          context.emit("addedRefreshTableData");
        })
        .catch((error) => {
          data.submitLoading = false;
        });
    };

    // 编辑方法 用户编辑接口调用
    const userEdit = (requestData) => {
      console.log(requestData);
      UserEdit(requestData)
        .then((response) => {
          context.root.$message({
            message: response.data.message,
            type: "success",
          });
          data.submitLoading = false;
          close();
          context.emit("addedRefreshTableData");
        })
        .catch((error) => {
          data.submitLoading = false;
        });
    };

    return {
      data,
      openDialog,
      close,
      submit,
    };
  },
};
</script>

<style scoped lang="scss">
</style>