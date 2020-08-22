<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{ current: currentIndex == index }"
          v-for="(item, index) in menuTab"
          :key="item.id"
          @click="toggleMenu(index)"
        >{{ item.txt }}</li>
      </ul>
      <!-- 表单 start -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="checkPassword" class="item-form" v-show="model === 'register'">
          <label for="checkPassword">确认密码</label>
          <el-input
            id="checkPassword"
            type="password"
            v-model="ruleForm.checkPassword"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="verificationCode" class="item-form">
          <label for="verificationCode">验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                id="verificationCode"
                type="text"
                v-model="ruleForm.verificationCode"
                autocomplete="off"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms"
                :disabled="codeButton.status"
                :loading="codeButton.loading"
              >{{ codeButton.text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login-btn block"
            :disabled="loginButtonStatus"
          >{{ model === "login" ? "登录" : "注册" }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { GetSms, Register, Login } from "@/api/login.js";
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
  // vue3.0新语法
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
    // 登录注册按钮状态
    const loginButtonStatus = ref(true);
    // 获取验证码按钮状态
    const codeButton = reactive({
      status: false,
      text: "获取验证码",
      loading: false
    });
    // 验证码重新发送倒计时
    const timer = ref(null);
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
      model.value = currentIndex.value == 0 ? "login" : "register";
      // 重置表单 表单ref="loginForm"
      context.refs.loginForm.resetFields();
    };
    // 获取验证码
    const getSms = () => {
      // 提示
      if (ruleForm.username == "") {
        context.root.$message.error("邮箱不能为空!");
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        context.root.$message.error("邮箱格式有误，请重新输入!");
        return false;
      }
      // 验证码请求接口 获取验证码 请求参数
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };
      // 修改 获取验证码状态
      codeButton.status = true;
      codeButton.text = "发送中";
      codeButton.loading = true;
      // 接口调用
      GetSms(requestData)
        .then(result => {
          // 验证码发送成功消息提示
          context.root.$message({
            message: result.data.message,
            type: "success"
          });
          // 启用登录或注册按钮
          loginButtonStatus.value = false;
          // 按钮定时器
          countDown(60);
        })
        .catch(error => {
          console.log(error);
          // 登录页 获取验证码 -> 邮箱不存在 -> 还原按钮
          clearCountDown();
        });
    };
    // 验证码按钮 倒计时
    const countDown = time => {
      clearInterval(timer.value);
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          // 清除定时器
          clearInterval(timer.value);
          codeButton.status = false;
          codeButton.text = "再次发送";
        } else {
          // 取消loading动画
          codeButton.loading = false;
          codeButton.text = `倒计时${time}秒`;
        }
      }, 1000);
    };
    // 清除倒计时
    const clearCountDown = () => {
      // 还原按钮状态
      codeButton.status = false;
      codeButton.text = "获取验证码";
      codeButton.loading = false;
      // 清除定时器
      clearInterval(timer.value);
    };
    // 登录 接口调用
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.verificationCode
      };
      Login(requestData)
        .then(result => {
          context.root.$message({
            message: result.data.message,
            type: "success"
          });
        })
        .catch(error => {});
    };
    // 注册 接口调用
    const register = () => {
      // 注册接口
      let requestData = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.verificationCode
      };
      Register(requestData)
        .then(result => {
          context.root.$message({
            message: result.data.message,
            type: "success"
          });
          // 注册成功后切换为登录
          toggleMenu(0);
          // 切换后按钮还原
          clearCountDown();
        })
        .catch(error => {});
    };
    // 提交 登录/注册
    const submitForm = formName => {
      context.refs[formName].validate(valid => {
        // 表单验证通过
        if (valid) {
          if (model.value === "login") {
            login();
          } else {
            register();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };

    /**
     * 生命周期钩子函数
     */
    // 挂载完成后
    onMounted(() => {});

    return {
      // 变量
      menuTab,
      currentIndex,
      model,
      loginButtonStatus,
      codeButton,
      ruleForm,
      rules,
      //方法
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
