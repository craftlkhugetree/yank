<template>
  <el-form
    :model="form"
    ref="form"
    :rules="rules"
    label-position="top"
    :hide-required-asterisk="true"
  >
    <!--基本信息-->
    <div class="title">
      <span class="num">1</span>
      <span>基本信息</span>
    </div>
    <el-row>
      <el-col :span="12">
        <el-form-item
          label="学院名称"
          :label-width="formLabelWidth"
          prop="orgname"
        >
          <!-- prop="orgid" -->
          <el-select
            v-model="form.orgname"
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
          label="班级名称"
          :label-width="formLabelWidth"
          prop="classname"
        >
          <el-input
            v-model="form.classname"
            autocomplete="off"
            placeholder="请输入班级"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      label="课程名称"
      :label-width="formLabelWidth"
      prop="coursename"
    >
      <el-input
        v-model="form.coursename"
        autocomplete="off"
        placeholder="请输入课程名称"
      ></el-input>
    </el-form-item>

    <el-form-item
      label="实习内容"
      :label-width="formLabelWidth"
      prop="prcontent"
    >
      <el-input
        type="textarea"
        v-model="form.prcontent"
        placeholder="请输入实习内容"
      ></el-input>
    </el-form-item>

    <el-row>
      <el-col :span="12">
        <el-form-item
          label="实习人数（人）"
          :label-width="formLabelWidth"
          prop="prpersonnum"
        >
          <el-input-number
            v-model="form.prpersonnum"
            autocomplete="off"
            :min="0"
            controls-position="right"
            style="width: 100%"
            placeholder="请输入"
          ></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="'实习日期(请提前' + limitDay + '天申请)'"
          prop="prdaterange"
        >
          <!-- <el-date-picker
            style="width: 100%"
            v-model="form.prdaterange"
            type="daterange"
            range-separator="--"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
            :picker-options="pickerOptions"
            @blur="val => dateRangeChange(val, 'prdate', form.prdaterange)"
            :clearable="false"
          ></el-date-picker> -->
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                :label-width="formLabelWidth"
                prop="prstarttime"
                style="margin-left: 0"
              >
                <el-date-picker
                  type="date"
                  placeholder="开始日期"
                  v-model="form.prstarttime"
                  value-format="yyyyMMdd"
                  style="width: 100%;"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label-width="formLabelWidth"
                prop="prendtime"
                style="margin-left: 0"
              >
                <el-date-picker
                  type="date"
                  placeholder="结束日期"
                  v-model="form.prendtime"
                  value-format="yyyyMMdd"
                  style="width: 100%;"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
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
          prop="applyername"
        >
          <el-input
            v-model="form.applyername"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="联系电话"
          :label-width="formLabelWidth"
          prop="applymobile"
        >
          <el-input
            v-model="form.applymobile"
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
          label="负责教师"
          :label-width="formLabelWidth"
          prop="leadername"
        >
          <el-select
            v-model="form.leadername"
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
          prop="leadermobile"
        >
          <el-input
            v-model="form.leadermobile"
            autocomplete="off"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="参与教师" :label-width="formLabelWidth">
      <div class="teacher-list">
        <el-row
          class="teacher-item"
          v-for="(item, index) in teacherList"
          :key="index"
        >
          <el-col :span="10" style="border-right: 3px solid #f3f5f9">
            <img src="../../static/images/bm-teacher-avater.png" alt="" />

            <el-select
              v-model="item.teachername"
              filterable
              remote
              placeholder="请输入或选择"
              :remote-method="remoteMethod"
              size="small"
              :loading="selectLoading"
              @change="val => dataFilter2(val, item)"
              style="width: 100%"
            >
              <el-option
                v-for="v in jzgList"
                :label="v.name + '--' + v.id"
                :value="JSON.stringify({ id: v.id, name: v.name })"
                :key="v.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <img src="../../static/images/bm-teacher-phone.png" alt="" />
            <el-input
              v-model="item.teachermobile"
              autocomplete="off"
              size="small"
              style="width: 90%"
              placeholder="请输入"
            ></el-input>
          </el-col>
          <el-col class="operate" :span="2" style="padding: 0">
            <!--            <img style="width: 16px;height: 16px;margin-right: 15px" src="../../static/images/bm-teacher-edit.png" title="编辑">-->
            <img
              style="width: 14px;height: 16px;cursor: pointer"
              src="../../static/images/bm-teacher-delete.png"
              title="删除"
              @click="deleteTeacher(index)"
            />
          </el-col>
        </el-row>
        <div class="add" @click="addTeacher">
          <i class="el-icon-plus" style="margin-right: 10px"></i>新增
        </div>
      </div>
    </el-form-item>

    <!--住宿信息-->
    <div class="title">
      <span class="num">2</span>
      <span>住宿信息</span>

      <div class="my-switch-text">
        <span>是否住宿</span>
        <el-switch
          v-model="form.issleep"
          active-color="#00B09B"
          inactive-color="#E7E9EF"
          inactive-value="0"
          active-value="1"
        ></el-switch>
      </div>
    </div>

    <el-row v-if="form.issleep == '1'">
      <el-col :span="14">
        <el-form-item
          label="住宿日期"
          :label-width="formLabelWidth"
          prop="sleepdaterange"
        >
          <!-- :rules="[
            {
              type: 'array',
              required: form.issleep == '1',
              message: '请选择住宿日期',
              trigger: 'change'
            }
          ]"
        > -->
          <!-- <el-date-picker
            style="width: 100%"
            v-model="form.sleepdaterange"
            type="daterange"
            range-separator="--"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
            :picker-options="pickerOptionsSleep"
            @blur="
              val => dateRangeChange(val, 'sleepdate', form.sleepdaterange)
            "
            :clearable="false"
            :disabled="!form.prdaterange"
          ></el-date-picker> -->
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                :label-width="formLabelWidth"
                prop="sleepstarttime"
                style="margin-left: 0"
              >
                <el-date-picker
                  type="date"
                  placeholder="开始日期"
                  v-model="form.sleepstarttime"
                  value-format="yyyyMMdd"
                  style="width: 100%;"
                  :picker-options="pickerOptionsSleep"
                  :disabled="!form.prstarttime"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label-width="formLabelWidth"
                prop="sleependtime"
                style="margin-left: 0"
              >
                <el-date-picker
                  type="date"
                  placeholder="结束日期"
                  v-model="form.sleependtime"
                  value-format="yyyyMMdd"
                  style="width: 100%;"
                  :picker-options="pickerOptionsSleep"
                  :disabled="!form.prstarttime"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>

      <el-col :span="10">
        <el-form-item
          label="住宿人数"
          :label-width="formLabelWidth"
          prop="sleepboynum"
        >
          <el-row :gutter="50">
            <el-col :span="10">
              <el-form-item
                prop="sleepboynum"
                class="no-margin-left"
                :rules="[
                  {
                    required: form.issleep == '1',
                    message: '请输入男生人数',
                    trigger: 'blur'
                  }
                ]"
              >
                <label style="margin-right: 10px">男</label>
                <el-input-number
                  v-model="form.sleepboynum"
                  autocomplete="off"
                  :controls="false"
                  :min="0"
                  style="width: 60px"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                prop="sleepgirlnum"
                class="no-margin-left"
                :rules="[
                  {
                    required: form.issleep == '1',
                    message: '请输入女生人数',
                    trigger: 'blur'
                  }
                ]"
              >
                <label style="margin-right: 10px">女</label>
                <el-input-number
                  v-model="form.sleepgirlnum"
                  autocomplete="off"
                  :controls="false"
                  :min="0"
                  style="width: 60px"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>

    <!--餐食信息-->
    <div class="title">
      <span class="num">3</span>
      <span>餐食信息</span>

      <div class="my-switch-text">
        <span>是否用餐</span>
        <el-switch
          v-model="form.iseat"
          active-color="#00B09B"
          inactive-color="#E7E9EF"
          inactive-value="0"
          active-value="1"
        ></el-switch>
      </div>
    </div>
    <div id="fItem20220707" v-if="form.iseat == 1">
      <el-form-item
        label="如果实习期间遇特殊情况不用餐，请提前联系基地后勤保障科56217123，以免造成浪费。"
      ></el-form-item>
    </div>

    <el-row v-if="form.iseat == '1'">
      <el-col :span="24">
        <el-form-item
          label="用餐日期(请先选择实习日期)"
          :label-width="formLabelWidth"
          prop="eatdaterange"
        >
          <!-- :rules="[
            {
              type: 'array',
              required: form.iseat == '1',
              message: '请选择用餐日期',
              trigger: 'change'
            }
          ]"
        > -->
          <!-- <el-date-picker
            style="width: 100%"
            v-model="form.eatdaterange"
            type="daterange"
            range-separator="--"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
            :picker-options="pickerOptionsSleep"
            @blur="val => dateRangeChange(val, 'eatdate', form.eatdaterange)"
            :clearable="false"
            :disabled="!form.prdaterange"
          ></el-date-picker> -->
          <div class="flex-div">
            <div>
              <el-date-picker
                v-model="form.eatstarttime"
                type="date"
                placeholder="开始日期"
                :picker-options="pickerOptionsSleep"
                :disabled="!form.prstarttime"
                :clearable="false"
                style="width: 180px"
                @blur="$forceUpdate()"
              >
              </el-date-picker>
              <el-select
                v-model="form.eatstarttype"
                placeholder="请选择"
                style="width: 90px"
              >
                <el-option
                  v-for="item in optionsMeal"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <span>至</span>
            <div>
              <el-date-picker
                v-model="form.eatendtime"
                type="date"
                placeholder="结束日期"
                :picker-options="pickerOptionsSleep"
                :disabled="!form.prstarttime"
                :clearable="false"
                style="width: 180px"
                @blur="$forceUpdate()"
              >
              </el-date-picker>
              <el-select
                v-model="form.eatendtype"
                placeholder="请选择"
                style="width: 90px"
              >
                <el-option
                  v-for="item in optionsMeal"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- <el-row v-if="form.iseat == '1'" style="margin-top: -10px">
      <el-col :span="12">
        <el-form-item
          prop="eatstarttype"
          :rules="[
            {
              required: form.iseat == '1',
              message: '请选择餐食',
              trigger: 'change'
            }
          ]"
        >
          <div>
            <span class="choose-eat-type">选择餐食:</span>
            <el-radio-group
              v-model="form.eatstarttype"
              class="my-radio-right-18"
            >
              <el-radio label="1">早餐</el-radio>
              <el-radio label="2">中餐</el-radio>
              <el-radio label="3">晚餐</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          prop="eatendtype"
          :rules="[
            {
              required: form.iseat == '1',
              message: '请选择请选择餐食',
              trigger: 'change'
            }
          ]"
        >
          <div>
            <span class="choose-eat-type">选择餐食:</span>
            <el-radio-group v-model="form.eatendtype" class="my-radio-right-18">
              <el-radio label="1">早餐</el-radio>
              <el-radio label="2">中餐</el-radio>
              <el-radio label="3">晚餐</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-col>
    </el-row> -->

    <el-row v-if="form.iseat == '1'">
      <el-col :span="12">
        <!--        :rules="[{ required: form.iseat == '1', message: '请输入用餐总人数', trigger: 'blur' }]"-->
        <el-form-item
          label="用餐人数"
          :label-width="formLabelWidth"
          prop="eatpersonnum"
        >
          <el-input-number
            v-model="form.eatpersonnum"
            autocomplete="off"
            :min="0"
            controls-position="right"
            style="width: 100%"
            placeholder="请输入用餐总人数"
          ></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!--        :rules="[{ required: form.iseat == '1', message: '请输入用餐民族生人数', trigger: 'blur' }]"-->
        <el-form-item
          label="用餐民族生人数"
          :label-width="formLabelWidth"
          prop="eatmpersonnum"
        >
          <el-input-number
            v-model="form.eatmpersonnum"
            autocomplete="off"
            :min="0"
            controls-position="right"
            style="width: 100%"
            placeholder="请输入用餐民族生人数"
          ></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <!--餐食信息-->
    <div class="title">
      <span class="num">4</span>
      <span>其他信息</span>
    </div>

    <el-form-item
      label="实习条件"
      :label-width="formLabelWidth"
      prop="prconditions"
    >
      <el-input
        type="textarea"
        v-model="form.prconditions"
        placeholder="请输入实习条件"
      ></el-input>
    </el-form-item>

    <!-- <el-form-item label="学生信息表" :label-width="formLabelWidth">

      <div class="student-info" @click="uploadFile">
        <span>上传文件</span>
        <img style="float: right" src="../../static/images/bm-upload-student-info.png" alt="">

      </div>
      <div v-if="form.stuinfofilename" class="teacher-list" style="padding: 0 10px" >
        {{form.stuinfofilename}}
        <span style="float: right;margin-top: 5px">
          <img style="margin-right: 5px;cursor: pointer" src="../../static/images/bm-file-preview.png" alt="" title="预览" @click="common.previewFile(form.stuinfofileid)">
          <img style="cursor: pointer" src="../../static/images/bm-file-delete.png" alt="" title="删除" @click="deleteFile">
        </span>
      </div>
      <div class="text-download" @click="downMoudel">
         <i class="el-icon-download"></i> 下载模板
      </div>
    </el-form-item> -->
    <el-row>
      <el-col :span="12">
        <el-form-item label="学生信息表"></el-form-item>
        <div id="fItem20220530">
          <el-form-item
            label="请按模板上传学生信息表，否则将无法通过审核。"
          ></el-form-item>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="text-download" @click="addRow" style="float:right">
          <i class="el-icon-plus"></i> 新增
        </div>
        <div class="text-download image" @click="toUpload" style="float:right">
          <img :src="require('st@tic/images/import.png')" /> 导入
        </div>
        <div class="text-download" @click="downloadTemp" style="float:right">
          <i class="el-icon-download"></i> 下载模板
        </div>

        <!-- <el-button class="text-download" @click="downMoudel" type="text">
         <i class="el-icon-download"></i> 下载模板
      </el-button> -->
      </el-col>
    </el-row>
    <input
      type="file"
      :multiple="false"
      @change="getFile"
      title="上传文件"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      class="upload-input"
      ref="uploadDom"
    />

    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      height="250"
      ref="table"
      @row-click="onSelectOp"
    >
      <el-table-column type="index"> </el-table-column>
      <el-table-column
        v-for="(item, index) in tableT"
        :prop="item.name"
        :label="item.label"
        :key="item.name + index"
        align="center"
        :width="index == 3 ? 200 : ''"
      >
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model.trim="scope.row[item.name]"
            maxlength="30"
            v-show="scope.row.show"
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
              {{ scope.row.sex
              }}<i class="el-icon-arrow-down el-icon--right"></i>
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
              {{ scope.row.national
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>

            <el-dropdown-menu slot="dropdown" class="nation-c">
              <el-dropdown-item
                :command="item.name"
                v-for="item in nation_data"
                :key="item.id"
                >{{ item.name }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>

          <span v-show="!scope.row.show">{{ scope.row.national }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <div
            v-if="scope.row.show"
            class="std-btn save"
            @click="saveRow(scope.row)"
          >
            保存
          </div>
          <div class="std-btn del" @click="delRow(scope.$index)">
            删除
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-row>
      <!--      <img class="connect-icon" src="../../../../static/images/bm-connect-icon.png" alt="">-->
      <el-col :span="12">
        <el-form-item
          label="审批领导"
          :label-width="formLabelWidth"
          prop="approverid"
        >
          <el-select
            v-model="form.approverid"
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

    <upload
      v-show="false"
      ref="upload"
      class="my-upload"
      :url="uploadUrl"
      :multiple="false"
      :exts="fileType"
      @choose="choosefile"
      @done="finish"
    ></upload>

    <el-dialog
      v-if="dVisible"
      :visible.sync="dVisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="false"
      :show-close="false"
      width="50%"
    >
      <template #title>
        <div class="diag">
          <img :src="require('st@tic/images/dialog.png')" />
          <span class="diag-title">{{ diagTitle }}</span>
        </div>
      </template>
      <span class="info44">{{ diagBody }}</span>
      <div slot="footer" class="dialog-footer">
        <div
          class="my-button"
          @click="dVisible = false"
          v-if="diagType !== 'import'"
        >
          取 消
        </div>
        <!-- <div class="my-button plain-green"  @click="submit(0)">保 存</div> -->
        <div class="my-button green" @click="submitDiag()">确 定</div>
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
import upload from "../components/BaseUpload";
import { nation_data, optionsMeal } from "../assets/js/options";
import * as XLSX from "xlsx";
export default {
  name: "applyDialog",
  components: {
    upload
  },
  props: {
    form: Object,
    formLabelWidth: String,
    teacherList: Array,
    studentList: Array
  },
  data() {
    return {
      // import 成功导入；del 删除；submit 提交
      curRow: null,
      diagTitle: "",
      diagBody: "",
      diagType: "",
      dVisible: false,
      nation_data,
      optionsMeal,
      dataTitle: [["班级", "姓名", "学号", "身份证号", "性别", "民族"]],
      tableT: [],
      tableData: [],
      loading: false,
      // form:{},
      //日期禁用
      pickerOptions: this.disabledDate(),
      pickerOptionsSleep: this.disabledDateSleep(),

      selectLoading: false,
      value: true,
      radio: 3,
      groupList: JSON.parse(sessionStorage.getItem("groupList")), //学院列表
      fileType: "xls|XLS|xlsx|XLSX",
      uploadUrl: window.g.ApiUrl3 + "rest/FileOut/saveFile",
      downUrl: window.g.ApiUrl3 + "rest/FileOut/down?ID=",
      fullscreenLoading: "",
      rules: {
        // orgid: [
        //   { required: true, message: "请选择学院名称", trigger: "change" }
        // ],
        orgname: [
          { required: true, message: "请选择学院名称", trigger: "change" }
        ],
        classname: [
          { required: true, message: "请输入班级名称", trigger: "blur" }
        ],
        coursename: [
          { required: true, message: "请输入课程名称", trigger: "blur" }
        ],
        prcontent: [
          { required: true, message: "请输入实习内容", trigger: "blur" }
        ],
        prpersonnum: [
          { required: true, message: "请输入实习人数", trigger: "blur" }
        ],
        prstarttime: [
          { required: true, message: "请选择实习开始日期", trigger: "change" }
        ],
        prendtime: [
          { required: true, message: "请选择实习结束日期", trigger: "change" }
        ],
        // prdaterange: [
        //   {
        //     required: true,
        //     message: "请选择实习日期",
        //     trigger: "change",
        //     type: "array"
        //   }
        // ],
        applyername: [
          { required: true, message: "请选择申请人", trigger: "change" }
        ],
        applymobile: [
          { required: true, message: "请输入申请人联系方式", trigger: "blur" },
          this.options.testPhone
        ],
        leadername: [
          { required: true, message: "请选择负责教师", trigger: "change" }
        ],
        leadermobile: [
          {
            required: true,
            message: "请输入负责教师联系电话",
            trigger: "blur"
          },
          this.options.testPhone
        ],
        sleepstarttime: [
          { required: true, message: "请选择住宿开始日期", trigger: "blur" }
        ],
        sleependtime: [
          { required: true, message: "请选择住宿结束日期", trigger: "change" }
        ],

        // sleepdaterange: [
        //   {
        //     type: "array",
        //     required: this.form.issleep == "1",
        //     message: "请选择住宿日期",
        //     trigger: "change"
        //   }
        // ],
        // sleepboynum: [{ required: true, message: '请输入驻宿人数', trigger: 'blur' }],
        // eatstarttime: [{ required:  this.form.iseat =='1', message: '请选择用餐开始日期', trigger: 'change' }],
        // eatendtime: [{ required:  this.form.iseat =='1', message: '请选择用餐结束日期', trigger: 'change' }],

        eatdaterange: [
          {
            required: this.form.iseat == "1",
            // message: "请选择用餐日期",
            validator: (r, v, cb) => {
              if (!this.form.eatstarttime || !this.form.eatendtime) {
                return cb(new Error("请选择用餐日期"));
              } else if (!this.form.eatstarttype || !this.form.eatendtype) {
                return cb(new Error("请选择用餐类型"));
              } else {
                cb();
              }
            }
          }
        ],
        // eatstarttype: [
        //   {
        //     required: this.form.iseat == "1",
        //     message: "请选择用餐类型",
        //     trigger: "change"
        //   }
        // ],
        // eatendtype: [
        //   {
        //     required: this.form.iseat == "1",
        //     message: "请选择用餐类型",
        //     trigger: "change"
        //   }
        // ],
        eatpersonnum: [
          {
            required: this.form.iseat == "1",
            message: "请输入用餐总人数",
            trigger: "blur"
          }
        ],
        eatmpersonnum: [
          {
            required: this.form.iseat == "1",
            message: "请输入用餐民族生人数",
            trigger: "blur"
          }
        ],
        prconditions: [
          { required: true, message: "请输入实习条件", trigger: "blur" }
        ],
        //   stuinfofilename: [
        //   {
        //     required: true,
        //     message: "请上传学生信息表",
        //     trigger: ["blur", "change"]
        //   }
        // ],
        approverid: [
          { required: true, message: "请选择单位领导", trigger: "blur,change" }
        ]
      },
      jzgList: "",
      limitDay: 3,
      onlyExcel: "仅支持xlsx、xls格式文件"
    };
  },
  computed: {
    leaderList() {
      return this.$store.state.leaderList;
    }
  },
  watch: {
    "form.sleepstarttime": {
      handler(old, newVal) {
        if (this.form.sleependtime) {
          // this.form.sleepdaterange[0] = this.form.sleepstarttime;
        } else {
          this.$set(this.form, "sleependtime", this.form.sleepstarttime);
        }
      },
      deep: true // 引用类型数据，需要进行深度监听模式，不然无法进行触发回调
    },
    "form.sleependtime": {
      handler(old, newVal) {
        if (this.form.sleepstarttime) {
          // this.form.sleepdaterange[0] = this.form.sleepstarttime;
        } else {
          this.$set(this.form, "sleepstarttime", this.form.sleependtime);
        }
      },
      deep: true // 引用类型数据，需要进行深度监听模式，不然无法进行触发回调
    },
    "form.prstarttime": {
      handler(old, newVal) {
        this.pickerOptionsSleep = this.disabledDateSleep();
        if (this.form.prendtime) {
          // this.form.prdaterange[0] = this.form.prstarttime;
        } else {
          // this.form.prdaterange[0] = this.form.prstarttime;
          // this.form.prdaterange[1] = this.form.prstarttime;
          this.$set(this.form, "prendtime", this.form.prstarttime);
        }
      },
      deep: true // 引用类型数据，需要进行深度监听模式，不然无法进行触发回调
    },
    "form.prendtime": {
      handler(old, newVal) {
        this.pickerOptionsSleep = this.disabledDateSleep();
        if (this.form.prstarttime) {
          // this.form.prdaterange[1] = this.form.prendtime;
        } else {
          // this.form.prdaterange[0] = this.form.prendtime;
          // this.form.prdaterange[1] = this.form.prendtime;
          this.$set(this.form, "prstarttime", this.form.prendtime);
        }
      },
      deep: true // 引用类型数据，需要进行深度监听模式，不然无法进行触发回调
    }
  },
  methods: {
    // 学生信息表数据细节校验。name可能是字符串（导入文件）或者对象（转化后的表格数组），对应的n为索引或者对象的key
    regCheck(obj) {
      let { index: n, name } = obj;
      let i = typeof name === "string" ? name : name[n];
      let message = "";
      if (!i && n !== "show") {
        message = "学生信息表字段均必填！";
        this.$message({
          duration: 5000,
          showClose: true,
          type: "warning",
          message
        });
      } else if (
        (n == 3 || n === "idcard") &&
        !this.util.regExps.idCard.test(i)
      ) {
        message = `身份证号'${i}'不符合规则，请重新输入！`;
        this.$message({
          duration: 5000,
          showClose: true,
          type: "warning",
          message
        });
      } else if ((n == 4 || n === "sex") && !["男", "女"].includes(i)) {
        message = `性别为'男'或'女'，不能输入'${i}'！`;
        this.$message({
          duration: 5000,
          showClose: true,
          type: "warning",
          message
        });
      } else if (
        (n == 5 || n === "national") &&
        !this.nation_data.some(name => name.name === i)
      ) {
        message = `民族'${i}'输入不符合规则，请重新输入！`;
        this.$message({
          duration: 5000,
          showClose: true,
          type: "warning",
          message
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
    getSamePrimaryKey(arr, params = ["idcard", "userid"]) {
      let obj = {};
      params &&
        params.forEach(p => {
          arr.forEach((a, aindex) => {
            if (
              aindex < arr.length - 1 &&
              !(obj[p] && obj[p].find(itep => itep.val === a[p]))
            ) {
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
      let msg = "";
      params &&
        params.forEach(p => {
          let op = obj[p];
          if (op) {
            let tmpOb = {};
            op.forEach(item => {
              tmpOb[item.val]
                ? (tmpOb[item.val] += " " + item.index)
                : (tmpOb[item.val] = " " + item.index);
            });
            let message = "";
            for (let str in tmpOb) {
              message += str + " ";
              // message += str + ":" + tmpOb[str];
            }
            if (p === "idcard") {
              msg += "身份证号重复【" + message + "】<br />";
            } else if (p === "userid") {
              msg += "学号重复【" + message + "】<br />";
            }
          }
        });
      if (msg) {
        this.$message({
          duration: 5000,
          dangerouslyUseHTMLString: true,
          showClose: true,
          type: "warning",
          message: msg
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
        national: null
      };
      this.tableData.forEach(t => (t.show = false));
      this.tableData.unshift(obj);
    },
    delRow(index) {
      this.diagType = "del";
      this.diagTitle = "提示";
      this.diagBody = "确定删除该学生信息吗?";
      this.curRow = index;
      this.dVisible = true;
    },
    saveRow(row) {
      this.checkObj(row);
      let index = "";
      this.tableData.some((t, id) => {
        if (t.userid === row.userid) {
          index = id;
          return true;
        }
      });
      let [obj] = this.tableData.splice(
        index,
        1,
        Object.assign({}, row, { show: false })
      );
      try {
        this.checkAllTable();
      } catch (e) {
        this.tableData.splice(index, 1, obj);
      }
    },
    // 点击弹窗确定按钮
    submitDiag() {
      if (this.diagType === "del") {
        this.tableData.splice(this.curRow, 1);
      } else if (this.diagType === "submit") {
        this.$emit("submitDiag", 1);
      } else if (this.diagType === "import") {
        this.dVisible = false;
        this.checkAllTable();
      }
      this.dVisible = false;
    },
    // 点击学生信息表某一行
    onSelectOp(row, col) {
      // 点击编辑列按钮不进入行编辑
      if (col && col.label !== "操作") {
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
        const nArr = file.name.split(".");
        if (nArr && nArr.length > 0) {
          return ["xlsx", "xls"].includes(nArr[nArr.length - 1].toLowerCase());
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
      this.$refs.uploadDom.value = "";
      if (!this.judgeIfExcel(f)) {
        this.$message({
          showClose: true,
          type: "warning",
          message: this.onlyExcel
        });
        return;
      }
      if (f.size > 10 * 1000 * 1000) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "文件大小不能超过10M"
        });
        return;
      }
      let rABS = false; //是否将文件读取为二进制字符串

      let reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        let binary = "";
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

            var o = "",
              l = 0,
              w = 10240;

            for (; l < data.byteLength / w; ++l)
              o += String.fromCharCode.apply(
                null,
                new Uint8Array(data.slice(l * w, l * w + w))
              );

            o += String.fromCharCode.apply(
              null,
              new Uint8Array(data.slice(l * w))
            );

            return o;
          }

          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              // 手动转化
              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }
          //   outdata = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          outdata = XLSX.utils.sheet_to_txt(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          //   let a = outdata.split("</tr><tr>");
          const arr1 = outdata.split("\n");
          const arr2 =
            arr1 && arr1.length > 0 ? arr1.map(a => a.split("\t")) : [];
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
                this.$message({
                  showClose: true,
                  type: "warning",
                  message: "表头有误，请按模板导入。"
                });
                throw "表头有误";
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
          let name = [
            "classname",
            "username",
            "userid",
            "idcard",
            "sex",
            "national"
          ];
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
          this.diagTitle = "导入成功";
          this.diagBody = `成功导入${rest.length}条学生信息`;
        }
      }
    },
    toUpload() {
      this.checkAllTable();
      this.diagType = "import";
      this.$refs.uploadDom.click();
    },
    downloadTemp() {
      this.loading = true;
      const data = this.dataTitle;
      try {
        let ws = XLSX.utils.aoa_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(wb, "学生基本信息表模板.xlsx");
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      } catch (e) {
        this.loading = false;
      }
    },
    //实习日期不能选的日期
    disabledDate() {
      let that = this;
      return {
        disabledDate(time) {
          let limitDay = parseInt(that.limitDay);
          let nDate = new Date(
            new Date().setDate(new Date().getDate() + parseInt(limitDay) + 1)
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

    //住宿和用餐日期不能选的日期
    disabledDateSleep() {
      let that = this;
      return {
        disabledDate(time) {
          let nDate = that.form.prstarttime;
          return (
            time.getTime() <
            new Date(
              that.util.formatTime(nDate, "YYYY-MM-DD 00:00:00")
            ).getTime()
          );
        }
      };
    },

    //搜索
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

    //日期数组转单个
    dateRangeChange(val, type, arr) {
      // console.log(arr, val);
      // console.log(type);

      this.$forceUpdate();
      switch (type) {
        case "prdate":
          this.form.prstarttime = arr[0];
          this.form.prendtime = arr[1];
          this.$set(this.form, "prstarttime", arr[0]);
          break;
        case "sleepdate":
          this.form.sleepstarttime = arr[0];
          this.form.sleependtime = arr[1];
          break;
        case "eatdate":
          this.form.eatstarttime = arr[0];
          this.form.eatendtime = arr[1];
          break;
      }
    },

    //负责教师
    dataFilter(val) {
      this.form.leadername = JSON.parse(val).name;
      this.form.leaderid = JSON.parse(val).id;
      // console.log(val);
    },

    //参与教师
    dataFilter2(val, item) {
      console.log(item);
      console.log(val);
      item.teachername = JSON.parse(val).name;
      item.teacherid = JSON.parse(val).id;
      // console.log(val);
    },

    //下载学生信息表
    downMoudel() {
      this.util
        .getUrlByCode(this.global.code, "/prapply/exportStuTemplate")
        .then(res => {
          window.open(res, "_blank");
        });
    },

    // deleteFile

    deleteFile() {
      this.$forceUpdate();
      this.$emit("deleteFile");
    },
    //点击上传
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },

    //选择触发文件
    choosefile() {
      // this.fullscreenLoading = true;

      this.fullscreenLoading = this.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },

    //结束后返回
    finish(res) {
      // console.log(res);
      // this.fullscreenLoading = false;
      this.fullscreenLoading.close();
      if (res.success == true) {
        let data = res.data[0];
        this.$emit("getFileInfo", data);
        this.$forceUpdate();
        // console.log( "this.form.stuinfofileid",this.form.stuinfofileid);
      }
    },

    //删除教师
    deleteTeacher(index) {
      this.$emit("deleteTeacher", index);
    },

    //新增教师
    addTeacher() {
      this.$emit("addTeacher");
    },

    //刷新
    forceUpdate() {
      this.$forceUpdate();
    }
  },

  created() {
    if (this.form.prstarttime) {
      this.form.prdaterange = [this.form.prstarttime, this.form.prendtime];
    }
    if (this.form.sleepstarttime) {
      this.form.sleepdaterange = [
        this.form.sleepstarttime,
        this.form.sleependtime
      ];
    }
    if (this.form.eatstarttime) {
      this.form.eatdaterange = [this.form.eatstarttime, this.form.eatendtime];
    }

    this.common.findRule("PRJZGDAY").then(res => {
      if (res.success) {
        this.limitDay = res.item.rulevalue;
      }
    });

    this.tableData = this.studentList.map(s => {
      let obj = { ...s };
      obj.sex = obj.sex == "1" ? "男" : "女";
      return obj;
    });
    let title = this.dataTitle[0];
    let name = ["classname", "username", "userid", "idcard"];
    name.forEach((n, id) => {
      let obj = { name: n, label: title[id] };
      this.tableT.push(obj);
    });
  },
  mounted() {
    this.form.eatstarttime = this.form.eatstarttime
      ? new Date(this.common.formatTime(this.form.eatstarttime, "yyyy-MM-dd"))
      : null;
    this.form.eatendtime = this.form.eatendtime
      ? new Date(this.common.formatTime(this.form.eatendtime, "yyyy-MM-dd"))
      : null;
  }
};
</script>

<style scoped lang="scss">
.image {
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
    content: "";
  }
}
/deep/ #fItem20220707 .el-form-item__label {
  color: #f56c6c;
  &::after {
    content: "";
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
  height: 20px;
  overflow-wrap: break-word;
  color: rgba(31, 35, 47, 1);
  font-size: 14px;
  letter-spacing: -0.12098753452301025px;
  text-align: left;
  white-space: nowrap;
  line-height: 20px;
  display: block;
  margin: 20px 0 0 0;
}
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
.my-button {
  display: inline-block;
  //box-shadow:0px 0px 4px 0px rgba(226,226,226,0.3);
  border-radius: 5px;
  width: 100px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  color: #606266;
  font-size: 13px;
  border: 1px solid #dcdfe6;
  text-decoration: none !important;
  .image {
    width: 15px;
    height: 15px;
    vertical-align: top;
    margin-top: 9px;
  }

  &.samll {
    width: auto;
    min-width: 70px;
    height: 24px;
    line-height: 24px;
  }

  &:hover {
    cursor: pointer;
  }

  &.round {
    border-radius: 16px;
  }

  &.green {
    background: #00b09b;
    color: #ffffff;
    border-color: #00b09b;
  }

  &.plain-green {
    color: #00b09b;
    border-color: #00b09b;
  }
  &.grey {
    background: #e2e2e2;
    color: #999999;
    border-color: #e2e2e2;
  }
}
.flex-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // white-space: normal;
}
</style>