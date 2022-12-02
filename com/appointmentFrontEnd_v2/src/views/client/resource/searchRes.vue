<template>
  <div class="list_wrapper">
    <!---------------------------- 头部搜索 ---------------------------->
    <div class="header">
      <img class="logo" src="@/assets/img/logo-blue.png" alt="智慧校园预约平台" @click="jumperHome" />
      <el-input
        class="header-input"
        placeholder="请输入关键词查询"
        prefix-icon="el-icon-search"
        v-model="searchText"
        @keyup.enter.native="getResList"
      ></el-input>
      <div class="right-box">
        <router-link target="_blank" :to="{path:'/admin'}">
          <span class="gray-text">进入管理后台</span>
        </router-link>
        <el-divider direction="vertical"></el-divider>
        <el-dropdown @command="handleDown">
          <span class="el-dropdown-link">
            Hi，{{userInfo.NAME}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="jumpCenter">个人中心</el-dropdown-item>
            <el-dropdown-item command="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!---------------------------- 筛选条件 ---------------------------->
    <div class="head">
      <div class="head-box">
        <h2 class="h2_title">查找资源</h2>
        <div class="dropdown">
          <span class="client-gray-text">筛选：</span>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{resgroupName||'所有资源集'}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" align="center">
              <el-dropdown-item
                v-for="group in resGroupData"
                :key="group.id"
                :command="{id:group.id,name:group.name}"
              >{{ group.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!---------------------------- 有资源 ---------------------------->
    <main class="main">
      <template v-for="(res,index) in resList">
        <el-card
          :body-style="{ padding: '0px' }"
          :key="'elcard'+index"
          @click.native="jumpDetail(res)"
          :class="{'mgRt':(index+1)%6 !==0}"
        >
          <img :src="reviewImg(res.icon) " class="image" v-if="res.icon" />
          <img src="@/assets/img/no-img.png" class="image" v-else />
          <div style="padding: 14px;">
            <span class="name" v-html="ruleTitle(res.name)"></span>
          </div>
        </el-card>
      </template>
      <div class="pagination" v-if="currentPage>1">
        <el-pagination
          background
          layout="sizes, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[12,24,36,48]"
          :current-page.sync="currentPage"
          @current-change="page => getResList(page, pageSize)"
          @size-change="size => {pageSize = size; getResList(1, size)}"
        ></el-pagination>
      </div>
      <!---------------------------- 无资源 ---------------------------->
      <div class="nodata" v-if="total == 0">
        <img src="@/assets/img/nofind.png" alt />
        <p>没有找到</p>
      </div>
    </main>
    <footer-bar></footer-bar>
  </div>
</template>
<script>
import FooterBar from "@/layout/client/components/FooterBar";
import { fetchResGrouptList, fetchResList } from "@/api/client/resources.js";
export default {
  data() {
    return {
      resGroupData: [
        {
          name: "所有资源集",
          id: ""
        }
      ],
      searchText: "",
      resList: [],
      total: 0,
      pageSize: 12,
      currentPage: 1,
      resgroupName: "",
      resgroupid: ""
    };
  },
  components: {
    FooterBar
  },
  created() {},
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    curSearchText: function() {
      // 解决f5刷新会丢ID
      if (Object.keys(this.$route.params).length) {
        sessionStorage.setItem(
          "searchText",
          JSON.stringify(this.$route.params.searchText)
        );
      }
      let text = JSON.parse(sessionStorage.getItem("searchText"));
      return text;
    }
  },
  mounted() {
    this.getResGrouptList();
    this.searchText = this.curSearchText;
    this.getResList();
  },
  methods: {
    ruleTitle(name) {
      let titleString = name;
      if (!titleString) {
        return "";
      }
      if (this.searchText && this.searchText.length > 0) {
        // 匹配关键字正则
        let replaceReg = new RegExp(this.searchText, "g");
        // 高亮替换v-html值
        let replaceString = `<font color='#F56323'>${this.searchText}</font>`;
        // 开始替换
        titleString = titleString.replace(replaceReg, replaceString);
      }
      return titleString;
    },
    //跳转到详情页
    jumpDetail(curRes) {
      this.$router.push(`/detail/${curRes.id}`);
    },
    // 默认展示资源下的第一个图片
    reviewImg(icon) {
      let firstIcon = icon.split(",")[0];
      return `${window.g.viewUrl}${firstIcon}`;
    },
    //跳转到首页
    jumperHome() {
      this.$router.push({
        name: "home"
      });
    },

    handleDown(command) {
      if (command == "jumpCenter") {
        this.jumpCenter();
      } else if (command == "exit") {
        this.exit();
      }
    },
    //跳转到个人中心
    jumpCenter() {
      this.$router.push({
        name: "center",
        params: { type: "appoint" }
      });
    },
    // 退出
    exit() {
      sessionStorage.clear();
      location.href =
        location.protocol +
        "//" +
        location.host +
        "/appportalweb/rest/Idsclient/reqLogout?reqUrl=" +
        window.location.href;
    },
    //筛选
    handleCommand(command) {
      this.resgroupName = command.name;
      this.resgroupid = command.id;
      this.getResList();
    },

    //根据搜索文字和资源集 搜索资源
    getResList() {
      let params = {
        filter: {
          name: this.searchText,
          resgroupid: this.resgroupid,
          status: "1"
        },
        limit: this.pageSize,
        page: this.currentPage
      };
      fetchResList(params).then(res => {
        if (res.success) {
          this.resList = res.data;
          this.total = res.total;
        }
      });
    },

    // 获取全部资源集名称
    getResGrouptList() {
      fetchResGrouptList({}).then(res => {
        if (res.success) {
          let resSet = res.data;
          this.resGroupData = this.resGroupData.concat(resSet);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list_wrapper {
  margin-bottom: 100px;
}
.right-box {
  float: right;
  line-height: 60px;
}

.main {
  padding: 0 200px;
  width: 1200px;
}

.dropdown {
  margin-left: 10px;
  float: right;
}
span.el-dropdown-link.el-dropdown-selfdefine {
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: left;
}
.h2_title {
  color: #f56323;
  font-weight: 600;
  font-size: 20px;
  width: 80px;
  border-bottom: 5px solid #f56323;
  display: inline-block;
}

.name {
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.el-card {
  width: 180px;
  color: #474d51 !important;
  line-height: 20px;
  margin-bottom: 30px;

  display: inline-block;
  cursor: pointer;
  &:hover {
    font-weight: 600;
    color: #586add !important;
  }
}
.mgRt {
  margin-right: 20px;
}

.image {
  width: 180px;
  height: 135px;
  display: block;
}

.head {
  padding: 0 200px;
  margin: 0;
  height: 73px;
  background: #fafafa;
  margin-top: 120px;
  margin-bottom: 30px;
  color: #474d51;
  line-height: 70px;
  .head-box {
    width: 1200px;
  }
}

.header {
  height: 60px;
  background: #ffffff;
  box-shadow: 0px 8px 20px 0px rgba(98, 102, 130, 0.18);
  border-radius: 40px;
  padding: 0 40px;
  // position: fixed;
  position: absolute;
  top: 30px;
  z-index: 999;
  left: 200px;
  width: 1200px;
  .logo {
    width: 226px;
    height: 32px;
    vertical-align: middle;
    cursor: pointer;
  }
  .header-input {
    width: 320px;
    line-height: 60px;
    margin: 0 150px;
  }
  .header-input /deep/ input.el-input__inner {
    border: none !important;
    border-bottom: 1px solid #f2f2f2 !important;
  }
  .right-box {
    float: right;
    line-height: 60px;
  }
  .gray-text {
    font-weight: 400;
    color: #7d7d80;
    font-size: 14px;
  }
}
</style>
