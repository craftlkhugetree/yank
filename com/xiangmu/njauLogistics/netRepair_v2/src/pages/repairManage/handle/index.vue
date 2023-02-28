<template>
  <div style="min-height:800px;">
    <div class="title clearfix">
      <!------------------------- tabs 待办理/已办理 ------------------------->
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


    <!------------------------- 待办理列表 ------------------------->
    <transition class="container" name="slide-fade" >
    <el-row ref="repairhandle" v-if="activeTab==='1'">
      <el-col :span="12">
        <list key="1" ref="list" :params="listParams"></list>
      </el-col>
      <!------------------------- 待办理详情 ------------------------->
      <el-col :span="12">
        <detail ref="detail" v-if="curItem.id" :id="curItem.id" v-loading="loading">
          <el-tabs v-model="handleTab" style="margin-bottom:30px;">
            <el-tab-pane label="办理" name="1">
              <el-form :model="editForm1" ref="editForm1">
                <el-form-item
                  label="维修责任人："
                  prop="repairleader"
                  :rules="[{required: true,message:'请选择维修责任人'}]"
                >
                  <el-select v-model="editForm1.repairleader" size="small" clearable value-key="ID">
                    <el-option
                      v-for="item in repairLeaderList"
                      :key="item.ID"
                      :label="item.NAME"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-button type="primary" size="small" @click="takeOut">提交</el-button>
                <el-button type="info" plain size="small" @click="resetForm1">重置</el-button>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="转移" name="2">
              <el-form :model="editForm2" ref="editForm2">
                <el-form-item
                  label="维修单位："
                  prop="repairdeptid"
                  :rules="[{required: true,message:'请选择维修单位'}]"
                >
                  <el-select v-model="editForm2.repairdeptid" size="small" clearable filterable>
                    <el-option
                      v-for="item in deptList"
                      :key="item.ID"
                      :label="item.NAME"
                      :value="item.ID"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="转移说明：" prop="note" style="padding-left:10px;">
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
                <el-form-item label="图片说明：" prop="photos" style="padding-left:10px;">
                  <div class="upload-box" v-if="editForm2.photos.length < 3">
                    <el-button
                      icon="el-icon-upload2"
                      size="small"
                      @click="upload"
                      :loading="imgLoading"
                    >上传图片</el-button>
                    <p class="img-des">最多可上传三张照片</p>
                  </div>
                  <div class="upload-imgs" v-for="(item,index) in editForm2.photos" :key="item">
                    <img :src="fileUrl + item" alt />
                    <i class="el-icon-close" @click="deletePhoto(index)"></i>
                  </div>
                </el-form-item>
                <el-button type="primary" size="small" @click="move">提交</el-button>
                <el-button type="info" plain size="small" @click="resetForm2">重置</el-button>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </detail>
      </el-col>
    </el-row>
    </transition>


    <!------------------------- 已办理列表 ------------------------->
    <transition class="container" name="slide-fade1" >
    <el-row ref="repairhandle" v-if="activeTab==='2'">
      <el-col :span="12">
        <list key="2" ref="list" :params="listParams"></list>
      </el-col>
      <!------------------------- 待办理/已办理详情 ------------------------->
      <el-col :span="12">
        <detail ref="detail" v-if="curItem.id" :id="curItem.id" v-loading="loading">
          <div v-if="curItem.applystatus === '2'" style="margin-bottom:30px;">
            <h3>撤回</h3>
            <el-form :model="editForm3" ref="editForm3" style="margin-top:10px;width:500px;">
              <el-form-item label="撤回说明：" prop="note" :rules="[{required: true,message:'请填写说明信息'}]">
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
              <el-button type="primary" size="small" @click="withdraw">提交</el-button>
              <el-button type="info" plain size="small" @click="resetForm3">重置</el-button>
            </el-form>
          </div>
        </detail>
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
      @choose="imgLoading=true"
      :url="$store.state.uploadUrl"
      ref="upload"
    ></upload>
  </div>
</template>

<script>
import List from "../list";
import Detail from "../detail";
import CommonReply from "../../../components/CommonReply";
import upload from "../../../components/BaseUpload";
export default {
  components: {
    List,
    Detail,
    CommonReply,
    upload
  },
  data() {
    return {
      activeTab: "1",
      tabs: [
        { id: "1", name: "待办理" },
        { id: "2", name: "已办理" }
      ],
      applystatus: null,
      handleTab: "1",
      dateTime: "",
      keyword: null,
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
        // 维修状态
        {
          id: "2",
          name: "等待派单"
        },
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
      return {
        applystatus:
          this.activeTab === "1"
            ? "1"
            : this.applystatus
            ? this.applystatus
            : "2,3,4,5",
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
      }
    }
  },
  methods: {
    // 切换tab
    changeTab(item) {
      this.activeTab = item.id;
      // if(this.activeTab==1){
      //   $(this.$refs.repairhandle.$el).css({'display':'none','transform':' translateX(800px)'})
      //    setTimeout(()=>{
      //     $(this.$refs.repairhandle.$el).css({'display':'block','overflow':'hidden','z-index':'-99'})
      //   },100)
      //   setTimeout(()=>{
      //     $(this.$refs.repairhandle.$el).css({'display':'block','z-index':'99','transform':' translateX(0px)','transition': 'all .3s ease','float':'left'})
      //   },300)
      // }else{
      //   $(this.$refs.repairhandle.$el).css({'display':'none','transform':' translateX(-800px)','transition': 'all .3s ease','float':'left'})
      //   setTimeout(()=>{
      //     $(this.$refs.repairhandle.$el).css({'display':'block','overflow':'hidden','z-index':'-99'})
      //   },100)
      //   setTimeout(()=>{
      //     $(this.$refs.repairhandle.$el).css({'display':'block','z-index':'99','transform':' translateX(0px)','transition': 'all .3s ease','float':'left'})
      //   },300)
      // }
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
                  })
                  .catch(() => {
                    this.activeTab = "2";
                    this.$refs.detail.getDetail();
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
                  })
                  .catch(() => {
                    this.activeTab = "1";
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
            ROLEID: "9100002njit-3"
          }
        })
        .then(res => {
          if (res.success) {
            this.repairLeaderList = res.items || [];
            this.resetForm1();
          }
        })
        .catch(err => {});
    }
  },
  created() {
    if (this.userDept.ID) {
      this.getRepairLeaderList();
    }
  }
};
</script>

<style lang="scss" scoped>
.slide-fade-enter-active,.slide-fade1-enter-active {
    transition: all .3s ease;
}
.slide-fade-leave-active {
    /* transition: all .3s ; */
}
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(500px);
    opacity: 0;
}
.slide-fade1-enter, .slide-fade1-leave-to{
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
</style>