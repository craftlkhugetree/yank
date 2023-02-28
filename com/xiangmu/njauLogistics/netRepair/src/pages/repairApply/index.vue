<template>
  <div class="main">
    <el-row :gutter="60">
      <!------------------------- 我要报修 ------------------------->
      <el-col :span="12">
        <div class="title" style="border-bottom: 1px solid #f0f0f0;">
          <span class="title-main">我要报修</span>
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
        <div class="content">
          <edit-form ref="editComponent"></edit-form>
          <div>
            <el-button type="primary" @click="onSubmit('submit')" size="small">提交报修</el-button>
            <el-button type="primary" @click="onSubmit('submit',true)" size="small" plain>提交并录入下一条</el-button>
            <el-button type="info" size="small" plain @click="onSubmit('draft')">保存草稿</el-button>
          </div>
        </div>
      </el-col>
      <!------------------------- 最近报修 ------------------------->
      <el-col :span="12">
        <div class="title">
          <span class="title-main">最近报修</span>
        </div>
        <div class="list" v-loading="loading">
          <list-box v-for="item in repairList" :key="item.id" :item="item" operType="edit"></list-box>
          <div class="no-data" v-if="repairList.length == 0">
            <img src="@/../static/images/nodata.png" alt />
            <span>没有找到报修记录</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import upload from "../../components/BaseUpload";
import ListBox from "../../components/ListBox";
import editForm from "./editForm";
export default {
  components: {
    upload,
    ListBox,
    editForm
  },
  data() {
    return {
      loading: false,
      repairList: []
    };
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    // 用户id
    userId() {
      return this.$store.state.userInfo.ID;
    }
  },
  watch: {
    userId() {
      this.getList();
    }
  },
  methods: {
    // 清空表单
    clearForm() {
      this.$refs.editComponent.clearForm();
    },
    // 最近五条报修
    getList() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              applyerid: this.userId
            },
            limit: 5,
            page: 1
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.repairList = res.data || [];
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    /**
     * 提交
     * type: submit-提交，draft-草稿
     * isNext: 是否录入下一条
     */
    onSubmit(type, isNext) {
      // applytype: "1"电话录单  "2"网络
      this.$refs.editComponent
        .onSubmit(type, "2")
        .then(res => {
          if (isNext) {
            let editForm = this.$refs.editComponent.editForm;
            editForm.note = "";
            editForm.photos = [];
            this.getList();
          } else {
            this.$router.push("/index");
          }
        })
        .catch(err => {
          return;
        });
    }
  },
  created() {
    if (this.userId) {
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 1400px;
  margin: 20px auto 0;
  background: #ffffff;
  border-radius: 5px;
  padding: 30px;
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
  margin-right: -30px;
  border-right: 1px solid #f0f0f0;
  padding: 20px 30px 30px 0;
}
.list {
  .list-box {
    border: 1px dashed #dbdbdb;
  }
}

.no-data {
  width: 100%;
  padding: 30px 0;
  border-radius: 5px;
  border: 1px dashed #dbdbdb;
  text-align: center;
  color: #999;
  font-size: 14px;
  img {
    width: 100px;
    height: 100px;
    vertical-align: middle;
    margin-right: 20px;
  }
  & > div {
    display: inline-block;
    text-align: left;
    vertical-align: top;
    p {
      line-height: 20px;
      margin-bottom: 10px;
    }
    .el-button {
      width: 88px;
    }
  }
}
</style>