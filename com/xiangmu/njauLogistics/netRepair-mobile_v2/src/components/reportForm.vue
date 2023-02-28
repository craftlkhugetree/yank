<template>
  <div>
    <van-form
      class="reportform"
      ref="reportform"
      :colon="true"
      :show-error-message="false"
    >
      <van-field
        v-model="reportForm.faulttype"
        label="维修类型"
        :rules="[{ required: true, message: '请选择' }]"
        :required="true"
      />

      <div class="selecters">
        <span
          class="selectbtns"
          :class="{ active: item.id === reportForm.faulttype }"
          v-for="item in types"
          :key="item.id"
          @click="reportForm.faulttype = item.id"
          >{{ item.name }}</span
        >
      </div>
      <van-field label="问题引导" :required="true" v-if="showGuide" />
      <div class="issueguide" v-if="showGuide">
        <div class="issues" v-for="(issue, index) in issueFlow" :key="issue.id">
          <p class="questionlabel">
            <i>*</i>{{ index + 1 }}.<span v-html="issue.question">{{
              issue.question
            }}</span>
            <i
              v-if="issue.guideImg"
              @click="showGuideImgInfo(issue.guideImg, issue.guideTitle)"
              class="moreinfo"
              >?</i
            >
          </p>
          <van-radio-group
            class="issueradios"
            direction="horizontal"
            v-model="issue.checked"
          >
            <van-radio
              class="textradios"
              @click="getOptions(option.qid, index, option.text)"
              v-for="option in issue.options"
              :key="option.qid"
              :name="option.text"
              >{{ option.text }}</van-radio
            >
          </van-radio-group>
        </div>
      </div>
      <div class="reportForms" v-if="showReport">
        <van-field
          v-model="reportForm.faulttype"
          label="物品类型"
          :rules="[{ required: true, message: '请选择' }]"
          :required="true"
        />
        <div class="forms itemnames">
          <van-field
            class="half fieldbottom"
            v-model="areaForm2.itemnametype"
            placeholder="请选择物品类型"
            right-icon="arrow"
            name="areaForm1roominfo"
            readonly
            clickable
            @click="showItemTypePicker = true"
            :rules="[{ required: true, message: '请选择' }]"
          />
          <span> </span>
          <van-field
            name="areaForm1pubareainfo"
            class="half fieldbottom"
            v-model="areaForm2.itemname"
            placeholder="请选择物品名称"
            right-icon="arrow"
            readonly
            clickable
            @click="showItemNamePicker = true"
            v-show="showNamePicker"
            :rules="[{ required: showNamePicker, message: '请选择' }]"
          />
        </div>
        <van-field
          v-model="reportForm.areatype"
          label="报修区域"
          :required="true"
          :rules="[{ required: true, message: '请选择' }]"
          style="padding-bottom: 0"
        />
        <div class="selecters">
          <span
            :class="{ active: item.id === reportForm.areatype }"
            class="flexselectbtns"
            @click="reportForm.areatype = item.id"
            v-for="item in areas"
            :key="item.id"
            >{{ item.name }}</span
          >
        </div>
        <div class="selectforms">
          <!-- 学生公寓的表单 -->
          <div class="forms forms1" v-show="reportForm.areatype === '1'">
            <van-field
              readonly
              clickable
              :value="areaForm1.areaname"
              placeholder="请输入学生公寓名称"
              right-icon="search"
              @click="showPicker = true"
              class="fieldbottom deptname"
              :rules="[
                {
                  required: reportForm.areatype === '1',
                  message: '请输入学生公寓名称',
                },
              ]"
            />
            <van-field
              class="fieldbottom half"
              v-model="areaForm1.roominfo"
              placeholder="请输入房间号"
              :disabled="roominfodisabled"
              @input="setRoomInfoState"
              name="areaForm1roominfo"
              :rules="[
                {
                  required:
                    reportForm.areatype === '1' && !areaForm1.pubareainfo,
                  message: '请输入房间号',
                },
              ]"
            />
            <span>或</span>
            <van-field
              :rules="[
                {
                  required: reportForm.areatype === '1' && !areaForm1.roominfo,
                  message: '请输入地区',
                },
              ]"
              name="areaForm1pubareainfo"
              @input="setpubareaInfoState"
              :disabled="pubareainfodisabled"
              class="fieldbottom half"
              v-model="areaForm1.pubareainfo"
              placeholder="请输入地区"
            />
          </div>
          <!-- 学校其他楼宇的表单 -->
          <div class="forms forms2" v-show="reportForm.areatype === '2'">
            <van-field
              readonly
              clickable
              :value="areaForm2.areaname"
              placeholder="请输入楼宇名称"
              right-icon="search"
              @click="showPicker2 = true"
              class="fieldbottom deptname"
              :rules="[
                {
                  required: reportForm.areatype === '2',
                  message: '请输入楼宇名称',
                },
              ]"
            />
            <van-field
              :rules="[
                {
                  required:
                    reportForm.areatype === '2' && !areaForm2.pubareainfo,
                  message: '请输入房间号',
                },
              ]"
              class="fieldbottom half"
              v-model="areaForm2.roominfo"
              placeholder="请输入房间号"
            />
            <span>或</span>
            <van-field
              :rules="[
                {
                  required: reportForm.areatype === '2' && !areaForm2.roominfo,
                  message: '请输入地区',
                },
              ]"
              class="fieldbottom half"
              v-model="areaForm2.pubareainfo"
              placeholder="请输入地区"
            />
          </div>
          <!-- 校园公共区域的表单 -->
          <div class="forms forms3" v-show="reportForm.areatype === '3'">
            <van-field
              :rules="[
                {
                  required: reportForm.areatype === '3',
                  message: '请输入区域名称',
                },
              ]"
              v-model="areaForm3.areaname"
              placeholder="请输入区域名称"
              class="fieldbottom deptname"
            />
          </div>
          <!-- 家属区的表单 -->
          <div class="forms forms4" v-show="reportForm.areatype === '4'">
            <van-field
              :rules="[
                {
                  required: reportForm.areatype === '4',
                  message: '请输入区域名称',
                },
              ]"
              v-model="areaForm4.areaname"
              placeholder="请输入区域名称"
              class="fieldbottom deptname"
            />
          </div>
        </div>

        <van-field
          v-model="reportForm.note"
          label="详细描述"
          :required="true"
          :rules="[{ required: true, message: '请输入' }]"
        />
        <van-field
          v-model="reportForm.note"
          :rows="1"
          autosize
          type="textarea"
          placeholder="请输入详细描述"
          class="fieldbottom"
          :rules="[{ required: true, message: '请输入' }]"
        />
        <van-field
          v-model="reportForm.mobile"
          label="联系电话"
          :required="true"
          :rules="[{ required: true, message: '请输入' }]"
        />
        <van-field
          class="fieldbottom"
          v-model="reportForm.mobile"
          placeholder="请输入手机"
          :rules="[{ required: true, message: '请输入手机号' }]"
        />
        <upload :attaches="photos"></upload>
      </div>
    </van-form>

    <!-- 公寓搜索弹窗 -->
    <van-popup
      v-model="showPicker"
      position="bottom"
      :style="{ height: '60%' }"
    >
      <van-field
        v-model="searchInput"
        placeholder="请输入学生公寓名称"
        right-icon="search"
        class="popupsearch"
        size="large"
        @input="getDorms"
      />
      <van-list class="popuplist">
        <p
          class="deptinfos"
          v-for="item in deptments"
          :key="item.id"
          @click="setDeptment(item)"
        >
          {{ item.name }}
        </p>
      </van-list>
    </van-popup>
    <!-- 建筑搜索弹窗 -->
    <van-popup
      v-model="showPicker2"
      position="bottom"
      :style="{ height: '60%' }"
    >
      <van-field
        v-model="searchInput2"
        placeholder="请输入楼宇名称"
        right-icon="search"
        class="popupsearch"
        size="large"
        @input="getBuildings"
      />
      <van-list class="popuplist">
        <p
          class="deptinfos"
          v-for="item in buildings"
          :key="item.id"
          @click="setBuilding(item)"
        >
          {{ item.name }}
        </p>
      </van-list>
    </van-popup>
    <!-- 物品类型选择框 -->
    <van-popup v-model="showItemTypePicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="itemTypeColumns"
        @confirm="onItemTypeConfirmed"
        @cancel="showItemTypePicker = false"
      />
    </van-popup>
    <!-- 物品名字选择框 -->
    <van-popup v-model="showItemNamePicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="itemNameColumns"
        @confirm="onItemNameConfirm"
        @cancel="showItemNamePicker = false"
      />
    </van-popup>
    <!-- 完结指导流程弹窗 -->
    <van-dialog v-model="showFinishDialog" title="" :showConfirmButton="false">
      <div class="finishdiv">
        <h2>即将离开页面</h2>
        <p>您的问题已解决，即将离开当前页面。</p>
        <van-button class="finishbtn" type="info" @click="goBack"
          >确定</van-button
        >
      </div>
    </van-dialog>
    <!-- 图片指引弹窗 -->
    <van-dialog
      v-model="showGuideImgDialog"
      style="max-height: 80%; overflow: scroll"
      title=""
      :showConfirmButton="true"
    >
      <div class="finishdiv">
        <h2>{{ guideImgDialogTitle }}</h2>
        <img
          @click="showGuideImgs(index)"
          class="guideimgs"
          v-for="(url, index) in guideImgUrls"
          :src="url"
          :key="url"
          alt=""
        />
      </div>
    </van-dialog>
  </div>
</template>

<script>
let itemList = [];
import upload from "./attaches";
import { qusetionFlow } from "../assets/js/common";
import { ImagePreview } from "vant";
export default {
  data() {
    return {
      //指引窗口
      showGuideImgDialog: false,
      guideImgDialogTitle: "",
      guideImgUrls: [],

      issueFlow: [],
      showGuide: true,
      showReport: false,
      showFinishDialog: false,
      groupId: "",
      roominfodisabled: false,
      pubareainfodisabled: false,
      deptments: [],
      buildings: [],
      itemTypeColumns: [],
      itemTypeNameMap: {},
      showNamePicker: true,
      itemNameColumns: [],
      types: [
        // { name: "后勤", id: "1" },
        { name: "网络", id: "2" },
        // { name: "消防", id: "3" },
      ],
      areas: [
        { name: "学生公寓", id: "1" },
        { name: "学校其他楼宇", id: "2" },
        { name: "校园公共区域", id: "3" },
        // { name: "家属区", id: "4" },
      ],
      reportForm: {
        faulttype: "2",
        areatype: "1",
        note: "",
        mobile: "",
        id: null,
      },
      areaForm1: {
        areaname: "",
        roominfo: "",
        pubareainfo: "",
      },
      areaForm2: {
        areaname: "",
        roominfo: "",
        pubareainfo: "",
        itemnametype: "",
        itemname: "",
      },
      areaForm3: {
        areaname: "",
      },
      areaForm4: {
        areaname: "",
      },
      photos: [],
      showPicker: false,
      showPicker2: false,
      showItemTypePicker: false,
      showItemNamePicker: false,
      searchInput: "",
      searchInput2: "",
    };
  },
  props: {
    showIssueGuide: Boolean,
  },
  components: { upload },

  methods: {
    showGuideImgs(index) {
      ImagePreview({
        images: this.guideImgUrls,
        startPosition: index,
      });
    },
    goBack() {
      history.go(-1);
    },
    setRoomInfoState(val) {
      if (val) {
        this.pubareainfodisabled = true;
      } else {
        this.pubareainfodisabled = false;
      }
      this.$refs["reportform"].resetValidation("areaForm1pubareainfo");
    },
    setpubareaInfoState(val) {
      if (val) {
        this.roominfodisabled = true;
      } else {
        this.pubareainfodisabled = false;
      }
      this.$refs["reportform"].resetValidation("areaForm1roominfo");
    },
    //设置选中的物品类型附带的物品
    onItemTypeConfirmed(val) {
      this.areaForm2.itemnametype = val;
      this.showItemTypePicker = false;
      let nameId = itemList[_.findIndex(itemList, { name: val })].id;
      this.areaForm2.itemname = "";
      if (this.itemTypeNameMap[nameId].length) {
        this.showNamePicker = true;
        this.itemNameColumns = [];
        this.itemNameColumns = this.itemTypeNameMap[nameId];
      } else {
        this.showNamePicker = false;
      }
    },
    onItemNameConfirm(val) {
      this.areaForm2.itemname = val;
      this.showItemNamePicker = false;
    },
    //设置选中的公寓S
    setDeptment(item) {
      this.areaForm1.areaname = item.name;
      this.showPicker = false;
      // this.deptments = [];
    },
    //设置选中的楼层
    setBuilding(item) {
      this.areaForm2.areaname = item.name;
      this.showPicker2 = false;
      // this.buildings = [];
    },
    //搜索公寓
    searchDepts() {},
    //触发上传，验证表单获取值
    getFormData() {
      let _this = this;
      return new Promise((res, rej) => {
        _this.$refs["reportform"]
          .validate()
          .then((flag) => {
            //组装上传参数
            let formData = _.cloneDeep(this.reportForm);
            _.assign(formData, this[`areaForm${formData.areatype}`]);
            formData.groupId = this.groupId;
            if (this.photos.length) {
              formData.photos = this.photos.join(",");
            }
            //生成标题
            let title = `${
              this.areas[_.findIndex(this.areas, { id: formData.areatype })]
                .name
            }/`;
            title += `${formData.areaname}`;
            if (formData.areatype === "1" || formData.areatype === "2") {
              title += `/${formData.roominfo || formData.pubareainfo}`;
            }
            formData.title = title;
            // 生成物品类型
            // 南工程定制
            formData.itemname = _this.areaForm2.itemnametype;
            if (_this.showNamePicker) {
              formData.itemname += `/${_this.areaForm2.itemname}`;
            }

            res(formData);
          })
          .catch((err) => {});
      });
    },
    //设置录入下一条，清空一些表单
    setNext() {
      this.photos = [];
      this.reportForm.note = "";
    },
    //获取宿舍
    getDorms() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/area/areas",
          isRep: true,
          data: {
            type: "1",
            name: this.searchInput,
          },
        })
        .then((res) => {
          if (res.success) {
            this.deptments = res.data;
            this.areaForm1.areaname = localStorage.getItem("area") || "";
          }
        });
    },
    //获取学校建筑
    getBuildings() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/area/areas",
          isRep: true,
          data: {
            type: "2",
            name: this.searchInput2,
          },
        })
        .then((res) => {
          if (res.success) {
            this.buildings = res.data;
          }
        });
    },
    //获取草稿信息
    getDraftInfo() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/applydraft/findById",
          data: {
            id: this.reportForm.id,
          },
        })
        .then((res) => {
          if (res.success) {
            let draftInfo = res.data;
            //赋值基本信息
            this.reportForm.areatype = draftInfo.areatype;
            this.reportForm.faulttype = draftInfo.faulttype;
            this.reportForm.mobile = draftInfo.mobile;
            this.reportForm.note = draftInfo.note;
            if (draftInfo.photos) {
              this.photos = draftInfo.photos.split(",");
            }
            this[`areaForm${draftInfo.areatype}`] = {
              areaname: draftInfo.areaname || null,
              roominfo: draftInfo.roominfo || null,
              pubareainfo: draftInfo.pubareainfo || null,
            };
            this.areaForm2.itemnametype = draftInfo.itemname.split("/")[0];
            if (this.areaForm2.itemnametype) {
              this.onItemTypeConfirmed(this.areaForm2.itemnametype);
            }
            this.areaForm2.itemname = draftInfo.itemname.split("/")[1];
          }
        });
    },
    // 获取维修物品类型
    getItemInfos() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/item/items",
          isRep: true,
          data: {},
        })
        .then((res) => {
          if (res.success) {
            let { data } = res;
            itemList = data;
            _.forEach(data, (typeInfo) => {
              if (typeInfo.pid === "-1") {
                this.itemTypeColumns.push(typeInfo.name);
                !this.itemTypeNameMap[typeInfo.id] &&
                  (this.itemTypeNameMap[typeInfo.id] = []);
                // 创建映射
              } else {
                // 当是子类型时
                !this.itemTypeNameMap[typeInfo.pid] &&
                  (this.itemTypeNameMap[typeInfo.pid] = []);
                this.itemTypeNameMap[typeInfo.pid].push(typeInfo.name);
              }
            });
          }
        });
    },
    getOptions(qid, index, optionText) {
      let newIssueArr = [];
      newIssueArr = this.issueFlow;
      if (index !== this.issueFlow.length - 1) {
        //如果不是最后一个问题，那就要先把后面的全清除,再添加新问题
        newIssueArr = this.issueFlow.slice(0, index + 1);
        // this.issueFlow.splice(index + 1, this.issueFlow.length);
      }
      if (qid === "success") {
        this.saveSelfHelp(index, optionText);
        //直接结束报修流程
        this.showFinishDialog = true;
        return;
      }

      if (qid === "fail") {
        //开启报修流程表格
        this.saveSelfHelp(index, optionText);
        this.showReport = true;
        if (index !== this.issueFlow.length - 1) {
          this.issueFlow.splice(index + 1, this.issueFlow.length);
        }
        this.switchFormState(true);
        return;
      }
      if (qid !== "success" && qid !== "fail") {
        this.showReport = false;
        this.switchFormState(false);
        let newIssue = qusetionFlow[_.findIndex(qusetionFlow, { id: qid })];
        newIssueArr.push({ ...newIssue, checked: "" });
        this.issueFlow = newIssueArr;
        this.saveSelfHelp(index, optionText);
      }
    },
    saveSelfHelp(index, optionText) {
      let data = {
        groupid: this.groupId,
        item: this.issueFlow[index].question,
        itemid: this.issueFlow[index].id,
        option: optionText,
      };
      this.util.postAjax({
        code: this.global.code,
        url: "/helpself/save",
        isRep: true,
        data: data,
      });
    },
    switchFormState(flag) {
      this.showReport = flag;
      this.$emit("switchFormState", flag);
      if (flag) {
        let text = [];
        _.forEach(this.issueFlow, (issue, index) => {
          let notes = `${index + 1}.${issue.question}  ${issue.checked}`;
          text.push(notes);
        });
        this.reportForm.note = text.join("\n");
      }
    },
    getGroupId() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/helpself/getGroupId",
        })
        .then((res) => {
          if (res.success) {
            this.groupId = res.data;
          }
        });
    },
    showGuideImgInfo(imgs, title) {
      this.guideImgDialogTitle = title;
      this.guideImgUrls = _.map(imgs, (img) => {
        return `@/../static/flowImg/${img}.png`;
      });
      this.showGuideImgDialog = true;
    },
  },

  created() {
    this.reportForm.mobile = localStorage.getItem("mobile") || "";
    this.issueFlow.push({ ...qusetionFlow[0], checked: "" });
    this.getDorms();
    this.getBuildings();
    this.getItemInfos();
    this.getGroupId();
    if (this.$route.params.id && this.$route.params.id != 0) {
      this.reportForm.id = this.$route.params.id;
      this.getDraftInfo();
      this.showGuide = false;
      this.showReport = true;
    }
    if (!this.showIssueGuide) {
      this.showGuide = false;
      this.showReport = true;
    }
  },
};
</script>
<style lang='scss' scoped>
.reportform {
  margin-top: 6px;
  background-color: #fff;
  padding-bottom: 20px;
  & /deep/ .van-cell__title + .van-cell__value.van-field__value {
    display: none;
  }
  .selecters {
    margin-left: 15px;
  }
  .selectbtns {
    display: inline-block;
    margin-right: 15px;
    width: 104px;
    height: 40px;
    text-align: center;
    border-radius: 4px;
    line-height: 40px;
    border: 1px solid rgba(147, 146, 142, 1);
    color: rgba(147, 146, 142, 1);
    &.active {
      background-color: rgba(99, 141, 236, 1);
      border: 1px solid rgba(99, 141, 236, 1);
      color: #fff;
    }
  }
  .flexselectbtns {
    display: inline-block;
    margin-right: 6px;
    margin-top: 13px;
    padding: 0 10px;
    height: 40px;
    text-align: center;
    border-radius: 4px;
    line-height: 40px;
    border: 1px solid rgba(147, 146, 142, 1);
    color: rgba(147, 146, 142, 1);
    &.active {
      background-color: rgba(99, 141, 236, 1);
      border: 1px solid rgba(99, 141, 236, 1);
      color: #fff;
    }
  }
  .fieldbottom {
    padding: 0;
    margin: 0 16px;
    border-bottom: 1px solid rgba(219, 219, 219, 1);
    width: 90%;
  }
  & /deep/ .van-cell::after {
    border-bottom: 1px solid #fff;
  }
  .fieldbottom.deptname {
    margin-top: 16px;
    margin-bottom: 16px;
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
  .forms {
    padding: 0 16px;
    margin-top: 16px;
    .half {
      display: inline-block;
      width: 44%;
      height: 30px;
      line-height: 30px;
      margin: 0;
    }
    & > span {
      display: inline-block;
      width: 30px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      position: relative;
      top: -10px;
      font-size: 14px;
    }
  }
}
.forms.itemnames {
  margin-top: 0;
}
.popupsearch {
  width: 100%;
  position: fixed;
  top: 40%;
}
.deptinfos {
  margin-left: 23px;
  line-height: 16px;
  font-size: 14px;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.7);
}
.popuplist {
  margin-top: 60px;
}
.issueguide {
  width: 92%;
  background-color: #f6f6f6;
  margin: 0 auto;
  min-height: 150px;
}
.issues {
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 5px;
  padding-bottom: 5px;
  .questionlabel {
    & > span {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #666666;
    }

    & > i {
      color: #ff0000;
      display: inline-block;
      margin-right: 8px;
    }
  }
  .issueradios {
    margin-top: 12px;
    margin-left: 15px;
  }
  .textradios {
    margin-right: 40px;
    margin-bottom: 10px;
  }
}
.finishdiv {
  padding: 10%;
  & > h2 {
    font-size: 16px;
    font-weight: 600;
    color: #2a2e2e;
    text-align: center;
    margin-bottom: 16px;
  }
  & > p {
    font-size: 14px;
    width: 80%;
    margin: 0 auto;
    font-weight: 400;
    color: #5f6464;
  }
  .finishbtn {
    width: 180px;
    height: 40px;
    display: block;
    margin: 0 auto;
    margin-top: 40px;
  }
}
.issues .questionlabel .moreinfo {
  display: inline-block;
  width: 15px;
  height: 15px;
  text-align: center;
  line-height: 15px;
  color: #fff;
  background-color: #faad14;
  border-radius: 50%;
  font-style: normal;
}
.guideimgs {
  width: 100%;
  display: block;
  margin-bottom: 20px;
}
</style>