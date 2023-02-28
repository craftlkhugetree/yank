<template>
  <div class="common-reply" v-loading="loading">
    <div class="common-reply-title">
      <span>常用回复</span>
      <i class="el-icon-circle-plus-outline" @click="drawer=true;">添加</i>
    </div>
    <div class="common-reply-box">
      <ul>
        <li v-for="item in list" :key="item.id" @click="chooseReply(item)">
          <el-tooltip :content="item.content" placement="top-end">
            <span class="ellipsis">{{item.content}}</span>
          </el-tooltip>
          <i class="el-icon-delete" @click.stop="deleteReply(item)"></i>
          <i class="el-icon-check" v-if="curItem.id === item.id"></i>
        </li>
      </ul>
    </div>
    <!---------------------------- 弹窗 ---------------------------->
    <el-drawer
      class="base-drawer"
      title="添加常用回复"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
      @close="closeDrawer"
      v-loading="drawerLoading"
      size="660"
    >
      <el-form ref="editForm" :model="editForm" style="padding:30px;">
        <el-form-item
          label="回复内容："
          prop="content"
          :rules="[{required: true,trigger:'change',message:'请输入回复内容'}]"
        >
          <el-input
            type="textarea"
            v-model="editForm.content"
            placeholder="请输入回复内容，不超过200字"
            size="small"
            style="width:500px;"
            rows="5"
            maxlength="200"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button type="primary" size="small" @click="doSubmit">提交</el-button>
        <el-button size="small" @click="drawer = false">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    type: String //1退回 2撤回 3派单 4已维修 5不修
  },
  data() {
    return {
      loading: false,
      curItem: "",
      list: [],
      drawer: false,
      drawerLoading: false,
      editForm: {
        content: ""
      }
    };
  },
  computed: {
    // 用户部门
    userDept() {
      return this.$store.state.userDept;
    }
  },
  watch: {
    type() {
      this.getList();
    }
  },
  methods: {
    // 关闭弹窗
    closeDrawer() {
      this.$refs.editForm.resetFields();
    },
    // 选择回复
    chooseReply(item) {
      this.curItem = item;
      this.$emit("doFunc", item.content);
    },
    // 提交常用意见
    doSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "quickanswer/save",
              isRep: true,
              data: {
                type: this.type,
                deptid: this.userDept.ID,
                content: this.editForm.content
              }
            })
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: "true",
                  type: "success",
                  message: "提交成功！"
                });
                this.drawer = false;
                this.getList();
              } else {
                this.$message({
                  showClose: "true",
                  type: "error",
                  message: "提交失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: "true",
                type: "error",
                message: "提交失败：" + err
              });
            });
        }
      });
    },
    // 删除
    deleteReply(item) {
      this.$confirm(`是否确认删除该回复？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "quickanswer/delete",
              data: {
                id: item.id
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `删除成功！`
                });
                this.getList();
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `删除失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `删除失败：${err}`
              });
            });
        })
        .catch(() => {
          return;
        });
    },
    // 获取常用意见
    getList() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "quickanswer/quickanswers",
          isRep: true,
          data: {
            deptid: this.userDept.ID,
            type: this.type
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.list = res.data || [];
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.common-reply {
  margin-bottom: 20px;
  .common-reply-title {
    padding: 5px 0;
    margin-bottom: 10px;
    span {
      color: #93928e;
      font-size: 14px;
    }
    i {
      float: right;
      font-size: 14px;
      color: #638dec;
      cursor: pointer;
      &::before {
        margin-right: 8px;
      }
    }
  }
  .common-reply-box {
    height: 160px;
    background: #f6f6f6;
    border-radius: 2px;
    padding: 10px;
    overflow-y: scroll;
    li {
      height: 20px;
      margin-bottom: 10px;
      cursor: pointer;
      span {
        color: #666;
        font-size: 14px;
        width: calc(100% - 80px);
      }
      i {
        float: right;
        margin-right: 10px;
        color: #638dec;
      }
    }
  }
}
</style>