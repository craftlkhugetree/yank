<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="openDrawer"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <el-table :data="tableData" style="width:100%" header-row-class-name="table-header">
        <el-table-column
          prop="createtime"
          label="操作时间"
          show-overflow-tooltip
          :formatter="common.timeFormat"
        ></el-table-column>
        <el-table-column prop="creatername" label="操作人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.creatername}}（{{scope.row.createrid}}）</template>
        </el-table-column>
        <el-table-column prop="content" label="操作内容" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
import { fetchKpiDetail } from "@/api/kpi/awardList.js";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      id: null,
      title: null,
      tableData: []
    };
  },
  methods: {
    // 打开抽屉
    openDrawer() {
      this.getTableData();
    },
    // 关闭抽屉
    closeDrawer() {
      this.title = null;
      this.id = null;
      this.tableData = [];
    },
    // 获取数据
    getTableData() {
      this.drawerLoading = true;
      let param = {
        id: this.id
      };
      fetchKpiDetail(param)
        .then(res => {
          this.drawerLoading = false;
          let data = res.data || {};
          this.tableData = data.events || [];
          this.tableData.sort((a, b) => {
            return a.createtime > b.createtime ? -1 : 1;
          });
          this.tableData.forEach(i => {
            let content = "";
            let note = i.note ? "，" + i.note : "";
            switch (i.type) {
              case "1":
                content = "发起录入" + note;
                break;
              case "2":
                content = "撤回录入" + note;
                break;
              case "3":
                content = "提交录入结果，发起内部确认" + note;
                break;
              case "4":
                if (i.result == "1") {
                  content = "内部确认通过" + note;
                } else {
                  let note = i.note ? "，原因：" + i.note : "";
                  content = "内部确认未通过，请求重新修改" + note;
                }
                break;
              case "5":
                if (i.result == "1") {
                  content = "审核通过" + note;
                } else {
                  let note = i.note ? "，原因：" + i.note : "";
                  content = "审核未通过，请求重新修改" + note;
                }
                break;
            }
            i.content = content;
          });
        })
        .catch(err => {
          this.drawerLoading = false;
        });
    }
  }
};
</script>

<style scoped>
</style>