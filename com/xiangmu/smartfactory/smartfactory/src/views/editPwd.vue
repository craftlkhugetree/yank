<template>
  <el-container class="app-wrapper">
    <!------------------------------ 顶部菜单 ------------------------------>
    <el-header height="80px">
      <header-bar></header-bar>
    </el-header>
    <!------------------------------ 主要内容 ------------------------------>
    <el-main>
      <div class="base-search-table">
        <div class="search-box clearfix">
          <h3>修改密码</h3>
          <div class="search-box-right">
            <el-button type="primary" size="small" @click="savePwd"
              >保存</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-link icon="el-icon-refresh-left" href="/" type="info"
              >返回首页</el-link
            >
          </div>
        </div>
        <div class="params-content">
          <div class="tips">
            <i class="el-icon-warning"></i>
            密码至少6位，必须包含数字和字母
          </div>
          <el-form
            ref="editForm"
            :model="editForm"
            label-width="100px"
            label-suffix="："
            label-position="right"
            :rules="rules"
            v-loading="loading"
          >
            <el-form-item prop="OLDPWD" label="原密码">
              <el-input
                v-model="editForm.OLDPWD"
                show-password
                placeholder="请输入"
                size="small"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item prop="NEWPWD" label="修改密码">
              <el-input
                v-model="editForm.NEWPWD"
                show-password
                placeholder="请输入"
                size="small"
                style="width: 300px"
                @change="changeNewPwd"
              ></el-input>
            </el-form-item>
            <el-form-item prop="RNEWPWD" label="确认密码">
              <el-input
                v-model="editForm.RNEWPWD"
                show-password
                placeholder="请输入"
                size="small"
                style="width: 300px"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import HeaderBar from "@/layout/components/HeaderBar";
import { changePwd } from "@/api/admin/user.js";
export default {
  components: {
    HeaderBar,
  },
  data() {
    let checkNewPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入新密码!"));
        //   } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(value)) {
        //     return callback(new Error("密码至少6位，必须包含数字和字母！"));
      } else {
        if (value == this.editForm.OLDPWD) {
          return callback(new Error("新密码不能与原密码相同！"));
        } else {
          callback();
        }
      }
    };
    let checkRnewPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请再次输入新密码!"));
      } else if (value !== this.editForm.NEWPWD) {
        return callback(new Error("输入的确认密码与新密码不一致！"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      editForm: {
        OLDPWD: "",
        NEWPWD: "",
        RNEWPWD: "",
      },
      rules: {
        OLDPWD: [
          { required: true, message: "请输入原密码！", trigger: "change" },
        ],
        NEWPWD: [{ required: true, validator: checkNewPwd, trigger: "change" }],
        RNEWPWD: [
          { required: true, validator: checkRnewPwd, trigger: "change" },
        ],
      },
    };
  },
  methods: {
    // 重置表单
    reset() {
      this.$refs.editForm.resetFields();
    },
    changeNewPwd() {
      this.$refs.editForm.validate("RNEWPWD");
    },
    // 保存密码
    savePwd() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let param = {
            newPwd: this.editForm.NEWPWD,
            oldPwd: this.editForm.OLDPWD,
          };
          this.loading = true;
          changePwd(param)
            .then((res) => {
              this.loading = false;
              if (res.code == "000000") {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "修改成功，请重新登录！",
                });
                this.reset();
                setTimeout(() => {
                  sessionStorage.clear();
                  localStorage.clear();
                  this.$router.push("/login");
                }, 1000);
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "修改失败：" + res.msg,
                });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败：" + err,
              });
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  min-width: 1200px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f6f7fe;
  .el-header {
    background: #1957fb;
    padding: 0 30px;
  }
  .main-container {
    overflow: auto;
  }
  .el-aside {
    background: #ffffff;
  }
  .el-main {
    background: #ffffff;
    margin: 20px;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.05);
  }
}
.base-search-table {
  min-height: 800px;
}
.params-content {
  margin: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.tips {
  width: 400px;
  background: #fffbe6;
  border-radius: 2px;
  border: 1px solid #ffe58f;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  height: 40px;
  line-height: 40px;
  padding-left: 16px;
  margin: 20px 0 30px;
  i {
    font-size: 18px;
    color: #fa9a00;
    margin-right: 2px;
    vertical-align: middle;
  }
}
.el-form-item {
  margin-bottom: 14px;
}
</style>