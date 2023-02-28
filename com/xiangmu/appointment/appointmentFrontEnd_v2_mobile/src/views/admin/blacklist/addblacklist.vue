<template>
  <div class="main">
    <van-nav-bar
      title="添加黑名单"
      fixed
      :border="false"
      left-arrow
      @click-left="back"
      ref="navBar"
    ></van-nav-bar>
    <div class="item">
      <h3 class="title">添加黑名单</h3>
    </div>
    <div class="drawer-container">
      <el-form :model="form" label-position="top" ref="form" :rules="rules" class="form_style">
        <el-form-item label="选择用户：" prop="userName">
          <el-select
            :popper-append-to-body="false"
            v-model="form.userName"
            filterable
            remote
            placeholder="请输入或选择"
            :remote-method="remoteMethodProject"
            @change="dataFilterProject"
            :loading="loading"
            style="width: 100%"
          >
            <!-- :remote-method="remoteMethodProject" -->
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
    <div class="div_flex">
      <van-button class="big-btn" type="info" @click="save">提交</van-button>
    </div>
  </div>
</template>

<script>
import { fetchUserList } from '@/api/admin/roles';
import { apBlacklistSave } from '@/api/admin/sysman';
export default {
  data() {
    return {
      form: {},
      loading: false,
      userList: [], // 用户列表
      rules: {
        userName: [{ required: true, message: '请选择用户', trigger: 'change' }],
      },
      drawerLoading: false,
      timer: null,
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
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
                this.$toast.success('保存成功');
                this.back();
              } else {
                this.$toast.fail('保存失败');
              }
            })
            .catch(err => {
              this.$toast.fail('保存失败');
            });
        }
      });
    },
    debounce(query, fun, delay = 500) {
      let that = this
      return function () {
        console.log(query, that);
        clearTimeout(that.timer);
        that.timer = setTimeout(() => {
          fun(query);
        }, delay);
      };
    },
    //搜索项目名称
    remoteMethodProject(query) {
      this.drawerLoading = true;
      this.loading = true;
      this.userList = [];
      if (query) {
        this.debounce(query, this.getList)();
      } else {
        this.drawerLoading = false;
        this.loading = false;
      }
    },
    getList(query) {
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
    },
    dataFilterProject(value) {
      let val = JSON.parse(value);
      this.form = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  margin: 0 auto;
  width: 100%;
}
.item {
  margin-top: 80px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 32px;
  .title {
    height: 33px;
    font-size: 28px;
    font-weight: bolder;
    color: #51575c;
    line-height: 33px;
    position: relative;
    padding: 32px 0 64px 68px;
    &::before {
      display: inline-block;
      content: '';
      width: 12px;
      height: 12px;
      border: 6px solid #3f86f7;
      border-radius: 12px;
      position: absolute;
      left: 32px;
      top: 36px;
    }
  }

  .rules {
    color: #3f86f7;
    font-size: 28px;
  }
}
.big-btn {
  height: 88px;
  background: #3f86f7;
  width: 70%;
}
.form_style {
  margin: 0 30px;
}
/deep/ .el-select-dropdown .el-select-dropdown__item {
  font-size: 24px !important;
  margin: 5px 0;
}
.div_flex {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
/deep/ .el-form-item__label {
  margin-bottom: 10px;
}
/deep/ .el-input,
.el-textarea {
  font-size: 24px;
}
</style>
