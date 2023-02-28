<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      style="margin:0 50px"
    >
      <el-form-item label="登录名" prop="LOGINNAME">
        <el-input v-model="form.LOGINNAME" disabled></el-input>
      </el-form-item>

      <el-form-item label="用户名" prop="NAME">
        <el-input v-model="form.NAME" disabled></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="PWD">
        <el-input
          type="password"
          v-model="form.PWD"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认新密码" prop="checkPWD">
        <el-input
          type="password"
          v-model="form.checkPWD"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="() => $emit('closePwdDialog')"
        >取 消</el-button
      >
      <el-button type="primary" @click="confirm" size="small">确 定</el-button>
    </div>
  </div>
</template>

<script>
// import upload from '../../components/BaseUpload'
export default {
  // components:{upload},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPWD !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };

    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.PWD) {
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
      form: {
        ID: "",
        LOGINNAME: "",
        PWD: "",
        NAME: ""
      },
      rules: {
        PWD: [{ validator: validatePass, trigger: "blur" }],
        checkPWD: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },

  methods: {
    // 提交
    confirm() {
      // console.log(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {
          let form = {
            ID: this.form.ID,
            PWD: this.form.PWD
          };

          // console.log(form);

          // return false;
          const loading = this.$loading({
            lock: true,
            text: "提交中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });

          this.util
            .postAjax({
              code: this.global.authCode,
              url: "/User/saveUserPwd",
              data: {
                data: JSON.stringify(form)
              }
            })
            .then(res => {
              loading.close();
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "密码重置成功"
                });
                this.$emit("closePwdDialog");
              }
            });
        }
      });

      // return;
    },

    // 获取组织列表
    getOrgList() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "/Org/tree"
        })
        .then(res => {
          //    console.log(res)
          this.orgList = res;
        });
    },

    // 获取角色列表
    getRoleList() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "/Role/groupRole"
        })
        .then(res => {
          if (res.success && res.items) {
            let arr = [];
            res.items.forEach(v => {
              if (v.children) {
                v.children.forEach(m => {
                  arr.push(m);
                });
              }
            });

            this.roleList = arr;
          }
        });
    }
  },

  created() {
    this.getOrgList();
    this.getRoleList();

    this.$nextTick(() => {
      this.$refs.form.clearValidate();
    });

    // this.contentText=this.form.quesTitle;
  }
};
</script>