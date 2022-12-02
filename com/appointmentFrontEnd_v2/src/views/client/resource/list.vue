<template>
  <div class="wrapper">
    <!---------------------------- 资源集tab---------------------------->
    <el-tabs class="nav-tab" @tab-click="toggle" v-model="activeId">
      <el-tab-pane
        v-for="(group, index) in resGroupData"
        :key="index"
        :label="group.name"
        :name="group.id"
      >
        <!---------------------------- 资源列表---------------------------->
        <section class="list-wapper">
          <main class="card-box">
            <template v-for="(res,index) in resData">
              <el-card
                :body-style="{ padding: '0px' }"
                :key="'elcard'+index"
                :class="{'card-margin':  index==0||index%3 !== 0 }"
                @click.native="jumpDetail(res)"
              >
                <img :src="reviewImg(res.icon) " class="image" v-if="res.icon" />
                <img src="@/assets/img/no-img.png" class="image" v-else />
                <div style="padding: 14px;">
                  <span class="res-name">{{res.name}}</span>
                </div>
              </el-card>
            </template>

            <div class="pagination-box" v-if=" currentPage>1">
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
          <aside class="aside" width="400px">
            <div class="manager-box">
              <span class="manager_icon"></span>
              <h4 class="title-h4 mg-bt30">管理办法</h4>
              <div class="manager-html" v-html="managerinfo" v-if="managerinfo"></div>
              <div class="manager" v-else>无</div>
            </div>
          </aside>
        </section>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { fetchResGrouptList, fetchResList } from "@/api/client/resources.js";
export default {
  data() {
    return {
      resData: [],
      managerinfo: "",
      tabs: [],
      activeId: "",
      total: 0,
      pageSize: 12,
      currentPage: 1
    };
  },
  components: {},
  created() {},
  computed: {
    activeGroup() {
      let group = JSON.parse(sessionStorage.getItem("activeGroup"));
      return group;
    },
    resGroupData() {
      let groupData = JSON.parse(sessionStorage.getItem("resGroupData"));
      return groupData;
    }
  },
  mounted() {
    if (this.activeGroup.id) {
      this.activeId = this.activeGroup.id;
      this.managerinfo = this.activeGroup.managerinfo;
    }
    this.getResList();
  },
  methods: {
    //跳转到详情页
    jumpDetail(curRes) {
      this.$router.push(`/detail/${curRes.id}`);
    },
    // 切换 tab
    toggle(tab, event) {
      let resSets = this.resGroupData;
      let resource = resSets.filter(v => v.id == tab.name)[0];
      this.managerinfo = resource.managerinfo;
      this.activeId = tab.name;
      this.currentPage = 1;
      this.pageSize = 12;
      this.getResList();
    },
    // 默认展示资源下的第一个图片
    reviewImg(icon) {
      let firstIcon = icon.split(",")[0];
      return `${window.g.viewUrl}${firstIcon}`;
    },

    //获取资源列表
    getResList() {
      let params = {
        filter: { resgroupid: this.activeId, status: "1" },
        limit: this.pageSize,
        page: this.currentPage
      };
      fetchResList(params).then(res => {
        if (res.success) {
          this.resData = res.data;
          this.total = res.total;
        }
      });
    }
  }
};
</script>
<style lang='scss'>
.manager-html {
  line-height: 26px;
  padding: 10px 0 20px;
  color: #474d51;
  border-top: 1px solid #f2f2f2;
  width: 360px;
  overflow-y: auto;
  h1 {
    font-size: 2em;
  }
  h2 {
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.17em;
  }
  h4 {
    font-size: 1em;
  }
  h5 {
    font-size: 0.83em;
  }
  p {
    font-size: 1em;
  }
  .placeholder {
    color: #d4d4d4;
    position: absolute;
    font-size: 11pt;
    line-height: 22px;
    left: 10px;
    top: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: -1;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  table,
  pre {
    margin: 10px 0;
    line-height: 1.5;
  }
  i {
    font-style: italic;
  }
  ul,
  ol {
    margin: 10px 0 10px 20px;
  }
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }
  code {
    display: inline-block;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
    min-height: 30px;
    height: 30px;
  }
  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
    background-color: #f1f1f1;
  }
  :focus {
    outline: none;
  }
  img {
    cursor: pointer;
  }
  img:hover {
    box-shadow: 0 0 5px #333;
  }

  li {
    list-style: none;
    font-size: 1em;
  }
  li span:nth-child(1) {
    position: relative;
    left: -18px;
  }
  li span:nth-child(1) input {
    position: absolute;
    margin-right: 3px;
  }
  li span:nth-child(1) input[type="checkbox"] {
    top: 50%;
    margin-top: -6px;
  }
}
</style>

<style lang="scss" scoped>
.list-wapper {
  min-height: 740px;
  width: 1250px;
  display: block;
  padding: 10px;
  margin-left: 200px;
}
.card-box {
  float: left;
  width: 800px;
}
.aside {
  width: 400px;
  float: right;
  margin-right: 20px;
  margin-bottom: 20px;
  .manager-box {
    width: 400px;
    background: #ffffff;
    border: 1px solid #f2f2f2;
    padding: 20px;
  }
  .manager_icon {
    position: absolute;
    width: 32px;
    height: 32px;
    background: url("~@/assets/img/read.png") no-repeat right;
    background-size: cover;
  }
  // .manager {
  //   line-height: 26px;
  //   padding: 10px 0 20px;
  //   color: #474d51;
  //   border-top: 1px solid #f2f2f2;
  //   width: 360px;
  //   /deep/ h1 {
  //     font-size: 2em !important;
  //   }
  //   /deep/ h2 {
  //     font-size: 1.5em !important;
  //   }
  //   /deep/ h3 {
  //     font-size: 1.17em !important;
  //   }
  //   /deep/ h4 {
  //     font-size: 1em !important;
  //   }
  //   /deep/ h5 {
  //     font-size: 0.83em !important;
  //   }
  //   /deep/ p {
  //     font-size: 1em !important;
  //   }
  // }
}

.nav-tab {
  margin: 0;
  height: 73px;
  background: #fafafa;
  margin-top: 120px;
  margin-bottom: 30px;
}

.nav-tab /deep/ .el-tabs__item {
  font-size: 20px;
  color: #474d51;
  line-height: 70px;
}
.nav-tab /deep/ .el-tabs__header.is-top {
  padding: 0 200px;
}
.nav-tab.el-tabs.el-tabs--top {
  line-height: 60px;
}
.nav-tab /deep/ .el-tabs__nav-next,
.nav-tab /deep/ .el-tabs__nav-prev {
  font-size: 20px;
  line-height: 70px;
}
.nav-tab /deep/ .el-tabs__item.is-active {
  color: #f56323;
  font-weight: 600;
}
.nav-tab /deep/ .el-tabs__active-bar {
  height: 5px;
  background-color: #f56323;
}
.nav-tab /deep/ .el-tabs__nav-wrap.is-scrollable {
  padding: 0 25px;
}
.nav-tab /deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
.nav-tab-item {
  margin: 0;
  float: left;
  list-style: none;
  position: relative;
  cursor: pointer;
  margin-left: 40px;
}

.title-h4 {
  font-size: 20px;
  font-weight: 600;
  color: #474d51;
  line-height: 30px;
  margin-left: 40px;
  margin-bottom: 20px;
}

.res-name {
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
  // margin-bottom: 30px;

  display: inline-block;
  cursor: pointer;
  &:hover {
    font-weight: 600;
    color: #586add !important;
  }
  .image {
    width: 180px;
    height: 135px;
    display: block;
  }
}
.card-margin {
  margin-right: 20px;
}

.pagination-box {
  background: #fff;
  text-align: right;
  padding-right: 20px;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #3f86f7;
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background: #fff;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.15);
}
</style>
