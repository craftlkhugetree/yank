<template>
  <div v-loading.fullscreen.lock="loading">
    <div class="common-content" style="padding: 10px 20px">
      <!------------------------- 查询区域 ------------------------->
      <div class="search-group div-flex clearfix">
        <div class="title-left">
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
            style="width:160px;"
            maxlength="20"
          ></el-input>
          <el-button
            type="default"
            size="small"
            icon="el-icon-search"
            @click="onSearch"
            >搜索</el-button
          >
          <el-button
            type="text"
            plain
            size="small"
            icon="el-icon-refresh-right"
            style="margin-left:0"
            @click="resetSearch"
            >重置</el-button
          >
        </div>

        <!------------------------- tabs 已报修/草稿 ------------------------->
        <div class="title-right">
          <div :class="{ active: activeTab == '1' }" @click="changeTab('1')">
            <img
              v-if="activeTab == '1'"
              src="@/../static/images/yibaoxiu-active.png"
              alt
            />
            <img v-else src="@/../static/images/yibaoxiu.png" alt />
            已报修
          </div>
          <el-divider direction="vertical"></el-divider>
          <div :class="{ active: activeTab == '2' }" @click="changeTab('2')">
            <img
              v-if="activeTab == '2'"
              src="@/../static/images/caogaoxiang-active.png"
              alt
            />
            <img v-else src="@/../static/images/caogaoxiang.png" alt />
            草稿箱
          </div>
        </div>
      </div>
    </div>
    <!------------------------- 新增和列表 ------------------------->
    <div class="main">
      <!------------------------- 新增/编辑 ------------------------->
      <div class="container" style="float: left; min-height:1000px;">
        <edit-report
          ref="edit"
          @loading="setLoading"
          @apis="apis"
        ></edit-report>
      </div>
      <!------------------------- 列表 ------------------------->
      <div class="container" style="float: right; min-height:1000px;">
        <list
          :isReport="true"
          v-show="!isDetail"
          ref="list"
          :total="total"
          :tableData="tableData"
          :activeTab="activeTab"
          @getList="getList"
          @trigger="trigger"
        >
          <!-- 状态图标 -->
          <div class="imgs" v-if="activeTab == 1">
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
        <!------------------------- 详情 ------------------------->
        <detail ref="detail" v-show="isDetail" :activeTab="activeTab"></detail>
      </div>
    </div>

    <!-- 删除确认框 -->
    <el-dialog
      v-if="showConfirmDelete"
      :visible.sync="showConfirmDelete"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="true"
      :show-close="false"
      width="30%"
    >
      <template #title>
        <div class="diag">
          <img :src="require('st@tic/images/dialog.png')" />
          <span class="diag-title">{{ diagTitle }}</span>
        </div>
      </template>
      <span class="info44">{{ diagBody }}</span>
      <div slot="footer" class="dialog-footer">
        <div class="my-button" @click="showConfirmDelete = false">
          取 消
        </div>
        <div class="my-button green" @click="confirmDelete">确 定</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCountFlag, getMyRepairs, deleteId } from "@/assets/js/api";
import { repairStatus } from "@/assets/js/options";

export default {
  name: "ReportList",
  components: {
    EditReport: () => import("./editReport"),
    List: () => import("./list"),
    Detail: () => import("./detail")
  },
  data() {
    return {
      diagBody: "",
      diagTitle: "",
      isDetail: false,
      activeTab: "1",
      status: -1,
      img: [{ val: -1, name: "全部", icon: "quanbu", count: 0 }],
      dateTime: [],
      keyword: "",
      currentPage: 1,
      limit: 5,
      tableData: [],
      total: 0,
      loading: false,
      showConfirmDelete: false,
      deleteRow: {},
      userId: this.$store.state.userId
    };
  },
  methods: {
    trigger(type, obj) {
      if (type === "edit") {
        this.toEdit(obj);
      }
      if (type === "delete") {
        this.deleteRes(obj);
      }
      if (type === "detail") {
        this.toDetail(obj);
      }
      if (type === "judge") {
        this.toJudge(obj);
      }
    },
    // 改变loading
    setLoading(bool) {
      this.loading = bool;
    },
    // 切换tab
    changeTab(type) {
      this.$refs.list.currentPage = 1;
      this.isDetail = false;
      this.activeTab = type;
      this.apis();
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
      this.getCount();
      this.getList(1);
    },
    // 编辑页面
    toEdit(id) {
      this.$refs.edit.findById(id);
    },
    // 报修详情
    toDetail(id) {
      this.isDetail = true;
      this.$nextTick(() => {
        this.$refs.detail.findById(id);
        this.$refs.detail.$refs.judge && this.$refs.detail.$refs.judge.genR();
      });
    },
    // 评价
    toJudge(row) {
      this.toDetail(row.id);
    },
    // 删除
    deleteRes(row) {
      this.diagTitle = "确认";
      this.diagBody = "确认删除吗？";
      this.showConfirmDelete = true;
      this.deleteRow = row;
    },
    // 确认删除
    confirmDelete() {
      this.showConfirmDelete = false;
      deleteId(this.deleteRow.id)
        .then(res => {
          if (res.success == true) {
            this.$message({
              showClose: true,
              type: "success",
              message: "删除成功"
            });
            this.getList(1);
            this.$refs.edit.reset();
            this.$refs.edit.resetForm();
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

    // 获取列表
    getList(page, limit) {
      this.isDetail = false;
      let status =
        this.activeTab == "2"
          ? 0
          : this.status == "-1"
          ? "1,2,3,4"
          : this.status;
      let filter = { status };
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

        getMyRepairs(params)
          .then(res => {
            this.loading = false;
            if (res && res.success) {
              this.total = res.total;
              let list = res.data || [];
              this.tableData = list;
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
    // 获取状态数量
    getCount() {
      let params = { createId: this.userId };
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
                this.$set(this.img[1], 'count', 0);
                this.$set(this.img[2], 'count', 0);
                this.$set(this.img[3], 'count', 0);
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
    // 子组件触发
    apis(type) {
      if (type == 0) {
        this.activeTab = "2";
      }
      if (type == 1 || type == 2) {
        this.activeTab = "1";
      }
      this.getList(1);
      this.getCount();
    }
  },
  created() {
    this.genImg();
    this.apis();
  }
};
</script>

<style lang="scss" scoped>
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

.div-flex {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  .title-left {
    display: inline-block;
  }
  .title-right {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    div {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      color: #999;
      font-size: 12px;
      color: #999;
      cursor: pointer;
      img {
        width: 16px;
        height: 16px;
        margin-right: 0;
      }
      &.active {
        color: #fd7d18;
        font-weight: 600;
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
  margin: 10px auto;
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
</style>
