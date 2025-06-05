<template>
  <div class="login">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      label-width="80px"
    >
      <el-form-item label="登录名" prop="user_id">
        <el-input v-model="ruleForm.user_id"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item argin="right">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  mounted() {
    // 绑定enter事件
    this.enterKeyup();
  },
  destroyed() {
    // 销毁enter事件
    this.enterKeyupDestroyed();
  },
  data() {
    const validateLoginName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        user_id: "",
        password: "",
      },
      rules: {
        user_id: [
          {
            required: true,
            validator: validateLoginName,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            validator: validatePassword,
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "60px",
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.requestDataObj = {
            user_id: this.ruleForm.user_id,
            password: this.ruleForm.password,
          };
          this.$executeRequest.execByUrl("/login", this.requestDataObj).then((res) => {
              if (res && res.success) {
                this.$store.dispatch("loadToken", res).then(() => {
                  this.$router.push("/menu");
                  this.$store.commit("SET_DEFAULT_MENU", res.data);
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    enterKey(event) {
      const code = event.keyCode
        ? event.keyCode
        : event.which
        ? event.which
        : event.charCode;

      if (code === 13) {
        this.submitForm("ruleForm");
      }
    },
    enterKeyupDestroyed() {
      document.removeEventListener("keyup", this.enterKey);
    },
    enterKeyup() {
      document.addEventListener("keyup", this.enterKey);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.login {
  background: url("../../assets/bg13.jpg") no-repeat center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

.demo-ruleForm {
  position: relative;
  width: 25%;
  padding: 18%;
  margin: 0 auto;
  /* overflow: hidden; */
}
</style>
