<template>
  <div class="main">
    <div class="title" style="border-bottom: 1px solid #f0f0f0;">
      <span class="title-main">编辑报修</span>
      <el-divider direction="vertical"></el-divider>
      <div @click="$router.push('/index')">
        <img src="@/../static/images/home.png" alt />
        <span>首页</span>
      </div>
      <div class="title-right" @click="clearForm">
        <i class="iconfont iconqingkong"></i>
        <span>清空内容</span>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <edit-form ref="editComponent" caller="draft"></edit-form>
      <div>
        <el-button type="primary" @click="onSubmit('submit')" size="small">提交报修</el-button>
        <el-button type="info" @click="onSubmit('draft')" size="small" plain>保存草稿</el-button>
        <el-button style="float:right" type="info" @click="deleteDraft" size="small" plain>删除草稿</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import editForm from "./editForm";
export default {
  components: {
    editForm
  },
  props: {
    id: String
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    // 清空表单
    clearForm() {
      this.$refs.editComponent.clearForm();
    },
    // 删除
    deleteDraft() {
      this.$confirm(`是否确认删除该草稿？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "applydraft/delete",
              data: {
                id: this.id
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
                this.$router.push("/index");
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
    // 获取数据
    getDetail() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "applydraft/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            let data = res.data || {};
            data.photos = data.photos ? data.photos.split(",") : [];
            data.roomOrPub = data.pubareainfo ? "pub" : "room";
            data.roomtype = data.roomtype || "";
            this.$refs.editComponent.editForm = data;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    /**
     * 提交
     * type: submit-提交，draft-草稿
     */
    onSubmit(type) {
      // applytype: "1"电话录单  "2"网络
      this.$refs.editComponent
        .onSubmit(type, "2")
        .then(res => {
          this.$router.push("/index");
        })
        .catch(err => {
          return;
        });
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 1400px;
  margin: 20px auto 0;
  background: #ffffff;
  border-radius: 5px;
  padding: 30px 400px;
}
.title {
  padding-bottom: 15px;
  .title-main {
    font-size: 16px;
    font-weight: bold;
    color: #464032;
    position: relative;
    z-index: 10;
    &::before {
      position: absolute;
      display: block;
      content: "";
      width: 30px;
      height: 4px;
      background: #fedec5;
      left: 0;
      top: 18px;
      border-radius: 24px;
      z-index: -10;
    }
  }
  & > div {
    display: inline-block;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      margin-right: 4px;
      vertical-align: text-bottom;
    }
    span {
      color: #666666;
    }
    &:hover {
      i,
      span {
        color: #fd7d18;
      }
    }
  }
  .title-right {
    float: right;
  }
  .el-divider--vertical {
    margin: 0 15px;
  }
}
.content {
  padding: 20px 0 30px 0;
}
</style>