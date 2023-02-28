<template>
  <div class="common-content">
    <div style="width: 470px;margin: 50px auto">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="oldPass">
          <el-input
            type="text"
            v-model="ruleForm.oldPass"
            autocomplete="off"
            @focus="clearTip"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            @focus="clearTip"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            @focus="clearTip"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <el-alert
            v-if="errMessage.length > 0"
            :title="errMessage"
            type="error"
            :closable="false"
            style="padding:0"
          ></el-alert>

          <el-alert
            v-if="succMessage.length > 0"
            :title="succMessage"
            type="success"
            :closable="false"
            style="padding:0"
          ></el-alert>

          <!-- <span v-show="succMessage !=''" style="color: red">{{succMessage}}</span> -->
        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button size="small" type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button size="small" @click="resetForm('ruleForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Password",
  data() {
    var oldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("旧密码不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else if (!this.util.regExps.pwdRegex.test(value)) {
        callback(
          new Error(
            "您的密码复杂度太低（密码中必须包含大小写字母、数字、特殊字符，长度为8~30），请及时修改密码！"
          )
        );
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        oldPass: ""
      },
      ID: "", //当前用户ID
      errMessage: "", //错误提示
      succMessage: "", //正确提示
      isTrue: "",
      tipMessage: "",
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        oldPass: [{ validator: oldPass, trigger: "blur" }]
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },

  methods: {
    clearTip() {
      this.errMessage = "";
      this.successMessage = "";
    },

    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.ruleForm.oldPass == this.ruleForm.pass) {
            this.$message({
              type: "error",
              message: "旧密码和新密码一致,无需更改"
            });
          } else {
            this.util
              .postAjax({
                code: this.global.authCode,
                url: "/User/modfiyPwd",
                data: {
                  auth: JSON.stringify({ userid: this.userInfo.ID }),
                  data: JSON.stringify({
                    OLDPWD: this.ruleForm.oldPass,
                    NEWPWD: this.ruleForm.pass,
                    RNEWPWD: this.ruleForm.checkPass
                  })
                }
              })
              .then(res => {
                //  console.log(res);
                if (res.success == true) {
                  this.succMessage = res.message;
                  this.isTrue = true;
                  //  this.$message("修改成功！即将跳转登录页面！");
                  //  setTimeout(()=>{
                  //    this.util.postAjax({
                  //      code:this.global.code3,
                  //      url:"/User/cleanNowLoginUser",
                  //    }).then((res) => {
                  //      if(res.success == true){
                  //        location.href=location.protocol+'//'+location.host+"/appportalweb/rest/Idsclient/reqLogout?reqUrl=" + window.location.href;
                  //      }
                  //    })
                  //  },2000)
                } else {
                  this.errMessage = res.data.message;
                  this.isTrue = false;
                }
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();

      this.clearTip();
    }
  },
  created() {}
};
</script>

<style scoped></style>