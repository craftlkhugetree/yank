<template>
  <div v-loading.fullscreen.lock="loading">
    <div class="common-content" style="padding: 10px 20px">
      <div class="clearfix div-flex">
        <!------------------------- tabs 待办理/已办理 ------------------------->
        <div class="my-tab-wrap">
          <el-tabs
            class="my-el-tabs"
            v-model="activeTab"
            @tab-click="changeTab"
          >
            <el-tab-pane
              :label="'待处理' + pendingNum"
              name="pending"
            ></el-tab-pane>
            <el-tab-pane
              :label="'已处理' + processedNum"
              name="processed"
            ></el-tab-pane>
            <el-tab-pane
              :label="'已转移' + transNum"
              name="transfered"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <!------------------------- 查询区域 ------------------------->
        <div class="title-right search-group clearfix">
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyyMMdd"
            size="small"
            style="width:250px;"
            clearable
          ></el-date-picker>
          <el-input
            v-model="keyword"
            placeholder="请输入报修内容"
            size="small"
            clearable
            style="width:160px; margin-left:10px"
            maxlength="20"
          ></el-input>
          <el-button
            type="default"
            size="small"
            icon="el-icon-search"
            @click="onSearch"
            style="margin-left: 10px"
            >搜索</el-button
          >
          <el-button
            type="text"
            plain
            size="small"
            icon="el-icon-refresh-right"
            style="margin-left:10px"
            @click="resetSearch"
            >重置</el-button
          >
        </div>
      </div>
    </div>

    <div class="main">
      <!------------------------- 列表 ------------------------->
      <div class="container" style="float: left; min-height:1000px;">
        <list
          ref="list"
          :total="total"
          :tableData="tableData"
          :activeTab="activeTab"
          @getList="getList"
          @toDetail="toDetail"
        >
          <div
            style="display:flex; align-items:center; justify-content: space-between"
            v-if="activeTab == P && tableData.length"
          >
            <el-checkbox
              style="padding-left: 10px"
              :indeterminate="isIndeterminate"
              v-model="isChecked"
              @change="kChange"
            >
              全选
            </el-checkbox>
            <div
              @click.stop="batch"
              class="my-button green batchImg"
              style="margin-left: 10px"
            >
              <img :src="require(`st@tic/images/batch_approve.png`)" />
              <span>批量审批</span>
            </div>
          </div>
          <!-- 状态图标 -->
          <div class="imgs" v-if="activeTab == D">
            <div
              v-for="item in img"
              :key="item.name"
              class="img-box"
              @click="clickImg(item)"
            >
              <img
                :src="require(`st@tic/images/${item.icon}.png`)"
                :class="status === item.val ? 'click' : ''"
                alt
              />
              <div :class="status === item.val ? 'gap' : 'no-gap'">
                {{ item.count }}
              </div>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </list>
      </div>
      <!------------------------- 详情 ------------------------->
      <div class="container" style="float: right; min-height:1000px;">
        <detail
          v-show="tableData.length"
          ref="detail"
          :activeTab="activeTab"
          :isHandle="true"
        >
        </detail>
        <div class="no-data" v-show="!tableData.length">
          <img src="@/../static/images/nodata.png" alt />
          <span>没有找到记录</span>
        </div>
      </div>
    </div>

    <!-- 批量处理确认框 -->
    <el-dialog
      v-if="bVisible"
      :visible.sync="bVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="true"
      :show-close="false"
      width="70%"
    >
      <template #title>
        <div class="diag">
          <img :src="require('st@tic/images/dialog.png')" />
          <span class="diag-title">{{ diagTitle }}</span>
        </div>
      </template>
      <div class="my-tab-wrap">
        <el-tabs class="my-el-tabs" v-model="moveTab">
          <el-tab-pane label="维修" name="repair"></el-tab-pane>
          <el-tab-pane label="转移" name="move"></el-tab-pane>
        </el-tabs>
      </div>
      <el-divider></el-divider>
      <el-form
        v-if="moveTab == 'repair'"
        :model="editForm"
        ref="edifForm"
        input-align="right"
        error-message-align="right"
        label-position="top"
        size="small"
      >
        <el-form-item
          label="选择操作："
          prop="result"
          :rules="[{ required: true, message: '请选择维修结果' }]"
        >
          <el-radio-group v-model="editForm.result" class="elRadio">
            <el-radio label="3-1" class="itemRadio">维修完工</el-radio>
            <el-radio label="3-2" class="itemRadio">不维修</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="详细说明："
          prop="note"
          :rules="[
            { required: editForm.result === '3-2', message: '请填写详细说明' }
          ]"
        >
          <el-input
            v-model.trim="editForm.note"
            type="textarea"
            maxlength="200"
            rows="3"
            resize="none"
            placeholder="请输入"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="图片说明：" v-if="editForm.result === '3-1'">
          <div class="upload-box" v-if="files.length < 3">
            <el-button icon="el-icon-upload2" size="small" @click="uploadFile"
              >上传图片</el-button
            >
            <p class="img-des">最多可上传三张照片</p>
          </div>
        </el-form-item>
      </el-form>

      <div v-if="editForm.result === '3-1'">
        <div class="upload-imgs" v-for="(item, index) in files" :key="item.ID">
          <img :src="viewUrl + item.ID" alt />
          <i class="el-icon-close" @click="deleteFile(index)"></i>
        </div>
      </div>

      <opinions
        :isCol="true"
        :isRepairMove="true"
        ref="opinions"
        v-if="moveTab === 'repair' && editForm.result === '3-2'"
        style="margin-bottom:20px"
      ></opinions>
      <span class="text" v-if="moveTab == 'move'">
        {{ diagBody }}
      </span>

      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="clearForm">
          取 消
        </div>
        <div class="my-button green" @click="confirmHandle">确 定</div>
      </div>
    </el-dialog>

    <!-- 上传组件 -->
    <upload
      v-show="false"
      ref="upload"
      class="my-upload"
      :url="uploadUrl"
      :multiple="false"
      :exts="fileType"
      :isCarmera="true"
      @choose="imgLoading = true"
      @done="finish"
    ></upload>
  </div>
</template>

<script>
import {
  getCountFlag,
  pageQuery,
  handleBatch,
  moveBatch
} from "@/assets/js/api";
import { repairStatus, roleId, bizNode } from "@/assets/js/options";

export default {
  name: "HandleList",
  components: {
    List: () => import("./list"),
    Detail: () => import("./detail"),
    upload: () => import("@/components/BaseUpload"),
    opinions: () => import("@/components/opinions")
  },
  computed: {
    curRole() {
      let url = document.location.href;
      if (url.indexOf("/repair/bm_handle") > -1) {
        return roleId.bm;
      } else if (url.indexOf("/repair/hq_handle") > -1) {
        return roleId.hq;
      }
      return "16000";
    },
    viewUrl() {
      return this.$store.state.viewUrl;
    },
    uploadUrl() {
      return this.$store.state.uploadUrl;
    }
  },
  data() {
    return {
      moveTab: "repair",
      pendingNum: "",
      processedNum: "",
      transNum: "",
      isIndeterminate: false,
      isChecked: false,
      P: "pending",
      D: "processed",
      T: "transfered",
      diagBody: "",
      diagTitle: "",
      activeTab: "pending",
      status: -1,
      img: [{ val: -1, name: "全部", icon: "quanbu", count: 0 }],
      dateTime: [],
      keyword: "",
      currentPage: 1,
      limit: 5,
      tableData: [],
      total: 0,
      loading: false,
      bVisible: false,
      files: [],
      fileType: "jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF",
      editForm: {
        note: "",
        result: ""
      }
    };
  },
  methods: {
    // 点击上传
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 上传文件
    finish(res) {
      this.imgLoading = false;
      if (res.success) {
        let data = res.data || [];
        data.forEach(i => {
          i.FILEID = i.ID;
        });
        this.files = data.concat(this.files);
      }
    },
    // 删除图片
    deleteFile(index) {
      this.files.splice(index, 1);
    },
    // 改变loading
    setLoading(bool) {
      this.loading = bool;
    },
    // 重置搜索
    resetSearch() {
      this.keyword = "";
      this.dateTime = [];
    },
    // 时间转换
    transTime(date) {
      if (date) {
        return this.common.formatTime(date, "YYYYMMDD000000");
      } else {
        return "";
      }
    },
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 编辑页面
    toEdit(id) {
      this.$refs.edit.findById(id);
    },
    // 报修详情
    toDetail(id) {
      if (this.$refs.detail) {
        this.$nextTick(() => {
          this.$refs.detail.findById(id);
        });
      } else {
        let timer = setInterval(() => {
          if (this.$refs.detail) {
            this.$refs.detail.findById(id);
            clearInterval(timer);
          }
        }, 200);
      }
    },
    // 批量办理
    confirmHandle() {
      const arr = [];
      const checkData = this.tableData.filter(t => t.checked) || [];
      if ("move" === this.moveTab) {
        checkData.forEach(r => {
          const params = {};
          params.eventType = 2;
          params.repairId = r.id;
          params.repairVersion = r.version;
          params.movedNode =
            this.curRole === roleId.bm ? bizNode.hq : bizNode.bm;
          arr.push(params);
        });
        this.batchHandle(arr);
        return;
      }
      this.$refs.edifForm.validate().then(res => {
        checkData.forEach(r => {
          const params = {};
          if (this.editForm.result === "3-1") {
            let photos = "";
            this.files.forEach(f => {
              photos += f.ID + ",";
            });
            params.photos = photos.substring(0, photos.length - 1);
          }
          params.note = this.editForm.note;
          params.result = this.editForm.result;
          params.eventType = 3;
          params.repairId = r.id;
          params.repairVersion = r.version;
          arr.push(params);
        });
        this.batchHandle(arr);
      });
    },

    // 办理或转移
    batchHandle(arr) {
      let fun = "move" === this.moveTab ? moveBatch : handleBatch;
      fun(arr)
        .then(res => {
          if (res.success == true) {
            this.$message({
              showClose: true,
              type: "success",
              message: "办理成功"
            });
            this.clearForm();
            this.getList(1);
          } else {
            this.$message({
              showClose: true,
              type: "warning",
              message: res.message
            });
          }
        })
        .catch(err => {});
    },

    clearForm() {
      this.editForm = {
        note: "",
        result: ""
      };
      this.files = [];
      this.bVisible = false;
    },
    // 获取tab页签总数
    getAll() {
      this.activeTab !== this.P &&
        pageQuery({
          page: 1,
          limit: 5,
          filter: { status: 1, bizNode: this.selfRole() }
        }).then(res => {
          this.pendingNum = "";
          if (res && res.success) {
            this.pendingNum = res.total;
          }
        });
      this.activeTab !== this.D &&
        pageQuery({
          page: 1,
          limit: 5,
          filter: { status: "2,3,4", handledNode: this.selfRole() }
        }).then(res => {
          this.processedNum = "";
          if (res && res.success) {
            this.processedNum = res.total;
          }
        });
      this.activeTab !== this.T &&
        pageQuery({
          page: 1,
          limit: 5,
          filter: { movedNode: this.selfRole() }
        }).then(res => {
          this.transNum = "";
          if (res && res.success) {
            this.transNum = res.total;
          }
        });
    },
    // 获取列表
    getList(page, limit) {
      this.getAll();
      let filter = {};
      if (this.activeTab === this.P) {
        filter.bizNode = this.selfRole();
        this.status = -1;
        filter.status = 1;
      } else if (this.activeTab === this.D) {
        filter.handledNode = this.selfRole();
        filter.status = this.status == "-1" ? "2,3,4" : this.status;
      } else if (this.activeTab === this.T) {
        filter.movedNode = this.selfRole();
        this.status = -1;
      }
      let _this = this;
      function ifInFilter(key, obj = filter) {
        if (_this[key]) {
          obj[key] = _this[key];
        }
      }
      return new Promise((resolve, reject) => {
        this.loading = true;
        let params = {
          page,
          limit: limit || this.limit
        };
        ifInFilter("keyword");
        if (this.dateTime && this.dateTime.length) {
          filter.starttime = this.transTime(this.dateTime[0]);
          filter.endtime = this.transTime(this.dateTime[1]);
        }
        params.filter = filter;

        pageQuery(params)
          .then(res => {
            this.loading = false;
            if (res && res.success) {
              if (this.activeTab === this.P) {
                this.pendingNum = res.total;
              }
              if (this.activeTab === this.D) {
                this.processedNum = res.total;
              }
              if (this.activeTab === this.T) {
                this.transNum = res.total;
              }
              this.total = res.total;
              let list = res.data || [];
              this.tableData = list;
              this.tableData.forEach(t => {
                t.checked = false;
              });
              list.length && this.toDetail(list[0].id);
              this.currentPage = page;
              this.limit = limit || this.limit;
              resolve(list);
            } else {
              this.$message({
                showClose: true,
                type: "warning",
                message: res.message
              });
              reject(res);
            }
          })
          .catch(err => {
            this.loading = false;
            reject(err);
          });
      });
    },
    // 身份
    selfRole() {
      if (this.curRole === roleId.hq) {
        return bizNode.hq;
      } else if (this.curRole === roleId.bm) {
        return bizNode.bm;
      }
    },
    // 获取状态数量
    getCount() {
      let params = { handledNode: this.selfRole() };
      params.status = this.status == "-1" ? "2,3,4" : this.status;
      if (this.dateTime && this.dateTime.length) {
        params.starttime = this.transTime(this.dateTime[0]);
        params.endtime = this.transTime(this.dateTime[1]);
      }
      if (this.keyword) {
        params.keyword = this.keyword;
      }
      getCountFlag(params)
        .then(res => {
          if (res && res.success) {
            this.$set(this.img[1], "count", 0);
            this.$set(this.img[2], "count", 0);
            this.$set(this.img[3], "count", 0);
            let total = 0;
            res.data &&
              res.data.forEach(r => {
                if (r.status) {
                  total += r.num || 0;
                  this.img.some(i => {
                    if (i.val == r.status) {
                      i.count = r.num;
                      return 1;
                    }
                  });
                }
              });
            this.$set(this.img[0], "count", total);
          } else {
          }
        })
        .catch(err => {});
    },
    // 生成状态图标数组
    genImg() {
      repairStatus.forEach(r => {
        if (r.icon) {
          this.img.push({ ...r, count: 0 });
        }
      });
    },
    // 点击状态图标
    clickImg(item) {
      this.status = item.val;
      this.getList(1);
    },
    // 列表和状态角标
    apis(type) {
      if (type == 0) {
        this.activeTab = "2";
      }
      if (type == 1 || type == 2) {
        this.activeTab = "1";
      }
      this.getList(1);
      this.getCount();
    },
    // 切换tab
    changeTab() {
      this.$refs.list.currentPage = 1;
      this.apis();
    },
    batch() {
      let arr = this.tableData.filter(t => t.checked) || [];
      if (!arr.length) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请先勾选数据"
        });
        return;
      }
      this.bVisible = true;
      this.diagTitle = "批量办理";
    },
    // 全选
    kChange() {
      this.isIndeterminate = false;
      this.tableData.forEach(t => {
        this.$set(t, "checked", this.isChecked);
      });
    }
  },
  created() {
    this.genImg();
    this.apis();
    this.diagBody =
      this.curRole === roleId.bm
        ? "是否转移至后勤管理员？"
        : "是否转移至白马管理员？";
  }
};
</script>

<style lang="scss" scoped>
.div-flex {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  .title-right {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    .batchImg {
      img {
        width: 14px;
        height: 14px;
      }
      span {
        display: inline-block;
      }
    }
  }
}
/deep/ .el-button.el-button--text.el-button--small.is-plain {
  color: #606266;
}
.main {
  margin-top: 10px;
}
.container {
  width: 49%;
  padding: 25px 20px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(37, 38, 41, 0.1),
    0px 24px 20px -24px rgba(37, 38, 41, 0.18);
  border-radius: 5px;
}
// 点击使img变色，必须配合外围的overflow
.click {
  transform: translateY(-60px);
  //颜色、x轴偏移量、y轴偏移量
  filter: drop-shadow(#fd7d18 0 60px);
  -webkit-filter: drop-shadow(#fd7d18 0 60px); //兼容其它浏览器
}
.gap {
  border: 1px solid #fd7d18;
  color: #fd7d18;
}
.no-gap {
  border: 1px solid #cccccc;
  color: #cccccc;
}
.imgs {
  width: 100%;
  margin: 0px auto 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  background-color: #f8f8f8;
  .img-box {
    flex-basis: 23%;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    img {
      margin: 0 auto;
      width: 32px;
      height: 32px;
    }
    div {
      position: absolute;
      left: 50%;
      top: 0;
      width: 32px;
      height: 18px;
      background: #ffffff;
      border-radius: 16px;
      text-align: center;
      line-height: 18px;
    }
    span {
      // 确保文字处于img下方
      flex-basis: 100%;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 18px;
    }
  }
}

.diag {
  width: 121px;
  height: 27px;
  text-align: left;
  img {
    vertical-align: middle;
    width: 29px;
    height: 27px;
  }
  .diag-title {
    vertical-align: middle;
    height: 25px;
    margin-top: 1px;
    width: 72px;
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
  div {
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

/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #00b09b;
  border-color: #00b09b;
}

/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #00b09b;
  border-color: #00b09b;
}
/deep/ .el-checkbox.is-checked .el-checkbox__label {
  color: #383a48;
}
/deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #00b09b;
}

.elRadio {
  display: flex;
  flex-wrap: wrap;
  .itemRadio {
    flex-basis: 20%;
  }
}
.upload-imgs {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #f6f6f6;
  text-align: center;
  margin: 10px 12px 10px 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  i {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    color: #ffffff;
    font-size: 10px;
    padding: 2px;
    cursor: pointer;
  }
}

.upload-box {
  display: inline-block;
  margin-right: 20px;
  vertical-align: top;
  .img-des {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
