<template>
  <el-aside :width="collapse ? '75px' : '250px'" class="sidebar-container">
    <div class="sidebar-logo">
      <img src="../../../static/images/logo.png" alt="logo" />
      <h1 v-if="!collapse">基地科教资源管理信息平台</h1>
    </div>
   <!-- <el-menu
      v-loading="loading"
      :default-active="'/' + $route.path.split('/')[1]"
      background-color="#1B2032"
      text-color="#B8BBBE"
      active-text-color="#FFFFFF"
      :collapse="collapse"
      :collapse-transition="false"
      mode="vertical"
      router
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="icomoon icon-menu-personal"></i>
          <span>泵水资源111</span>
        </template>
        <el-menu-item index="/irrigate-apply">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">教职工申请列表</span>
        </el-menu-item>
        <el-menu-item index="/irrigate-res-management">
          <i class="icomoon icon-menu-edit-records"></i>
          <span slot="title">灌溉资源管理</span>
        </el-menu-item>
         <el-menu-item index="/irrigate-audit">
           <i class="icomoon icon-menu-edit-records"></i>
           <span slot="title">白马办待审批列表</span>
         </el-menu-item>
         <el-menu-item index="/irrigate-worker">
           <i class="icomoon icon-menu-edit-records"></i>
           <span slot="title">水电工</span>
         </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="icomoon icon-menu-personal"></i>
          <span>农服农资服务信息</span>
        </template>
        <el-menu-item index="/post-info">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">白马办发布信息</span>
        </el-menu-item>
        <el-menu-item index="/view-info">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">教职工查看信息</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="icomoon icon-menu-personal"></i>
          <span>实习</span>
        </template>
        <el-menu-item index="/practive-apply">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">教职工申请</span>
        </el-menu-item>
        <el-menu-item index="/practive-leader-audit">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">单位领导审批</span>
        </el-menu-item>
        <el-menu-item index="/practive-BM-audit">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">白马办审批</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="icomoon icon-menu-personal"></i>
          <span>温室、网室、附属房</span>
        </template>
        <el-menu-item index="/resource-type-management">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">资源类型管理</span>
        </el-menu-item>
        <el-menu-item index="/resource-info-management">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">资源信息管理</span>
        </el-menu-item>
        <el-menu-item index="/resource-apply">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">资源信息申请</span>
        </el-menu-item>
        <el-menu-item index="/my-apply">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">申请记录</span>
        </el-menu-item>
        <el-menu-item index="/resource-leader-audit">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">单位领导审批</span>
        </el-menu-item>
        <el-menu-item index="/resource-BM-audit">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">白马办审批</span>
        </el-menu-item>
        <el-menu-item index="/repair-list">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">维修列表</span>
        </el-menu-item>
        <el-menu-item index="/repair-record-list">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">维修记录</span>
        </el-menu-item>
        <el-menu-item index="/rules">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">规则配置</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="icomoon icon-menu-personal"></i>
          <span>统计查询</span>
        </template>
        <el-menu-item index="/spresUse">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">资源使用情况总表</span>
        </el-menu-item>
        <el-menu-item index="/spresUseHistory">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">资源使用情况明细表</span>
        </el-menu-item>
        <el-menu-item index="/spresUsing">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">资源当前使用情况</span>
        </el-menu-item>
        <el-menu-item index="/spresRepair">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">故障报修统计</span>
        </el-menu-item>
        <el-menu-item index="/needPay">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">统计科教资源欠费</span>
        </el-menu-item>
        <el-menu-item index="/projectHistory">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">统计科研项目</span>
        </el-menu-item>
        <el-menu-item index="/prapply">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">统计本科生实习</span>
        </el-menu-item>
        <el-menu-item index="/irapply">
          <i class="icomoon icon-menu-all"></i>
          <span slot="title">统计水资源调配</span>
        </el-menu-item>

      </el-submenu>

       <el-menu-item index="/message">
           <i class="icomoon icon-menu-edit-records"></i>
           <span slot="title">消息通知</span>
         </el-menu-item>
    </el-menu> -->

    <el-menu v-loading="loading" :default-active="'/' + $route.path.split('/')[1]"
             background-color="#1B2032"
             text-color="#B8BBBE"
             active-text-color="#FFFFFF"
             :collapse="collapse"
             :collapse-transition="false"
             mode="vertical"
             router >
      <template v-for="item in menuData" >
        <el-menu-item v-if="item.ISLEAF === '1'" :key="item.ID" :index="urlFormat(item.DISPLAYURL)" @click="toUrl(item.DISPLAYURL)">
          <i style="display: inline-block;margin-right: 8px" :class="item.ICONCLS"></i>
          <span slot="title">{{ item.NAME }}</span>
        </el-menu-item>
        <el-submenu v-if="item.ISLEAF === '0'" :key="item.ID" :index="item.ID">
          <template slot="title">

            <i style="display: inline-block;margin-right: 8px" :class="item.ICONCLS"></i>
            <span>{{ item.NAME }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.ID"
            :index="child.DISPLAYURL"
          >
            <i style="display: inline-block;margin-right: 8px" :class="child.ICONCLS"></i>
            <span slot="title">{{ child.NAME }}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import menutree from "./menutree";

export default {
  name: "SideBar",
  components:{
    menutree
  },
  data() {
    return {
      loading: false,
      menuData: [],
      gid:""
    };
  },
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /*menuChange(index,path,route){
      // console.log(index);
      console.log(path);

      if(path[0] == "/rules"){
        // window.open(window.g.ApiUrl+"/view/JZUserGroupManager/userGroupManager.html");
        window.open(window.g.ApiUrl+"/view/JZUserGroupManager/userGroupManager.html");
      }else

    },*/

    urlFormat(url) {
      if (url) {
        if (url.includes("view/JZUserGroupManager/userGroupManager.html")) {
          return "";
        } else {
          return url;
        }
      } else {
        return "";
      }
    },

    // 跳转链接
    toUrl(path) {
      if (path.includes("view/JZUserGroupManager/userGroupManager.html")) {
        window.open(path, "_blank");
      } else {
        return;
      }
    },

    // 获取url上的字段
    GetQueryString(name) {
      let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      let r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },

    // 获取菜单数据
    getMeun() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.menuCode,
          url: "Portal/getUserMenu",
          data: {
            menupid: "16000-0",
            gid:this.gid
          }
        })
        .then(res => {
          this.loading = false;
          this.menuData = res;

          // 判断是学生、白马办还是后勤
          const repair = this.menuData.find(m => '在线报修' === m.NAME) || {};
          if (repair.children && repair.children[0]) {
            const url = repair.children[0].DISPLAYURL;
            const obj = {};
            if ('/repair/report' === url) {
              obj.start = 1;
            } else if ('/repair/bm_handle' === url) {
              obj.bm = 1;
            } else if ('/repair/hq_handle' === url) {
              obj.hq = 1;
            }
            sessionStorage.setItem('url4bizNode', JSON.stringify(obj))
          }

          // 判断是否有“用户组管理”，如果有则是管理员
          if(res.some(i => i.NAME === "用户组管理" )) {
            this.$store.commit("setIsAdmin", true);
          } else {
            this.$store.commit("setIsAdmin", false);
          }
          
         /* // 如果是刚进入系统，则跳转到第一个菜单
          if (this.$route.path === "/") {
            let url=this.menuData[0].DISPLAYURL || this.menuData[0].children[0].DISPLAYURL
            this.$router.push(url);
          }

*/

          let urlRouter = localStorage.getItem("urlRouter");
          // 如果是刚进入系统，则跳转到第一个菜单
          if (this.$route.path === "/") {
            // 从南农用户组进入时  会丢失掉gid参数  替换url中的&符号以保留gid参数
            let href = window.location.href
            if(href.includes("___")) {
              href = href.replace(/___/g,"&");
              window.location.href = href
            }
            // 判断是否存在路由
            if(urlRouter) {
              this.$router.push(urlRouter);
            } else {
              let url=this.menuData[0].DISPLAYURL || this.menuData[0].children[0].DISPLAYURL
              this.$router.push(url);
            }
          }

         if(urlRouter){
           localStorage.removeItem("urlRouter");
         }
          // console.log("menuData",this.menuData);
        });
    }
  },
  created() {
    this.gid = this.GetQueryString("gid_");
    this.getMeun();
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/variable.scss";
.sidebar-container {
  position: fixed;
  height: 100%;
  z-index: 100;
  overflow: hidden;
  transition: width 0.5s;

  .sidebar-logo {
    width: 100%;
    height: 75px;
    line-height: 55px;
    color: #00CBA9;
    background: #3C435E;
    text-align: center;
    vertical-align: middle;
    padding: 12px 20px;

    img {
      height: 29px;
      width: 29px;
      vertical-align: middle;
      margin-right: 10px;
      /*margin-top: 10px;*/
    }
    h1 {
      display: inline-block;
      font-size: $font-size-large-x;
      font-weight: 500;
      width: 165px;
      line-height: 20px;
      vertical-align: middle;
      text-align: left;
    }
  }
  
  .el-menu {
    width: 100%;
    height: 100%;
    padding-bottom: 80px;
    overflow: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.4);
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: transparent;
    }
    i {
      margin-right: 10px;
    }
    .el-icon-s-custom {
      font-size: 16px;
    }
    .el-menu-item {
      height: 52px;

      &.is-active {
        background: $sidebar-background-h !important;
        border-left: 4px solid $main-color;
        color: #ffffff !important;
        i::before {
          color: #ffffff;
        }
      }
      &:hover {
        background: $sidebar-background-h !important;
        color: #ffffff !important;
        i::before {
          color: #ffffff;
        }
      }
    }
  }
}
</style>

