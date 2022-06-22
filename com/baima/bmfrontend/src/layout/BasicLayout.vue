<template>
  <el-container class="app-wrapper">
    <side-bar :collapse="collapse"></side-bar>
    <el-container class="main-container" style="width: 100%;position: relative" :class="{'padding-left-75': collapse,'padding-left-250': !collapse}">
      <el-header>
        <img
          :class="{'collapse-img': collapse}"
          src="../../static/images/collaps.png"
          @click="changeCollapse"
        />
        <!--<el-breadcrumb separator="/" style="display: inline-block;margin-left: 40px">
         &lt;!&ndash; <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">泵水资源</el-breadcrumb-item>
          <el-breadcrumb-item>教职工申请列表</el-breadcrumb-item>&ndash;&gt;
          <el-breadcrumb-item v-for="(item,index) in breadList" :key="index" :to="item.path">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>-->
        <header-bar></header-bar>
      </el-header>
      <el-main style="width: 100%;white-space: nowrap;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideBar from "./components/SideBar";
import HeaderBar from "./components/HeaderBar";
export default {
  name: "BasicLayout",
  props:{
    name:String
  },
  components: {
    SideBar,
    HeaderBar
  },
  data() {
    return {
      collapse: false,
      breadList:[
        {path:"/",name:"灌溉用水"},
        {path:"/",name:"水资源管理"}
        ]
    };
  },
  methods: {
    changeCollapse() {
      this.collapse = !this.collapse;
    }
  },
  created() {
    // console.log("name",sessionStorage.getItem("name"));
  }
};
</script>

<style lang="scss" scpoed>
@import "../assets/css/mixin.scss";
@import "../assets/css/variable.scss";
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .padding-left-250 {
    padding-left: 250px;
  }
  .padding-left-75 {
    padding-left: 75px;
  }

  .main-container {
    min-width: 1000px;
    @include clearfix;
    transition: padding 0.5s;
    .el-main {
      padding: 20px;
    }
    .el-header {
      background: $container-background;
      height: 75px !important;
      line-height: 75px;
      width: 100%;
      box-shadow: 0 2px 8px 0 $container-box-shadow;
      z-index: 500;
      > img {
        width: 24px;
        cursor: pointer;
        &.collapse-img {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
