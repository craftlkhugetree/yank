<template>
  <el-popover placement="bottom" width="250" trigger="manual" v-model="visible">
    <div class="content" v-loading="loading">
      <h4>
        选择历史材料
        <i class="el-icon-close" @click="visible=false;"></i>
      </h4>
      <div class="content-box">
        <li v-for="file in fileList" :key="file.id">
          <el-checkbox v-model="file.checked" @change="changeChecked(file)"></el-checkbox>
          {{file.filename}}
        </li>
      </div>
    </div>
    <el-button slot="reference" size="small" @click="getData">选择历史材料</el-button>
  </el-popover>
</template>

<script>
import { fetchAllFileList } from '@/api/kpi/historyFile'
export default {
  props: {
    // 已选择的文件
    checkedData: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      fileList: [],
      firstClick: true
    }
  },
  watch: {
    checkedData() {
      this.resetFiles()
    }
  },
  methods: {
    // 第一次点击按钮时 获取数据
    getData() {
      this.visible = !this.visible
      if (this.firstClick) {
        this.getFileList()
        this.firstClick = false
      }
    },
    // 获取文件列表
    getFileList() {
      fetchAllFileList({}).then(res => {
        if (res.success) {
          this.fileList = res.data || []
          this.resetFiles()
        }
      })
    },
    // 重新设置选中的文件
    resetFiles() {
      this.fileList.forEach(i => {
        this.$set(i, 'checked', false)
      })
      this.checkedData.forEach(i => {
        let index = this.fileList.findIndex(j => j.fileid == i.fileid)
        if (index > -1) {
          this.fileList[index].checked = true
        }
      })
    },
    // 改变选择的文件
    changeChecked(file) {
      let arr = this.fileList.filter(i => i.checked)
      // 更新父组件checkedData
      this.$emit('update:checkedData', arr)
      // 调用父组件方法
      this.$emit('doFunc', file)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  h4 {
    font-size: 14px;
    font-weight: 400;
    color: #3a3a3a;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    margin: 0 -12px;
    i {
      font-size: 16px;
      color: #000;
      float: right;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .content-box {
    height: 270px;
    overflow: auto;
  }
  li {
    list-style: none;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    margin: 16px 0;
    .el-checkbox {
      margin-right: 6px;
    }
  }
}
</style>