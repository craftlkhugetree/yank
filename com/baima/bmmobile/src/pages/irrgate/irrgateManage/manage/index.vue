<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model="keyword" shape="round" placeholder="请输入资源编号" @search="onSearch" />
      <div class="select-group">
        <basic-select
          style="width: 50%"
          title="选择灌溉类型"
          :value="resTypeName"
          :list="resTypes"
          optionName="typename"
          optionValue="id"
          top="188px"
          @chooseItem="chooseResType"
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
        />-->
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
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;margin-top:10px;" :height="tableHeight">
      <el-table-column
        prop="restypename"
        label="灌溉类型"
        align="center"
        show-overflow-tooltip
        :formatter="common.defaultFormatter"
      ></el-table-column>
      <el-table-column
        prop="orgname"
        label="学院"
        align="center"
        show-overflow-tooltip
        :formatter="orgFormatter"
      ></el-table-column>
      <el-table-column prop="rescode" label="资源编号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="110">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toEdit(scope.row)">编辑</span>
          <span
            style="color:#fe3e61;padding:0 5px;font-weight:bold"
            @click="deleteRes(scope.row)"
          >删除</span>
        </template>
      </el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && tableData.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>

    <!-- 新增资源 -->
    <div class="btns">
      <van-button icon="plus" round type="primary" @click="toAdd">新增资源</van-button>
      <!-- <van-button icon="plus" round type="primary" @click="uploadFile">导入</van-button>
      <van-button icon="down" round type="primary" @click="downTemplate">导入模板</van-button>-->
    </div>

    <!-- 是否确定删除 -->
    <van-action-sheet
      v-model="showConfirmDelete"
      :actions="[{name: '确定删除', color: '#fe3e61'}]"
      @select="confirmDelete"
      cancel-text="取消"
    />

    <!-- 上传组件 -->
    <upload
      v-show="false"
      ref="upload"
      class="my-upload"
      :url="uploadUrl"
      :multiple="false"
      :exts="fileType"
      :isCarmera="true"
      @choose="choosefile"
      @done="finish"
    ></upload>
  </div>
</template>

<script>
import BasicSelect from "../../../../components/BasicSelect";
import upload from "../../../../components/BaseUpload";
import BasicSelectOrg from "../../../../components/BasicSelectOrg";
export default {
  components: {
    BasicSelect,
    upload,
    BasicSelectOrg
  },
  data() {
    return {
      activeTab: "manage",
      keyword: "",
      resType: "",
      resTypeName: "",
      resTypes: [],
      orgId: "",
      orgName: "",
      showOrgPicker: false,
      currentPage: 1,
      limit: 10,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false,
      showConfirmDelete: false,
      deleteRow: {},
      fileType: "xls|XLS|xlsx|XLSX",
      uploadUrl: window.g.bm + "/irres/importData"
    };
  },
  // computed: {
  //   orgList() {
  //     let list = this.$store.state.orgList;
  //     let data = [
  //       {
  //         name: "全部学院",
  //         id: ""
  //       }
  //     ];
  //     return data.concat(list);
  //   }
  // },
  watch: {
    resType() {
      this.getList(1);
    },
    orgId() {
      this.getList(1);
    }
  },
  methods: {
    // 搜索
    onSearch() {
      this.getList(1);
    },
    // 选择灌溉类型
    chooseResType(item) {
      this.resType = item.id;
      this.resTypeName = item.typename;
    },
    // 选择学院
    chooseOrg(item) {
      this.orgId = item.id;
      this.orgName = item.name;
    },
    // 转换学院名称
    orgFormatter(row, column, value) {
      return value ? value : "公共资源";
    },
    // 新增页面
    toAdd() {
      this.$router.push("/irrgate-manage/add");
    },
    // 编辑页面
    toEdit(row) {
      this.$router.push(
        `/irrgate-manage/edit/${row.id}?orgname=${row.orgname}`
      );
    },
    // 删除
    deleteRes(row) {
      this.showConfirmDelete = true;
      this.deleteRow = row;
    },
    // 确认删除
    confirmDelete(a, b) {
      this.$toast.loading({
        message: "删除中...",
        forbidClick: true,
        duration: 0
      });
      this.showConfirmDelete = false;
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/irres/deleteById?id=" + this.deleteRow.id
        })
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success("删除成功");
            this.getList(1);
          } else {
            this.$toast.fail("删除失败" + "\n" + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("删除失败" + "\n" + err);
        });
    },
    // 下载模板
    downTemplate() {
      let url = window.g.bm + "/irres/exportTemplate";
      window.location.href = url;
    },
    // 点击上传文件按钮
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 选择文件
    choosefile() {
      this.$toast.loading({
        message: "文件上传中...",
        forbidClick: true,
        duration: 0
      });
    },
    // 上传文件
    finish(res) {
      this.$toast.clear();
      if (res.success) {
        this.$toast.success("导入成功");
        this.getList(1);
      } else {
        this.$toast.fail("导入失败" + "\n" + res.message);
      }
    },
    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1).then(list => {
        this.tableData = this.tableData.concat(list);
      });
    },
    // 获取列表
    getList(page) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let params = {
          page: page,
          limit: this.limit
        };
        if(this.resType) {
          params.restypeid = this.resType
        }
        if(this.keyword) {
          params.rescode = this.keyword
        }
        if(this.orgId) {
          params.orgid = this.orgId
        }
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: "/irres/pageList?date=" + new Date().getTime(),
            data: {
              params: JSON.stringify(params)
            }
          })
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              let list = res.items || [];
              if (page === 1) {
                this.tableData = list;
              }
              this.finishTable = list.length < this.limit ? true : false;
              this.currentPage = page;
              resolve(list);
            } else {
              // this.finishTable = true;
              this.$toast.fail("获取数据失败" + "\n" + res.message);
              reject(res);
            }
          })
          .catch(err => {
            this.loading = false;
            // this.finishTable = true;
            // this.$toast.fail("获取数据失败" + "\n" + err);
            reject(err);
          });
      });
    },
    // 设置表格的高度
    setTableHeight() {
      this.$nextTick(() => {
        let domHeight = document.documentElement.clientHeight;
        let navBarHeight = this.$parent.$refs.navBar.offsetHeight;
        let tabsHeight = this.$parent.$refs.tabs.$el.offsetHeight;
        let searchBarHeight = this.$refs.searchBar.offsetHeight;
        let tabBarHeight = this.$parent.$parent.$refs.tabBar.$el.offsetHeight;
        this.tableHeight =
          domHeight -
          navBarHeight -
          tabsHeight -
          searchBarHeight -
          tabBarHeight -
          10;
      });
    }
  },
  created() {
    // 获取灌溉类型列表
    this.common.getResTypeList().then(res => {
      this.resTypes = res;
      this.resTypes.unshift({
        typename: "全部类型",
        id: ""
      });
    });
    // 获取学院列表
    // if (this.orgList.length === 0) {
    //   this.$sotre.dispatch("getOrgList").then(res => {
    //     this.orgList = res.unshift({
    //       name: "全部学院",
    //       id: ""
    //     });
    //   });
    // }
    // 获取列表
    this.getList(1);
  },
  mounted() {
    // 设置表格高度
    this.setTableHeight();
  }
};
</script>

<style lang="scss" scoped>
</style>