
<template>
  <div class="search">
    <!-- 时间筛选 -->
    <div v-if="listType == 'dis'" style="margin-bottom:15px;">
      <label slot="label">提问时间：</label>
      <el-date-picker
        v-model="createTime"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyyMMdd"
        size="small"
        style="width:300px;margin-right:30px;"
        @change="search"
      ></el-date-picker>
      <label slot="label">回复时间：</label>
      <el-date-picker
        v-model="handleTime"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyyMMdd"
        size="small"
        style="width:300px;"
        @change="search"
      ></el-date-picker>
    </div>
    <!-- 类型筛选 -->
    <label slot="label">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</label>
    <div class="types" :class="{ selected: all }" @click="selectAll">全部</div>
    <div
      class="types"
      :class="{ selected: item.selected }"
      v-for="(item, index) in types"
      :key="item.type"
      @click="selectType(index)"
    >{{ item.name }}</div>
    <el-input
      prefix-icon="el-icon-search"
      size="small"
      class="historySearch"
      clearable
      v-model="input"
      @keypress.native.enter="search"
      placeholder="请输入关键字搜索"
      @clear="search"
    ></el-input>
    <!-- 业务领域筛选 -->
    <div style="margin-top:5px;" v-if="userDepts.length > 1">
      <label slot="label">业务领域：</label>
      <div class="types" :class="{ selected: allDepts }" @click="selectAllDepts">全部</div>
      <div
        class="types"
        :class="{ selected: item.selected }"
        v-for="(item, index) in userDepts"
        :key="item.ID"
        @click="selectDept(index)"
      >{{ item.NAME }}</div>
    </div>
    <div style="margin-top:5px;" v-if="userDepts.length == 1">
      <label slot="label">业务领域：</label>
      <div class="types selected">{{userDepts[0].NAME}}</div>
    </div>
    <!-- 二级 -->
    <div class="level-2" v-if="listType == 'dis' && handledeptids.length == 1">
      <div>
        <div class="more" @click="showMoreArea=!showMoreArea">
          {{showMoreArea ? "收起" : "更多"}}
          <i
            :class="showMoreArea ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          ></i>
        </div>
        <label slot="label">区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域：</label>
        <div class="level-2-box" :class="{'show-more': showMoreArea}">
          <span
            v-for="item in areaList"
            :key="item.id"
            :class="{'selected': areas.includes(item.id)}"
            @click="selectArea(item)"
          >{{item.name}}</span>
        </div>
      </div>
      <div>
        <div class="more" @click="showMoreQuest=!showMoreQuest">
          {{showMoreQuest ? "收起" : "更多"}}
          <i
            :class="showMoreQuest ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          ></i>
        </div>
        <label slot="label">问题类型：</label>
        <div class="level-2-box" :class="{'show-more': showMoreQuest}">
          <span
            v-for="item in questTypeList"
            :key="item.id"
            :class="{'selected': questTypes.includes(item.id)}"
            @click="selectQuestType(item)"
          >{{item.name}}</span>
        </div>
      </div>
    </div>
    <div style="margin-top:5px;" v-if="listType == 'dis'">
      <label slot="label">评价星级：</label>
      <div class="types" :class="{ selected: allStars }" @click="selectAllStars">全部</div>
      <div
        class="types"
        :class="{ selected: item.selected }"
        v-for="(item, index) in stars"
        :key="item.id"
        @click="selectStar(index)"
      >{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listType: String // 列表类型：待回复：task, 已回复： dis
  },
  data() {
    return {
      createTime: null,
      handleTime: null,
      types: [],
      userDepts: [],
      handledeptids: [],
      input: "",
      all: true,
      allDepts: true,
      areaList: [],
      areas: [],
      questTypeList: [],
      questTypes: [],
      showMoreArea: true,
      showMoreQuest: true,
      stars: [],
      markscores: [],
      allStars: true
    };
  },
  methods: {
    selectType(index) {
      let item = _.cloneDeep(this.types);
      _.forEach(item, type => {
        type.selected = false;
      });
      item[index].selected = true;
      this.all = false;
      this.types = item;
      // this.$set(this.types, index, item);
      this.search();
    },
    selectAll() {
      this.types = _.cloneDeep(this.$store.state.serviceTypes);
      _.forEach(this.types, (type, index) => {
        type.selected = false;
      });
      this.all = true;
      this.search();
    },
    selectDept(index) {
      _.forEach(this.userDepts, (dept, index) => {
        this.$set(dept, "selected", false);
      });
      let item = this.userDepts[index];
      item.selected = true;
      this.allDepts = false;
      this.handledeptids = [item.ID];
      this.getAreaList(item.ID);
      this.getQuestTypeList(item.ID);
      this.search();
    },
    selectAllDepts() {
      _.forEach(this.userDepts, dept => {
        dept.selected = false;
      });
      this.handledeptids = this.userDepts.map(i => i.ID);
      this.allDepts = true;
      this.search();
    },
    selectStar(index) {
      _.forEach(this.stars, (star, index) => {
        this.$set(star, "selected", false);
      });
      let item = this.stars[index];
      item.selected = true;
      this.allStars = false;
      this.markscores = [item.id];
      this.search();
    },
    selectAllStars() {
      _.forEach(this.stars, star => {
        star.selected = false;
      });
      this.markscores = [];
      this.allStars = true;
      this.search();
    },
    getData() {
      let selecteds = [];
      _.forEach(this.types, type => {
        type.selected && selecteds.push(type.type);
      });
      let data = {
        types: selecteds.join(","),
        handledeptids: this.handledeptids.join(","),
        areaids: this.areas.join(","),
        questtypeids: this.questTypes.join(","),
        markscore: this.markscores.join(","),
        title: this.input || null,
        starttime: this.createTime ? this.createTime[0] + "000000" : null,
        endtime: this.createTime ? this.createTime[1] + "235959" : null,
        handlestarttime: this.handleTime ? this.handleTime[0] + "000000" : null,
        handleendtime: this.handleTime ? this.handleTime[1] + "235959" : null
      };
      if (this.all) {
        data.types = null;
      }
      if (this.allStars) {
        data.markscores = null;
      }
      return data;
    },
    search() {
      this.$emit("search");
    },
    // 获取业务领域的区域
    getAreaList(deptId) {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/area/areas",
          isRep: true,
          data: {
            deptid: deptId
          }
        })
        .then(res => {
          if (res.success) {
            this.areaList = res.data || [];
          }
        });
    },
    // 获取业务领域的问题类型
    getQuestTypeList(deptId) {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/questtype/types",
          isRep: true,
          data: {
            deptid: deptId
          }
        })
        .then(res => {
          if (res.success) {
            this.questTypeList = res.data || [];
          }
        });
    },
    // 选择区域
    selectArea(item) {
      let index = this.areas.findIndex(i => i == item.id);
      if (index > -1) {
        this.areas.splice(index, 1);
      } else {
        this.areas.push(item.id);
      }
      this.search();
    },
    // 选择问题类型
    selectQuestType(item) {
      let index = this.questTypes.findIndex(i => i == item.id);
      if (index > -1) {
        this.questTypes.splice(index, 1);
      } else {
        this.questTypes.push(item.id);
      }
      this.search();
    }
  },
  mounted() {
    this.types = _.cloneDeep(this.$store.state.serviceTypes);
    _.forEach(this.types, (type, index) => {
      type.selected = false;
    });
    this.userDepts = _.cloneDeep(this.$store.state.userInfo.userOrgId);
    _.forEach(this.userDepts, (dept, index) => {
      this.$set(dept, "selected", false);
    });
    this.handledeptids = this.userDepts.map(i => i.ID);
    if (this.handledeptids.length == 1) {
      let id = this.handledeptids[0];
      this.getAreaList(id);
      this.getQuestTypeList(id);
    }
    this.stars = [];
    for (let i = 1; i < 6; i++) {
      this.stars.push({
        id: i,
        name: `${i}星`
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.types {
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  height: 32px;
  padding: 0 16px;
  text-align: center;
  font-size: 14px;
  color: #666666;
  line-height: 32px;
  background: #f6f6f6;
  border-radius: 3px;
  cursor: pointer;
}
.types.selected {
  background-color: rgba(231, 238, 254, 1);
  color: #3a78fc;
  background-image: url(../../../static/images/selected.png);
  background-repeat: no-repeat;
  background-position: right bottom;
}
.historySearch /deep/ input {
  background-color: #f6f6f6;
  border: none;
}
.historySearch {
  width: 200px;
  float: right;
}
.level-2 {
  margin: 16px 0 16px 72px;
  border: 1px solid #eeeeee;
  border-width: 1px 0;
  padding: 15px 0 0;
  color: #666666;
  font-size: 14px;
  font-weight: 400;
  & > div {
    position: relative;
    margin-bottom: 5px;
    line-height: 20px;
    .more {
      position: absolute;
      right: 0;
      color: #999;
      cursor: pointer;
    }
    .level-2-box {
      display: inline-block;
      width: calc(100% - 120px);
      vertical-align: top;
      height: 30px;
      overflow: hidden;
      &.show-more {
        height: auto;
      }
    }
    span {
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 10px;
      cursor: pointer;
      &.selected {
        color: #3a78fc;
      }
    }
  }
}
</style>