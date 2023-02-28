<template>
  <div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" :height="tableHeight" :border="false">
      <!-- <el-table-column type="selection" width="45" align="center" fixed="left"></el-table-column> -->
      <el-table-column
        prop="rescode"
        label="资源编号"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="area"
        label="面积(m²)"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="price"
        :label="'单价(元/' + typeDetail.chargecycle + '/' + typeDetail.chargetype + ')'"
        align="center"
        show-overflow-tooltip
        :formatter="common.moneyFormatter"
        min-width="120"
      ></el-table-column>
      <el-table-column prop="liveinfo" label="入驻信息" align="center" show-overflow-tooltip>
        <el-table-column
          prop="liveinfo.orgname"
          label="学院名称"
          align="center"
          :formatter="common.defaultFormatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.projectname"
          label="项目名称"
          align="center"
          :formatter="common.defaultFormatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.classleadername"
          label="负责人"
          align="center"
          :formatter="common.defaultFormatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.classleadermobile"
          label="联系方式"
          align="center"
          :formatter="common.defaultFormatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="liveinfo.applyendtime"
          label="退租时间"
          align="center"
          :formatter="common.dateFormatter"
          show-overflow-tooltip
        ></el-table-column>
      </el-table-column>
      <el-table-column
        prop="usestatus"
        label="入驻状态"
        align="center"
        show-overflow-tooltip
        :formatter="common.useStateFormatter"
      ></el-table-column>
      <el-table-column
        prop="resstatus"
        label="是否开启"
        align="center"
        show-overflow-tooltip
        :formatter="common.resStateFormatter"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="110" align="center">
        <template slot-scope="scope">
          <span style="color:#00b09b;padding:0 5px;font-weight:bold" @click="toDetail(scope.row)">
            详情
          </span>
          <span style="color:#faac16;padding:0 5px;font-weight:bold" @click="toEdit(scope.row)">
            编辑
          </span>
          <span
            v-if="scope.row.resstatus == '2'"
            style="color:#814ef5;padding:0 5px;font-weight:bold"
            @click="changeStatus('1', scope.row)"
          >
            开启
          </span>
          <span
            v-if="scope.row.resstatus == '1' && scope.row.usestatus == '1'"
            style="color:#814ef5;padding:0 5px;font-weight:bold"
            @click="changeStatus('2', scope.row)"
          >
            关闭
          </span>
          <span
            v-if="scope.row.usestatus == '1'"
            style="color:#fe3e61;padding:0 5px;font-weight:bold"
            @click="deleteRes(scope.row)"
          >
            删除
          </span>
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
    </div>

    <!-- 是否确定删除 -->
    <van-action-sheet
      v-model="showConfirmDelete"
      :actions="[{ name: '确定删除', color: '#fe3e61' }]"
      @select="confirmDelete"
      cancel-text="取消"
    />
  </div>
</template>

<script>
import BasicSelect from '../../../components/BasicSelect';
export default {
  components: {
    BasicSelect,
  },
  data() {
    return {
      currentPage: 1,
      limit: 10,
      tableData: [],
      loading: false,
      finishTable: false,
      showConfirmDelete: false,
      deleteRow: {},
      typeDetail: {},
    };
  },
  props: {
    id: String,
    keyword: String,
    usestatus: String,
    orgid: String,
    tableHeight: Number,
  },
  watch: {
    id() {
      this.getResTypeDetail();
      this.getList(1);
    },
    usestatus() {
      this.getList(1);
    },
    orgid() {
      this.getList(1);
    },
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 新增页面
    toAdd() {
      this.$router.push(`/edures-bm/res-info-manage/${this.id}/add-res`);
    },
    // 编辑页面
    toEdit(row) {
      this.$router.push(`/edures-bm/res-info-manage/${this.id}/edit-res/${row.id}`);
    },
    // 详情页面
    toDetail(row) {
      this.$router.push(`/edures-bm/res-info-manage/${this.id}/detail-res/${row.id}`);
    },
    // 开启、关闭
    changeStatus(type, row) {
      let message = type === '1' ? '开启' : '关闭';
      this.$toast.loading({
        message: message + '中...',
        forbidClick: true,
        duration: 0,
      });
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/spres/changeStatus',
          data: {
            ids: row.id,
            resstatus: type,
          },
        })
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success(message + '成功');
            this.getList(1);
          } else {
            this.$toast.fail(message + '失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail(message + '失败' + '\n' + err);
        });
    },
    // 删除
    deleteRes(row) {
      this.showConfirmDelete = true;
      this.deleteRow = row;
    },
    // 确认删除
    confirmDelete() {
      this.$toast.loading({
        message: '删除中...',
        forbidClick: true,
        duration: 0,
      });
      this.showConfirmDelete = false;
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/spres/deleteByIds',
          data: {
            ids: this.deleteRow.id,
          },
        })
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success('删除成功');
            this.getList(1);
          } else {
            this.$toast.fail('删除失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('删除失败' + '\n' + err);
        });
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
          limit: this.limit,
        };
        if (this.id) {
          params.restypeid = this.id;
        }
        if (this.keyword) {
          params.rescode = this.keyword;
        }
        if (this.usestatus) {
          params.usestatus = this.usestatus;
        }
        if (this.orgid) {
          params.orgid = this.orgid;
        }
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: '/spres/pageList?date=' + new Date().getTime(),
            data: {
              params: JSON.stringify(params),
            },
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
              this.$toast.fail('获取数据失败' + '\n' + res.message);
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
    // 获取资源类型详情
    getResTypeDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/sprestype/findById',
          data: {
            id: this.id,
          },
        })
        .then(res => {
          if (res.success) {
            this.typeDetail = res.item || {};
            this.typeDetail.chargecycle = this.common.chargecycleFormatter(res.item.chargecycle);
            this.typeDetail.chargetype = this.common.chargetypeFormatter(
              res.item.chargetype,
              'unit'
            );
          } else {
            this.$toast.fail('获取数据失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + "\n" + err);
        });
    },
  },
  created() {
    // 获取资源类型详情
    this.getResTypeDetail();
    // 获取资源列表
    this.getList(1);
  },
};
</script>

<style lang="scss" scoped></style>
