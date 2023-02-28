<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    @open="openDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <!-------------------- 保存 -------------------->
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="100px"
        :show-message="false"
        label-position="right"
      >
        <el-form-item prop="name" label="菜单名称：" style="margin-bottom: 16px" required>
          <el-input v-model="editForm.name" placeholder="请输入菜单名称" size="small" style="width: 360px"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="菜单url：" style="margin-bottom: 16px" required>
          <el-input
            v-model="editForm.path"
            placeholder="请输入菜单url，如:/sys-setting/menu"
            size="small"
            style="width: 360px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="菜单icon：" style="margin-bottom: 16px">
          <el-input
            v-model="editForm.icon"
            placeholder="请输入菜单icon，如: el-icon-search"
            size="small"
            style="width: 360px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="parentIds" label="上级菜单：" style="margin-bottom: 16px">
          <el-cascader
            v-model="editForm.parentIds"
            :options="menuList"
            :props="{ value: 'id', label: 'name', checkStrictly: true }"
            size="small"
            style="width: 360px"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="sort" label="排序：" style="margin-bottom: 16px">
          <el-input-number
            v-model="editForm.sort"
            controls-position="right"
            :min="1"
            :max="100"
            size="small"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="visible" label="当前状态：" style="margin-bottom: 16px" required>
          <el-radio-group v-model="editForm.visible">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">不启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { fetchAllMenuList, saveMenu } from '@/api/admin/menu.js'
export default {
  data() {
    return {
      title: '新增菜单',
      drawer: false,
      drawerLoading: false,
      editForm: {
        id: null, // 修改时添加
        name: null,
        path: null,
        icon: null,
        parentIds: null,
        visible: 1,
        sort: null
      },
      menuList: []
    }
  },
  methods: {
    // 打开
    openDrawer() {
      this.getMenuList()
    },
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields()
      this.editForm = {
        id: null,
        name: null,
        path: null,
        icon: null,
        parentIds: null,
        visible: 1,
        sort: null
      }
    },
    // 设置当前节点及其子节点不可选
    setCurNodeDisabled(arr) {
      arr.forEach(i => {
        if (i.id == this.editForm.id) {
          i.disabled = true
          if (i.children && i.children.length > 0) {
            this.setDisabled(i.children)
          }
        } else if (i.children && i.children.length > 0) {
          this.setCurNodeDisabled(i.children)
        }
      })
    },
    // 全部设置为不可选
    setDisabled(arr) {
      arr.forEach(i => {
        i.disabled = true
        if (i.children && i.children.length > 0) {
          this.setDisabled(i.children)
        }
      })
    },
    // 获取菜单列表
    getMenuList() {
      fetchAllMenuList({}).then(res => {
        if (res.code == '000000') {
          this.menuList = res.data || []
          this.setCurNodeDisabled(this.menuList)
        }
      })
    },
    // 保存
    save() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true
          let param = {
            ...this.editForm
          }
          let parentIds = this.editForm.parentIds || []
          if (parentIds.length == 0) {
            param.parentId = 0
          } else {
            param.parentId = parentIds.pop()
          }
          saveMenu(param)
            .then(res => {
              this.drawerLoading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '保存成功！'
                })
                this.drawer = false
                this.$emit('doFunc')
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '保存失败：' + res.msg
                })
              }
            })
            .catch(err => {
              this.drawerLoading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: '保存失败：' + err
              })
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 30px;
}
</style>
