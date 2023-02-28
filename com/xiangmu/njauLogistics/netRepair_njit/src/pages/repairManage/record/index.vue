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
        <el-divider direction="vertical"></el-divider>
        <el-button
          class="orange-btn"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="$router.push('/repair-manage/record/record')"
        >报修录单</el-button>
      </div>
    </div>
    <el-row>
      <!------------------------- 列表 ------------------------->
      <el-col :span="12">
        <list v-if="userId" ref="list" :params="listParams" @getTotal="getTotal"></list>
      </el-col>
      <!------------------------- 详情 ------------------------->
      <el-col :span="12">
        <detail ref="detail" v-if="curItem.id" :id="curItem.id">
          <div class="dept">
            <el-button
              v-if="curItem.repairdeptid === userDept.ID && curItem.applystatus ==='1'"
              type="primary"
              size="small"
              @click="$router.push('/repair-manage/handle')"
            >
              <img src="@/../static/images/right-hand.png" alt />
              去办理
            </el-button>
            <span v-else>维修单位：{{common.deptFormat(curItem.repairdeptid)}}</span>
          </div>
        </detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import List from "../list";
import Detail from "../detail";
import CommonReply from "../../../components/CommonReply";
export default {
  components: {
    List,
    Detail,
    CommonReply
  },
  data() {
    return {
      total: 0,
      dateTime: "",
      keyword: null
    };
  },
  computed: {
    // 用户部门
    userDept() {
      return this.$store.state.userDept;
    },
    // 用户id
    userId() {
      return this.$store.state.userInfo.ID;
    },
    // 列表查询参数
    listParams() {
      return {
        applyerid: this.userId,
        applytype: "1",
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
</style>