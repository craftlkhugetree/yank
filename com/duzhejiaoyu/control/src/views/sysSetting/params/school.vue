<template>
  <div class="params-box">
    <h3>校区管理</h3>
    <div class="params-box-content" v-loading="schoolLoading">
      <div class="item" v-for="(item,index) in schoolList" :key="item.id">
        <div class="show-item" v-if="!item.isEdit">
          {{item.name}}
          <div class="right-btn">
            <span @click="item.isEdit = true;">编辑</span>
            <span v-if="item.isConfig !== 1" @click="deleteSchool(item)">删除</span>
          </div>
        </div>
        <div class="edit-item" v-else>
          <el-input
            v-model="item.editName"
            placeholder="请输入校区名称"
            :class="{'is-error': !item.editName && activeSave}"
          ></el-input>
          <div class="right-btn">
            <span @click="saveSchool(item)">保存</span>
            <span @click="cancelEditSchool(item, index)">取消</span>
          </div>
        </div>
      </div>
      <div class="item add-item" @click="addSchool">+ 新增校区</div>
    </div>
  </div>
</template>

<script>
import { fetchSchoolList, saveSchool, deleteSchool } from '@/api/params'
export default {
  data() {
    return {
      schoolLoading: false,
      schoolList: [],
      activeSave: false
    }
  },
  methods: {
    addSchool() {
      this.schoolList.push({ id: null, name: null, editName: null, isEdit: true })
    },
    cancelEditSchool(school, index) {
      this.activeSave = false
      if (school.id) {
        school.isEdit = false
        school.editName = school.name
      } else {
        this.schoolList.splice(index, 1)
      }
    },
    // 删除
    deleteSchool(school) {
      this.$confirm(`确认删除校区『 ${school.name} 』吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.schoolLoading = true
          deleteSchool(school.id)
            .then(res => {
              this.schoolLoading = false
              if (res.code == '000000') {
                this.$message({
                  showClose: true,
                  type: 'success',
                  message: '校区删除成功！'
                })
                this.getSchoolList()
              } else {
                this.$message({
                  showClose: true,
                  type: 'error',
                  message: '校区删除失败' + res.msg
                })
              }
            })
            .catch(err => {
              this.schoolLoading = false
              this.$message({
                showClose: true,
                type: 'error',
                message: '校区删除失败' + err
              })
            })
        })
        .catch(err => {})
    },
    // 保存校区
    saveSchool(school) {
      let { id, name, editName, isEdit } = school
      this.activeSave = true
      if (!editName) {
        return
      }
      if (editName == name) {
        school.isEdit = false
        return
      }
      this.schoolLoading = true
      let param = {
        id,
        name: editName
      }
      saveSchool(param)
        .then(res => {
          this.schoolLoading = false
          this.activeSave = false
          if (res.code == '000000') {
            this.$message({
              showClose: true,
              type: 'success',
              message: '校区保存成功！'
            })
            this.getSchoolList()
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '校区保存失败：' + res.msg
            })
          }
        })
        .catch(err => {
          this.schoolLoading = false
          this.activeSave = false
          this.$message({
            showClose: true,
            type: 'error',
            message: '校区保存失败：' + err
          })
        })
    },
    // 获取校区列表
    getSchoolList() {
      this.schoolLoading = true
      this.$store
        .dispatch('getCampusList')
        .then(res => {
          this.schoolLoading = false
          this.schoolList = res
          this.schoolList.forEach(i => {
            this.$set(i, 'isEdit', false)
            this.$set(i, 'editName', i.name)
          })
        })
        .catch(err => {
          this.schoolLoading = false
          this.schoolList = []
          this.$message({
            showClose: true,
            type: 'error',
            message: '获取校区列表失败：' + err
          })
        })
    }
  },
  created() {
    this.getSchoolList()
  }
}
</script>

<style lang="scss" scoped>
.params-box-content {
  .edit-item {
    position: relative;
  }
  .right-btn {
    position: absolute;
    right: 0;
    top: 0;
    span {
      color: #3a78fc;
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
</style>
<style>
.edit-item .el-input .el-input__inner {
  padding-right: 80px;
}
.edit-item .el-input.is-error .el-input__inner {
  border-color: #f56c6c;
}
</style>