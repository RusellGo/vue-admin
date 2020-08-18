<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-bind:class="{ current: currentIndex == index }"
          v-for="(item, index) in menuTab"
          v-bind:key="item.id"
          v-on:click="toggleMenu(index)"
        >{{ item.txt }}</li>
      </ul>
      <!-- 表单 start -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label>密码</label>
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="checkPassword" class="item-form" v-show="model === 'register'">
          <label>确认密码</label>
          <el-input
            type="password"
            v-model="ruleForm.checkPassword"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="verificationCode" class="item-form">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                type="text"
                v-model="ruleForm.verificationCode"
                autocomplete="off"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block" @click="getSms">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { GetSms } from "@/api/login.js";
// Vue3.0体验版API
import { reactive, ref, onMounted } from "@vue/composition-api";
// 引入特殊字符处理函数 以及表单输入验证函数
import {
  stripscript,
  validateEmail,
  validatePass,
  validateCode
} from "@/utils/validate.js";

export default {
  name: "Login",
  setup(props, context) {
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
    // 验证重复密码
    let validateCheckPassword = (rule, value, callback) => {
      // 使用v-show进行条件渲染 当model为login时直接通过
      if (model.value === "login") {
        callback();
      }
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== ruleForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    // 验证验证码
    let validateVerificationCode = (rule, value, callback) => {
      // 验证并处理特殊字符
      ruleForm.verificationCode = stripscript(value);
      value = ruleForm.verificationCode;

      if (value === "") {
        return callback(new Error("验证码不能为空"));
      } else if (validateCode(value)) {
        //验证验证码
        callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };

    /**
     * 这里面放置data数据、生命周期、自定义的函数
     */
    const menuTab = reactive([{ txt: "登录" }, { txt: "注册" }]);

    // 保存点击
    const currentIndex = ref(0);

    // 模块值
    const model = ref("login");
    // 使用ref定义的变量需要通过单一属性 .value 来获取定义的变量值

    // 表单绑定数据
    const ruleForm = reactive({
      username: "",
      password: "",
      checkPassword: "",
      verificationCode: ""
    });
    // 表单验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      checkPassword: [{ validator: validateCheckPassword, trigger: "blur" }],
      verificationCode: [
        { validator: validateVerificationCode, trigger: "blur" }
      ]
    });

    /**
     * 声明方法
     */
    // 切换 登录/注册
    const toggleMenu = index => {
      // 点击赋值 对比 显示高光
      currentIndex.value = index;

      // 修改模块值
      model.value = index == 0 ? "login" : "register";
    };

    // 获取验证码
    const getSms = () => {
      let data = {
        username: ruleForm.username
      };
      GetSms(data);
    };

    // 提交/登录
    const submitForm = formName => {
      context.refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    /**
     * 生命周期钩子函数
     */
    // 挂在完成后
    onMounted(() => {});

    return {
      menuTab,
      currentIndex,
      model,
      ruleForm,
      rules,
      toggleMenu,
      getSms,
      submitForm
    };
  }
};
</script>

<style scoped lang="scss">
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  .item-form {
    margin-bottom: 13px;
    label {
      display: block;
      margin-bottom: 3px;
      font-size: 14px;
      text-align: left;
      color: #fff;
    }
  }
  .login-btn {
    margin-top: 19px;
  }
  .block {
    display: block;
    width: 100%;
  }
}
</style>
