<template>
  <el-popover
    placement="bottom"
    width="160"
    trigger="click"
    :visible-arrow="false"
    @show="showPopover"
  >
    <div class="check-group" v-loading="loading">
      <el-checkbox-group v-model="checkList" @change="changCheck">
        <el-checkbox v-for="item in userGroupList" :key="item.ID" :label="item.ID">{{item.NAME}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-button slot="reference" type="primary" size="small" icon="el-icon-edit-outline">开放对象</el-button>
  </el-popover>
</template>

<script>
import { fetchGroupList } from "@/api/admin/userGroup";
import { saveResGroup } from "@/api/admin/res";
export default {
  props: {
    curResGroup: Object
  },
  data() {
    return {
      loading: false,
      checkList: [],
      userGroupList: []
    };
  },
  methods: {
    // 获取用户组
    getGroupData() {
      this.loading = true;
      fetchGroupList()
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.userGroupList = res.items || [];
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 选择开放对象
    changCheck() {
      let data = {
        id: this.curResGroup.id,
        name: this.curResGroup.name,
        ugroupids: this.checkList
      };
      this.loading = true;
      saveResGroup(data)
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: "保存成功！"
            });
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
          this.loading = false;
          this.$message({
            showClose: true,
            type: "error",
            message: "保存失败：" + err
          });
        });
    },
    // 显示
    showPopover() {
      this.getGroupData();
      let ugroupids = this.curResGroup.ugroupids;
      if (ugroupids) {
        this.checkList = ugroupids.split(",");
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.check-group {
  height: 190px;
  overflow: auto;
  .el-checkbox {
    display: block;
    line-height: 22px;
    margin-bottom: 10px;
  }
}
</style>
