<template>
  <el-drawer
    class="base-drawer"
    title="批量编辑"
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
        <el-table-column type="index" label="序号" show-overflow-tooltip width="50"></el-table-column>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.name}}（{{scope.row.id}}）</template>
        </el-table-column>
        <el-table-column prop="joblvid" label="领导岗位级别" show-overflow-tooltip min-width="150">
          <template slot-scope="scope">
            <el-select size="small" v-model="scope.row.joblvid" style="width:100%">
              <el-option
                v-for="item in levelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="groupid" label="考核分组" show-overflow-tooltip min-width="150">
          <template slot-scope="scope">
            <el-select size="small" v-model="scope.row.groupid" style="width:100%">
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSave">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { saveUser } from "@/api/admin/users.js";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      tableData: []
    };
  },
  computed: {
    levelList() {
      return this.$store.state.levelList;
    },
    groupList() {
      return this.$store.state.groupList;
    }
  },
  methods: {
    // 打开抽屉
    openDrawer() {},
    // 关闭抽屉
    closeDrawer() {},
    // 保存
    doSave() {
      this.drawerLoading = true;
      // 排除掉joblvid 和 groupid都为空的数据
      let data = this.tableData.filter(i => i.joblvid || i.groupid);
      let param = data.map(i => {
        return {
          id: i.id,
          joblvid: i.joblvid,
          groupid: i.groupid
        };
      });
      saveUser(param)
        .then(res => {
          this.drawerLoading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: "保存成功！"
            });
            this.drawer = false;
            this.$emit("doFunc");
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "保存失败：" + res.data.message
            });
          }
        })
        .catch(err => {
          this.drawerLoading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: "保存失败：" + err
          });
        });
    }
  }
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 12px;
}
</style>