<template>
  <el-drawer
    class="base-drawer"
    title="批量设置"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <div class="form-box">
        <el-form
          ref="editForm"
          class="edit-form"
          :model="editForm"
          label-position="right"
          label-width="100px"
          label-suffix="："
          size="small"
        >
          <el-form-item label="所属模块" prop="modelIds">
            <el-checkbox-group v-model="editForm.modelIds">
              <el-checkbox
                class="width-100"
                v-for="item in moduleList"
                :key="item.id"
                :label="item.id"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="所属校区" prop="campusIds">
            <el-checkbox-group v-model="editForm.campusIds">
              <el-checkbox
                class="width-100"
                v-for="item in campusList"
                :key="item.id"
                :label="item.id"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="用户类型" prop="usertypeCodes">
            <el-checkbox-group v-model="editForm.usertypeCodes">
              <el-checkbox
                class="width-100"
                v-for="item in userTypeList"
                :key="item.code"
                :label="item.code"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        <el-form-item label="是否必考" prop="isImportant">
          <div class="switch">
            <el-switch
              ref="switch"
              :width="42"
              v-model="editForm.isImportant"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <span class="on" v-show="editForm.isImportant==1" @click="editForm.isImportant=0">是</span>
            <span class="off" v-show="editForm.isImportant==0" @click="editForm.isImportant=1">否</span>
          </div>
        </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { mapState } from 'vuex'
import { batchSet } from '@/api/question'
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      editForm: {
        questionIds: [],
        modelIds: [],
        campusIds: [],
        usertypeCodes: [],
        isImportant: 1
      }
    }
  },
  computed: mapState({
    moduleList: state => state.moduleList,
    campusList: state => state.campusList,
    userTypeList: state => state.userTypeList
  }),
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields()
      this.editForm = {
        questionIds: [],
        modelIds: [],
        campusIds: [],
        usertypeCodes: [],
        isImportant: 1
      }
    },
    // 保存
    save() {
      this.drawerLoading = true
      let param = {
        ...this.editForm
      }
      batchSet(param)
        .then(res => {
          this.drawerLoading = false
          if (res.code == '000000') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功!'
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
  },
  created() {
    if (this.moduleList.length == 0) {
      this.$store.dispatch('getModuleList')
    }
    if (this.campusList.length == 0) {
      this.$store.dispatch('getCampusList')
    }
    if (this.userTypeList.length == 0) {
      this.$store.dispatch('getUserTypeList')
    }
  }
}
</script>
<style lang="scss" scoped>
.switch {
  display: inline-block;
  position: relative;
  width: 54px;
  height: 22px;
  line-height: 22px;
  margin-top: -2px;
  span {
    position: absolute;
    font-size: 12px;
    padding-top: 1px;
    top: 0;
    cursor: pointer;
    &.on {
      color: #ffffff;
      left: 6px;
    }
    &.off {
      color: #999;
      right: 20px;
    }
  }
}
</style>