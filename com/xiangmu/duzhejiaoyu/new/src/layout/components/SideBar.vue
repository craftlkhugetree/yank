<template>
  <el-aside :width="collapse ? '75px' : '250px'" class="sidebar-container my-scroll">
    <div class="sidebar-logo">
      <img src="../../../static/images/logo.png" alt="logo" />
      <h1 v-if="!collapse">读者教育后台管理</h1>
    </div>
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
          <el-menu-item v-for="child in item.children" :key="child.ID" :index="child.DISPLAYURL">
            <i style="display: inline-block;margin-right: 8px" :class="child.ICONCLS"></i>
            <span slot="title">{{ child.NAME }}</span>
          </el-menu-item>
        </el-submenu>
      </template>
      <div style="height:80px;"></div>
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
    };
  },
  props: {
    collapse: {
      type: Boolean,
      default: false
    }
  },
  methods: {
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

    // 获取菜单数据
    getMeun() {
      this.loading = true;

      this.util
        .postAjax({
          code: this.global.menuCode,
          url: "Portal/getUserMenu",
          data: {
            menupid: "110000",
            
          }
        })
        .then(res => {
          this.loading = false;
          this.menuData = res;
          // 如果是刚进入系统，则跳转到第一个菜单
          // if (this.$route.path === "/") {
          //   let url=this.menuData[0].DISPLAYURL || this.menuData[0].children[0].DISPLAYURL
          //   this.$router.push(url);
          // }
          if(this.menuData.length<1)
            this.$router.push('/noAuth');
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
    line-height: 75px;
    color: #00CBA9;
    background: #3C435E;
    text-align: center;
    vertical-align: middle;
    /* padding: 12px 20px; */
    -webkit-box-sizing: border-box;
    box-sizing: border-box;


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

