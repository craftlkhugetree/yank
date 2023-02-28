<template>
  <div style="min-height:800px;">
    <div class="title clearfix">
      <!------------------------- 查询区域 ------------------------->
      <div class="title-right">
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
        <el-select
          v-model="faulttype"
          placeholder="维修类型"
          size="small"
          clearable
          style="width:110px;"
        >
          <el-option
            v-for="item in repairTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="repairdeptid"
          placeholder="维修单位"
          size="small"
          clearable
          style="width:110px;"
        >
          <el-option v-for="item in deptList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
        </el-select>
        <el-select
          v-model="applystatus"
          placeholder="报修状态"
          size="small"
          clearable
          style="width:110px;"
        >
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
        <el-divider direction="vertical"></el-divider>
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          plain
          style="margin-left:2px;padding:9px 10px;"
          @click="downloadData"
        >导出</el-button>
      </div>
    </div>
    <el-row>
      <!------------------------- 待办理/已办理列表 ------------------------->
      <el-col :span="12">
        <list ref="list" :params="listParams" canDown @getTotal="getTotal"></list>
      </el-col>
      <!------------------------- 待办理/已办理详情 ------------------------->
      <el-col :span="12">
        <detail ref="detail" v-if="curItem.id" canDown :id="curItem.id" v-loading="loading"></detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import List from "../../repairManage/list";
import Detail from "../../repairManage/detail";
import CommonReply from "../../../components/CommonReply";
export default {
  components: {
    List,
    Detail,
    CommonReply
  },
  data() {
    return {
      dateTime: "",
      keyword: null,
      faulttype: null,
      repairdeptid: null,
      applystatus: null,
      loading: false,
      total: 0,
    };
  },
  computed: {
    // 用户部门
    // userDept() {
    //   return this.$store.state.userDept;
    // },
    // 维修单位列表
    deptList() {
      return this.$store.state.deptList;
    },
    // 维修类型列表
    repairTypeList() {
      return this.$store.state.repairTypeList;
    },
    // 维修状态
    statusList() {
      return this.$store.state.statusList;
    },
    // 列表查询参数
    listParams() {
      return {
        repairdeptid: this.repairdeptid || null,
        keyword: this.keyword || null,
        faulttype: this.faulttype || null,
        applystatus: this.applystatus || null,
        starttime: this.dateTime ? this.dateTime[0] + "000000" : null,
        endtime: this.dateTime ? this.dateTime[1] + "235959" : null
      };
    },
    // 当前报修单
    curItem() {
      return this.$store.state.curItem;
    }
  },
  methods: {
    getTotal(total) {
      this.total = total;
    },
    // 查询
    doSearch() {
      this.$refs.list.getList();
    },
    // 重置
    resetSearch() {
      this.keyword = null;
      this.dateTime = "";
      this.faulttype = null;
      this.applystatus = null;
    },
    // 导出
    downloadData() {
      let params = {
        repairdeptid: this.repairdeptid || "",
        keyword: this.keyword || "",
        faulttype: this.faulttype || "",
        applystatus: this.applystatus || "",
        starttime: this.dateTime ? this.dateTime[0] + "000000" : "",
        endtime: this.dateTime ? this.dateTime[1] + "235959" : ""
      };
      let queryParams = "";
      for (let key in params) {
        queryParams += `${key}=${params[key]}&`;
      }
      let url = `${window.g.url}apply/exportApply?${queryParams}`;
      window.open(url, "_blank");
    }
  }
};
</script>


<style lang="scss" scoped>
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
      &.active {
        color: #fd7d18;
        font-weight: 500;
        border-bottom: 2px solid #fd7d18;
      }
      &:hover {
        color: #fd7d18;
      }
    }
  }
  .title-right {
    float: right;
  }
}
.main-list {
  margin: 0 20px 20px;
}
.dept {
  margin-top: 10px;
  margin-bottom: 30px;
  img {
    width: 16px;
    height: 16px;
    vertical-align: text-bottom;
    margin-right: 5px;
  }
  span {
    color: #999;
  }
}
.el-divider {
  height: 32px;
  margin: 0 0 0 2px;
}
</style>