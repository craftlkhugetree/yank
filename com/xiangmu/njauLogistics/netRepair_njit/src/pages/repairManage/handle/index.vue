<template>
  <div style="min-height:800px;">
    <div class="title clearfix">
      <!------------------------- tabs 待办理/已办理 ------------------------->
      <div class="tabs">
        <span
          v-for="item in tabs"
          :key="item.id"
          :class="{ active: activeTab == item.id }"
          @click="changeTab(item)"
        >
          {{ item.name }}
          <span class="tab-num">{{ item.num }}</span>
          <i></i>
        </span>
      </div>
      <!------------------------- 查询区域 ------------------------->
      <div class="title-right">
        <!-- <el-select
          v-if="this.activeTab === '2'"
          v-model="applystatus"
          placeholder="请选择状态"
          size="small"
          clearable
          style="width:120px;"
        >
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>-->
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
          class="input-box"
          v-model="keyword"
          placeholder="请输入报修内容"
          size="small"
          clearable
          style="width:160px;"
        ></el-input>
        <el-select
          v-if="activeTab == 2"
          v-model="repairleader"
          size="small"
          clearable
          value-key="ID"
          placeholder="请选择维修责任人"
          @change="void 0"
        >
          <el-option
            v-for="item in repairLeaderList"
            :key="item.ID"
            :label="item.NAME"
            :value="item.ID"
          ></el-option>
        </el-select>
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
          style="margin-left:0"
          @click="resetSearch"
          >重置</el-button
        >
        <el-divider direction="vertical" v-if="activeTab == '1'"></el-divider>
        <el-button
          type="primary"
          size="small"
          style="margin-left:0"
          @click="handleBatch('takeOut')"
          v-if="activeTab == '1'"
          >批量办理</el-button
        >
        <el-button
          type="primary"
          size="small"
          style="margin-left:0"
          @click="handleBatch('move')"
          v-if="activeTab == '1'"
          >批量转移</el-button
        >
        <el-divider v-if="activeTab == 2" direction="vertical"></el-divider>
        <el-button
          type="primary"
          size="small"
          style="margin-left:0"
          @click="downBatch"
          v-if="activeTab == '2'"
          >批量下载</el-button
        >
      </div>
    </div>

    <!------------------------- 待办理列表 ------------------------->
    <transition class="container" name="slide-fade">
      <el-row ref="repairhandle" v-if="activeTab === '1'">
        <el-col :span="12">
          <list key="1" ref="list" :params="listParams" canSelect
          @getTotal="getTotal"></list>
        </el-col>
        <!------------------------- 待办理详情 ------------------------->
        <el-col :span="12">
          <detail
            ref="detail"
            v-if="curItem.id"
            :id="curItem.id"
            v-loading="loading"
          >
            <el-tabs v-model="handleTab" style="margin-bottom:30px;">
              <el-tab-pane label="办理" name="1">
                <el-form :model="editForm1" ref="editForm1">
                  <el-form-item
                    label="维修责任人："
                    prop="repairleader"
                    :rules="[{ required: true, message: '请选择维修责任人' }]"
                  >
                    <el-select
                      v-model="editForm1.repairleader"
                      size="small"
                      clearable
                      value-key="ID"
                    >
                      <el-option
                        v-for="item in repairLeaderList"
                        :key="item.ID"
                        :label="item.NAME"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-button type="primary" size="small" @click="takeOut"
                    >提交</el-button
                  >
                  <el-button type="info" plain size="small" @click="resetForm1"
                    >重置</el-button
                  >
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="转移" name="2">
                <el-form :model="editForm2" ref="editForm2">
                  <el-form-item
                    label="维修单位："
                    prop="repairdeptid"
                    :rules="[{ required: true, message: '请选择维修单位' }]"
                  >
                    <el-select
                      v-model="editForm2.repairdeptid"
                      size="small"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="item in deptList"
                        :key="item.ID"
                        :label="item.NAME"
                        :value="item.ID"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="转移说明："
                    prop="note"
                    :rules="[{ required: true, message: '请输入转移说明' }]"
                  >
                    <el-input
                      v-model="editForm2.note"
                      type="textarea"
                      maxlength="200"
                      rows="5"
                      resize="none"
                      placeholder="请输入说明，不超过200字"
                      style="width:400px;"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="图片说明："
                    prop="photos"
                    style="padding-left:10px;"
                  >
                    <div class="upload-box" v-if="editForm2.photos.length < 3">
                      <el-button
                        icon="el-icon-upload2"
                        size="small"
                        @click="upload"
                        :loading="imgLoading"
                        >上传图片</el-button
                      >
                      <p class="img-des">最多可上传三张照片</p>
                    </div>
                    <div
                      class="upload-imgs"
                      v-for="(item, index) in editForm2.photos"
                      :key="item"
                    >
                      <img :src="fileUrl + item" alt />
                      <i class="el-icon-close" @click="deletePhoto(index)"></i>
                    </div>
                  </el-form-item>
                  <el-button type="primary" size="small" @click="move"
                    >提交</el-button
                  >
                  <el-button type="info" plain size="small" @click="resetForm2"
                    >重置</el-button
                  >
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </detail>
        </el-col>
      </el-row>
    </transition>

    <!------------------------- 已办理列表 ------------------------->
    <transition class="container" name="slide-fade1">
      <el-row ref="repairhandle" v-if="activeTab === '2'">
        <el-col :span="12">
          <div class="status-box clearfix">
            <div
              class="status-box-item clearfix"
              :class="{ active: applystatus == item.status }"
              v-for="item in statusList"
              :key="item.status"
              @click="applystatus = item.status"
            >
              <div class="status-box-img">
                <img
                  :src="applystatus == item.status ? item.imgA : item.img"
                  alt
                />
                <span :class="{ active: applystatus == item.status }">{{
                  item.num
                }}</span>
              </div>
              {{ item.name }}
            </div>
          </div>
          <list key="2" ref="list" :params="listParams" canSelect
          @getTotal="getTotal"></list>
        </el-col>
        <!------------------------- 待办理/已办理详情 ------------------------->
        <el-col :span="12">
          <detail
            ref="detail"
            v-if="curItem.id"
            :id="curItem.id"
            v-loading="loading"
          >
            <div v-if="curItem.applystatus === '2'" style="margin-bottom:30px;">
              <h3>撤回</h3>
              <el-form
                :model="editForm3"
                ref="editForm3"
                style="margin-top:10px;width:500px;"
              >
                <el-form-item
                  label="撤回说明："
                  prop="note"
                  :rules="[{ required: true, message: '请填写说明信息' }]"
                >
                  <el-input
                    v-model="editForm3.note"
                    type="textarea"
                    maxlength="200"
                    rows="5"
                    resize="none"
                    placeholder="请输入说明，不超过200字"
                  ></el-input>
                </el-form-item>
                <common-reply type="2" @doFunc="chooseReply"></common-reply>
                <el-button type="primary" size="small" @click="withdraw"
                  >提交</el-button
                >
                <el-button type="info" plain size="small" @click="resetForm3"
                  >重置</el-button
                >
              </el-form>
            </div>
          </detail>
        </el-col>
      </el-row>
    </transition>

    <!------------------------- 已转移列表 ------------------------->
    <transition class="container" name="slide-fade1">
      <el-row ref="repairhandle" v-if="activeTab === '3'">
        <el-col :span="12">
          <list key="3" ref="list" :params="listParams"
          @getTotal="getTotal"></list>
        </el-col>
        <!------------------------- 待办理/已办理详情 ------------------------->
        <el-col :span="12">
          <detail
            ref="detail"
            v-if="curItem.id"
            :id="curItem.id"
            v-loading="loading"
          ></detail>
        </el-col>
      </el-row>
    </transition>

    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="5120"
      exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
      @done="uploaded"
      @choose="imgLoading = true"
      :url="$store.state.uploadUrl"
      ref="upload"
    ></upload>

    <!------------------------- 办理弹窗 ------------------------->
    <take-out-drawer
      ref="takeOutDrawer"
      :repairLeaderList="repairLeaderList"
      @doFunc="
        $refs.list.getList();
        getTabNum();
      "
    ></take-out-drawer>
    <!------------------------- 转移弹窗 ------------------------->
    <move-drawer
      ref="moveDrawer"
      :deptList="deptList"
      @doFunc="
        $refs.list.getList();
        getTabNum();
      "
    ></move-drawer>
  </div>
</template>

<script>
import List from "../list";
import Detail from "../detail";
import CommonReply from "../../../components/CommonReply";
import upload from "../../../components/BaseUpload";
import TakeOutDrawer from "./takeOutDrawer";
import MoveDrawer from "./moveDrawer";
export default {
  components: {
    List,
    Detail,
    CommonReply,
    upload,
    TakeOutDrawer,
    MoveDrawer
  },
  data() {
    return {
      total: {},
      activeTab: "1",
      tabs: [
        { id: "1", name: "待办理", num: "" },
        { id: "2", name: "已办理", num: "" },
        { id: "3", name: "已转移", num: "" }
      ],
      applystatus: "2,3,4,5",
      handleTab: "1",
      dateTime: "",
      keyword: null,
      repairleader: "",
      editForm1: {
        repairleader: ""
      },
      loading: false,
      editForm2: {
        repairdeptid: "",
        note: "",
        photos: []
      },
      editForm3: {
        note: ""
      },
      repairLeaderList: [],
      imgLoading: false,
      statusList: [
        {
          name: "全部",
          img: "@/../../static/images/quanbu.png",
          imgA: "@/../../static/images/quanbu-active.png",
          status: "2,3,4,5",
          num: 0
        },
        {
          name: "等待派单",
          img: "@/../../static/images/wait.png",
          imgA: "@/../../static/images/wait-active.png",
          selected: false,
          status: "2",
          num: 0
        },
        {
          name: "维修中",
          img: "@/../../static/images/repair.png",
          imgA: "@/../../static/images/repair-active.png",
          selected: false,
          status: "3",
          num: 0
        },
        {
          name: "维修完工",
          img: "@/../../static/images/done.png",
          imgA: "@/../../static/images/done-active.png",
          selected: false,
          status: "4",
          num: 0
        },
        {
          name: "维修结束",
          img: "@/../../static/images/finish.png",
          imgA: "@/../../static/images/finish-active.png",
          selected: false,
          status: "5",
          num: 0
        }
      ],
      selectArr: [] // 已选择的报修单
    };
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    // 用户部门
    userDept() {
      return this.$store.state.userDept;
    },
    // 维修单位列表
    deptList() {
      let data = this.$store.state.deptList;
      return data.filter(i => i.ID !== this.userDept.ID);
    },
    // 列表查询参数
    listParams() {
      let applystatus = null;
      switch (this.activeTab) {
        case "1":
          applystatus = "1";
          break;
        case "2":
          applystatus = this.applystatus ? this.applystatus : "2,3,4,5";
          break;
        case "3":
          applystatus = null;
          break;
      }
      return {
        repairleaderid:
          this.activeTab == 2 && this.repairleader
            ? this.repairleader
            : undefined,
        applystatus,
        activeTab: this.activeTab,
        eventtype: this.activeTab == "3" ? "9" : null,
        repairdeptid: this.userDept.ID || "",
        keyword: this.keyword,
        starttime: this.dateTime ? this.dateTime[0] + "000000" : null,
        endtime: this.dateTime ? this.dateTime[1] + "235959" : null
      };
    },
    // 当前报修单
    curItem() {
      return this.$store.state.curItem;
    }
  },
  watch: {
    userDept() {
      if (this.userDept.ID) {
        this.getRepairLeaderList();
        this.getTabNum();
      }
    }
  },
  methods: {
    getTotal(total) {
      this.total[this.activeTab] = total;
    },
    // 下载已办理的报修单
    downBatch() {
      const curList = this.$refs.list.curList;
      const list = curList.filter(c => c.checked) || [];
      if (list.length) {
        // console.log(list);
        const data = [
          [
            "报修区域",
            "报修内容",
            "报修时间",
            "报修人",
            "联系电话",
            "维修单位",
            "维修责任人"
          ]
        ];
        list.forEach(t => {
          data.push([
            t.title,
            t.note,
            this.util.formatTime(t.createtime, "yyyy-MM-dd hh:mm:ss"),
            t.applyername,
            t.mobile,
            this.common.deptFormat(t.repairdeptid),
            t.repairleadername
          ]);
        });
        this.common.exportExcel(data, "已处理报修单.xlsx");
      } else {
        this.$message({
          showClose: true,
          type: "error",
          message: `请选择报修单！`
        });
      }
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
      this.repairleader = "";
    },
    // 重置办理表单
    resetForm1() {
      // 默认选择第一个人
      this.editForm1.repairleader = this.repairLeaderList[0];
    },
    // 办理
    takeOut() {
      this.$refs.editForm1.validate(valid => {
        if (valid) {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/takeout",
              isRep: true,
              data: {
                version: this.curItem.version,
                applyid: this.curItem.id,
                repairleaderid: this.editForm1.repairleader.ID,
                repairleadername: this.editForm1.repairleader.NAME
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$confirm("办理成功!", "提示", {
                  confirmButtonText: "继续办理下一条",
                  cancelButtonText: "查看已办理",
                  type: "success"
                })
                  .then(() => {
                    this.$refs.list.getList();
                    this.getTabNum();
                  })
                  .catch(() => {
                    this.activeTab = "2";
                    this.$refs.detail.getDetail();
                    this.getTabNum();
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
    // 上传
    upload() {
      this.$refs.upload.toupload();
    },
    // 上传完成
    uploaded(res) {
      this.imgLoading = false;
      if (res.success && this.editForm2.photos.length < 3) {
        this.editForm2.photos.unshift(res.data[0].ID);
      } else {
        this.$message({
          showClose: true,
          message: "上传失败！",
          type: "error"
        });
      }
    },
    // 删除图片
    deletePhoto(index) {
      this.editForm2.photos.splice(index, 1);
    },
    // 重置转移表单
    resetForm2() {
      this.editForm2.repairdeptid = "";
      this.editForm2.note = "";
      this.editForm2.photos = [];
    },
    // 转移
    move() {
      this.$refs.editForm2.validate(valid => {
        if (valid) {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/move",
              isRep: true,
              data: {
                applyid: this.curItem.id,
                version: this.curItem.version,
                repairdeptid: this.editForm2.repairdeptid,
                note: this.editForm2.note,
                photos: this.editForm2.photos.join(",")
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$confirm("转移成功!", "提示", {
                  confirmButtonText: "继续办理下一条",
                  cancelButtonText: "查看已办理",
                  type: "success"
                })
                  .then(() => {
                    this.$refs.list.getList();
                    this.getTabNum();
                  })
                  .catch(() => {
                    this.activeTab = "2";
                    this.$refs.detail.getDetail();
                    this.getTabNum();
                  });
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `转移失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `转移失败：${err}`
              });
            });
        }
      });
    },
    // 选择撤回回复
    chooseReply(content) {
      this.editForm3.note = content;
    },
    // 撤回
    withdraw() {
      this.$refs.editForm3.validate(valid => {
        if (valid) {
          this.loading = true;
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/withdraw",
              isRep: true,
              data: {
                applyid: this.curItem.id,
                version: this.curItem.version,
                note: this.editForm3.note
              }
            })
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$confirm("撤回成功!", "提示", {
                  confirmButtonText: "继续撤回下一条",
                  cancelButtonText: "查看待办理",
                  type: "success"
                })
                  .then(() => {
                    this.$refs.list.getList();
                    this.$refs.editForm3.resetFields();
                    this.getTabNum();
                  })
                  .catch(() => {
                    this.activeTab = "1";
                    this.getTabNum();
                  });
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `撤回失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `撤回失败：${err}`
              });
            });
        }
      });
    },
    // 重置撤回表单
    resetForm3() {
      this.editForm3.note = "";
    },
    // 获取维修负责人列表
    getRepairLeaderList() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/UserGroup/getUserByGroup2Role",
          data: {
            GROUPID: this.userDept.ID,
            ROLEID: `${this.util.webUserID}-3`
          }
        })
        .then(res => {
          if (res.success) {
            this.repairLeaderList = res.items || [];
            this.resetForm1();
          }
        })
        .catch(err => {});
    },
    // 批量办理/转移
    handleBatch(type) {
      this.selectArr = this.$refs.list.list.filter(i => i.checked);
      if (this.selectArr.length == 0) {
        this.$message({
          showClose: true,
          type: "error",
          message: "请选择报修单！"
        });
        return;
      }
      let drawer =
        type == "takeOut" ? this.$refs.takeOutDrawer : this.$refs.moveDrawer;
      drawer.selectArr = this.selectArr;
      drawer.drawer = true;
    },

    // 获取数据
    getNum(params) {
      return new Promise((resolve, reject) => {
        this.util
          .postAjax({
            code: this.global.code,
            url: "apply/pageQuery",
            isRep: true,
            data: {
              filter: {
                ...params
              },
              limit: 5,
              page: 1
            }
          })
          .then(res => {
            if (res.success) {
              resolve(res.total || 0);
            } else {
              reject(res.data.message);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 获取tab数字
    getTabNum() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/applycountByDept",
          data: {
            repairdeptid: this.userDept.ID
          }
        })
        .then(res => {
          if (res.success) {
            let data = res.data || [];
            this.tabs[0].num = 0;
            this.statusList[1].num = 0;
            this.statusList[2].num = 0;
            this.statusList[3].num = 0;
            this.statusList[4].num = 0;
            data.forEach(i => {
              switch (i.applystatus) {
                case "1":
                  this.tabs[0].num = i.num;
                  break;
                case "2":
                  this.statusList[1].num = i.num;
                  break;
                case "3":
                  this.statusList[2].num = i.num;
                  break;
                case "4":
                  this.statusList[3].num = i.num;
                  break;
                case "5":
                  this.statusList[4].num = i.num;
                  break;
              }
            });
            let nums = this.statusList
              .filter((item, index) => index > 0)
              .map(i => i.num);
            let total = nums.reduce((sum, num) => {
              return sum + num;
            }, 0);
            this.statusList[0].num = this.tabs[1].num = total;
          }
        })
        .catch(err => {});

      // 已转移的数据
      this.getNum({
        eventtype: "9",
        repairdeptid: this.userDept.ID || ""
      }).then(res => {
        this.tabs[2].num = res;
      });
    }
  },
  created() {
    if (this.userDept.ID) {
      this.getRepairLeaderList();
      this.getTabNum();
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
      margin-right: 55px;
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
    .tab-num {
      position: absolute;
      left: 54px;
      bottom: 0;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
    }
  }
  .title-right {
    float: right;
  }
}
// #line{
//   width:0px;
//   height:5px;
//   border-radius:5px;
//   background-color:#fff;
//   margin:0 auto;
//   position:absolute;
//   top:338px;
//   left:0px;
//   right:0px;
//   transition:width 1s linear;
// }
// #wrap:hover #line{
//   width:200px;
// }
.main-list {
  margin: 0 20px 20px;
}

.no-data {
  width: 100%;
  padding: 30px 0;
  margin-left: 20px;
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
}

.upload-box {
  display: inline-block;
  margin-right: 20px;
  vertical-align: top;
  .img-des {
    color: rgba(0, 0, 0, 0.45);
  }
}

.upload-imgs {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #f6f6f6;
  text-align: center;
  margin-right: 12px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

.status-box {
  padding: 16px 20px 0;
  background: #f9f9f9;
  border-radius: 5px;
  margin: 0 20px 10px;
  .status-box-item {
    cursor: pointer;
    float: left;
    margin: 0 30px 10px 0;
    line-height: 32px;
    color: #999;
    &.active {
      color: #666;
    }
    .status-box-img {
      float: left;
      position: relative;
      width: 32px;
      height: 32px;
      margin-right: 12px;
      img {
        width: 100%;
        height: 100%;
      }
      span {
        position: absolute;
        top: -6px;
        left: 24px;
        display: inline-block;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #cccccc;
        line-height: 17px;
        padding: 1px 6px;
        font-size: 12px;
        color: #999;
        &.active {
          color: #fd7d18;
          border-color: #fd7d18;
        }
      }
    }
  }
}

.el-divider {
  margin: 0;
  height: 30px;
}
</style>
