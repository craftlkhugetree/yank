
<template>
  <div>
    <div class="banner">
      <p class="h1">办师生满意的后勤</p>
      <p class="sectitle">— PROVIDE SATISFACTORY LOGISTICS —</p>
      <!-- <el-button class="openModal" @click="startTaskModal">
        <i class="iconfont iconhuifuguanli1"></i>
        我要说</el-button
      > -->
    </div>
    <div class="main">
      <div class="mainlists">
        <div class="listleft">
          <el-tabs v-model="status"  @tab-click="changestatus">
            <el-tab-pane name="mine">
              <span slot="label"><i class="iconfont iconquanbu"></i> <i class="tabshow tabshow1"></i>我的</span>
               <transition class="container" name="slide-fade" >
                <myTasks v-if="status=='mine'" ref="mytask"></myTasks>
               </transition>
            </el-tab-pane>
            <el-tab-pane name="all">
              <span slot="label"><i class="tabshow"></i> 全部</span>
              <transition class="container" name="slide-fade1" >
                <allTasks v-if="status=='all'"></allTasks>
              </transition>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="listright">
          <div class="start">
            <h2>我要说</h2>
            <div
              class="startbtns"
              v-for="item in $store.state.serviceTypes"
              :key="item.type"
              @click="startTaskModal(item.type)"
            >
              <i :class="item.icon" class="starticons"></i>
              <p>{{ item.name }}</p>
            </div>
          </div>
          <div class="ask" @click="toHref"></div>
          <!-- <iframe
            class="boya"
            src="https://njau.campusphere.net/wec-amp-boya/mobile/index.html#/chat"
          ></iframe> -->
        </div>
      </div>
    </div>
    <el-dialog
      title="我要说"
      :visible.sync="vis"
      class="service-small-dialog"
      width="600px"
    >
      <el-form
        :model="form"
        label-width="90px"
        label-position="right"
        :rules="formRule"
        ref="applyform"
      >
        <el-form-item label="我要:" prop="type">
          <div
            class="selectservicetype"
            :class="{ selected: form.type === item.type }"
            v-for="item in $store.state.serviceTypes"
            @click="form.type = item.type"
            :key="item.type"
          >
            <i class="formicon" :class="item.icon"></i>
            <p class="formiconname">{{ item.name }}</p>
          </div>
          <el-input
            v-model="form.type"
            autocomplete="off"
            class="hidden"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" prop="applyermobile">
          <el-input
            v-model="form.applyermobile"
            autocomplete="off"
            placeholder="请输入手机号"
            size="small"
            style="width: 314px"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务领域:" prop="handledeptid">
          <el-select
            v-model="form.handledeptid"
            placeholder="请选择"
            class="selects"
            size="small"
          >
            <el-option
              v-for="item in $store.state.departments.filter(i => i.ISLOCK=='0')"
              :key="item.ID"
              :label="item.NAME"
              :value="item.ID"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题:" prop="title">
          <el-input
            v-model="form.title"
            autocomplete="off"
            placeholder="请输入标题"
            size="small"
            style="width: 314px"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input
            type="textarea"
            v-model="form.content"
            autocomplete="off"
            :rows="6"
            :maxlength="200"
            placeholder="请输入内容，不超过200字"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片:">
          <el-button
            icon="iconfont iconexport"
            size="small"
            @click="upload"
            v-show="photos.length < 3"
            >上传图片</el-button
          >
          <span class="imglabel">最多可上传三张照片,每张不大于5M</span>
        </el-form-item>
        <el-form-item label="">
          <div class="attaches" v-for="(img, index) in photos" :key="img">
            <img :src="$store.state.fileUrl + img" width="80px" height="80px" />
            <i class="el-icon-close" @click="delAttach(index)"></i>
          </div>
        </el-form-item>
      </el-form>

      <upload
        class="hidden"
        :multiple="false"
        :size="1024 * 5"
        exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
        @done="uploaded"
        :url="$store.state.uploadUrl"
        ref="upload"
      ></upload>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" size="small" :loading="saveLoading">提 交</el-button>
        <el-button @click="vis = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import upload from "../../components/BaseUpload";
import allTasks from "./allTasks";
import myTasks from "./myTasks";
export default {
  data() {
    return {
      saveLoading: false,
      status: "mine",
      vis: false,
      form: {
        title: "",
        type: 1,
        content: "",
        handledeptid: "",
        applyermobile: "",
      },
      formRule: {
        title: { required: true, message: "请输入标题" },
        type: { required: true, message: "请选择类型" },
        content: { required: true, message: "请输入内容" },
        handledeptid: { required: true, message: "请选择领域" },
        applyermobile: [
          {
            validator: function (rule, value, callback) {
              if (/^1\d{10}$/.test(value) == false) {
                callback(new Error("请输入正确的手机号"));
              } else {
                callback();
              }
            },
            message: "请输入手机号",
          },
          { required: true, message: "请输入手机号" },
        ],
      },
      photos: [],
    };
  },
  components: { allTasks, myTasks, upload },
  computed: {
    userRoleIds() {
      return this.$store.state.userRoles.map(i => i.ID);
    }
  },
  methods: {
    changestatus(tab, event){
      if(tab.index==0){
        this.status = 'mine'
      }else{
        this.status = 'all'
      }
    },
    toHref() {
      let left = window.innerWidth - 400;
      let height = window.innerHeight - 100;
      window.open(
        "https://njau.campusphere.net/wec-amp-boya/mobile/index.html#/chat",
        "_blank",
        "resizable=no,top=60,width=375,left=" + left + ",height=" + height
      );
    },
    startTaskModal(type) {
      this.form = {
        title: "",
        type: type,
        content: "",
        handledeptid: "",
      };
      this.$refs["applyform"] && this.$refs["applyform"].resetFields();
      this.photos = [];
      this.vis = true;
    },
    upload() {
      this.$refs["upload"].toupload();
    },
    uploaded(res) {
      if (res.success && this.photos.length < 3)
        this.photos.push(res.data[0].ID);
    },
    delAttach(index) {
      this.photos.splice(index, 1);
    },
    save() {
      this.$refs["applyform"].validate((valid) => {
        if (!valid) {
          return;
        }
        let departments = this.$store.state.departments;
        let handledeptname =
          departments[_.findIndex(departments, { ID: this.form.handledeptid })]
            .NAME;
        this.saveLoading = true;
        this.util
          .postAjax({
            code: this.global.code,
            url: "apply/save",
            isRep: true,
            data: {
              ...this.form,
              handledeptname,
              photos: this.photos.join(","),
              applyertype: this.userRoleIds.includes("9100003-4") ? "1" : "0" // 是否学生督察员
            },
          })
          .then((res) => {
            this.saveLoading = false;
            if (res.success) {
              this.vis = false;
              this.$message.success("成功发起任务！");
              this.$refs["mytask"].refresh();
            }
          }).catch(err => {
            this.saveLoading = false;
          });
      });
    },
  },
  created() {},
};
</script>
<style lang='scss' scoped>
.slide-fade-enter-active,.slide-fade1-enter-active {
    transition: all .5s ease;
}
.slide-fade-leave-active {
    /* transition: all .3s ; */
}
.slide-fade-enter, .slide-fade-leave-to

    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(800px);
    opacity: 0;
}
.slide-fade1-enter, .slide-fade1-leave-to{
    transform: translateX(-800px);
    opacity: 0;
}
.banner {
  position: absolute;
  width: 100%;
  height: 200px;
  background: url(../../../static/images/banner.png) no-repeat;
  background-size: cover;
  top: 60px;
  left: 0;
}
.main {
  position: absolute;
  width: 100%;
  background-color: #fff;
  top: 260px;
  padding-top: 20px;
  left: 0;
  min-height: 735px;
}
.h1 {
  height: 50px;
  font-size: 36px;
  color: #4e75cb;
  line-height: 50px;
  margin-bottom: 7px;
  margin-top: 56px;
  margin-left: 18%;
}
.sectitle {
  height: 22px;
  font-size: 16px;
  color: rgba(70, 92, 140, 0.3);
  line-height: 22px;
  margin-bottom: 16px;
  margin-left: 18%;
}
.openModal {
  margin-left: 18%;
  width: 280px;
  height: 45px;
  background: #ff6f4b;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  .iconfont.iconhuifuguanli1 {
    font-size: 20px !important;
    font-weight: 400;
    display: inline-block;
    margin-right: 10px;
  }
}
.openModal:hover {
  color: #ffffff;
  border-color: #ff6f4b;
  background-color: #ff6f4b;
}
.mainlists {
  width: 1200px;
  margin: 0 auto;
  .listleft {
    width: 800px;
    float: left;
    margin-right: 40px;
  }
  .listright {
    width: 360px;
    float: left;
    .ask {
      width: 100%;
      height: 100px;
      background: url(../../../static/images/ask.png);
      cursor: pointer;
    }
  }
}
.listleft {
  & /deep/ .el-tabs__item {
    height: 30px;
    line-height: 20px;

    font-size: 18px;
  }
  & /deep/ .el-tabs__active-bar {
    background-color: #ff6f4b;
  }
  & /deep/ .el-tabs__header {
    margin: 0 0 0;
  }
}
.listleft /deep/ .el-tabs__item.is-active {
  color: #ff6f4b;
  font-weight: 600;
}
.listleft /deep/ .el-tabs__item.is-active :hover .tabshow{
  width: 0;
}
.listleft /deep/ .el-tabs__item:hover {
  color: #ff6f4b;
}
.listleft /deep/ .el-tabs__item:hover .tabshow{
  width: 36px;
}
.listleft /deep/ .el-tabs__item:hover .tabshow1{
  width: 67px;
}
.iconquanbu {
  display: inline-block;
  margin-right: 10px;
}
.tabshow{
  display: inline-block;
  height: 2px;
  background: #fd7d18;
  width: 0;
  margin:0 auto;
  position:absolute;
  bottom:0;
  transition:width .3s linear;
}
.tabshow1{
  left:0;
}
.selectservicetype {
  width: 50px;
  height: 60px;
  background: #eeeeee;
  border-radius: 5px;
  display: inline-block;
  margin-right: 16px;
  cursor: pointer;
  i {
    display: block;
    text-align: center;
    height: 28px;
    font-size: 18px;
    color: rgba(153, 153, 153, 1);
  }
  p {
    font-size: 12px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    color: rgba(153, 153, 153, 1);
  }
}
.selectservicetype.selected {
  background: #3a78fc;
  box-shadow: 0px 4px 10px 0px rgba(58, 120, 252, 0.3);
  i,
  p {
    color: #fff;
  }
}
.hidden {
  display: none;
}
.service-small-dialog {
  .selects {
    width: 314px;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
}
.imglabel {
  display: block;
  height: 22px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
}
.attaches {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  // outline: 1px solid #000;
  i {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 16px;
    cursor: pointer;
  }
}
.boya {
  width: 100%;
  margin-top: 10px;
  height: 600px;
  margin-bottom: 60px;
}
.start {
  height: 151px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 0px rgba(37, 38, 41, 0.06),
    0px 24px 20px -24px rgba(37, 38, 41, 0.16);
  border-radius: 5px;
  margin-bottom: 30px;
  h2 {
    width: 340px;
    height: 40px;
    line-height: 40px;
    margin: 0 auto;
    font-size: 18px;
    font-weight: 400;
    color: #5f6464;
    border-bottom: 1px solid #eee;
  }
  .startbtns {
    cursor: pointer;
    display: inline-block;
    margin: 16px;
    p {
      text-align: center;
    }
  }
  .starticons {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background-color: rgba(58, 120, 252, 1);
    border-radius: 5px;
    font-size: 18px;
    margin-bottom: 6px;
    box-shadow: 0px 0px 15px 0px rgba(37, 38, 41, 0.06),
      0px 24px 20px -24px rgba(37, 38, 41, 0.16);
  }
}
</style>