<template>
  <div>
    <van-nav-bar ref="navBar" title="资源管理" :border="false" left-arrow @click-left="goBack" />
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
          top="144px"
          @chooseItem="chooseUsestatus"
        />
        <!-- <basic-select
          style="width: 50%"
          title="选择学院"
          :value="orgName"
          :list="orgList"
          optionName="name"
          optionValue="id"
          top="144px"
          @chooseItem="chooseOrg"
        /> -->
        <basic-select-org
          style="width: 50%"
          :showPicker.sync="showOrgPicker"
          title="选择学院"
          :value="orgName"
          top="144px"
          @selectItem="chooseOrg"
          @click.stop="showOrgPicker = !showOrgPicker"
        ></basic-select-org>
      </div>
    </div>
    <!-- 表格 -->
    <res-table
      ref="resTable"
      style="margin-top:10px;"
      :id="id"
      :keyword="keyword"
      :usestatus="usestatus"
      :orgid="orgId"
      :tableHeight="tableHeight"
    ></res-table>
  </div>
</template>

<script>
import BasicSelect from "../../../components/BasicSelect";
import ResTable from "./resTable";
import BasicSelectOrg from "../../../components/BasicSelectOrg";
export default {
  components: {
    BasicSelect,
    ResTable,
    BasicSelectOrg
  },
  data() {
    return {
      keyword: "",
      usestatus: "",
      usestatusName: "",
      orgId: "",
      orgName: "",
      showOrgPicker: false,
      tableHeight: 0
    };
  },
  props: {
    id: String
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
    // 设置表格的高度
    setTableHeight() {
      this.$nextTick(() => {
        let domHeight = document.documentElement.clientHeight;
        let navBarHeight = this.$refs.navBar.offsetHeight;
        let searchBarHeight = this.$refs.searchBar.offsetHeight;
        this.tableHeight = domHeight - navBarHeight - searchBarHeight - 10;
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
  },
  mounted() {
    // 设置表格高度
    this.setTableHeight();
  }
};
</script>

<style lang="scss" scoped>
</style>