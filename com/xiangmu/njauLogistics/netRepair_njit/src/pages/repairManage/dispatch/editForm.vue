<template>
  <el-form
    class="edit-form"
    :model="editForm"
    ref="editForm"
    :rules="rules1"
    label-position="top"
    style="width:80%;"
  >
    <el-form-item
      label="选择操作："
      prop="handletype"
      style="margin-bottom: 10px"
    >
      <el-radio-group v-model="editForm.handletype" @change="changeHandleType">
        <el-radio v-for="item in handleList" :key="item.id" :label="item.id">{{
          item.name
        }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="维修人："
      prop="repairerid"
      v-if="editForm.handletype === '1'"
    >
      <el-input v-model="editForm.repairerid" v-show="false"></el-input>
      <div class="flex-div">
        <span
          class="user-tag"
          :class="{ active: editForm.repairerid === item.ID }"
          v-for="item in repairerList"
          :key="item.ID"
          @click="chooseRepairer(item)"
          >{{ item.NAME }}</span
        >
      </div>
    </el-form-item>
    <el-form-item
      label="维修时间："
      prop="starttime"
      v-if="editForm.handletype === '1'"
    >
      <el-date-picker
        v-model="editForm.starttime"
        type="date"
        placeholder="选择日期"
        value-format="yyyyMMdd"
        style="width:375px;"
      ></el-date-picker>
    </el-form-item>
    <el-form-item
      :label="replyLabel"
      prop="sendnote"
      style="margin-bottom: 10px"
      v-if="['1', '2', '3', '5'].includes(editForm.handletype)"
    >
      <el-input
        v-model="editForm.sendnote"
        type="textarea"
        maxlength="200"
        rows="5"
        resize="none"
        placeholder="请输入说明，不超过200字"
      ></el-input>
    </el-form-item>
    <common-reply
      :type="replyType"
      @doFunc="chooseReply"
      v-if="['1', '2', '3', '5'].includes(editForm.handletype)"
    ></common-reply>
    <el-form-item
      label="关联单"
      prop="repairid"
      v-if="editForm.handletype === '4'"
    >
      <el-select
        v-model="editForm.repairid"
        placeholder="请选择"
        size="small"
        clearable
        filterable
        style="width:375px;"
      >
        <el-option
          v-for="item in repairList"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        >
          <el-tooltip
            :content="item.relationApplys[0].note"
            placement="right-start"
          >
            <span>{{ item.title }}</span>
          </el-tooltip>
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import CommonReply from "../../../components/CommonReply";
export default {
  components: {
    CommonReply
  },
  props: {
    operType: {
      // add 为办理  edit 为修改
      type: String,
      default: "add"
    }
  },
  data() {
    return {
      editForm: {
        handletype: "1",
        repairerid: "",
        repairername: "",
        starttime: "",
        sendnote: "",
        repairid: ""
      },
      rules1: {
        handletype: [
          { required: true, trigger: "change", message: "请选择操作！" }
        ],
        repairerid: [
          { required: true, trigger: "change", message: "请选择维修人！" }
        ],
        starttime: [
          { required: true, trigger: "change", message: "请选择维修时间！" }
        ],
        repairid: [
          { required: true, trigger: "change", message: "请选择关联单！" }
        ]
      },
      repairerList: [], // 维修工列表
      repairList: [] // 维修单列表
    };
  },
  computed: {
    // 用户部门
    userDept() {
      return this.$store.state.userDept;
    },
    // 操作列表
    handleList() {
      let data = [
        { id: "1", name: "重新派单" },
        { id: "3", name: "暂不维修" }
      ];
      return this.operType === "edit" ? data : this.$store.state.handleList;
    },
    // 常用回复类型 1退回 2撤回 3派单 4已维修 5暂不维修 6不维修
    replyType() {
      let data = "";
      // 操作：1派单 4重复报修 3暂不维修 2已维修 5不维修
      switch (this.editForm.handletype) {
        case "1":
          data = "3";
          break;
        case "2":
          data = "4";
          break;
        case "3":
          data = "5";
          break;
        case "4":
          data = "";
          break;
        case "5":
          data = "6";
          break;
        default:
          data = "";
      }
      return data;
    },
    replyLabel() {
      // let data = this.editForm.handletype === "3" ? "暂停说明：" : "维修说明：";
      let data = "维修说明：";
      switch (this.editForm.handletype) {
        case "3":
          data = "暂停说明：";
          break;
        case "5":
          data = "不维修说明：";
          break;
        default:
          data = "维修说明：";
      }
      return data;
    }
  },
  watch: {
    userDept() {
      this.getRepairerList();
      this.getRepairList();
    },
    item() {
      this.initData(this.item);
    }
  },
  methods: {
    // 选择操作
    changeHandleType(val) {
      this.$refs.editForm.resetFields();
      this.editForm.handletype = val;
      if (val == "4") {
        this.getRepairList();
      }
    },
    // 选择维修人
    chooseRepairer(item) {
      this.editForm.repairerid = item.ID;
      this.editForm.repairername = item.NAME;
    },
    // 选择办理回复
    chooseReply(content) {
      this.editForm.sendnote = content;
    },
    // 维修工列表
    getRepairerList() {
      this.util
        .postAjax({
          code: this.global.authCode,
          url: "rest/UserGroup/getUserByGroup2Role",
          data: {
            GROUPID: this.userDept.ID,
            ROLEID: `${this.util.webUserID}-4`
          }
        })
        .then(res => {
          if (res.success) {
            // res = {
            //   total: 29,
            //   success: true,
            //   message: "成功",
            //   items: [
            //     {
            //       SEX: "0",
            //       ID: "W0700016",
            //       LOGINNAME: "W0700016",
            //       NAME: "宿舍空调-张宏耀 "
            //     },
            //     { SEX: "0", ID: "00281", LOGINNAME: "00281", NAME: "张军" },
            //     {
            //       SEX: "0",
            //       ID: "H1000007",
            //       LOGINNAME: "H1000007",
            //       NAME: "木工-朱发宏"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H1000002",
            //       LOGINNAME: "H1000002",
            //       NAME: "木工-赵光文"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "Y1000001",
            //       LOGINNAME: "Y1000001",
            //       NAME: "木工-赵光荣"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H1000012",
            //       LOGINNAME: "H1000012",
            //       NAME: "木工-邓海鹏"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H1000013",
            //       LOGINNAME: "H1000013",
            //       NAME: "水电-刘文奕"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H1000011",
            //       LOGINNAME: "H1000011",
            //       NAME: "水电-夏可义"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H1000005",
            //       LOGINNAME: "H1000005",
            //       NAME: "水电-孙银久"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H1000004",
            //       LOGINNAME: "H1000004",
            //       NAME: "水电-张正富"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H1000015",
            //       LOGINNAME: "H1000015",
            //       NAME: "水电-彭立军"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H1000001",
            //       LOGINNAME: "H1000001",
            //       NAME: "水电-章从文"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "W0900004",
            //       LOGINNAME: "W0900004",
            //       NAME: "热水-刘小明 "
            //     },
            //     {
            //       SEX: "0",
            //       ID: "W0900003",
            //       LOGINNAME: "W0900003",
            //       NAME: "热水-左滨"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "W0900005",
            //       LOGINNAME: "W0900005",
            //       NAME: "热水-杜克发 "
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H0900007",
            //       LOGINNAME: "H0900007",
            //       NAME: "热水-杨超"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "W0900001",
            //       LOGINNAME: "W0900001",
            //       NAME: "热水-赵伟连 "
            //     },
            //     { SEX: "0", ID: "00237", LOGINNAME: "00237", NAME: "王军" },
            //     { SEX: "0", ID: "80354", LOGINNAME: "80354", NAME: "王赵冲" },
            //     {
            //       SEX: "0",
            //       ID: "H0900005",
            //       LOGINNAME: "H0900005",
            //       NAME: "用电-刘强 "
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H0900019",
            //       LOGINNAME: "H0900019",
            //       NAME: "用电-李徽琳 "
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H0900008",
            //       LOGINNAME: "H0900008",
            //       NAME: "用电-汤文迪 "
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H0900016",
            //       LOGINNAME: "H0900016",
            //       NAME: "用电-邱豪 "
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H0900015",
            //       LOGINNAME: "H0900015",
            //       NAME: "用电-陈杨 "
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H0900004",
            //       LOGINNAME: "H0900004",
            //       NAME: "用电-顾君 "
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H0900025",
            //       LOGINNAME: "H0900025",
            //       NAME: "电梯-濮成伟"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H0900012",
            //       LOGINNAME: "H0900012",
            //       NAME: "空调-刘义鹏"
            //     },
            //     {
            //       SEX: "0",
            //       ID: "H0900018",
            //       LOGINNAME: "H0900018",
            //       NAME: "路灯-陆佳荣 "
            //     },
            //     { SEX: "0", ID: "00408", LOGINNAME: "00408", NAME: "陆兴华" }
            //   ]
            // };
            this.repairerList = res.items || [];
          }
        });
    },
    // 维修单列表
    getRepairList() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "repair/repairs",
          isRep: true,
          data: {
            repairdeptid: this.userDept.ID,
            status: '1'
          }
        })
        .then(res => {
          if (res.success) {
            let data = res.data || [];
            // this.repairList = data.filter(i => i.status === "1");
            this.repairList = data
          }
        });
    }
  },
  mounted() {
    if (this.userDept.ID) {
      this.getRepairerList();
      this.getRepairList();
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-div {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .user-tag {
    padding: 6px 10px;
    color: #666;
    font-size: 12px;
    line-height: 16px;
    border: 1px solid #dbdbdb;
    border-radius: 16px;
    margin: 0 10px 10px 0;
    cursor: pointer;
    white-space: nowrap;
    &.active {
      color: #638dec;
      border-color: #638dec;
      background: #eff3fd;
    }
  }
}
</style>
