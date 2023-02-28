<template>
  <div class="base-search-table bg-white" v-loading="loading">
    <div class="search-box clearfix">
      <span class="go-back" @click="$router.go(-1)">
        <i class="el-icon-arrow-left">返回</i>
        <el-divider direction="vertical"></el-divider>
      </span>
      <h3>资源详情</h3>
      <div class="search-box-right">
        <div class="switch">
          <el-switch
            ref="elSwitch"
            v-model="resDetail.status"
            :width="50"
            active-color="#3F86F7"
            active-value="1"
            inactive-color="#c3c3c3"
            inactive-value="0"
            @change="changeStatus(resDetail)"
          ></el-switch>
          <span
            :class="resDetail.status == '1' ? 'switch-text-left' : 'switch-text-right'"
            @click="$refs.elSwitch.handleChange()"
          >{{resDetail.status == "1" ? "开放" : "关闭"}}</span>
        </div>
        <span class="span-btn" @click="toEdit">
          <i class="el-icon-edit"></i>
          编辑
        </span>
        <span class="span-btn" @click="copyRes(resDetail)">
          <i class="el-icon-document-copy"></i>
          复制
        </span>
        <span class="span-btn hover-red" @click="deleteRes(resDetail)">
          <i class="el-icon-delete"></i>
          删除
        </span>
        <span class="span-btn" @click="createCode" v-if="isShowCode">
          <i class="iconfont iconerweima"></i>
          下载二维码
        </span>
      </div>
      <div ref="code" id="code" v-show="false"></div>
    </div>
    <div class="main">
      <div class="title">
        <span class="tag">{{resDetail.status == "1" ? "开放" : "关闭"}}</span>
        <h2>{{resDetail.name}}</h2>
      </div>
      <div class="attribute">
        <span>资源集：{{resDetail.resgroupname}}</span>
        <span>模板：{{resDetail.templatename}}</span>
      </div>
      <div class="detail">
        <h4>
          <i class="el-icon-location"></i>
          {{resDetail.location}}
        </h4>
        <!------------------------- 图片 ------------------------->
        <div class="image-view">
          <el-image
            style="width: 200px; height: 150px"
            v-for="img in imgUrls"
            :key="img"
            :src="img"
            :preview-src-list="imgUrls"
            fit="contain"
          ></el-image>
        </div>
        <p>{{resDetail.note}}</p>
        <!------------------------- tabs ------------------------->
        <el-tabs v-model="activeTab">
          <el-tab-pane label="申请表单" name="fields">
            <fields ref="fields" :resDetail="resDetail"></fields>
          </el-tab-pane>
          <el-tab-pane label="预约规则" name="appointRules">
            <appoint-rules ref="appointRules" :resDetail="resDetail"></appoint-rules>
          </el-tab-pane>
          <el-tab-pane label="签到规则" name="checkRules">
            <check-rules ref="checkRules" :resDetail="resDetail"></check-rules>
          </el-tab-pane>
          <el-tab-pane label="审核规则" name="auditRules">
            <approve-rules ref="approveRules" :resDetail="resDetail"></approve-rules>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { getResDetail, changeResStatus, deleteRes } from "@/api/admin/res";
import Fields from "./tabs/fields";
import AppointRules from "./tabs/appointRules";
import CheckRules from "./tabs/checkRules";
import ApproveRules from "./tabs/approveRules";
import QRCode from "qrcodejs2";
export default {
  components: {
    Fields,
    AppointRules,
    CheckRules,
    ApproveRules
  },
  props: {
    resId: String
  },
  data() {
    return {
      loading: false,
      resDetail: {},
      activeTab: "fields"
    };
  },
  computed: {
    imgUrls() {
      let imgIds = this.resDetail.icon ? this.resDetail.icon.split(",") : [];
      return imgIds.map(i => window.g.viewUrl + i);
    },
    isShowCode() {
      let checkInfo = this.resDetail.check || {};
      let type = checkInfo.checktype || null;
      let checkType = type ? JSON.parse(type) : null;
      return checkType && checkType.code == "1";
    }
  },
  methods: {
    // 编辑
    toEdit() {
      this.$router.push(`/res-manage/edit-res/${this.resId}`);
    },

    // 改变状态
    changeStatus(row) {
      let flag = row.status;
      row.status = flag == "0" ? "1" : "0"; // 之前的值
      let message = flag == "0" ? "关闭" : "开放";
      this.$confirm(`是否确认${message}该资源？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          this.loading = true;
          let data = {
            id: row.id,
            status: flag
          };
          changeResStatus(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `${message}成功！`
                });
                this.getResDetail();
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `${message}失败：` + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `${message}失败：` + err
              });
            });
        })
        .catch(() => {
          return;
        });
    },

    // 删除资源
    deleteRes(row) {
      this.$confirm(`是否确认删除该资源？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          let data = {
            id: row.id
          };
          this.loading = true;
          deleteRes(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "删除成功！"
                });
                this.$router.push("/res-manage");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "删除失败：" + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "删除失败：" + err
              });
            });
        })
        .catch(() => {
          return;
        });
    },

    // 生成二维码
    createCode() {
      let drawerCode = new QRCode("code", {
        width: 240,
        height: 240,
        text: this.resId, // 二维码内容
        colorDark: "#000",
        colorLight: "#fff"
      });
      setTimeout(() => {
        this.downCode();
      }, 300);
    },

    // 下载二维码
    downCode() {
      let code = document.getElementById("code")
      let img = code.getElementsByTagName("img")[0];
      let url = img.getAttribute("src");
      let link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "二维码.png");
      link.click();
      code.removeChild(img);
    },

    // 复制资源
    copyRes(row) {
      this.$router.push({
        path: `/res-manage/edit-res/${row.id}`,
        query: {
          isCopy: true
        }
      });
    },

    // 获取资源详情
    getResDetail() {
      this.loading = true;
      let data = {
        id: this.resId
      };
      getResDetail(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.resDetail = res.data || {};
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getResDetail();
  }
};
</script>

<style lang="scss" scoped>
.base-search-table {
  overflow: auto;
}
.search-box {
  margin: 20px;
  padding: 0 0 20px !important;
  border-bottom: 1px solid #dce1f0;
}
.search-box-right {
  height: 30px;
  line-height: 30px;
}
.switch {
  position: relative;
  display: inline-block;
  margin-right: 20px;
  .switch-text-left,
  .switch-text-right {
    position: absolute;
    font-size: 12px;
    color: #ffffff !important;
  }
  .switch-text-left {
    left: 6px;
    top: 1px;
  }
  .switch-text-right {
    right: 6px;
    top: 1px;
  }
}
.span-btn {
  color: #7d7d80;
  font-size: 13px;
  cursor: pointer;
  margin-right: 20px;
  &:hover {
    color: #3f86f7;
  }
  &.hover-red:hover {
    color: #e24234;
  }
}

.main {
  margin: 0 auto 20px;
  width: 860px;
  .title {
    margin-bottom: 20px;
    .tag {
      display: inline-block;
      color: #3f86f7;
      font-size: 14px;
      padding: 0 8px;
      line-height: 24px;
      height: 24px;
      background: #ecf3ff;
      border-radius: 2px;
      border: 1px solid #3f86f7;
    }
    h2 {
      display: inline-block;
      font-size: 20px;
      font-weight: 600;
      color: #474d51;
      line-height: 28px;
      margin-left: 10px;
    }
  }
  .attribute {
    background: #fafafa;
    padding: 12px 10px;
    margin-bottom: 20px;
    span {
      color: #474d51;
      line-height: 20px;
      margin-right: 30px;
    }
  }
  .detail {
    h4 {
      font-size: 14px;
      font-weight: 400;
      color: #474d51;
      line-height: 20px;
      margin-bottom: 10px;
      i {
        font-size: 18px;
        color: #cccccc;
      }
    }
    .image-view {
      .el-image {
        margin-right: 20px;
        margin-bottom: 12px;
      }
    }
    p {
      color: #474d51;
      line-height: 21px;
      margin-bottom: 20px;
    }
  }
}
.go-back {
  color: #3f86f7;
  cursor: pointer;
}
</style>