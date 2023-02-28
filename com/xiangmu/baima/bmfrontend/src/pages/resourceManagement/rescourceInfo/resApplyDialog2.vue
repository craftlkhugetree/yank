<template>
  <div>
    <el-form
      :model="form"
      label-position="top"
      ref="form"
      :hide-required-asterisk="false"
      :rules="rules"
    >
      <div class="title">
        <span class="num">1</span>
        <span>基本信息</span>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form-item
            :label="'资源类型'"
            :label-width="formLabelWidth"
            prop="eduTypeId"
          >
            <el-select
              @change="typeChange"
              v-model="form.eduTypeId"
              placeholder="请选择"
              style="width: 100%"
              :disabled="dialogType === 'continue'"
            >
              <el-option
                v-for="item in resTypeList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            :label="
              notRent ? '资源编号(最多可选择' + limitNum + '个)' : '资源编号'
            "
            :label-width="formLabelWidth"
            prop="eduResourceIds"
          >
            <el-select
              v-model="form.eduResourceIds"
              placeholder="请选择"
              multiple
              :multiple-limit="limitNum"
              style="width: 100%"
              @change="resChange"
              :disabled="dialogType == 'continue' || !form.eduTypeId"
            >
              <el-option
                v-for="item in resList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <span
            v-if="
              notRent &&
                form.eduResourceIds &&
                form.eduResourceIds.length > limitNum
            "
            class="day-tips"
          >
            所选资源数超出规定数量
          </span>
        </el-col>

        <!-- :label="`${form.ct1}(${form.ct2})`" -->

        <!-- <el-col :span="12">
          <el-form-item :label="` `" :label-width="formLabelWidth" prop="nth">
            <el-input
              autocomplete="off"
              disabled
              style="visibility: hidden"
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item
            :label="`入驻日期`"
            :label-width="formLabelWidth"
            prop="rentStartTime"
          >
            <el-date-picker
              type="date"
              placeholder="入驻日期"
              v-model="valueDate"
              value-format="yyyyMMdd"
              style="width: 100%;"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="
              resTypeDetail.chargecycle
                ? '使用时长 ( 最大使用时长为' +
                  (resTypeDetail.maxUse || 0) +
                  resTypeDetail.chargecycle +
                  ' ) '
                : '使用时长'
            "
            :label-width="formLabelWidth"
            prop="useCycle"
            id="useCycle"
          >
            <el-input-number
              v-model.number="form.useCycle"
              autocomplete="off"
              style="width: 100%"
              controls-position="right"
              :min="0"
              :max="resTypeDetail.maxUse"
              :precision="0"
              :disabled="!form.eduTypeId"
            >
            </el-input-number
            >{{ resTypeDetail.chargecycle || "" }}
          </el-form-item>
          <span v-if="form.useCycle" class="day-tips">
            租期自{{ today }}到{{ newDate }}
          </span>
        </el-col>

        <el-col :span="12">
          <el-form-item
            :label="`面积(㎡)`"
            :label-width="formLabelWidth"
            prop="areas"
          >
            <el-input
              v-model="form.areas"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!--申请人，学院名称，入驻时间暂时修改-->

      <el-row>
        <img
          class="connect-icon"
          src="../../../../static/images/bm-connect-icon.png"
          alt=""
        />
        <el-col :span="12">
          <el-form-item
            label="课题组经费负责人"
            :label-width="formLabelWidth"
            prop="classfeeLeaderName"
          >
            <!-- <el-input
              v-model="form.classfeeLeaderName"
              autocomplete="off"
              disabled
            ></el-input> -->
            <el-select
              v-model="form.classfeeLeaderName"
              filterable
              remote
              placeholder="请输入或选择"
              :remote-method="remoteMethod"
              :loading="selectLoading"
              @change="dataFilterLeader"
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
            prop="classfeeLeaderMobile"
          >
            <el-input
              v-model="form.classfeeLeaderMobile"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item
            label="学院名称"
            :label-width="formLabelWidth"
            prop="orgId"
          >
            <el-select
              v-model="form.orgId"
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
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="课题组名称"
            :label-width="formLabelWidth"
            prop="classgroupName"
          >
            <el-input
              :maxlength="maxLen2"
              v-model.trim="form.classgroupName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <img
          class="connect-icon"
          src="../../../../static/images/bm-connect-icon.png"
          alt=""
        />
        <el-col :span="12">
          <el-form-item
            label="日常联系人"
            :label-width="formLabelWidth"
            prop="contacterName"
          >
            <el-select
              v-model="form.contacterName"
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
            prop="contacterMobile"
          >
            <el-input
              v-model="form.contacterMobile"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="title">
        <span class="num">2</span>
        <span>项目信息</span>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="项目名称"
            :label-width="formLabelWidth"
            prop="projectName"
            id="some-text"
          >
            <el-select
              v-model="form.projectName"
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
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="项目来源"
            :label-width="formLabelWidth"
            prop="projectFrom"
          >
            <el-input
              :maxlength="maxLen2"
              v-model.trim="form.projectFrom"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="项目经费 ( 万元 ) "
            :label-width="formLabelWidth"
            prop="projectFee"
          >
            <el-input-number
              v-model="form.projectFee"
              autocomplete="off"
              controls-position="right"
              style="width: 100%"
              :min="0"
              :max="9999999999"
              :precision="4"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="项目时间"
            :label-width="formLabelWidth"
            prop="projectTime"
          >
            <!-- <el-date-picker
              :style="{ width: formItemWidth }"
              v-model="value1"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
            >
            </el-date-picker> -->
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  :label-width="formLabelWidth"
                  prop="projectStarttime"
                  style="margin-left: 0"
                >
                  <el-date-picker
                    type="date"
                    placeholder="开始日期"
                    v-model="form.projectStarttime"
                    value-format="yyyyMMdd"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label-width="formLabelWidth"
                  prop="projectEndtime"
                  style="margin-left: 0"
                >
                  <el-date-picker
                    type="date"
                    placeholder="结束日期"
                    v-model="form.projectEndtime"
                    value-format="yyyyMMdd"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        label="项目概况"
        :label-width="formLabelWidth"
        prop="projectOverview"
      >
        <el-input
          type="textarea"
          v-model="form.projectOverview"
          :maxlength="maxLen"
          placeholder="不少于200字"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="实验概况"
        :label-width="formLabelWidth"
        prop="experimentOverview"
      >
        <el-input
          type="textarea"
          v-model="form.experimentOverview"
          placeholder="主要包括实验目的、材料、实验方法、进度计划及预期成果和应用价值等；（如果是宿舍类，注明居住人姓名、性别、身份证号、联系电话等）"
          :maxlength="maxLen"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="预期成果"
        :label-width="formLabelWidth"
        prop="expectedResult"
      >
        <el-input
          type="textarea"
          v-model="form.expectedResult"
          :maxlength="maxLen"
        ></el-input>
      </el-form-item>

      <el-row v-if="notRent">
        <el-col :span="12">
          <el-form-item
            label="审批领导"
            :label-width="formLabelWidth"
            prop="approver"
          >
            <el-select
              v-model="form.approver"
              filterable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in leaderList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 协议 -->
    <el-dialog
      class="res-apply-dialog"
      title="协议"
      v-if="agreeVisible"
      :visible.sync="agreeVisible"
      width="1200px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="false"
    >
      <agreement-form
        :hasSignature="false"
        :tableTable="tableTable"
        :dialogType="dialogType"
        :resTypeDetail="form"
      ></agreement-form>
      <el-checkbox v-model="checked">
        已阅读上述协议后请确认填写信息无误
      </el-checkbox>
      <br />
      <span class="agree-warn">
        审核通过后，请下载打印协议文件到基地办理入驻。
      </span>
      <div slot="footer" class="dialog-footer">
        <div
          class="my-button"
          @click="
            agreeVisible = false;
            checked = false;
          "
        >
          取 消
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          content="请仔细阅读并勾选后再提交"
          placement="top"
        >
          <div
            class="my-button"
            :class="checked ? 'green' : 'grey'"
            @click="checked ? submit('continue') : void 0"
            :style="{ cursor: checked ? 'pointer' : 'inherit' }"
          >
            提 交
          </div>
        </el-tooltip>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eduResourcePageQuery } from "@/assets/js/api";
export default {
  name: "applyDialog2",
  props: {
    form: Object,
    formLabelWidth: String,
    dialogType: String,
    resTypeList: Array,
    notRent: Boolean
  },
  components: {
    agreementForm: () => import("../resourceApply/agreementForm")
  },
  data() {
    return {
      valueDate: "",
      checked: false,
      tableTable: [],
      agreeVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      formItemWidth: "200px",
      value1: null,
      maxLen: 10000,
      maxLen2: 200,
      resTypeDetail: {},
      resList: [...this.resTypeList] || [],
      jzgList: [], //教职工列表
      selectLoading: false,
      typeList: JSON.parse(sessionStorage.getItem("typeList")), //资源类型列表
      groupList: JSON.parse(sessionStorage.getItem("groupList")), //学院列表
      rules: {
        eduTypeId: [
          { required: true, message: "请选择资源类型", trigger: "change" }
        ],
        rentStartTime: [
          { required: true, message: "请选择入驻日期", trigger: "change" }
        ],
        // projectTime: [
        //   {
        //     required: true,
        //     trigger: "change",
        //     validator: (r, v, cb) => {
        //       if (this.value1) {
        //         cb();
        //       } else {
        //         return cb(new Error("请选择项目时间"));
        //       }
        //     }
        //   }
        // ],
        // projectStarttime: [
        //   { required: true, message: "请选择开始日期", trigger: "change" }
        // ],
        // projectEndtime: [
        //   { required: true, message: "请选择结束日期", trigger: "change" }
        // ],
        // expectedResult: [
        //   { required: true, message: "请填写预期成果", trigger: "change" }
        // ],
        orgId: [
          { required: true, message: "请选择学院名称", trigger: "change" }
        ],
        eduResourceIds: [
          {
            required: true,
            trigger: "change",
            validator: (r, v, cb) => {
              if (this.form.eduResourceIds.length) {
                // if (v && v.length) {
                cb();
              } else {
                return cb(new Error("请选择资源编号"));
              }
            }
          }
        ],
        areas: [{ required: true, message: "请输入面积", trigger: "change" }],
        // projectName: [
        //   { required: true, message: "请输入项目名称", trigger: "change" }
        // ],
        contacterName: [
          { required: true, message: "请选择联系人", trigger: "change" }
        ],
        contacterMobile: [
          { required: true, message: "请输入电话号码", trigger: "change" },
          this.options.testPhone
        ],
        classfeeLeaderName: [
          {
            required: true,
            message: "请输入课题组经费负责人",
            trigger: "change"
          }
        ],
        applyername: [
          { required: true, message: "请选择申请人", trigger: "change" }
        ],
        // applytime: [{ required: true, message: '请选择入驻时间', trigger: 'change'}],
        classfeeLeaderMobile: [
          { required: true, message: "请输入电话号码", trigger: "change" },
          this.options.testPhone
        ],
        classgroupName: [
          { required: true, message: "请输入课题组名称", trigger: "change" }
        ],
        // projectFrom: [
        //   { required: true, message: "请输入项目来源", trigger: "change" }
        // ],
        // projectFee: [
        //   { required: true, message: "请输入项目经费", trigger: "change" }
        // ],
        useCycle: [
          { required: true, message: "请输入使用时长", trigger: "blur" }
        ],
        // projectOverview: [
        //   {
        //     required: true,
        //     trigger: "change",
        //     validator: (r, v, cb) => {
        //       if (this.form.projectOverview) {
        //         // if (v && v.length) {
        //         if (this.form.projectOverview.length <= 200) {
        //           return cb(new Error("项目概况不到200字"));
        //         } else {
        //           cb();
        //         }
        //       } else {
        //         return cb(new Error("请输入项目概况"));
        //       }
        //     }
        //   }
        // ],
        // experimentOverview: [
        //   { required: true, message: "请输入实验概况", trigger: "change" }
        // ],
        approver: [
          { required: true, message: "请选择审批领导", trigger: "change" }
        ]
      },

      areas: "",
      // resTypeDetail:JSON.parse(sessionStorage.getItem("resTypeDetail")),
      limitNum: 2,
      projectList: [], //项目名称列表
      current: 1, // 分页
      total: 0, //总页数
      limit: 20,
      isFirst: true,

      today: "",
      newDate: ""
      // leaderList:[],  //领导列表
    };
  },
  computed: {
    leaderList() {
      return this.$store.state.leaderList;
    }
    // overRange() {
    //   this.notRent && this.form.eduResourceIds && this.form.eduResourceIds.length > this.limitNum;
    // }
  },
  watch: {
    valueDate(val) {
      this.form.rentStartTime = val + "000000";
      //   let now = this.form.rentStartTime
      //     ? new Date(this.util.formatTime(this.form.rentStartTime, "yyyy-MM-dd"))
      //     : new Date();
      //   this.today = this.util.formatTime(now.getTime(), "yyyy年MM月dd日");
      this.calDay();
    },
    "form.useCycle": {
      handler() {
        this.calDay();
      },
      deep: true
    },
    "form.projectStarttime": {
      handler(old, newVal) {
        if (this.form.projectEndtime) {
          // this.form.sleepdaterange[0] = this.form.sleepstarttime;
        } else {
          this.$set(this.form, "projectEndtime", this.form.projectStarttime);
        }
      },
      deep: true // 引用类型数据，需要进行深度监听模式，不然无法进行触发回调
    },
    "form.projectEndtime": {
      handler(old, newVal) {
        if (this.form.projectStarttime) {
          // this.form.sleepdaterange[0] = this.form.sleepstarttime;
        } else {
          this.$set(this.form, "projectStarttime", this.form.projectEndtime);
        }
      },
      deep: true // 引用类型数据，需要进行深度监听模式，不然无法进行触发回调
    }
  },
  methods: {
    // 保存
    submit() {
      if (!this.checked) {
        this.$message({
          type: "warn",
          message: "请仔细阅读并勾选确认"
        });
        return;
      }
      this.$emit("submitDiag");
    },

    // 计算租期
    calDay() {
      if (!this.form.useCycle) {
        return;
      }
      const r = this.form;
      let interval = "";
      switch (r.chargecycle) {
        case "天":
          interval = "d";
          break;
        case "月":
          interval = "M";
          break;
        case "年":
          interval = "y";
          break;
      }
      let newDate;
      // if (r.useType == 1) {
      // 从当天开始计算
      let now = r.rentStartTime
        ? new Date(this.util.formatTime(r.rentStartTime, "yyyy-MM-dd"))
        : new Date();
      this.today = this.util.formatTime(now.getTime(), "yyyy年MM月dd日");

      newDate = this.common.DateAdd(interval, r.useCycle, now).getTime();
      // } else if (r.useType == 2) {
      //   let now = r.rentStartTime
      //     ? new Date(this.util.formatTime(r.rentStartTime, "yyyy-MM-dd"))
      //     : new Date();
      //   this.today = this.util.formatTime(now.getTime(), "yyyy年MM月dd日");

      //   newDate = this.common.DateAdd(interval, r.useCycle, now).getTime();
      // }
      this.newDate = this.util.formatTime(newDate, "yyyy年MM月dd日");
    },
    // 类型改变
    typeChange(val) {
      this.resTypeDetail = this.resTypeList.find(r => r.id === val) || {};
      if (!this.isFirst) {
        this.form.eduResourceIds = [];
        this.form.areas = "";
      }
      const filter = {
        status: 1,
        // 空闲才能申请，但是续租一般是已占用的
        useState: this.notRent ? 0 : undefined,
        eduTypeId: val
      };
      const params = {
        page: 1,
        limit: 10000,
        filter
      };
      this.loading = true;
      eduResourcePageQuery(params)
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.resList = res.data;

            this.resList.forEach(r => {
              const obj =
                this.resTypeList.find(t => t.id === r.eduTypeId) || {};
              r.typeName = obj.name || "";

              let chargecycle = r.billingCycle + "";
              let chargetype = r.billingMethod + "";
              this.common.chargecycleFormatter(chargecycle, r);
              this.common.chargetypeFormatter(chargetype, r);
              this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");
              this.isFirst = false;
            });
            let obj = this.resTypeList.find(r => r.id == val) || {}
            this.form.ct2 = obj.ct2;
            this.form.chargecycle = obj.chargecycle;
            this.form.ct1 = obj.ct1;
            this.form.eduTypeName = obj.name
            this.form.billingCycle = obj.billingCycle
            this.form.billingMethod = obj.billingMethod
            this.form.rules = obj.rules
            // this.$set(this.form, "eduResourceIds", [...this.form.eduResourceIds]);
            this.$forceUpdate();
          }
        })
        .catch(e => {
          this.loading = false;
        });
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
              // this.form.projectName=query;
              this.projectList.push({ xmmc: query + "-(新增)", xmbh: "" });
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

    //点击选项
    clickItem(item) {
      // console.log(item);
      this.form.projectName = item.xmmc;
      this.form.projectbh = item.xmbh;
      this.projectList = [];
    },

    //项目名称格式变化
    dataFilterProject(value) {
      let val = JSON.parse(value);
      this.form.projectName = val.xmmc.includes("新增")
        ? val.xmmc.split("-")[0]
        : val.xmmc;
      this.form.projectbh = val.xmbh;
    },

    // 经费负责人
    dataFilterLeader(val) {
      let obj = this.jzgList.find(j => j.id === JSON.parse(val).id) || {};
      this.form.classfeeLeaderName = JSON.parse(val).name;
      this.form.classfeeLeader = JSON.parse(val).id;
      this.form.orgId = obj.orgid || "";
      let org = this.groupList.find(g => g.id === obj.orgid) || {}
      this.form.orgName = org.name || "";
    },
    // 日常联系人
    dataFilter(val) {
      this.form.contacterName = JSON.parse(val).name;
      this.form.contacter = JSON.parse(val).id;
    },

    //申请人格式变化
    dataFilterApply(val) {
      this.form.applyername = JSON.parse(val).name;
      this.form.applyerid = JSON.parse(val).id;

      console.log(val);
      this.util
        .postAjax({
          code: global.code,
          url: "/user/findOrgByUserId",
          data: {
            userId: this.form.applyerid
          }
        })
        .then(res => {
          // console.log(res);
          this.form.orgId = res.id;
          console.log(this.form.orgId);
          this.$forceUpdate();
        });
    },

    //资源编号选择
    resChange(item) {
      let arr = [];
      this.resList.forEach(v => {
        item.forEach(m => {
          if (v.id == m) {
            arr.push(v.area);
          }
        });
      });

      this.form.areas = arr.join(",");
      this.$refs.form.validateField("eduResourceIds", valid => {});
    },

    //刷新
    forceUpdate() {
      this.$forceUpdate();
    }
  },
  created() {
    // if (this.dialogType === "continue") {
    //   this.resTypeDetail =
    //     this.resTypeList.find(r => r.id === this.form.eduTypeId) || {};
    // } else {
    //   }
    this.typeChange(this.form.eduTypeId);
    this.common.findRule("SPAPPLYNUM").then(res => {
      if (res.success) {
        this.limitNum = Number(res.item.rulevalue);
      }
    });
    if (this.form.projectStarttime && this.form.projectEndtime) {
      let a0 = this.util.formatTime(this.form.projectStarttime, "yyyy-MM-dd");
      let a1 = this.util.formatTime(this.form.projectEndtime, "yyyy-MM-dd");
      this.value1 = [new Date(a0), new Date(a1)];
    }
  },
  mounted() {
    const el = document.getElementById("some-text");
    this.formItemWidth = el.offsetWidth
      ? el.offsetWidth + "px"
      : this.formItemWidth;
    this.calDay();
  }
};
</script>

<style scoped lang="scss">
/deep/ #some-text .el-form-item__label {
  width: 100%;
  &::before {
    content: "需与项目申报名称一致";
    color: #f56c6c;
    float: right;
  }
}
.day-tips {
  color: #f56c6c;
  float: right;
  // display: inline-block;
}

/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #00b09b !important;
  border-color: #00b09b !important;
}

/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #00b09b !important;
  border-color: #00b09b !important;
}
/deep/ .el-checkbox.is-checked .el-checkbox__label {
  color: #383a48 !important;
}
/deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #00b09b !important;
}
.agree-warn {
  margin-left: 29px;
  width: 308px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fe3e61;
  line-height: 20px;
}
/deep/ .el-form-item__label:after {
  display: none;
}
</style>
