<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
      <div class="select-group">
        <basic-select
          style="width: 50%"
          title="选择状态"
          :value="usestatusName"
          :list="usestatusList"
          optionName="name"
          optionValue="id"
          top="188px"
          @chooseItem="chooseUsestatus"
        />
        <!-- <basic-select
          style="width: 50%"
          title="选择学院"
          :value="orgName"
          :list="orgList"
          optionName="name"
          optionValue="id"
          top="188px"
          @chooseItem="chooseOrg"
        /> -->
        <basic-select-org
          style="width: 50%"
          :showPicker.sync="showOrgPicker"
          title="选择学院"
          :value="orgName"
          top="188px"
          @selectItem="chooseOrg"
          @click.stop="showOrgPicker = !showOrgPicker"
        ></basic-select-org>
      </div>
    </div>
    <!-- tab标签页 -->
    <div class="tabs more-tabs" ref="tableTabs">
      <li
        class="ellipsis"
        :class="{'active': activeTab === item.id}"
        v-for="(item,index) in tabs"
        :key="item.id"
        @click="changeTab(item,index)"
      >{{item.name}}</li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <res-table
      ref="resTable"
      v-if="activeTab"
      :id="activeTab"
      :keyword="keyword"
      :usestatus="usestatus"
      :orgid="orgId"
      :tableHeight="tableHeight"
    ></res-table>
  </div>
</template>

<script>
import BasicSelect from "../../../components/BasicSelect";
import ResTable from "../resInfoMange/resTable";
import BasicSelectOrg from "../../../components/BasicSelectOrg";
export default {
  components: {
    BasicSelect,
    ResTable,
    BasicSelectOrg
  },
  data() {
    return {
      activeTab: "",
      tabs: [],
      keyword: "",
      usestatus: "",
      usestatusName: "",
      orgId: "",
      orgName: "",
      showOrgPicker: false,
      tableHeight: 0
    };
  },
  computed: {
    usestatusList() {
      let list = this.$store.state.usestatus;
      let data = [{ name: "全部状态", id: "" }];
      return data.concat(list);
    },
    // orgList() {
    //   let list = this.$store.state.orgList;
    //   let data = [{ name: "全部学院", id: "" }];
    //   return data.concat(list);
    // }
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 搜索
    onSearch() {
      this.$refs.resTable.getList(1);
    },
    // 选择状态
    chooseUsestatus(item) {
      this.usestatus = item.id;
      this.usestatusName = item.name;
    },
    // 选择学院
    chooseOrg(item) {
      this.orgId = item.id;
      this.orgName = item.name;
    },
    // 切换tab
    changeTab(item, index) {
      this.activeTab = item.id;
      this.scrollToTab(index);
      sessionStorage.setItem("curEduResTab", this.activeTab);
    },
    // 滚动Tab
    scrollToTab(index) {
      let clientWidth = document.documentElement.offsetWidth;
      let tabs = this.$refs.tableTabs;
      let curLi = tabs.getElementsByTagName("li")[index];
      let curWidth = curLi.offsetWidth + curLi.offsetLeft;
      if (
        curWidth > clientWidth - 50 &&
        curLi.offsetLeft >= tabs.scrollLeft + 50
      ) {
        // 当前tab左侧距离+自身宽度 > 屏幕宽度 并且 当前tab左侧距离 > tabs滚动距离 时，tabs向左滚动
        tabs.scrollLeft += curLi.offsetWidth;
      } else if (curLi.offsetLeft <= tabs.scrollLeft + 50) {
        // 当前tab左侧距离 < tabs滚动距离，tabs向左滚动
        tabs.scrollLeft -= curLi.offsetWidth;
      }
      sessionStorage.setItem("tabScroll", tabs.scrollLeft);
    },
    // 设置表格的高度
    setTableHeight() {
      this.$nextTick(() => {
        let domHeight = document.documentElement.clientHeight;
        let navBarHeight = this.$parent.$refs.navBar.offsetHeight;
        let tabsHeight = this.$parent.$refs.tabs.$el.offsetHeight;
        let searchBarHeight = this.$refs.searchBar.offsetHeight;
        let tableTabsHeight = this.$refs.tableTabs.offsetHeight;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight;
        this.tableHeight =
          domHeight -
          navBarHeight -
          tabsHeight -
          searchBarHeight -
          tableTabsHeight -
          tabBarHeight -
          20;
      });
    }
  },
  created() {
    // 获取学院列表
    // if (this.orgList.length === 0) {
    //   this.$sotre.dispatch("getOrgList").then(res => {
    //     this.orgList = res.unshift({
    //       name: "全部学院",
    //       id: ""
    //     });
    //   });
    // }
    // 获取资源类型列表
    this.common
      .getEduResTypeList()
      .then(res => {
        this.tabs = res;
        this.$nextTick(() => {
          // 判断是否存在当前tab的缓存
          let curEduResTab = sessionStorage.getItem("curEduResTab");
          if (curEduResTab && curEduResTab !== undefined) {
            this.activeTab = curEduResTab;
          } else {
            this.activeTab = res[0] ? res[0].id : "";
          }
          sessionStorage.setItem("curEduResTab", this.activeTab);

          // tab滚动到当前tab
          this.$refs.tableTabs.scrollLeft =
            sessionStorage.getItem("tabScroll") || 0;

          // 设置表格高度
          this.setTableHeight();
        });
      })
      .catch(() => {});
  }
};
</script>

<style lang="scss" scoped>
</style>