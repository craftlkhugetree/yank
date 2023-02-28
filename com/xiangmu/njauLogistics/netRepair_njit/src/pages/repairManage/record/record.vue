<template>
  <div class="main">
    <div class="title" style="border-bottom: 1px solid #f0f0f0;">
      <span class="title-main">报修录单</span>
      <div class="title-right" @click="clearForm">
        <i class="iconfont iconqingkong"></i>
        <span>清空内容</span>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <edit-form caller="record" ref="editComponent"></edit-form>
      <div>
        <el-button type="primary" @click="onSubmit('submit')" size="small">提交报修</el-button>
        <el-button type="primary" @click="onSubmit('submit',true)" size="small" plain>提交并录入下一条</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import editForm from "../../repairApply/editForm";
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

    /**
     * 提交
     * type: submit-提交，draft-草稿
     * isNext: 是否录入下一条
     */
    onSubmit(type, isNext) {
      // applytype: "1"电话录单  "2"网络
      this.$refs.editComponent
        .onSubmit(type, "1")
        .then(res => {
          if (isNext) {
            let editForm = this.$refs.editComponent.editForm;
            editForm.note = "";
            editForm.photos = [];
          } else {
            this.$router.push("/repair-manage/record");
          }
        })
        .catch(err => {
          return;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
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
  width: 580px;
  margin: 30px auto 20px;
  background: #ffffff;
}
</style>