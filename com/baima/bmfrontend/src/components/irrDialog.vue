<template>
  <el-form
    :model="form"
    label-position="top"
    ref="form"
    :hide-required-asterisk="true"
    :rules="rules"
  >
    <div class="title">
      <span class="num">1</span>
      <span>基本信息</span>
    </div>
    <el-form-item
      label="学院名称"
      :label-width="formLabelWidth"
      prop="owngroupname"
    >
      <el-select
        v-model="form.orgid"
        filterable
        placeholder="请选择"
        style="width: 100%"
        disabled
      >
        <el-option
          v-for="item in groupList"
          :label="item.name"
          :value="item.id"
          :key="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="项目名称"
      :label-width="formLabelWidth"
      prop="projectname"
    >
      <!--<el-select v-model="form.projectname" filterable remote placeholder="请输入或选择" :remote-method="remoteMethodProject" :loading="selectLoading" style="width: 100%">
        <el-option v-for="item in projectList" :label="item.xmmc" :value="item.xmmc" :key="item.id"></el-option>
      </el-select>-->

      <el-select
        v-model="form.projectname"
        filterable
        remote
        placeholder="请输入或选择"
        :remote-method="remoteMethodProject"
        @change="dataFilterProject"
        :loading="selectLoading"
        style="width: 100%"
      >
        <el-option
          v-for="item in projectList"
          :label="item.xmmc"
          :value="JSON.stringify(item)"
          :key="item.id"
        ></el-option>
      </el-select>

      <!--<div class="my-select-box" style="position: relative">
        <el-input v-model="form.projectname" autocomplete="off" placeholder="请输入项目名称" @input="chooseProject"></el-input>
        <div v-if="projectList && projectList.length >0" class="project-options-box">
          <div class="name-item" v-for="item in projectList" @click="clickItem(item)">{{item.xmmc}}</div>
&lt;!&ndash;          <el-pagination  class="my-el-pagination" layout="prev, pager, next" :total="total" :page-size="limit" :current-page="current" small @current-change="getCurrentChange"></el-pagination>&ndash;&gt;
        </div>
      </div>-->
    </el-form-item>

    <el-row>
      <img
        class="connect-icon"
        src="../../static/images/bm-connect-icon.png"
        alt=""
      />
      <el-col :span="12">
        <el-form-item
          label="课题组负责人"
          :label-width="formLabelWidth"
          prop="classleadername"
        >
          <el-select
            v-model="form.classleadername"
            filterable
            remote
            placeholder="请输入或选择"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            @change="dataFilter"
            style="width: 100%"
          >
            <el-option
              v-for="item in jzgList"
              :label="item.name + '--' + item.id"
              :value="JSON.stringify({ id: item.id, name: item.name })"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          label="联系电话"
          :label-width="formLabelWidth"
          prop="classleadermobile"
        >
          <el-input
            v-model="form.classleadermobile"
            autocomplete="off"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <img
        class="connect-icon"
        src="../../static/images/bm-connect-icon.png"
        alt=""
      />
      <el-col :span="12">
        <el-form-item
          label="申请人"
          :label-width="formLabelWidth"
          prop="eventername"
        >
          <el-input
            v-model="form.eventername"
            autocomplete="off"
            disabled
            placeholder="申请人"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          label="联系电话"
          :label-width="formLabelWidth"
          prop="applyermobile"
        >
          <el-input
            v-model="form.applyermobile"
            autocomplete="off"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <img
        class="connect-icon"
        src="../../static/images/bm-connect-icon.png"
        alt=""
      />
      <el-col :span="12">
        <el-form-item
          label="田间值守人"
          :label-width="formLabelWidth"
          prop="worker"
        >
          <el-input
            v-model="form.worker"
            autocomplete="off"
            placeholder="田间值守人"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          label="联系电话"
          :label-width="formLabelWidth"
          prop="workermobile"
        >
          <el-input
            v-model="form.workermobile"
            autocomplete="off"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <div class="title">
      <span class="num">2</span>
      <span>灌溉信息</span>
    </div>

    <el-row>
      <el-col :span="12">
        <el-form-item
          label="灌溉类型"
          :label-width="formLabelWidth"
          prop="irrestypeid"
        >
          <el-select
            v-model="form.irrestypeid"
            placeholder="请选择灌溉类型"
            style="width: 100%"
            @change="change"
          >
            <el-option
              v-for="item in typeList"
              :label="item.typename"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item
          label="灌溉编号"
          :label-width="formLabelWidth"
          prop="resids"
        >
          <el-select
            v-model="form.resids"
            style="width: 100%"
            multiple
            filterable
            collapse-tags
            placeholder="请输入或选择灌溉编号"
            :disabled="!form.irrestypeid"
          >
            <el-option
              v-for="item in codeList"
              :label="item.rescode"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item
          :label="'灌溉日期(请提前' + limitDay + '天' + limitTime + '前申请)'"
          :label-width="formLabelWidth"
          prop="irdate"
        >
          <el-col :span="15">
            <el-date-picker
              type="date"
              placeholder="请选择日期"
              v-model="form.irdate"
              value-format="yyyyMMdd"
              style="width: 100%;"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="8">
            <el-dropdown @command="chooseTime">
              <el-button type="plain">
                {{ selectTime
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in timeOption"
                  :key="item.value"
                  :command="item.text"
                  >{{ item.text }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item :label-width="formLabelWidth" style="margin-top: 30px">
          <!--<div class="ground" style="" >
            <img style="width:18px;height: 16px;vertical-align: middle" src="../../static/images/bm-ground-icon.png" alt="">
            <span>地块细分预览</span>
            <img  style="width:14px;height: 14px;float: right;margin-top: 14px" src="../../static/images/bm-ground-check.png" alt="">
          </div>-->

          <el-image
            ref="img"
            :src="require('../../static/images/bm-ground-bg.png')"
            :preview-src-list="srcList"
          ></el-image>

          <!--<el-image ref="img" :src="require('../../static/images/bm-ground-bg.png')" @click="show"></el-image>

          <div v-show="false" class="images clearfix" v-viewer="{movable: false}">
            <template v-for="(item) in srcList">
              <img :src="item"  class="image" :key="source" >
            </template>
          </div>-->
        </el-form-item>
      </el-col>
    </el-row>

    <div class="title">
      <span class="num">3</span>
      <span>备注信息</span>
    </div>

    <el-form-item :label-width="formLabelWidth">
      <el-input type="textarea" v-model="form.note"></el-input>
    </el-form-item>

    <!--    <el-button @click="submit">点击</el-button>-->
  </el-form>
</template>

<script>
import util from "../assets/js/util";
import global from "../assets/js/global";

/* import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'
  Vue.use(Viewer)*/

export default {
  name: "applyDialog",
  props: {
    form: Object,
    formLabelWidth: String
    // limitDay:String
    // rules:Object,
  },
  data() {
    var checkresids = (rule, value, callback) => {
      // console.log(value);
      if (value && value.length > 0) {
        callback();
      } else {
        return callback(new Error("请选择灌溉编号"));
      }
    };
    return {
      timeOption: [
        { text: "全天", value: 1 },
        { text: "上午", value: 2 },
        { text: "下午", value: 3 },
      ],
      selectTime: "全天",
      selectTimeId: 1,
      labelsuf: "请规范详实填写项目名称",
      options: {
        toolbar: true,
        url: "data-source"
      },
      selectLoading: false,
      limitDay: "",
      limitTime: "17:30",
      //日期禁用
      pickerOptions: this.disabledDate(),
      jzgList: [], //教职工列表
      typeList: JSON.parse(sessionStorage.getItem("typeList")), //资源类型列表
      codeList: [], //资源编号列表
      groupList: JSON.parse(sessionStorage.getItem("groupList")), //学院列表
      rules: {
        orgid: [
          { required: true, message: "请选择学院名称", trigger: "change" }
        ],
        projectname: [
          { required: true, message: "请输入项目名称", trigger: "change" }
        ],
        classleadername: [
          { required: true, message: "请选择课题组负责人", trigger: "change" }
        ],
        classleadermobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          this.options.testPhone
        ],
        eventername: [
          { required: true, message: "请输入申请人", trigger: "blur" }
        ],
        applyermobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          this.options.testPhone
        ],
        worker: [
          { required: true, message: "请输入田间值守人", trigger: "blur" }
        ],
        workermobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" }
        ],
        irrestypeid: [
          { required: true, message: "请选择灌溉类型", trigger: "change" }
        ],
        resids: [{ validator: checkresids, trigger: "change" }],
        irdate: [
          { required: true, message: "请选择灌溉日期", trigger: "change" }
        ]
        // note:[{ required: true, message: '请输入备注信息', trigger: 'blur'}]
      },
      projectList: [], //项目名称列表
      current: 1, // 分页
      total: 0, //总页数
      limit: 20,
      srcList: [
        require("../../static/images/bm-land-01.jpg"),
        require("../../static/images/bm-land-02.jpg")
      ]
    };
  },
  // computed:{
  //   userInfo() {
  //     return this.$store.state.userInfo;
  //   }
  // },
  methods: {
    chooseTime(val) {
      let obj = this.timeOption.find(t => t.text === val) || this.timeOption[0];
      this.selectTime = obj.text;
      this.selectTimeId = obj.value;
    },
    disabledDate() {
      let that = this;
      return {
        disabledDate(time) {
          // console.log(that.limitTime);
          let limitDay = parseInt(that.limitDay);
          let now = that.util.formatTime(new Date().getTime(), "hh:mm");
          if (that.limitTime < now) {
            limitDay += 1;
          }
          console.log(that.limitTime);
          console.log(now);

          let nDate = new Date(
            new Date().setDate(new Date().getDate() + parseInt(limitDay))
          ).getTime();
          return (
            time.getTime() <
            new Date(
              that.util.formatTime(nDate, "YYYY-MM-DD 00:00:00")
            ).getTime()
          );
        }
      };
    },
    //搜索项目名称
    remoteMethodProject(query) {
      this.selectLoading = true;
      this.projectList = [];
      if (query !== "") {
        this.common
          .getProjectList(query, 1, 10)
          .then(res => {
            console.log(res);
            this.selectLoading = false;
            if (res.total == 0) {
              this.projectList.push({ xmmc: query + "-(新增)" });
            } else {
              this.projectList = res.items;
            }
          })
          .catch(err => {
            this.selectLoading = false;
            this.projectList = [];
          });
      } else {
        this.selectLoading = false;
        this.projectList = [];
      }
    },

    //搜索教职工
    remoteMethod(query) {
      this.selectLoading = true;
      if (query !== "") {
        this.common
          .getjzgList(query)
          .then(res => {
            console.log(res);
            this.selectLoading = false;
            this.jzgList = res.items;
          })
          .catch(err => {
            this.selectLoading = false;
            this.jzgList = [];
          });
      } else {
        this.selectLoading = false;
        this.jzgList = [];
      }
    },

    show() {
      const viewer = this.$el.querySelector(".images").$viewer;
      viewer.show();
    },
    /*preview(){
        // this.$refs.img.style.opacity =1;
        console.log(this.$refs.img);
      },*/

    dataFilterProject(value) {
      let val = JSON.parse(value);
      this.form.projectname = val.xmmc.includes("新增")
        ? val.xmmc.split("-")[0]
        : val.xmmc;
      this.form.projectbh = val.xmbh;
      console.log(this.form.projectname);
    },

    dataFilter(val) {
      this.form.classleadername = JSON.parse(val).name;
      this.form.classleaderid = JSON.parse(val).id;
    },

    residsChange() {
      this.$forceUpdate();
      // console.log(this.form.resids);
    },

    change() {
      this.form.resids = [];
      this.getResCodeList();
    },

    //获取资源编号列表
    getResCodeList() {
      util
        .postAjax({
          code: global.code,
          url: "/irres/list",
          data: {
            params: JSON.stringify({
              restypeid: this.form.irrestypeid,
              orgid: this.form.orgid
            })
          }
        })
        .then(res => {
          if (res.success == true) {
            this.codeList = res.items;
          }
        });
    },
    //刷新
    forceUpdate() {
      this.$forceUpdate();
    }
  },
  created() {
    this.getResCodeList();
    let obj = this.timeOption.find(t => this.form.daytype == t.value) || this.timeOption[0];
    this.selectTime = obj.text;
    this.selectTimeId = obj.value;
    // console.log("222",this.form);
    this.common.findRule("IRAPPLYDAY").then(res => {
      if (res.success) {
        this.limitDay = res.item.rulevalue;

        /*this.pickerOptions={
             disabledDate(time) {
               return this.dealDisabledDate(time);
             }
          }*/
      }
    });

    this.common.findRule("IRAPPLYTIME").then(res => {
      if (res.success) {
        let time = res.item.rulevalue;
        let time2 = "";
        time2 = "00000000" + time;
        this.limitTime = this.util.formatTime(time2, "hh:mm");
      }
    });
  }
};
</script>

<style scoped lang="scss">
/deep/ label[for="owngroupname"] + div.el-form-item__content{
  &::after {
    content: "请规范详实填写项目名称"; 
    position: absolute;
    right: 0;
    margin-top: 5px;
    vertical-align: middle;
    color: #F56C6C;
  }
 }
// /deep/ label[for="projectname"] {
//   // /deep/ label[for="projectname"] + div.el-form-item__content {
//   // &::before {
//   //   content: '123';
//   //   // display: inline-block;
//   //   clear: both;
//   //   // position: absolute;
//   // }
//   &::after {
//     content: "*                                                     请规范详实填写项目名称";
//     // white-space: pre;
//   }
// }
</style>
