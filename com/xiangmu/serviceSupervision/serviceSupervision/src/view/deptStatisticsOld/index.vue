<template>
  <div class="main-div" >
    <div class="left-div" >
      <el-menu
        :default-active="$route.path"
        text-color="#464032"
        active-text-color="#3A78FC"
        active-background-color="#F0F5FF"
        router
      >
        <!-- <template v-for="item in menuData">
          <el-submenu v-if="item.ISLEAF" :key="item.ID" :index="item.ID">
            <template slot="title">
              <i class="iconfont" :class="item.ICON"></i>
              <span slot="title">{{item.NAME}}</span>
            </template>
            
          </el-submenu>
          <el-menu-item v-if="item.ISLEAF === '1'" :key="item.ID" :index="item.DISPLAYURL">
            <i class="iconfont" :class="item.ICON"></i>
            <span slot="title">{{item.NAME}}</span>
          </el-menu-item>
        </template> -->
        <el-menu-item
          class="submenu-item"
          v-for="item in menuData"
          :key="item.ID"
          :index="item.DISPLAYURL"
          @click="setHeight"
        >
          <span slot="title" >{{ item.NAME }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right-div" ref="rightdiv">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightHeight: 758,
      menuData: [
        {
          ID: "1",
          NAME: "提问量统计",
          DISPLAYURL: "/deptsysStatistics/deptQusetionAmount",
        },
        {
          ID: "2",
          NAME: "提问类型统计",
          DISPLAYURL: "/deptsysStatistics/deptQuestionType",
        },
        {
          ID: "3",
          NAME: "业务领域统计",
          DISPLAYURL: "/deptsysStatistics/deptQuestionArea",
        },
        {
          ID: "4",
          NAME: "提问内容统计",
          DISPLAYURL: "/deptsysStatistics/deptHotWord",
        },
        {
          ID: "5",
          NAME: "回复统计",
          DISPLAYURL: "/deptsysStatistics/deptReplies",
        },
        {
          ID: "6",
          NAME: "评价统计",
          DISPLAYURL: "/deptsysStatistics/deptRates",
        },
      ],
    };
  },
  methods: {
    setHeight() {
      setTimeout(() => {
        this.rightHeight = this.$refs["rightdiv"].clientHeight + 20;
      }, 500);
    },
  },
  mounted() {
    this.setHeight();
  },
};
</script>

<style lang="scss" scoped>
.main-div::after {
  clear: both;
  content: "";
  display: block;
}
.main-div {
  width: 100%;
  height: auto;
  overflow: auto;
  margin: 0 auto;
  
  background-color: #FFF;
  .right-div {
    background: rgba(246, 246, 246, 1);
  }
  .left-div {
    background-color: #fff;
    width: 200px;
    float: left;
    height: 100%;
    padding: 10px 0;
    border-right: 1px solid rgba(0, 0, 0, 0.15);
    .el-menu {
      border: none;
      .el-menu-item {
        &.is-active {
          font-weight: bold;
          background: #f0f5ff;
          border-right: 3px solid #3a78fc;
        }
      }
    }
  }
  .right-div {
    padding-top: 20px;
    width: calc(100% - 200px);
    float: left;
  }
}
</style>