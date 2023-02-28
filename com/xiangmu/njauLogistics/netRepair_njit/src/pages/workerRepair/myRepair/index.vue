<template>
  <div style="min-height: 800px">
    <div class="title clearfix">
      <!------------------------- tabs 待维修/已维修 ------------------------->
      <div class="tabs">
        <span
          v-for="item in tabs"
          :key="item.id"
          :class="{ active: activeTab == item.id }"
          @click="changeTab(item)"
        >
          {{ item.name }}
          <!-- <span class="tab-num">{{ item.num }}</span> -->
          <i></i>
        </span>
      </div>
      <!------------------------- 查询区域 ------------------------->
      <div class="title-right">
        <el-date-picker
          v-model="dateTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyyMMdd"
          size="small"
          style="width: 250px"
        ></el-date-picker>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入报修内容"
          size="small"
          clearable
          style="width: 160px"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="doSearch"
          >查询</el-button
        >
        <el-button
          type="primary"
          size="small"
          icon="el-icon-refresh-right"
          style="margin-left: 0"
          @click="resetSearch"
          >重置</el-button
        >
      </div>
    </div>

    <!------------------------- 待维修列表 ------------------------->
    <transition class="container" name="slide-fade">
      <el-row v-if="activeTab === '1'">
        <el-col :span="12">
          <list
            key="1"
            ref="list"
            v-if="userId"
            :params="listParams"
            :activeTab="activeTab"
            @getTotal="getTotal"
          ></list>
        </el-col>
        <!------------------------- 待维修详情 ------------------------->
        <el-col :span="12">
          <repair-detail
            ref="detail"
            v-if="curItem.id"
            :id="curItem.id"
            v-loading="loading"
          >
            <el-tabs v-model="handTab" style="margin-bottom: 30px">
              <!------------------------- 维修完工 ------------------------->
              <el-tab-pane label="维修完工" name="1">
                <edit-form ref="finishForm"></edit-form>
                <el-button type="primary" size="small" @click="takeOut"
                  >提交</el-button
                >
                <el-button type="info" plain size="small" @click="resetForm1"
                  >重置</el-button
                >
              </el-tab-pane>
            </el-tabs>
          </repair-detail>
        </el-col>
      </el-row>
    </transition>

    <!------------------------- 已维修列表 ------------------------->
    <transition class="container" name="slide-fade1">
      <el-row v-if="activeTab === '2'">
        <el-col :span="12">
          <list
            key="2"
            ref="list"
            v-if="userId"
            :params="listParams"
            :activeTab="activeTab"
            @getTotal="getTotal"
          ></list>
        </el-col>
        <!------------------------- 已维修详情 ------------------------->
        <el-col :span="12">
          <detail
            ref="detail"
            v-if="curApplyItem.id"
            :id="curApplyItem.id"
            v-loading="loading"
          ></detail>
        </el-col>
      </el-row>
    </transition>
  </div>
</template>

<script>
import List from "./list";
import repairDetail from "./detail";
import EditForm from "./editForm";
import Detail from "../../repairManage/detail";
export default {
  components: {
    List,
    repairDetail,
    EditForm,
    Detail
  },
  data() {
    return {
      total: {},
      activeTab: "1",
      handTab: "1",
      tabs: [
        { id: "1", name: "待维修" },
        { id: "2", name: "已维修" }
      ],
      dateTime: "",
      keyword: null,
      loading: false
    };
  },
  computed: {
    // 用户部门
    userDept() {
      return this.$store.state.userDept;
    },
    // 用户id
    userId() {
      return this.$store.state.userInfo.ID;
    },
    // 列表查询参数
    listParams() {
      return {
        repairerid: this.userId,
        status: this.activeTab === "1" ? "1" : "2,4",
        repairdeptid: this.userDept.ID || null,
        title: this.keyword,
        starttime: this.dateTime ? this.dateTime[0] + "000000" : null,
        endtime: this.dateTime ? this.dateTime[1] + "235959" : null
      };
    },
    // 当前维修单
    curItem() {
      return this.$store.state.curItem;
    },
    // 当前报修单
    curApplyItem() {
      let data = {};
      let applys = this.curItem.relationApplys || [];
      if (applys.length > 0) {
        for (let i = 0; i < applys.length; i++) {
          if (applys[i].title === this.curItem.title) {
            data = applys[i];
          }
        }
      }
      return data;
    },
    hasData() {
      return this.curItem.id && this.total[this.activeTab];
    }
  },
  methods: {
    getTotal(total) {
      this.total[this.activeTab] = total;
    },
    // 切换tab
    changeTab(item) {
      this.activeTab = item.id;
    },
    // 查询
    doSearch() {
      this.$refs.list.getList();
    },
    // 重置
    resetSearch() {
      this.keyword = null;
      this.dateTime = "";
    },
    // 重置办理表单
    resetForm1() {
      this.$refs.finishForm.$refs.editForm.resetFields();
    },
    // 办理
    takeOut() {
      this.$refs.finishForm.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let data = _.cloneDeep(this.$refs.finishForm.editForm);

          this.util
            .postAjax({
              code: this.global.code,
              url: "repair/complete",
              isRep: true,
              data: {
                id: this.curItem.id,
                photos: data.photos.join(","),
                repairnote: data.note
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$confirm("维修完工!", "提示", {
                  confirmButtonText: "继续维修下一条",
                  cancelButtonText: "查看已维修",
                  type: "success"
                })
                  .then(() => {
                    this.$refs.list.getList();
                    this.$refs.finishForm.$refs.editForm.resetFields();
                  })
                  .catch(() => {
                    this.activeTab = "2";
                    this.$refs.detail.getDetail();
                  });
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `操作失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `操作失败：${err}`
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.slide-fade-enter-active,
.slide-fade1-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  /* transition: all .3s ; */
}
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(500px);
  opacity: 0;
}
.slide-fade1-enter,
.slide-fade1-leave-to {
  transform: translateX(-500px);
  opacity: 0;
}
.title {
  padding: 20px;
  .tabs {
    float: left;
    span {
      display: inline-block;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      margin-right: 30px;
      padding-bottom: 10px;
      cursor: pointer;
      position: relative;
      i {
        display: inline-block;
        height: 2px;
        background: #fd7d18;
        width: 0;
        margin: 0 auto;
        position: absolute;
        bottom: -2px;
        left: 0px;
        right: 0px;
        transition: width 0.3s linear;
      }
      &.active {
        color: #fd7d18;
        font-weight: 500;
        border-bottom: 2px solid #fd7d18;
      }
      &.active:hover i {
        color: #fd7d18;
        font-weight: 500;
        width: 0;
        border-bottom: 0px solid #fd7d18;
      }
      &:hover i {
        color: #fd7d18;
        width: 100%;
        // border-bottom: 2px solid #fd7d18;
      }
    }
  }
  .title-right {
    float: right;
  }
}
.main-list {
  margin: 0 20px 20px;
}
.repair-content {
  position: relative;
  .el-button {
    position: absolute;
    right: 0;
    top: -10px;
  }
  & > div {
    margin: 24px 0 10px 0;
    color: #666;
    span {
      margin-right: 100px;
    }
  }
  p {
    line-height: 28px;
    color: #666;
  }
}
</style>