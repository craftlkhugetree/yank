<template>
  <div>
    <van-nav-bar title="实习申请" :border="false" left-arrow @click-left="goBack" />
    <van-form ref="edifForm" input-align="right" error-message-align="right">
      <!-- 基本信息 -->
      <basic-info
        ref="basicInfo"
        v-if="!id || detail.orgname"
        :id="id"
        :data="detail"
        @changeMinDate="changeMinDate"
      ></basic-info>
      <!-- 住宿信息 -->
      <div class="form-box">
        <div class="form-box-title">2.住宿信息</div>
        <base-switch
          label="是否住宿"
          :isOn="sleepInfo.issleep"
          @click.native="sleepInfo.issleep = sleepInfo.issleep === '1' ? '0' : '1'"
        ></base-switch>
        <transition name="van-fade">
          <div class="form-box-content" v-if="sleepInfo.issleep === '1'">
            <van-field
              readonly
              clickable
              name="住宿日期"
              v-model="sleepInfo.sleeptime"
              label="住宿日期"
              placeholder="请选择"
              @click="showSleepCalendar = true"
              right-icon="calender-o"
              :rules="[
                {
                  required: false,
                  message: '请选择住宿日期(不能早于实习日期)',
                },
              ]"
            />
            <van-calendar
              v-model="showSleepCalendar"
              type="range"
              @confirm="onConfirmSleepDate"
              :show-confirm="false"
              color="#00b09b"
              :default-date="common.defaultDate(sleepInfo.sleeptime, true)"
              :min-date="sleepMinDate"
              :max-date="new Date(2050, 1, 1)"
            />
            <div class="field-box sleep-box">
              <p>住宿人数</p>
              <div>
                <van-field
                  v-model="sleepInfo.sleepboynum"
                  name="住宿人数(男)"
                  label="男 -"
                  placeholder="请输入"
                  type="digit"
                  label-width="30px"
                  :border="false"
                  style="padding-top:0;"
                />
                <van-field
                  v-model="sleepInfo.sleepgirlnum"
                  name="住宿人数(女)"
                  label="女 -"
                  placeholder="请输入"
                  type="digit"
                  label-width="30px"
                  style="padding-top:5px;"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!-- 餐食信息 -->
      <div class="form-box">
        <div class="form-box-title">3.餐食信息</div>
        <base-switch
          label="是否用餐"
          :isOn="eatInfo.iseat"
          @click.native="eatInfo.iseat = eatInfo.iseat === '1' ? '0' : '1'"
        ></base-switch>
        <transition name="van-fade">
          <div class="form-box-content" v-if="eatInfo.iseat === '1'">
            <van-field
              readonly
              clickable
              name="用餐开始日期"
              v-model="eatInfo.eatstarttimeFormat"
              label="用餐开始日期"
              placeholder="请选择"
              @click="showEatStartCalendar = true"
              right-icon="calender-o"
              :border="false"
              :rules="[
                {
                  required: false,
                  message: '请选择用餐开始日期(不能早于实习日期)',
                },
              ]"
            />
            <!-- validator: (v) => {
                if(v && $refs.basicInfo.editForm.prstarttime) {
                  return eatInfo.eatstarttime >= $refs.basicInfo.editForm.prstarttime
                } else {
                  return true;
                }
              }, -->
            <van-calendar
              v-model="showEatStartCalendar"
              @confirm="onConfirmEatStartDate"
              :show-confirm="false"
              :default-date="common.defaultDate(eatInfo.eatstarttimeFormat)"
              color="#00b09b"
              :min-date="eatMinDate"
              :max-date="new Date(2050, 1, 1)"
            />
            <van-field
              name="选择餐食"
              v-model="eatInfo.eatstarttype"
              label="选择餐食"
              style="padding-top:5px;"
            >
              <template #input>
                <van-radio-group
                  v-model="eatInfo.eatstarttype"
                  direction="horizontal"
                  checked-color="#00b09b"
                >
                  <van-radio name="1">早餐</van-radio>
                  <van-radio name="2">午餐</van-radio>
                  <van-radio name="3">晚餐</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              readonly
              clickable
              name="用餐结束日期"
              v-model="eatInfo.eatendtimeFormat"
              label="用餐结束日期"
              placeholder="请选择"
              @click="showEatEndCalendar = true"
              right-icon="calender-o"
              :border="false"
              :rules="[
                {
                  required: false,
                  message: '请选择用餐结束日期(不能早于开始日期)',
                },
              ]"
            />

            <!-- validator: (v) => {
                if(v && eatInfo.eatstarttimeFormat) {
                  return eatInfo.eatendtime >= eatInfo.eatstarttime
                } else {
                  return true;
                }
              }, -->
            <van-calendar
              v-model="showEatEndCalendar"
              @confirm="onConfirmEatEndDate"
              :show-confirm="false"
              :default-date="common.defaultDate(eatInfo.eatendtimeFormat)"
              color="#00b09b"
              :min-date="eatEndMinDate"
              :max-date="new Date(2050, 1, 1)"
            />
            <van-field
              name="选择餐食"
              v-model="eatInfo.eatendtype"
              label="选择餐食"
              style="padding-top:5px;"
            >
              <template #input>
                <van-radio-group
                  v-model="eatInfo.eatendtype"
                  direction="horizontal"
                  checked-color="#00b09b"
                >
                  <van-radio name="1">早餐</van-radio>
                  <van-radio name="2">午餐</van-radio>
                  <van-radio name="3">晚餐</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              v-model="eatInfo.eatpersonnum"
              name="用餐总人数(人)"
              label="用餐总人数(人)"
              placeholder="请输入"
              type="digit"
              label-width="100px"
              :border="false"
            />
            <van-field
              v-model="eatInfo.eatmpersonnum"
              name="用餐民族生人数(人)"
              label="用餐民族生人数(人)"
              placeholder="请输入"
              type="digit"
              label-width="125px"
              style="padding-top:5px"
            />
          </div>
        </transition>
      </div>
      <!-- 备注信息 -->
      <div class="form-box">
        <div class="form-box-title">4.备注信息</div>
        <div class="form-box-content">
          <div class="field-box">
            <div class="field-box-textarea">
              <p>实习条件</p>
              <van-field
                v-model="noteInfo.prconditions"
                name="实习条件"
                placeholder="请输入"
                rows="3"
                type="textarea"
                :show-word-limit="true"
                input-align="left"
              />
            </div>
          </div>
          <div class="field-box">
            <div class="field-box-file">
              <p>学生信息表</p>
              <!-- <p style="color:red;">请点击保存按钮，保存所填信息。</p>
              <p style="color:red;">如需提交，请至PC端上传学生信息表后进行提交。</p> -->
              <!-- 上传文件 -->
              <!-- <van-field
                name="学生信息表"
                v-model="noteInfo.stuinfofileid"
                :rules="[{ required: true, message: '请上传学生信息表' }]"
              >
                <template #input>
                  <div class="upload-box">
                    <van-button type="primary" size="small" @click="uploadFile">上传信息表</van-button>
                  </div>
                </template>
              </van-field> -->
              <van-icon name="down" @click.stop="downloadTemp">
                <div class="image" @click.stop="toUpload">
                  <img :src="require('st@tic/imgs/import.png')" />
                  导入
                </div>
                下载模板
              </van-icon>
            </div>
            <van-cell style="padding:0;">
              <span style="color:#faac16;font-size:12px;float: left">
                请按模板上传学生信息表，否则将无法通过审核。
              </span>
            </van-cell>

            <!-- <div class="field-box-box" v-if="noteInfo.stuinfofilename">{{noteInfo.stuinfofilename}}</div> -->
          </div>
          <!-- <div style="width: 100%; height: 50px;"></div> -->
        </div>
      </div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%; overflow-y: scroll;"
        ref="table"
        height="300"
        @row-click="onSelectOp"
      >
        <el-table-column type="index" width="20"></el-table-column>
        <el-table-column
          v-for="(item, index) in tableT"
          :prop="item.name"
          :label="item.label"
          :key="item.name + index"
          align="center"
          :width="index == 3 ? 150 : ''"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model.trim="scope.row[item.name]"
              v-show="scope.row.show"
              maxlength="30"
              placeholder="请输入内容"
            ></el-input>
            <span v-show="!scope.row.show">{{ scope.row[item.name] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" align="center">
          <template slot-scope="scope">
            <el-dropdown
              v-show="scope.row.show"
              size="mini"
              @command="sex => (scope.row.sex = sex)"
            >
              <span class="el-dropdown-link">
                {{ scope.row.sex }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="男">男</el-dropdown-item>
                <el-dropdown-item command="女">女</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span v-show="!scope.row.show">{{ scope.row.sex }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="national" label="民族" align="center" width="150">
          <template slot-scope="scope">
            <el-dropdown
              v-show="scope.row.show"
              size="mini"
              @command="nation => (scope.row.national = nation)"
              style="max-height: 300px"
            >
              <span class="el-dropdown-link">
                {{ scope.row.national }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>

              <el-dropdown-menu slot="dropdown" class="nation-c">
                <el-dropdown-item :command="item.name" v-for="item in nation_data" :key="item.id">
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <span v-show="!scope.row.show">{{ scope.row.national }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.show" class="std-btn save" @click="saveRow(scope.row)">
              保存
            </div>
            <div class="std-btn del" @click="delRow(scope.$index)">
              删除
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="layer8 flex-col">
        <div class="wrap7 flex-col justify-between">
          <div class="bd24 flex-col">
            <div class="outer19 flex-row">
              <div class="field-std">
                <van-field v-model.trim="value.classname" placeholder="班级名称" input-align="left" maxlength="30" />
              </div>
              <div class="field-std">
                <van-field v-model.trim="value.username" placeholder="姓名" input-align="left" maxlength="30" />
              </div>
              <div class="field-std">
                <van-field v-model.trim="value.userid" placeholder="学号" input-align="left" maxlength="30" />
              </div>
              <div class="field-std">
                <van-field v-model.trim="value.idcard" placeholder="身份证号" input-align="left" maxlength="30" />
              </div>
              <div class="field-std" @click.stop="triggerDp('sex')">
                  <van-field v-model="value.sex" placeholder="性别" input-align="left" readonly> 
                   <template #right-icon>
                      <i class="van-icon van-icon-arrow-down" ></i>
                   </template>
                   </van-field>
              </div>
              <div class="field-std" @click.stop="triggerDp('nation')">
                <van-field v-model="value.national" placeholder="民族" input-align="left" readonly> 
                   <template #right-icon>
                      <i class="van-icon van-icon-arrow-down" ></i>
                   </template>
                   </van-field>
              </div>
            </div>
          </div>
          <div class="bd25 flex-row justify-between">
            <div class="mod34 flex-col" @click.stop="resetStd">
              <span class="word64">重置</span>
            </div>
            <div class="main20 flex-col" @click.stop="saveStd">
              <span class="word47">保存至学生信息表</span>
            </div>
          </div>
        </div>
      </div>
      <van-field
        name="审批领导"
        label="审批领导"
        placeholder="请选择"
        readonly
        clickable
        v-model="approvername"
        @click="showApproverPicker = true"
        right-icon="arrow-down"
        :border="false"
      />
      <div class="leader-van-field"></div>
      <div class="form-btns">
        <van-button type="default" @click="goBack" v-if="operType === 'auditEdit'">返回</van-button>
        <van-button v-if="operType === 'auditEdit'" type="primary" @click="auditEdit">
          保存
        </van-button>
        <van-button v-if="operType !== 'auditEdit'" type="default" @click="doApply(0)">
          保存
        </van-button>
        <van-button v-if="operType !== 'auditEdit'" type="primary" @click="triggerSubmit(1)">
          提交
        </van-button>
      </div>
    </van-form>
    <!-- 上传组件 -->
    <upload
      v-show="false"
      ref="upload"
      class="my-upload"
      :url="uploadUrl"
      :multiple="false"
      :exts="fileType"
      :isCarmera="true"
      @choose="choosefile"
      @done="finish"
    ></upload>
    <!-- 选择审批人弹窗 -->
    <!-- <van-dialog
      title="选择审批人"
      v-model="showApproverDialog"
      show-cancel-button
      @confirm="onConfirmApporver"
    >
      <van-field
        readonly
        clickable
        name="审批人"
        v-model="approvername"
        placeholder="请选择"
        left-icon="manager"
        @click="showApproverPicker = true"
      ></van-field>
    </van-dialog> -->

    <van-popup v-model="showApproverPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="leaderList"
        @confirm="chooseApporver"
        @cancel="showApproverPicker = false"
      />
    </van-popup>
    <input
      type="file"
      :multiple="false"
      @change="getFile"
      title="上传文件"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      class="upload-input"
      ref="uploadDom"
    />
    
    <!-- 导入、删除确认框 -->
    <van-dialog
      v-if="dVisible"
      v-model="dVisible"
      :closeOnClickOverlay="false"
      width="90%"
      @confirm="submitDiag"
      @cancel="dVisible = false"
      :show-cancel-button="diagType !== 'import'"
    >
      <!-- show-cancel-button -->
      <template #title>
        <div class="diag">
          <img :src="require('st@tic/imgs/dialog.png')" />
          <span class="diag-title">{{ diagTitle }}</span>
        </div>
      </template>
      <span class="info44">{{ diagBody }}</span>
    </van-dialog>

    <!-- 性别、民族下拉框 -->
    <van-popup v-model="dropVisible" position="bottom">
      <van-picker
        show-toolbar
        :columns="dpOptions"
        @confirm="chooseDpValue"
        @cancel="dropVisible = false"
      />
    </van-popup>
  </div>
</template>

<script>
import BasicInfo from '../prApply/basicInfo';
import BaseSwitch from '../../../components/BaseSwitch';
import Upload from '../../../components/BaseUpload';
import { Notify } from 'vant';
import { nation_data } from '@/assets/js/options';
import * as XLSX from 'xlsx';
export default {
  components: {
    BasicInfo,
    BaseSwitch,
    Upload,
  },
  data() {
    return {
      // 新增学生对象
      value: {'classname': '', 'username': '', 'userid': "", 'idcard': '', 'national': '', sex: ''},
      // import 成功导入；del 删除；submit 提交
      curRow: null,
      diagTitle: '',
      diagBody: '',
      diagType: '',
      dVisible: false,
      nation_data,
      dataTitle: [['班级', '姓名', '学号', '身份证号', '性别', '民族']],
      tableT: [],
      tableData: [],
      studentList: [],
      sleepInfo: {
        issleep: '0',
        sleeptime: '',
        sleepstarttime: '',
        sleependtime: '',
        sleepboynum: '',
        sleepgirlnum: '',
      },
      eatInfo: {
        iseat: '0',
        eatstarttime: '',
        eatstarttimeFormat: '',
        eatendtime: '',
        eatendtimeFormat: '',
        eatstarttype: '1',
        eatendtype: '1',
        eatpersonnum: '',
        eatmpersonnum: '',
      },
      noteInfo: {
        prconditions: '',
        stuinfofileid: '',
        stuinfofilename: '',
      },
      sleepMinDate: new Date(),
      eatMinDate: new Date(),
      eatEndMinDate: new Date(),
      showSleepCalendar: false,
      showEatStartCalendar: false,
      showEatEndCalendar: false,
      fileType: 'xls|XLS|xlsx|XLSX',
      showApproverDialog: false,
      showApproverPicker: false,
      approverid: '',
      approvername: '',
      leaderList: [],
      detail: {},
      onlyExcel: '仅支持xlsx、xls格式文件',
      dpOptions: [],
      dropVisible: false,
      dpType: '',
    };
  },
  props: {
    id: String,
    operType: String,
  },
  computed: {
    uploadUrl() {
      return this.$store.state.uploadUrl;
    },
  },
  methods: {
    // 重置新增框
    resetStd() {
       this.value = {'classname': '', 'username': '', 'userid': "", 'idcard': '', 'national': '', sex: ''}
    },
    // 保存至学生信息表
    saveStd() {
      this.checkObj(this.value);
      this.tableData.unshift(this.value);
      this.checkAllTable()
    },
    // 选择性别或民族
    chooseDpValue(val) {
      if (this.dpType === 'sex') {
        this.value.sex = val;
      } else if (this.dpType === 'nation') {
        this.value.national = val;
      }
      this.dropVisible = false;
    },
    // 触发性别或民族下拉框
    triggerDp(type) {
      this.dpType = type;
      this.dropVisible = true;
      if (type === 'sex') {
        this.dpOptions = ['男', '女']
      } else if (type === 'nation') {
        this.dpOptions = nation_data.map(n => n.name);
      }
    },
    triggerSubmit(type) {
      this.dVisible = true;
      this.diagType = 'submit';
      this.diagTitle = '友情提醒';
      this.diagBody = '实习期间，未经允许，请勿随意进入他人实验区域。';
    },
    // 学生信息表数据细节校验。name可能是字符串（导入文件）或者对象（转化后的表格数组），对应的n为索引或者对象的key
    regCheck(obj) {
      let { index: n, name } = obj;
      let i = typeof name === 'string' ? name : name[n];
      let message = '';
      if (!i && n !== 'show') {
        message = '学生信息表字段均必填！';
        Notify({
          duration: 5000,
          type: 'warning',
          message,
        });
      } else if ((n == 3 || n === 'idcard') && !this.util.regExps.idCard.test(i)) {
        message = `身份证号'${i}'不符合规则，请重新输入！`;
        Notify({
          duration: 5000,
          type: 'warning',
          message,
        });
      } else if ((n == 4 || n === 'sex') && !['男', '女'].includes(i)) {
        message = `性别为'男'或'女'，不能输入'${i}'！`;
        Notify({
          duration: 5000,
          type: 'warning',
          message,
        });
      } else if ((n == 5 || n === 'national') && !this.nation_data.some(name => name.name === i)) {
        message = `民族'${i}'输入不符合规则，请重新输入！`;
        Notify({
          duration: 5000,
          type: 'warning',
          message,
        });
      }
      return message;
    },
    // 校验学生信息表格数组
    checkAllTable() {
      this.tableData.forEach(t => {
        this.checkObj(t);
      });
      this.getSamePrimaryKey(this.tableData);
    },
    // 校验是否有重复的学号或身份证号
    getSamePrimaryKey(arr, params = ['idcard', 'userid']) {
      let obj = {};
      params &&
        params.forEach(p => {
          arr.forEach((a, aindex) => {
            if (aindex < arr.length - 1 && !(obj[p] && obj[p].find(itep => itep.val === a[p]))) {
              let tmp = arr.slice(aindex + 1);
              let flag;
              tmp.forEach((t, tindex) => {
                if (a[p] === t[p]) {
                  // 加回slice减少的一个元素索引
                  let n = tindex + 1;
                  let o = { val: a[p], index: n };
                  obj[p] ? obj[p].push(o) : (obj[p] = [o]);
                  flag = 1;
                }
              });
              if (flag) {
                obj[p].push({ val: a[p], index: aindex });
              }
            }
          });
        });
      let msg = '';
      params &&
        params.forEach(p => {
          let op = obj[p];
          if (op) {
            let tmpOb = {};
            op.forEach(item => {
              tmpOb[item.val]
                ? (tmpOb[item.val] += ' ' + item.index)
                : (tmpOb[item.val] = ' ' + item.index);
            });
            let message = '';
            for (let str in tmpOb) {
              message += str + ' ';
              // message += str + ":" + tmpOb[str];
            }
            if (p === 'idcard') {
              msg += '身份证号重复【' + message + '】\n';
            } else if (p === 'userid') {
              msg += '学号重复【' + message + '】\n';
            }
          }
        });
      if (msg) {
        Notify({
          duration: 5000,
          type: 'warning',
          message: msg,
        });
        throw msg;
      }
    },
    // 校验学生信息表格数组内的对象元素
    checkObj(t) {
      for (let str in t) {
        let msg = this.regCheck({ name: t, index: str });
        if (msg) {
          throw msg;
        }
      }
    },
    addRow() {
      this.checkAllTable();
      let obj = {
        show: true,
        classname: null,
        username: null,
        userid: null,
        idcard: null,
        sex: null,
        national: null,
      };
      this.tableData.forEach(t => (t.show = false));
      this.tableData.unshift(obj);
    },
    delRow(index) {
      this.diagType = 'del';
      this.diagTitle = '提示';
      this.diagBody = '确定删除该学生信息吗?';
      this.curRow = index;
      this.dVisible = true;
    },
    saveRow(row) {
      this.checkObj(row);
      let index = '';
      this.tableData.some((t, id) => {
        if (t.userid === row.userid) {
          index = id;
          return true;
        }
      });
      let [obj] = this.tableData.splice(index, 1, Object.assign({}, row, { show: false }));
      try {
        this.checkAllTable();
      } catch (e) {
        this.tableData.splice(index, 1, obj);
      }
    },
    // 点击弹窗确定按钮
    submitDiag() {
      if (this.diagType === 'del') {
        this.tableData.splice(this.curRow, 1);
      } else if (this.diagType === 'submit') {
        this.doApply(1);
      } else if (this.diagType === 'import') {
        this.dVisible = false;
        this.checkAllTable();
      }
      this.dVisible = false;
    },
    // 点击学生信息表某一行
    onSelectOp(row, col) {
      // 点击编辑列按钮不进入行编辑
      if (col && col.label !== '操作') {
        // 点击非编辑的行且有一行处于编辑状态时，才校验全数据是否符合规则。
        if (!row.show && this.tableData.some(t => t.show)) {
          this.checkAllTable();
        }
        this.$refs.table.toggleRowSelection(row, true);
        this.tableData = this.tableData.map(t => {
          if (row.userid === t.userid) {
            return Object.assign({}, row, { show: true });
          } else {
            return Object.assign({}, t, { show: false });
          }
        });
      }
    },
    judgeIfExcel(file) {
      if (file && file.name) {
        const nArr = file.name.split('.');
        if (nArr && nArr.length > 0) {
          return ['xlsx', 'xls'].includes(nArr[nArr.length - 1].toLowerCase());
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    // 导入Excel
    getFile(event) {
      let _this = this;
      let f = event.target.files[0];
      this.$refs.uploadDom.value = '';
      if (!this.judgeIfExcel(f)) {
        Notify({
          type: 'warning',
          message: this.onlyExcel,
        });
        return;
      }
      if (f.size > 10 * 1000 * 1000) {
        Notify({
          type: 'warning',
          message: '文件大小不能超过10M',
        });
        return;
      }
      let rABS = false; //是否将文件读取为二进制字符串

      let reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        let binary = '';
        let rABS = false; //是否将文件读取为二进制字符串
        let wb; //读取完成的数据
        let outdata;
        let reader = new FileReader();
        reader.onload = function(e) {
          let bytes = new Uint8Array(reader.result);
          let length = bytes.byteLength;
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          function fixdata(data) {
            //文件流转BinaryString(不需要此功能可以删掉)

            var o = '',
              l = 0,
              w = 10240;

            for (; l < data.byteLength / w; ++l)
              o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));

            o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));

            return o;
          }

          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              // 手动转化
              type: 'base64',
            });
          } else {
            wb = XLSX.read(binary, {
              type: 'binary',
            });
          }
          //   outdata = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          outdata = XLSX.utils.sheet_to_txt(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          //   let a = outdata.split("</tr><tr>");
          const arr1 = outdata.split('\n');
          const arr2 = arr1 && arr1.length > 0 ? arr1.map(a => a.split('\t')) : [];
          // cut the empty rows
          const t = arr2.filter(row => row.length > 0 && row.some(r => r));
          // cols' length
          let tLen = t.length;
          const index = {};
          t.forEach(item => {
            item.forEach((ie, id) => {
              // cut the empty cols
              if (!ie) {
                index[id] = index[id] ? ++index[id] : 1;
              }
            });
          });
          for (let j = 0; j < tLen; j++) {
            if (index[j] === tLen) {
              t.forEach(item => {
                item.splice(j, 1);
              });
            }
          }
          // console.log(outdata, arr1, arr2, t);
          _this.checkExcelData(t);
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    // check excel's data
    checkExcelData(arr) {
      let flag = 0;
      if (arr && arr.length && arr.length > 1) {
        arr.forEach((item, index) => {
          if (index === 0) {
            item.forEach((i, id) => {
              if (i !== this.dataTitle[0][id] && item.length !== 6) {
                flag++;
                Notify({
                  type: 'warning',
                  message: '表头有误，请按模板导入。',
                });
                throw '表头有误';
              }
            });
          } else {
            item.forEach((i, n) => {
              let msg = this.regCheck({ index: n, name: i });
              if (msg) {
                flag++;
                throw msg;
              }
            });
          }
        });
        if (!flag) {
          let rest = arr.slice(1);
          let name = ['classname', 'username', 'userid', 'idcard', 'sex', 'national'];
          let arrT = [];
          rest.forEach(r => {
            let arrEle = { show: false };
            r.forEach((item, index) => {
              arrEle[name[index]] = item;
            });
            arrT.push(arrEle);
          });
          this.getSamePrimaryKey(arrT);
          this.tableData = this.tableData.concat(arrT);
          this.dVisible = true;
          this.diagTitle = '导入成功';
          this.diagBody = `成功导入${rest.length}条学生信息`;
        }
      }
    },
    stop(e) {
      let ev = e || window.event;
      ev.stopPropagation && ev.stopPropagation();
      ev.preventDefault && ev.preventDefault();
    },
    //点击上传
    toUpload(e) {
      this.stop(e);
      this.checkAllTable();
      this.diagType = 'import';
      this.$refs.uploadDom.click();
    },
    downloadTemp(e) {
      this.stop(e);
      const data = this.dataTitle;
      try {
        let ws = XLSX.utils.aoa_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(wb, '学生基本信息表模板.xlsx');
      } catch (e) {}
    },
    // 校验住宿日期 (不能早于实习开始日期)
    validator(v) {
      if (v && this.$refs.basicInfo.editForm.prstarttime) {
        return this.sleepInfo.sleepstarttime >= this.$refs.basicInfo.editForm.prstarttime;
      } else {
        return true;
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 更改最小可选日期
    changeMinDate(date) {
      this.sleepMinDate = date;
      this.eatMinDate = date;
      this.eatEndMinDate = date;
      this.sleepInfo.sleeptime = '';
      this.sleepInfo.sleepstarttime = '';
      this.sleepInfo.sleependtime = '';
      this.eatInfo.eatstarttime = '';
      this.eatInfo.eatstarttimeFormat = '';
      this.eatInfo.eatendtime = '';
      this.eatInfo.eatendtimeFormat = '';
    },
    // 选择住宿日期
    onConfirmSleepDate(date) {
      const [start, end] = date;
      this.sleepInfo.sleeptime = `${start.getFullYear()}.${start.getMonth() +
        1}.${start.getDate()} - ${end.getFullYear()}.${end.getMonth() + 1}.${end.getDate()}`;
      this.sleepInfo.sleepstarttime = this.common.formatTime(start.getTime(), 'YYYYMMDD000000');
      this.sleepInfo.sleependtime = this.common.formatTime(end.getTime(), 'YYYYMMDD000000');
      this.showSleepCalendar = false;
    },

    // 选择用餐开始日期
    onConfirmEatStartDate(date) {
      this.eatInfo.eatstarttimeFormat = `${date.getFullYear()}.${date.getMonth() +
        1}.${date.getDate()}`;
      this.eatInfo.eatstarttime = this.common.formatTime(date.getTime(), 'YYYYMMDD000000');
      this.eatEndMinDate = date;
      this.eatInfo.eatendtime = '';
      this.eatInfo.eatendtimeFormat = '';
      this.showEatStartCalendar = false;
    },

    // 选择用餐结束日期
    onConfirmEatEndDate(date) {
      this.eatInfo.eatendtimeFormat = `${date.getFullYear()}.${date.getMonth() +
        1}.${date.getDate()}`;
      this.eatInfo.eatendtime = this.common.formatTime(date.getTime(), 'YYYYMMDD000000');
      this.showEatEndCalendar = false;
    },
    // 下载模板
    downTemplate() {
      let url = window.g.bm + '/prapply/exportStuTemplate';
      window.location.href = url;
    },
    // 点击上传文件按钮
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 选择文件
    choosefile() {
      this.$toast.loading({
        message: '文件上传中...',
        forbidClick: true,
        duration: 0,
      });
    },
    // 上传文件
    finish(res) {
      this.$toast.clear();
      if (res.success) {
        let data = res.data[0];
        this.noteInfo.stuinfofileid = data.ID;
        this.noteInfo.stuinfofilename = data.TITLE;
      }
    },
    // 保存和提交
    doApply(type) {
      this.checkAllTable();
      if (!this.approverid) {
        Notify({
          duration: 5000,
          type: 'warning',
          message: '请选择审批领导',
        });
        return;
      }
      this.$refs.edifForm
        .validate()
        .then(() => {
          if (type === 0) {
            this.doSubmit(0);
          } else {
            // this.getLeaderList();
            // this.showApproverDialog = true;
            this.doSubmit(1);
          }
        })
        .catch(err => {
          this.$toast.fail('请填写正确信息');
        });
    },

    // 选择审批人
    chooseApporver(item) {
      this.approverid = item.value;
      this.approvername = item.text;
      this.showApproverPicker = false;
    },
    // 确定审批人
    onConfirmApporver() {
      // this.doSubmit(1);
    },
    // 最终提交
    doSubmit(type) {
      let url = type === 0 ? '/prapply/saveDraft' : '/prapply/save';
      let message = type === 0 ? '保存' : '提交';
      let data = {
        ...this.$refs.basicInfo.editForm,
        ...this.sleepInfo,
        ...this.eatInfo,
        ...this.noteInfo,
        approverid: this.approverid,
      };
      let studentList = this.tableData.map(t => {
        let obj = { ...t };
        obj.sex = obj.sex === '男' ? 1 : 0;
        return obj;
      });
      data.studentList = studentList;

      if (!data.id) {
        delete data.id;
      }
      this.$toast.loading({
        message: message + '中...',
        forbidClick: true,
        duration: 0,
      });
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: url,
          isRep: true,
          data: data,
        })
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            let path = type === 0 ? '/practice' : '/practice/apply-success';
            this.$toast.success(message + '成功');
            this.$router.push(path);
          } else {
            this.$toast.fail(message + '失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail(message + '失败' + '\n' + err);
        });
    },
    // 审批编辑
    auditEdit() {
      this.$refs.edifForm
        .validate()
        .then(() => {
          let data = {
            ...this.$refs.basicInfo.editForm,
            ...this.sleepInfo,
            ...this.eatInfo,
            ...this.noteInfo,
          };

          this.$toast.loading({
            message: '保存中...',
            forbidClick: true,
            duration: 0,
          });
          this.util
            .postAjax({
              code: this.global.bmCode,
              url: '/prapply/edit',
              isRep: true,
              data: data,
            })
            .then(res => {
              this.$toast.clear();
              if (res.success == true) {
                this.$toast.success('保存成功');
                this.$router.push('/practice-audit-bm');
              } else {
                this.$toast.fail('保存失败' + '\n' + res.message);
              }
            })
            .catch(err => {
              this.$toast.clear();
              this.$toast.fail('保存失败' + '\n' + err);
            });
        })
        .catch(() => {
          this.$toast.fail('请填写正确信息');
        });
    },
    // 获取审批人列表
    getLeaderList() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/user/userLeaderList',
        })
        .then(res => {
          if (res.success) {
            this.leaderList = res.items.map(i => {
              return {
                text: i.name,
                value: i.id,
              };
            });
            let tmpO = this.leaderList.find(l => l.value === this.approverid) || {};
            this.approvername = tmpO.text;
          } else {
            this.$toast.fail('获取审批人列表失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.fail('获取审批人列表失败' + '\n' + err);
        });
    },
    // 获取详情
    getDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/prapply/findById',
          data: {
            id: this.id,
          },
        })
        .then(res => {
          if (res.success) {
            this.detail = res.item ? res.item.apply || {} : {};
            this.detail.teacherList = res.item.teachers || [];
            this.studentList = res.item.students || [];
            this.tableData = this.studentList.map(s => {
              let obj = { ...s };
              obj.sex = obj.sex == '1' ? '男' : '女';
              return obj;
            });
            this.approverid = this.detail.approverid;
            this.getLeaderList();
            // 从详情中获取住宿数据
            for (let i in this.sleepInfo) {
              this.sleepInfo[i] = this.detail[i] || '';
            }
            // 如果存在实习日期，则设置住宿和餐食的最小日期
            let prstarttime = this.detail.prstarttime;
            if (prstarttime) {
              let date = new Date(this.common.formatTime(prstarttime, 'YYYY-MM-DD'));
              this.sleepMinDate = date;
              this.eatMinDate = date;
              this.eatEndMinDate = date;
            }
            // 转换住宿日期
            if (this.detail.issleep === '1') {
              this.sleepInfo.sleeptime = this.detail.sleepstarttime
                ? this.common.formatTime(this.detail.sleepstarttime, 'YYYY.MM.DD') +
                  ' - ' +
                  this.common.formatTime(this.detail.sleependtime, 'YYYY.MM.DD')
                : '';
            }
            // 从详情中获取餐食数据
            for (let i in this.eatInfo) {
              this.eatInfo[i] = this.detail[i] || '';
            }
            // 转换餐食日期
            if (this.detail.iseat === '1') {
              this.eatInfo.eatstarttimeFormat = this.detail.eatstarttime
                ? this.common.formatTime(this.detail.eatstarttime, 'YYYY.MM.DD')
                : '';
              this.eatInfo.eatendtimeFormat = this.detail.eatendtime
                ? this.common.formatTime(this.detail.eatendtime, 'YYYY.MM.DD')
                : '';
            }
            // 从详情中获取备注数据
            this.noteInfo.prconditions = this.detail.prconditions;
            this.noteInfo.stuinfofileid = res.item.attment ? res.item.attment.ID : '';
            this.noteInfo.stuinfofilename = res.item.attment ? res.item.attment.TITLE : '';
          } else {
            this.$toast.fail('获取数据失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + "\n" + err);
        });
    },
  },
  created() {
    if (this.id) {
      this.getDetail();
    } else {
      this.getLeaderList();
    }
    let title = this.dataTitle[0];
    let name = ['classname', 'username', 'userid', 'idcard'];
    name.forEach((n, id) => {
      let obj = { name: n, label: title[id] };
      this.tableT.push(obj);
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/mixin.scss';
.land-preview {
  color: #00b09b;
  .van-cell__value {
    background: url('../../../../static/imgs/bm-land-bg.png') no-repeat;
    background-size: 106px 28px;
    background-position: 100% 0%;
    color: #ffffff;
    img {
      width: 14px;
      height: 12px;
      margin-right: 5px;
    }
  }
}
.field-box.sleep-box {
  @include clearfix;
  p {
    width: 100px;
    float: left;
  }
  div {
    width: 150px;
    float: right;
  }
}
.field-box-file {
  .upload-box {
    width: 100%;
    margin: 10px 0 !important;
  }
  .van-icon-down {
    position: absolute;
    top: 10px;
    right: 15px;
    // float: right;
    color: #00b09b;
    // border-bottom: 1px solid #00b09b;
  }
  .van-cell {
    padding: 0;
    background: none;
  }
}
.image {
  margin-left: 15px;
  // display: inline-block;
  color: #00b09b;
  float: right;
  // font-size: 14px;
  // line-height: 14px;
  // height: 14px;
  img {
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
}
.upload-input {
  display: none;
}
/deep/ #fItem20220530 .el-form-item__label {
  color: #f56c6c;
  margin-top: -20px;
  &::after {
    content: '';
  }
}
.std-btn {
  width: 28px;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
  cursor: pointer;
  // height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  // line-height: 20px;
}
.del {
  color: #fe3e61;
}
.save {
  color: #1888fc;
}
/deep/ .nation-c .el-popper,
.el-dropdown-menu--mini {
  max-height: 300px;
  // min-width: 100px;
  overflow-y: auto;
}
.info44 {
  width: 341px;
  height: auto;
  overflow-wrap: break-word;
  color: rgba(31, 35, 47, 1);
  font-size: 14px;
  letter-spacing: -0.12098753452301025px;
  text-align: center;
  white-space: normal;
  line-height: 20px;
  display: block;
  margin: 20px auto;
}
.diag {
  width: 121px;
  height: 27px;
  text-align: left;
  margin-left: 10px;
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
/deep/ .van-dialog {
  min-height: 20%;
}
/deep/ .van-dialog__footer {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
/deep/ .van-dialog__cancel {
  margin: 0 10px;
  width: 120px;
  height: 42px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .van-button__text {
    height: 33px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 33px;
  }
}
/deep/ .van-dialog__confirm {
  margin: 0 10px;
  width: 120px;
  height: 42px;
  background: #00b09b;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  .van-button__text {
    height: 33px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 33px;
  }
}
.leader-van-field {
  width: 100%;
  height: 60px;
}
</style>

<style scoped lang="scss">
.layer8 {
  display: flex;
  background-color: rgba(243, 245, 249, 1);
  border-radius: 5px;
  min-height: 190px;
  min-width: 345px;
  margin: 9px 15px 10px;
}

.wrap7 {
  min-width: 326px;
  min-height: 170px;
  margin: 10px auto;
  width: 90%;
}

.bd24 {
  background-color: rgba(255, 255, 255, 1);
  border-radius: 5px;
  height: auto;
  margin-left: 1px;
  min-width: 325px;
  width: 100%;
}

.outer19 {
  // width: 326px;
  height: auto;
  justify-content: space-between;
  width: 100%;
}

.field-std {
  width: 48%;
  min-width: 160px;
  display: inline-block;
  border-width: 1px 0 1px 1px;
  border-color: #f3f5f9;
  border-style: solid;
  /deep/ .el-dropdown {
    color: inherit
  }
}

.bd25 {
  display: flex;
  justify-content: space-between;
  min-width: 326px;
  min-height: 40px;
  margin-top: 10px;
  width: 100%;
}

.mod34 {
  background-color: rgba(255, 255, 255, 1);
  border-radius: 5px;
  height: 40px;
  border: 1px rgba(182, 189, 198, 1);
  width: 48%;
}

.word64 {
  width: 28px;
  height: 20px;
  overflow-wrap: break-word;
  color: rgba(56, 58, 72, 1);
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  line-height: 20px;
  display: block;
  margin: 10px auto;
}

.main20 {
  background-color: rgba(227, 249, 245, 1);
  border-radius: 5px;
  height: 40px;
  border: 1px rgba(0, 176, 155, 1);
  width: 48%;
}

.word47 {
  width: 112px;
  height: 20px;
  overflow-wrap: break-word;
  color: rgba(0, 176, 155, 1);
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  line-height: 20px;
  display: block;
  margin: 10px auto;
}
</style>
