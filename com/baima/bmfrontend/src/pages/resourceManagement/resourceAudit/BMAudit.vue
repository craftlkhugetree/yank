<template>
  <div class="common-content">
    <!--搜索框-->
    <div class="search-group">
      <!-- <span>
          <label>学院</label>
          <el-select v-model="searchForm.orgid" filterable remote placeholder="请输入或选择" size="small" :remote-method="remoteMethod" :loading="selectLoading" style="width: 150px">
            <el-option v-for="item in groupList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </span> -->
      <span>
        <el-input
          v-model="searchForm.name"
          placeholder="请输入资源编号"
          prefix-icon="el-icon-search"
          size="small"
          style="width: 220px"
        ></el-input>
        <el-button size="small" style="width: 100px" @click="search"
          >搜索</el-button
        >
      </span>
      <span class="reset-icon" @click="reSet">
        <i class="el-icon-refresh-right" style="margin-right: 5px"></i>重置
      </span>
    </div>

    <!--tab切换-->
    <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0"></el-tab-pane>
        <el-tab-pane label="待审批" name="1"></el-tab-pane>
        <el-tab-pane label="已审批" name="2"></el-tab-pane>
      </el-tabs>

      <!--<div class="my-button green" style="float: right;margin-top: 3px;" @click="operateApply('add',null)">
          <i class="el-icon-plus"></i>
          <span>新增申请</span>
        </div>-->
    </div>

    <el-divider style=""></el-divider>

    <!--表格-->
    <el-table
      class="my-table"
      :data="applyList"
      style="width: 100%"
      stripe
      v-loading="loading"
    >
      <!--        <el-table-column prop="name" label="申请编号" width="180"></el-table-column>-->
      <el-table-column
        prop="useType"
        label="申请类型"
        align="center"
        :formatter="common.useTypeFormatter"
      ></el-table-column>
      <el-table-column
        prop="eduTypeName"
        label="资源类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="resName"
        label="资源编号"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="orgName"
        label="学院名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="classfeeLeaderName"
        label="负责教师"
        align="center"
      ></el-table-column>
      <el-table-column prop="useCycle" label="使用时长" align="center">
        <template slot-scope="scope">
          {{ common.cycleUnit(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column prop="status" label="审批状态" align="center">
        <template slot-scope="scope">
          <span
            :class="
              common.actionColor2(
                'BM',
                scope.row.handleNode,
                scope.row.historyNode,
                scope.row
              )
            "
            >{{
              common.processFormatter2(
                "BM",
                scope.row.handleNode,
                scope.row.historyNode,
                scope.row
              )
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="approver" label="审批人" align="center">
        <template slot-scope="scope">
          {{ charger(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <div class="table-btn green" @click="goDetail(scope.row)">详情</div>
          <!-- <div
            v-if="
              (scope.row.usetype == '1' || scope.row.usetype == '2') &&
                scope.row.actionstatus == '0' &&
                scope.row.applystatus == 3
            "
            class="table-btn purple"
            @click="checkIn(scope.row)"
          >
            入驻
          </div> -->
          <div
            v-if="scope.row.handleNode == 'BM' && scope.row.status == 1"
            class="table-btn blue"
            @click="goAudit(scope.row)"
          >
            审批
          </div>
          <!-- <div
            v-if="
              scope.row.usetype == '3' &&
                scope.row.actionstatus == '0' &&
                scope.row.applystatus == 3
            "
            class="table-btn pink"
            @click="reCall(scope.row)"
          >
            退出
          </div> -->
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="my-pagination" v-if="totalPage > limit">
      <span>显示{{ limit }}条，共{{ totalPage }}条</span>
      <el-pagination
        class="my-el-pagination"
        background
        layout="prev, pager, next"
        :total="totalPage"
        :page-size="limit"
        :current-page="parseInt(currentPage)"
        small
        @current-change="getCurrentChange"
      ></el-pagination>
    </div>

    <!--&lt;!&ndash;弹框&ndash;&gt;
      <el-dialog class="res-apply-dialog" :title="(dialogType == 'add' )? '资源申请新增' : '资源申请编辑'" v-if="dialogFormVisible" :visible.sync="dialogFormVisible"
                 width="700px" :close-on-click-modal="false">
        <apply-form ref="child" :form="form" :formLabelWidth="formLabelWidth" ></apply-form>
        <div slot="footer" class="dialog-footer">
          <div class="my-button" @click="dialogFormVisible = false">取 消</div>
          <div class="my-button plain-green"  @click="submit(0)">保 存</div>
          <div class="my-button green" @click="submit(1)">提 交</div>
        </div>
      </el-dialog>-->
  </div>
</template>

<script>
import { eduApplyPageQuery } from "@/assets/js/api";
export default {
  name: "BMAudit",
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    charger() {
      return function(row) {
        let obj =
          this.$store.state.leaderList.find(l => l.id === row.approver) || {};
        let name
        if (row && row.events && row.events.length && row.events[0].eventType != 1) {
          name = row.events[0].createName || name;
        }
        return name || "--";
      };
    }
  },
  data() {
    return {
      totalPage: 1,
      limit: 10,
      currentPage: JSON.parse(sessionStorage.getItem("currentPage")) || 1,
      activeName: sessionStorage.getItem("activeName") || "1",
      searchForm: {},
      applyList: [], //申请列表
      dialogFormVisible: false,
      form: {
        /* owngroupname:this.options.userInfo.ORGNAME,
              owngroup:this.options.userInfo.ORGID,
              eventername:this.options.userInfo.NAME,*/
      },
      formLabelWidth: "120px",
      applyStatus: this.options.applyStatus, //状态列表
      codeList: JSON.parse(sessionStorage.getItem("codeList")), //资源编号列表
      dialogType: "", //弹框类型
      groupList: [], //学院列表
      loading: false,
      selectLoading: false,
      disableCheckin: false
    };
  },

  methods: {
    //搜索学院名称
    remoteMethod(query) {
      this.selectLoading = true;
      if (query !== "") {
        this.common
          .getGroupList2(query)
          .then(res => {
            console.log(res);
            this.selectLoading = false;
            this.groupList = res.items;
          })
          .catch(err => {
            this.selectLoading = false;
            this.groupList = [];
          });
      } else {
        this.selectLoading = false;
        this.groupList = [];
      }
    },

    //查询
    search() {
      this.getList(1);
      this.currentPage = 1;
    },

    //重置
    reSet() {
      this.searchForm = {};
      this.getList(1);
      this.currentPage = 1;
    },

    timeFormatter(row, column, cellValue) {
      if (cellValue == null) {
        return "--";
      } else {
        return this.util.formatTime(cellValue, "yyyy.MM.dd hh:mm:ss");
      }
    },

    //表格内日期格式转化
    dateFormatter(row, column, cellValue) {
      if (cellValue && cellValue.length == 14) {
        return this.util.formatTime(cellValue, "yyyy.MM.dd");
      } else {
        return cellValue;
      }
    },

    //点击分页
    getCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getList(currentPage);
    },

    //跳转详情
    goDetail(row) {
      this.$router.push({
        path: `resource-BM-audit/detail/${row.id}`,
        query: {
          activeName: this.activeName,
          currentPage: this.currentPage
        }
      });
    },

    //跳转审核页面
    goAudit(row) {
      this.$router.push({
        path: `resource-BM-audit/audit/${row.id}`,
        query: {
          activeName: this.activeName,
          currentPage: this.currentPage
        }
      });
    },

    //入驻
    checkIn(row) {
      this.$confirm("确定办理入驻吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /*let params={
              id:row.id
            };*/
          if (!this.disableCheckin) {
            this.disableCheckin = true;
            this.util
              .postAjax({
                code: this.global.code,
                url: "/spapply/checkIn",
                // isRep:true,
                data: {
                  id: row.id
                }
              })
              .then(res => {
                // console.log(res);
                this.disableCheckin = false;
                if (res.success == true) {
                  this.getList(this.currentPage);
                  // this.currentPage =1;
                } else {
                  // console.log(res);
                  this.$message({
                    type: "warning",
                    message: res.data.message
                  });
                }
              });
          } else {
            this.disableCheckin = false;
          }
        })
        .catch(() => {});
    },

    //基地退出
    reCall(row) {
      this.$confirm("确定办理退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /*let params={
                eventtype:2,
                applyid:row.id
              };*/
          this.util
            .postAjax({
              code: this.global.code,
              url: "/spapply/checkOut",
              // isRep:true,
              data: {
                id: row.id
              }
            })
            .then(res => {
              // console.log(res);
              if (res.success == true) {
                this.getList(this.currentPage);
                // this.currentPage =1;
              } else {
                // console.log(res);
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
              }
            });
        })
        .catch(() => {});
    },

    // 获取资源列表
    getList(page) {
      this.loading = true;
      const filter = {
        // 申请列表使用status状态，节点则使用handleNode和historyNode
        status: "1,2,8",
        resName: this.searchForm.name || undefined
        // eduTypeId: this.searchForm.eduTypeId || undefined
      };
      if (0 == this.activeName) {
        filter.allNode = "BM";
      } else if (1 == this.activeName) {
        filter.handleNode = "BM";
        filter.status = 1;
      } else if (2 == this.activeName) {
        filter.historyNode = "BM";
        filter.status = "2,8";
      }
      const params = {
        page: page || this.currentPage,
        limit: this.limit,
        filter
      };
      eduApplyPageQuery(params)
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.applyList = res.data;
            this.totalPage = res.total;

            this.applyList.forEach(r => {
              let chargecycle = r.billingCycle + "";
              let chargetype = r.billingMethod + "";
              this.common.chargecycleFormatter(chargecycle, r);
              this.common.chargetypeFormatter2(chargetype, r, "ct2", "ct1");
            });
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    //tab切换
    handleClick(row) {
      this.currentPage = 1;
      this.getList(1);
    }
  },
  created() {
    this.getList(this.currentPage);
  },
  beforeDestroy() {
    sessionStorage.removeItem("currentPage");
    sessionStorage.removeItem("activeName");
  }
};
</script>

<style scoped></style>
