<template>
  <div class="set-exam-wrap">
    <!--步骤框-->
    <div class="step-box">
      <el-row>
        <el-col class="item" :class="{active:stepNum == 1}" :span="8">第一步：创建试卷</el-col>
        <el-col class="item" :class="{active:stepNum == 2}" :span="8">第二步：设置试卷信息</el-col>
        <el-col class="item" :class="{active:stepNum == 3}" :span="8">第三步：组卷发布</el-col>
      </el-row>
    </div>

    <!--内容-->
    <div class="content-box">
      <el-button type="primary" size="small" style="margin-bottom:20px" @click="back">返回上一页</el-button>
      <!--第一步-->
      <div class="item" v-if="stepNum == 1">
        <div class="title">第一步</div>

        <el-form
          class="set-exam-form"
          :model="form"
          :rules="rules"
          ref="form"
          label-width="100px"
          label-position="top"
        >
          <el-form-item label="选择考试形式" prop="testType">
            <el-select v-model="form.testType" style="width:100%" :disabled="pageType == 'edit'">
              <el-option label="普通考试" :value="1"></el-option>
              <el-option label="模拟考试" :value="2"></el-option>
              <el-option label="闯关考试" :value="3"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="考试时长(分钟)" prop="needTime" v-if="form.testType != 3">
            <el-input-number
              placeholder="请输入内容"
              v-model="form.needTime"
              :precision="0"
              controls-position="right"
              style="width:100%"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="适用对象" prop="userType">
            <el-select v-model="form.userType" multiple style="width:100%">
              <el-option
                v-for="(v,k) in userTypes"
                :label="v.readname"
                :key="v.id"
                :value="v.readtype"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="试卷主题" prop="name">
            <el-input type="textarea" v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="选择校区" prop="campusId">
            <el-select v-model="form.campusId" style="width:100%">
              <el-option
                :label="item.name"
                :value="item.id"
                :key="index"
                v-for="(item,index) in campusList"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否使用" prop="isUse">
            <el-radio-group v-model="form.isUse">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div style="text-align:center">
          <el-button type="primary" size="small" @click="next('1')">下一步</el-button>
        </div>
      </div>

      <!--第二步-->
      <div class="item" v-if="stepNum == 2">
        <div class="title">第二步</div>

        <el-form
          class="set-exam-form"
          :model="form"
          :rules="rules"
          ref="form"
          label-width="100px"
          label-position="top"
        >
          <el-form-item
            v-if="form.testType == 1 || form.testType==3 "
            label="需要学习时长(分钟)"
            prop="needstudytime"
          >
            <el-input-number
              type="text"
              v-model.number="form.needstudytime"
              :min="0"
              :precision="0"
              controls-position="right"
              style="width:100%"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="可提前交卷时间(分钟)" prop="minTime" v-if="form.testType != 3">
            <el-input-number
              type="text"
              v-model.number="form.minTime"
              :max="form.needTime"
              :precision="0"
              controls-position="right"
              style="width:100%"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="可参加考试时间范围" prop="dateArr">
            <el-date-picker
              v-model="form.dateArr"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              @change="dateSet"
            ></el-date-picker>
          </el-form-item>
        </el-form>

        <div style="text-align:center">
          <el-button type="primary" size="small" @click="prev('2')">上一步</el-button>
          <el-button type="primary" size="small" @click="next('2')">下一步</el-button>
        </div>
      </div>

      <!--第三步-->
      <div class="item" v-if="stepNum == 3">
        <div class="title">第三步</div>

        <el-form
          class="set-exam-form"
          :model="form"
          :rules="rules"
          ref="form"
          label-width="100px"
          label-position="top"
        >
          <div v-if="form.testType != 3">
            <el-form-item label="题库类型" prop="classListOld">
              <el-select
                v-model="form.classListOld"
                multiple
                style="width:100%"
                @change="getMoreTotals"
              >
                <el-option v-for="(v,k) in classifyList" :label="v.name" :key="k" :value="v.id"></el-option>
              </el-select>
            </el-form-item>

            <div
              style="color: #67C23A"
            >单选共{{this.radioTotal}}题,多选共{{this.checkboxTotal}}题,判断共{{this.judgeTotal}}题</div>

            <el-form-item label="试题信息">
              <el-row class="ques-setting-wrap" :gutter="20">
                <el-col :span="6">试题分类</el-col>
                <el-col :span="9">题数设置</el-col>
                <el-col :span="9">分值</el-col>
              </el-row>

              <el-row
                class="ques-setting-wrap"
                :gutter="20"
                v-for="(item,index) in form.itemList"
                :key="index"
              >
                <el-col :span="6">{{item.quesText}}</el-col>
                <el-col :span="9">
                  <el-form-item
                    :prop="'itemList.' + index + '.quesNum'"
                    :rules="rules.quesTypeListRule.quesNum"
                  >
                    <el-input-number
                      v-model="item.quesNum"
                      type="text"
                      :min="0"
                      :precision="0"
                      controls-position="right"
                      style="width:100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item
                    :prop="'itemList.' + index + '.score'"
                    :rules="rules.quesTypeListRule.score"
                  >
                    <el-input-number
                      v-model="item.score"
                      type="text"
                      :min="0"
                      :precision="0"
                      controls-position="right"
                      style="width:100%"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="考卷总分">
              <el-input-number
                type="text"
                v-model.number="score"
                controls-position="right"
                style="width:100%"
                disabled
              ></el-input-number>
            </el-form-item>

            <el-form-item label="合格分数" prop="passScore">
              <el-input-number
                type="text"
                v-model.number="form.passScore"
                :min="0"
                :max="score"
                :precision="0"
                controls-position="right"
                style="width:100%"
              ></el-input-number>
            </el-form-item>
          </div>

          <div v-else>
            <el-form-item label="设置关卡" prop="setLevel">
              <el-button
                type="primary"
                plain
                size="small"
                style="width:100px"
                @click="openLevelDialog('add',null,null)"
              >
                <i class="el-icon-plus" style="margin-right:10px"></i>增加关卡
              </el-button>
              <el-row class="level-list-box" style="margin:5px 0" :gutter="15">
                <el-col v-for="(item,index) in form.levelList" :key="index" :span="8">
                  <div class="level-list-item">
                    第{{item.levelNum}}关
                    <span style="float:right;margin-top:5px">
                      <el-tooltip effect="dark" content="编辑" placement="top-start">
                        <img
                          @click="openLevelDialog('edit',item,index)"
                          style="width:17px;height:18px;margin-right:5px;cursor:pointer"
                          src="../../../static/images/type-item-edit.png"
                        />
                      </el-tooltip>

                      <el-tooltip effect="dark" content="删除" placement="top-start">
                        <img
                          @click="deleteLevel(index)"
                          style="width:20px;height:18px;cursor:pointer"
                          src="../../../static/images/type-item-delete.png"
                        />
                      </el-tooltip>
                    </span>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="总关卡">
              <el-input-number
                type="text"
                v-model.number="form.levelScore"
                controls-position="right"
                style="width:100%"
                disabled
              ></el-input-number>
            </el-form-item>

            <el-form-item label="合格关卡" prop="levelPassScore">
              <el-input-number
                type="text"
                v-model.number="form.levelPassScore"
                :min="0"
                :precision="0"
                controls-position="right"
                style="width:100%"
              ></el-input-number>
            </el-form-item>

            <el-dialog
              :visible.sync="dialogFormVisible"
              v-if="dialogFormVisible"
              :close-on-click-modal="false"
              :title=" '第'+levelObj.levelNum+'关'"
              width="500px"
            >
              <el-form :model="levelObj" ref="levelForm" :rules="levelRules">
                <el-form-item label="题库类型" prop="classId">
                  <el-select v-model="levelObj.classId" style="width:100%" @change="getTotals">
                    <el-option v-for="(v,k) in classifyList" :label="v.name" :key="k" :value="v.id"></el-option>
                  </el-select>
                </el-form-item>

                <div
                  style="color: #67C23A"
                >该题库类型单选题共{{this.levelRadioTotal}}题，判断题共{{this.levelJudgeTotal}}题</div>

                <el-form-item label="试题信息">
                  <el-row class="ques-setting-wrap" :gutter="40">
                    <el-col :span="6">试题分类</el-col>
                    <el-col :span="18">题数设置</el-col>
                  </el-row>

                  <el-row
                    class="ques-setting-wrap"
                    :gutter="20"
                    v-for="(item,index) in levelObj.itemList"
                    :key="index"
                  >
                    <el-col :span="6">{{item.quesText}}</el-col>
                    <el-col :span="18">
                      <el-form-item
                        :prop="'itemList.' + index + '.quesNum'"
                        :rules="levelRules.quesTypeListRule.quesNum"
                      >
                        <el-input-number
                          v-model="item.quesNum"
                          type="text"
                          :min="0"
                          :precision="0"
                          controls-position="right"
                          style="width:100%"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>

                <el-form-item label="关卡时长(分钟)" prop="needTime">
                  <el-input-number
                    type="text"
                    v-model.number="levelObj.needTime"
                    :min="1"
                    :precision="0"
                    controls-position="right"
                    style="width:100%"
                  ></el-input-number>
                </el-form-item>
              </el-form>

              <div slot="footer" class="dialog-footer">
                <el-button type="primary" plain size="small" @click="closeLevel">关闭</el-button>
                <el-button type="primary" size="small" @click="addLevel()" :disabled="disable">确 定</el-button>

                <!--<el-button type="primary" @click="addLevelClickNew()">提  交</el-button>-->
              </div>
            </el-dialog>
          </div>

          <el-form-item label="结果展示形式" prop="resultType">
            <el-radio-group v-model="form.resultType">
              <el-radio :label="1" value="1" style="display:block;margin-bottom:10px">只展示结果</el-radio>
              <el-radio
                :label="2"
                value="2"
                style="display:block;margin-bottom:10px"
                :disabled="form.testType == 3"
              >展示错题及答案分析</el-radio>
              <el-radio
                :label="3"
                value="3"
                style="display:block"
                :disabled="form.testType == 3"
              >每答一题，显示结果及分析(模拟考试时用)</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div style="text-align:center">
          <el-button type="primary" size="small" @click="prev('3')">上一步</el-button>
          <el-button type="primary" size="small" @click="next('3')">提 交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageType: String,
    id: String,
    currentPage: Number
  },
  data() {
    // 校验所需时间
    var checkNeedTime = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error("请输入考试时长"));
      } else {
        if (value <= 0) {
          return callback(new Error("考试时长必须大于0"));
        } else {
          callback();
        }
      }
    };

    // 校验合格分数
    var checkSetLevel = (rule, value, callback) => {
      if (this.form.levelList.length > 0) {
        callback();
      } else {
        return callback(new Error("请设置关卡"));
      }
    };

    // 校验合格分数
    var checkPassScore = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error("请输入合格分数"));
      } else {
        if (value > this.score) {
          return callback(new Error("合格分数不能超过考卷总分"));
        } else {
          callback();
        }
      }
    };

    // 校验合格关卡
    var checkLevelPassScore = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error("请输入合格关卡数"));
      } else {
        if (value > this.form.levelScore) {
          return callback(new Error("合格关卡数不能超过总关卡数"));
        } else {
          callback();
        }
      }
    };

    // 校验非闯关题目数量
    var checkQuesNum = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error("请输入题目数量"));
      } else {
        let index = rule.field.split(".")[1];

        switch (index) {
          case "0":
            if (value > this.judgeTotal) {
              return callback(
                new Error("判断题数量不能超过" + this.judgeTotal)
              );
            } else {
              callback();
            }
            break;
          case "1":
            if (value > this.checkboxTotal) {
              return callback(
                new Error("多选题数量不能超过" + this.checkboxTotal)
              );
            } else {
              callback();
            }
            break;
          case "2":
            if (value > this.radioTotal) {
              return callback(
                new Error("单选题数量不能超过" + this.radioTotal)
              );
            } else {
              callback();
            }
            break;
        }
      }
    };

    // 校验闯关题目数量
    var checkLevelQuesNum = (rule, value, callback) => {
      if (!value && value != 0) {
        return callback(new Error("请输入题目数量"));
      } else {
        let index = rule.field.split(".")[1];

        switch (index) {
          case "0":
            if (value > this.levelJudgeTotal) {
              return callback(
                new Error("判断题数量不能超过" + this.levelJudgeTotal)
              );
            } else {
              callback();
            }
            break;
          case "1":
            if (value > this.levelRadioTotal) {
              return callback(
                new Error("单选题数量不能超过" + this.levelRadioTotal)
              );
            } else {
              callback();
            }
            break;
        }
      }
    };

    return {
      stepNum: 1,
      form: {
        dateArr: [],
        itemList: [
          { quesType: 3, quesNum: "", score: "", quesText: "判断题 —" },
          { quesType: 1, quesNum: "", score: "", quesText: "单选题 —" },
          { quesType: 2, quesNum: "", score: "", quesText: "多选题 —" }
        ],

        levelList: []
      },

      levelObj: {
        classId: "",
        levelNum: 1,
        itemList: [
          { quesType: 3, quesNum: "", quesText: "判断题 —" },
          { quesType: 1, quesNum: "", quesText: "单选题 —" }
        ]
        // needTime:"",
      }, //闯关考试
      userTypes: [],
      campusList: [],
      rules: {
        testType: [
          { required: true, message: "请选择考试形式", trigger: "change" }
        ],
        needTime: [
          { required: true, message: "请输入考试时长", trigger: "blur" },
          { validator: checkNeedTime, trigger: "blur" }
        ],
        userType: [
          { required: true, message: "请选择适用对象", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入试卷主题", trigger: "blur" }],
        campusId: [
          { required: true, message: "请选择校区", trigger: "change" }
        ],
        isUse: [
          { required: true, message: "请选择是否使用", trigger: "change" }
        ],

        needstudytime: [
          { required: true, message: "请输入需要学习时长", trigger: "blur" }
        ],
        minTime: [
          { required: true, message: "请输入可提前交卷时间", trigger: "blur" }
        ],
        dateArr: [
          {
            required: true,
            message: "请选择可参加考试时间范围",
            trigger: "change"
          }
        ],

        classListOld: [
          { required: true, message: "请选择题库类型", trigger: "change" }
        ],
        passScore: [
          { required: true, message: "请输入合格分数", trigger: "blur" },
          { validator: checkPassScore, trigger: "blur" }
        ],
        // levelPassScore:[{ required: true, message: '请输入合格关卡', trigger: 'blur' }],
        levelPassScore: [
          { required: true, message: "请输入合格关卡", trigger: "blur" },
          { validator: checkLevelPassScore, trigger: "blur" }
        ],
        resultType: [
          { required: true, message: "请选择结果展示形式", trigger: "change" }
        ],
        quesTypeListRule: {
          quesNum: [{ validator: checkQuesNum, trigger: "blur" }],
          score: [{ required: true, message: "请输入分值 ", trigger: "blur" }]
        },
        setLevel: [{ validator: checkSetLevel, trigger: "change" }]
      },

      levelRules: {
        classId: [
          { required: true, message: "请选择题库类型", trigger: "change" }
        ],
        quesTypeListRule: {
          quesNum: [{ validator: checkLevelQuesNum, trigger: "blur" }]
        },
        needTime: [
          { required: true, message: "请输入关卡时长", trigger: "blur" }
        ]
      },

      classifyList: [],
      radioTotal: 0,
      checkboxTotal: 0,
      judgeTotal: 0,
      levelRadioTotal: 0,
      levelJudgeTotal: 0,

      commonTotals: [],
      totalTip: false,

      dialogFormVisible: false,
      levelDialogType: "",
      levelIndex: "",
      disable: false

      // levelListOld:[],

      // score:"",
    };
  },

  computed: {
    score: {
      get(val) {
        let sum = 0;
        if (this.form.itemList) {
          this.form.itemList.forEach((v, i) => {
            sum += v.score * v.quesNum;
          });
          this.form.score = sum;
          return this.form.score;
        }
      },
      // 必须要设置set
      set() {}
    }
  },

  methods: {
    //返回
    back() {
      window.history.go(-1);
      sessionStorage.setItem("currentPage", this.currentPage);
    },

    // 数组对象排序
    sortbyKey(arr, key) {
      if (arr.length > 0) {
        return arr.sort((a, b) => {
          let x = a[key];
          let y = b[key];
          return y - x;
        });
      }
    },

    // 删除关卡
    deleteLevel(index) {
      this.$confirm("确定删除该关卡吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.form.levelList.splice(index, 1);
          this.form.levelScore = this.form.levelList.length;
          this.$message({
            type: "success",
            message: "删除成功"
          });
        })
        .catch(() => {});
    },

    //关卡弹框内提交
    addLevel() {
      this.$refs["levelForm"].validate(valid => {
        if (valid) {
          let message = "";

          switch (this.levelDialogType) {
            case "add":
              this.form.levelList.push(this.levelObj);
              message = "添加成功";
              break;

            case "edit":
              this.form.levelList[this.levelIndex] = this.levelObj;
              message = "编辑成功";
          }

          this.closeLevel();
          this.$message({
            type: "success",
            message: message
          });

          this.form.levelScore = this.form.levelList.length;

          // console.log(this.levelObj)
        }
      });
    },

    closeLevel() {
      this.dialogFormVisible = false;
      (this.levelObj = {}), (this.totalTip = false);
    },

    //打开关卡弹框
    openLevelDialog(type, item, index) {
      this.levelDialogType = type;
      this.levelIndex = index;
      this.dialogFormVisible = true;
      this.levelRadioTotal = 0;
      this.levelJudgeTotal = 0;

      switch (type) {
        case "add":
          this.totalTip = false;
          this.levelObj = {
            classId: "",
            levelNum: this.form.levelList ? this.form.levelList.length + 1 : 1,
            itemList: [
              { quesType: 3, quesNum: "", quesText: "判断题 —" },
              { quesType: 1, quesNum: "", quesText: "单选题 —" }
            ]
          };
          break;
        case "edit":
          // this.levelObj=item;item
          sessionStorage.setItem(
            "levelList",
            JSON.stringify(this.form.levelList)
          );

          let levelListOld = JSON.parse(sessionStorage.getItem("levelList"));

          this.levelObj = levelListOld[index];
          this.totalTip = true;
          this.getTotalsInit(this.levelObj.classId);
          this.levelObj.itemList.forEach(v => {
            if (v.quesType == 3) {
              v.quesText = "判断题 —";
            } else if (v.quesType == 1) {
              v.quesText = "单选题 —";
            }
          });
          break;
      }

      // 数组对象排序
      this.sortbyKey(this.levelObj.itemList, "quesType");
    },

    // 获取闯关类各题型数量
    getTotalsInit(id) {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/qusetion/countQuestionByClassIds",
          data: {
            classIds: id
          }
        })
        .then(res => {
          if (res.success) {
            this.totalTip = true;
            this.disable = false;
            this.levelRadioTotal = 0;
            this.levelJudgeTotal = 0;
            res.items.forEach(v => {
              switch (v.quesType) {
                case 1:
                  this.levelRadioTotal = v.num;
                  break;

                case 3:
                  this.levelJudgeTotal = v.num;
                  break;
              }
            });

            // this.levelObj.itemList.forEach(v=>{
            //   if(v.quesType == 1){
            //     v.max=this.levelRadioTotal;
            //   }else if(v.quesType == 3){
            //     v.max=this.levelJudgeTotal;
            //   }
            // })
          }
        });
    },

    getTotals(id) {
      switch (this.levelDialogType) {
        case "add":
          if (this.form.levelList) {
            let ids = this.form.levelList.map(v => v.classId);
            if (ids.includes(id)) {
              this.$message({
                type: "error",
                message: "该题库已被使用,请重新选择"
              });
              this.totalTip = false;
              this.disable = true;
              return;
            }
          }

          break;
        case "edit":
          let levelListOld = JSON.parse(sessionStorage.getItem("levelList"));
          if (levelListOld[this.levelIndex].classId == id) {
            this.$message({
              type: "success",
              message: "该题库正在使用"
            });
            this.getTotalsInit(id);
            return;
          }

          let ids2 = levelListOld.map(v => v.classId);
          if (ids2.includes(id)) {
            this.$message({
              type: "error",
              message: "该题库已被使用,请重新选择"
            });
            this.disable = true;
            this.totalTip = false;
            return;
          }
          break;
      }

      this.getTotalsInit(id);
    },

    // 获取非闯关类各题型数量
    getMoreTotals(val) {
      let ids = val.toString();

      // console.log(ids)
      this.util
        .postAjax({
          code: this.global.code,
          url: "/qusetion/countQuestionByClassIds",
          data: {
            classIds: ids
          }
        })
        .then(res => {
          // console.log("commonTotals", this.commonTotals);
          if (res.success && res.items) {
            this.commonTotals = res.items;
            if (this.commonTotals.length > 0) {
              res.items.forEach(v => {
                switch (v.quesType) {
                  case 1:
                    this.radioTotal = v.num;
                    break;
                  case 2:
                    this.checkboxTotal = v.num;
                    break;
                  case 3:
                    this.judgeTotal = v.num;
                    break;
                }
              });
            } else {
              this.radioTotal = 0;
              this.checkboxTotal = 0;
              this.judgeTotal = 0;
            }
          }
        });
    },

    dateSet() {
      this.$forceUpdate();
    },

    // 提交
    submit() {
      let url = "";
      switch (this.pageType) {
        case "add":
          url = "add";
          break;
        case "edit":
          url = "update";
          break;
      }

      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      this.util
        .postAjax({
          code: this.global.code,
          url: "/qresourceManager/" + url,
          data: {
            data: JSON.stringify(this.form)
          }
        })
        .then(res => {
          loading.close();
          if (res.success) {
            this.$router.push({ path: "/examManage" });
            this.$message({
              type: "success",
              message: this.pageType == "add" ? "添加成功" : "编辑成功"
            });
          } else {
            this.form.userType = this.form.userType.split(",");
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        });
    },

    // 下一步
    next(step) {
      //  return;
      this.$refs["form"].validate(valid => {
        if (valid) {
          switch (step) {
            case "1":
              if (this.form.needTime == 0) {
                this.$message("不能为0");
              } else {
                this.stepNum = 2;
              }

              break;
            case "2":
              this.$nextTick(() => {
                this.$refs.form.clearValidate();
              });
              this.stepNum = 3;
              break;

            case "3":
              // 使用对象转换
              this.form.userType = this.form.userType.toString();

              // 考试时间转换
              this.form.validStart = this.form.dateArr[0];
              this.form.validEnd = this.form.dateArr[1];

              // 题库类型转换

              if (this.form.testType != 3) {
                let arr = [];
                this.form.classListOld.forEach(v => {
                  arr.push({ classId: v });
                });
                this.form.classList = arr;
              }

              if (this.form.testType == 3) {
                this.form.score = this.form.levelScore;
                this.form.passScore = this.form.levelPassScore;
              }

              console.log(this.form);

              // return;
              this.submit();
              // console.log(JSON.stringify(this.form))
              break;
          }
        }
      });
    },

    // 上一步
    prev(step) {
      switch (step) {
        case "2":
          this.stepNum = 1;
          break;
        case "3":
          this.stepNum = 2;
          break;
      }
      this.$refs.form.clearValidate();
    },

    //获取校区列表接口
    // getCampusList() {
    //   this.util.postAjax({
    //     code: this.global.code,
    //     url: "/campus/list",
    //   }).then((res) => {
    //     if (res.success) {
    //       this.campusList = res.items;
    //     }
    //   })
    // },

    //获取使用对象接口
    getUserTypes() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/user/readerType"
        })
        .then(res => {
          if (res.success) {
            this.userTypes = res.items;
          }
        });
    }
  },

  created() {
    // 防止初次进入页面时自动校验
    this.$nextTick(() => {
      this.$refs.form.clearValidate();
    });

    this.getUserTypes();

    this.common.getCampusList().then(res => {
      if (res.success) {
        this.campusList = res.items;
      }
    });

    this.common.getClassifyList().then(res => {
      this.classifyList = res.items;
    });

    // 判断时否是编辑页面
    if (this.pageType == "edit") {
      console.log("编辑页面");

      this.util
        .postAjax({
          code: this.global.code,
          url: "/qresourceManager/find",
          data: {
            id: this.id
          }
        })
        .then(res => {
          if (res.success) {
            // this.form = res.item;

            let form = res.item;

            // 使用对象转换
            form.userType = form.userType.split(",");

            // 考试日期转换
            form.dateArr = [form.validStart, form.validEnd];

            // 题库类型转换
            form.classListOld = [];
            if (form.classList) {
              form.classListOld = form.classList.map(v => v.classId);
            }

            // 表单赋值
            this.form = {
              id: form.id,
              testType: form.testType,
              needTime: form.needTime,
              userType: form.userType,
              name: form.name,
              campusId: form.campusId,
              isUse: form.isUse,

              needstudytime: form.needstudytime,
              minTime: form.minTime,
              dateArr: form.dateArr,

              classListOld: form.classListOld,
              itemList: form.itemList,
              passScore: form.passScore,
              score: form.score,
              levelScore: form.score,
              levelPassScore: form.passScore,
              resultType: form.resultType,

              levelList: form.levelList
            };

            // 试题信息转换
            if (form.itemList) {
              form.itemList.forEach(v => {
                if (v.quesType == 3) {
                  v.quesText = "判断题 —";
                } else if (v.quesType == 2) {
                  v.quesText = "多选题 —";
                } else if (v.quesType == 1) {
                  v.quesText = "单选题 —";
                }
              });
              this.sortbyKey(this.form.itemList, "quesType");
            }

            this.getMoreTotals(this.form.classListOld.toString());
          }
        });
    }

    this.sortbyKey(this.form.itemList, "quesType");

    // console.log(this.form.itemList)
  }
};
</script>
<style >
</style>
