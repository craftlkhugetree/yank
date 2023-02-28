<template>
  <div style="min-height:800px;">
    <div class="title clearfix">
      <!------------------------- tabs 待派单/已派单 ------------------------->
      <div class="tabs">
        <span
          v-for="item in tabs"
          :key="item.id"
          :class="{'active': activeTab==item.id}"
          @click="changeTab(item)"
        >
          {{item.name}}
          <i></i>
        </span>
      </div>
      <!------------------------- 查询区域 ------------------------->
      <div class="title-right">
        <el-select
          v-if="this.activeTab === '2'"
          v-model="applystatus"
          placeholder="请选择状态"
          size="small"
          clearable
          style="width:120px;"
        >
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
        ></el-date-picker>
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入报修内容"
          size="small"
          clearable
          style="width:160px;"
        ></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="doSearch">查询</el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-refresh-right"
          style="margin-left:0"
          @click="resetSearch"
        >重置</el-button>
      </div>
    </div>

    <!------------------------- 待派单列表 ------------------------->
    <transition class="container" name="slide-fade">
      <el-row v-if="activeTab==='1'">
        <el-col :span="12">
          <list key="1" ref="list" v-if="userId" :params="listParams"></list>
        </el-col>
        <!------------------------- 待派单详情 ------------------------->
        <el-col :span="12">
          <detail ref="detail" v-if="curItem.id" :id="curItem.id" v-loading="loading">
            <el-tabs v-model="handleTab" style="margin-bottom:30px;">
              <!------------------------- 办理 ------------------------->
              <el-tab-pane label="办理" name="1">
                <edit-form-1 ref="editForm1"></edit-form-1>
                <el-button type="primary" size="small" @click="takeOut">提交</el-button>
                <el-button type="info" plain size="small" @click="resetForm1">重置</el-button>
              </el-tab-pane>
              <!------------------------- 退回 ------------------------->
              <el-tab-pane label="退回" name="2">
                <el-form :model="editForm2" ref="editForm2">
                  <el-form-item
                    label="退回说明："
                    prop="note"
                    :rules="[{required: true,message:'请填写说明信息'}]"
                  >
                    <el-input
                      v-model="editForm2.note"
                      type="textarea"
                      maxlength="200"
                      rows="5"
                      resize="none"
                      placeholder="请输入说明，不超过200字"
                    ></el-input>
                  </el-form-item>
                  <common-reply type="1" @doFunc="chooseReturnReply"></common-reply>
                  <el-button type="primary" size="small" @click="sendBack">提交</el-button>
                  <el-button type="info" plain size="small" @click="resetForm2">重置</el-button>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </detail>
        </el-col>
      </el-row>
    </transition>

    <!------------------------- 已派单列表 ------------------------->
    <transition class="container" name="slide-fade1">
      <el-row v-if="activeTab==='2'">
        <el-col :span="12">
          <list key="2" ref="list" v-if="userId" :params="listParams"></list>
        </el-col>
        <!------------------------- 已派单详情 ------------------------->
        <el-col :span="12">
          <detail ref="detail" v-if="curItem.id" :id="curItem.id" v-loading="loading">
            <div
              v-if="curItem.applystatus === '3'"
              style="margin-bottom:30px;position:relative;"
              class="repair-content"
            >
              <h3>维修信息</h3>
              <el-button
                v-if="curRepairItem.status === '1'"
                type="primary"
                size="small"
                @click="openDrawer"
              >修改</el-button>
              <div>
                <span>维修人：{{curRepairItem.repairername}}</span>
                <span>维修时间：{{common.timeFormat(curRepairItem.starttime,"YYYY-MM-DD")}}</span>
              </div>
              <p>维修说明：{{curRepairItem.sendnote}}</p>
            </div>
            <!---------------------------------- 关联报修单 ---------------------------------->
            <div>
              <h4 v-if="repairApplyList.length > 0">关联报修单</h4>
              <list-box-simple
                style="background:#f6f6f6;"
                v-for="item in repairApplyList"
                :key="item.id"
                :item="item"
              ></list-box-simple>
            </div>
          </detail>
        </el-col>
      </el-row>
    </transition>

    <!---------------------------- 弹窗 ---------------------------->
    <el-drawer
      class="base-drawer"
      title="维修派单修改"
      :visible.sync="drawer"
      direction="rtl"
      :wrapperClosable="false"
      @close="closeDrawer"
      v-loading="loading"
      size="660"
    >
      <edit-form-1 style="padding: 30px;" ref="editForm4" operType="edit"></edit-form-1>
      <div class="drawer-footer">
        <el-button type="primary" size="small" @click="editRepair">提交</el-button>
        <el-button size="small" @click="drawer = false">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import List from "../list";
import Detail from "../detail";
import EditForm1 from "./editForm";
import CommonReply from "../../../components/CommonReply";
import ListBoxSimple from "../../../components/ListBoxSimple";
export default {
  components: {
    List,
    Detail,
    EditForm1,
    CommonReply,
    ListBoxSimple
  },
  data() {
    return {
      activeTab: "1",
      applystatus: null,
      tabs: [
        { id: "1", name: "待派单" },
        { id: "2", name: "已派单" }
      ],
      handleTab: "1",
      dateTime: "",
      keyword: null,
      loading: false,
      editForm2: {
        note: ""
      },
      editForm3: {
        note: ""
      },
      drawer: false,
      statusList: [
        // 维修状态
        {
          id: "3",
          name: "维修中"
        },
        {
          id: "4",
          name: "维修完工"
        },
        {
          id: "5",
          name: "维修结束"
        }
      ]
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
        repairleaderid: this.userId,
        applystatus:
          this.activeTab === "1"
            ? "2"
            : this.applystatus
            ? this.applystatus
            : "3,4,5",
        repairdeptid: this.userDept.ID || null,
        keyword: this.keyword,
        starttime: this.dateTime ? this.dateTime[0] + "000000" : null,
        endtime: this.dateTime ? this.dateTime[1] + "235959" : null
      };
    },
    // 当前报修单
    curItem() {
      return this.$store.state.curItem;
    },
    // 当前维修单
    curRepairItem() {
      return this.$store.state.curRepairItem;
    },
    // 当前维修单关联的报销单列表
    repairApplyList() {
      let list = this.curRepairItem.relationApplys || [];
      return list.filter(i => i.id !== this.curItem.id);
    },
    // 维修单位列表
    deptList() {
      return this.$store.state.deptList;
    }
  },
  methods: {
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
      this.$refs.editForm1.$refs.editForm.resetFields();
    },
    // 办理
    takeOut() {
      this.$refs.editForm1.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let data = _.cloneDeep(this.$refs.editForm1.editForm);
          let handletype = data.handletype;
          delete data.handletype;
          let params = {};
          switch (handletype) {
            case "1":
              params.repair = data;
              break;
            case "4":
              params.repairid = data.repairid;
              break;
            case "3":
            case "2":
              params.note = data.sendnote;
              break;
          }
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/handle",
              isRep: true,
              data: {
                type: "4",
                applyid: this.curItem.id,
                handletype: handletype,
                ...params
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$confirm("办理成功!", "提示", {
                  confirmButtonText: "继续办理下一条",
                  cancelButtonText: "查看已派单",
                  type: "success"
                })
                  .then(() => {
                    this.$refs.list.getList();
                    this.$refs.editForm1.getRepairList();
                  })
                  .catch(() => {
                    this.activeTab = "2";
                    this.$refs.detail.getDetail();
                  });
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `办理失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `办理失败：${err}`
              });
            });
        }
      });
    },
    // 选择退回回复
    chooseReturnReply(content) {
      this.editForm2.note = content;
    },
    // 重置退回表单
    resetForm2() {
      this.$refs.editForm2.resetFields();
    },
    // 退回提交
    sendBack() {
      this.$refs.editForm2.validate(valid => {
        if (valid) {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/back",
              isRep: true,
              data: {
                applyid: this.curItem.id,
                type: "3",
                note: this.editForm2.note
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$confirm("退回成功!", "提示", {
                  confirmButtonText: "继续办理下一条",
                  cancelButtonText: "查看已派单",
                  type: "success"
                })
                  .then(() => {
                    this.$refs.list.getList();
                  })
                  .catch(() => {
                    this.activeTab = "2";
                    this.$refs.detail.getDetail();
                  });
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `退回失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `退回失败：${err}`
              });
            });
        }
      });
    },
    // 打开弹窗
    openDrawer() {
      this.drawer = true;
      this.$nextTick(() => {
        let item = this.curRepairItem;
        this.$refs.editForm4.editForm = {
          handletype: "1",
          repairerid: item.repairerid,
          repairername: item.repairername,
          starttime: item.starttime,
          sendnote: item.sendnote,
          repairid: item.id
        };
      });
    },
    // 关闭弹窗
    closeDrawer() {
      this.$refs.editForm4.$refs.editForm.resetFields();
    },
    // 修改维修单
    editRepair() {
      this.$refs.editForm4.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm(
            `关联报修单也同步重新派单的信息，是否确定重新派单？`,
            "重新派单",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(res => {
              this.loading = true;
              let data = _.cloneDeep(this.$refs.editForm4.editForm);
              let handletype = data.handletype;
              delete data.handletype;
              let params = {};
              switch (handletype) {
                case "1":
                  params = {
                    id: data.repairid,
                    status: "1",
                    repairerid: data.repairerid,
                    repairername: data.repairername,
                    starttime: data.starttime,
                    sendnote: data.sendnote
                  };
                  break;
                case "3":
                  params = {
                    id: data.repairid,
                    status: "3",
                    repairnote: data.sendnote
                  };
                  break;
              }
              this.util
                .postAjax({
                  code: this.global.code,
                  url: "repair/edit",
                  isRep: true,
                  data: params
                })
                .then(res => {
                  this.loading = false;
                  if (res.success) {
                    this.$message({
                      showClose: true,
                      type: "success",
                      message: `修改成功！`
                    });
                    this.drawer = false;
                    this.$refs.detail.getDetail();
                  } else {
                    this.$message({
                      showClose: true,
                      type: "error",
                      message: `修改失败：${res.data.message}`
                    });
                  }
                })
                .catch(err => {
                  this.loading = false;
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: `修改失败：${err}`
                  });
                });
            })
            .catch(() => {
              return;
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