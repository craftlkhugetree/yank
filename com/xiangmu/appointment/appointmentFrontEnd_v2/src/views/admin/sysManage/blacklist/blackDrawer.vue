<template>
  <el-drawer
    class="base-drawer"
    title="添加黑名单"
    :visible.sync="isBlackDrawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="700px"
  >
    <div class="drawer-container">
      <el-form :model="form" label-position="top" ref="form" :rules="rules" class="form_style">
        <el-form-item label="选择用户：" prop="userName">
          <el-select
            v-model="form.userName"
            filterable
            remote
            placeholder="请输入或选择"
            :remote-method="remoteMethodProject"
            @change="dataFilterProject"
            :loading="loading"
            style="width: 100%"
          >
            <el-option
              v-for="item in userList"
              :label="item.userName"
              :value="JSON.stringify(item)"
              :key="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="黑名单理由：" prop="reason">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            v-model="form.reason"
            maxlength="5000"
            placeholder="请输入理由"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button size="small" @click="closeDrawer">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { fetchUserList } from '@/api/admin/roles';
import { apBlacklistSave } from '@/api/admin/sysman';
export default {
  props: {
    isBlackDrawer: Boolean,
  },
  data() {
    return {
      form: {},
      drawerLoading: false,
      loading: false,
      userList: [], // 用户列表
      rules: {
        userName: [{ required: true, message: '请选择用户', trigger: 'change' }],
      },
    };
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.$emit('close');
      this.userList = [];
      this.form = {};
    },
    // 保存
    save() {
      this.$refs.form.validate(res => {
        if (res) {
          this.drawerLoading = true;
          let data = {
            opreaterType: 2, // (integer, optional): 1自动2手动 ,
            reason: this.form.reason, // (string, optional): 原因 ,
            userId: this.form.ID, // (string, optional): 工号 ,
            userName: this.form.NAME, // (string, optional): 姓名
          };
          apBlacklistSave(data)
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '保存成功！',
                });
                this.closeDrawer();
                this.$emit('query');
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '保存失败！' + res.data.errInf.shortBusInf,
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: 'error',
                message: '保存失败！' + err,
              });
            });
        }
      });
    },
    //搜索项目名称
    remoteMethodProject(query) {
      this.drawerLoading = true;
      this.loading = true;
      this.userList = [];
      if (query) {
        let data = {
          filter: JSON.stringify({
            KEYWORD: query,
          }),
          page: 1,
          limit: 1000,
        };
        fetchUserList(data)
          .then(res => {
            this.drawerLoading = false;
            if (res.success) {
              this.loading = false;
              this.userList = res.items || [];
              this.userList.forEach(u => {
                u.userName = u.NAME + '(' + u.ID + ')';
              });
            }
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
            this.drawerLoading = false;
            this.userList = [];
          });
      } else {
        this.drawerLoading = false;
        this.loading = false;
      }
    },
    dataFilterProject(value) {
      let val = JSON.parse(value);
      this.form = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.form_style {
  margin: 0 30px;
}
/deep/ .el-select__caret.el-input__icon {
  &::after {
    content: '\e778';
    transform: rotateX(180deg) rotateY(180deg);
    margin-right: -10px;
  }
}

/deep/ .el-textarea {
  /* 设置textarea框提示内容的样式 */
  textarea::-webkit-input-placeholder {
    text-align: left;
    line-height: 20px;
    font-family: PingFang SC, Helvetica Neue, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Arial, sans-serif;
  } /*webkit 内核浏览器*/
  textarea::-moz-placeholder {
    text-align: left;
    line-height: 20px;
    font-family: PingFang SC, Helvetica Neue, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Arial, sans-serif;
  } /*Mozilla Firefox 19+*/
  textarea:-moz-placeholder {
    text-align: left;
    line-height: 20px;
    font-family: PingFang SC, Helvetica Neue, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Arial, sans-serif;
  } /*Mozilla Firefox 4 to 18*/
  textarea:-ms-input-placeholder {
    text-align: left;
    line-height: 20px;
    font-family: PingFang SC, Helvetica Neue, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Arial, sans-serif;
  }
}
</style>
