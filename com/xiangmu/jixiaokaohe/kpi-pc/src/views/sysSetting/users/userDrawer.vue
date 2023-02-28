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
      <el-form
        ref="editForm"
        :model="editForm"
        style="padding:0 30px;"
        label-width="130px"
        label-position="right"
        :show-message="false"
      >
        <el-form-item label="领导岗位级别：" prop="leaderlevelid" required>
          <el-select
            v-model="editForm.leaderlevelid"
            placeholder="请选择"
            size="small"
            style="width:300px;"
          >
            <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考核分组：" prop="group">
          <el-select
            v-model="editForm.group"
            placeholder="请选择"
            size="small"
            style="width:300px;"
            disabled
          ></el-select>
        </el-form-item>
        <el-form-item label="人员类型：" prop="usertype">
          <el-select
            v-model="editForm.usertype"
            placeholder="请选择"
            size="small"
            style="width:300px;"
            disabled
          ></el-select>
        </el-form-item>
      </el-form>
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
      title: "",
      editForm: {
        id: null,
        leaderlevelid: null,
        group: null,
        usertype: null
      }
    };
  },
  computed: {
    levelList() {
      return this.$store.state.levelList;
    }
  },
  methods: {
    // 打开抽屉
    openDrawer() {
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.keyword = null;
      (this.editForm = {
        id: null,
        name: null
      }),
        this.$emit("doFunc");
    },
    // 保存
    doSave() {
      this.$refs.editForm.validate(valid => {
        if (valid) {

        }
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