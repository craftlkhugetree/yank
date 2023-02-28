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
    size="800px"
  >
    <!---------------------------- 已审核补充附件 ---------------------------->
    <div class="file-box">
      <label>&nbsp;&nbsp;补充考核材料：</label>
      <template>
        <el-button
          icon="el-icon-upload2"
          plain
          size="small"
          @click="uploadEdit"
          :loading="uploadEditLoading"
        >上传文件</el-button>
        <span style="padding: 0 10px;">或</span>
        <history-files
          ref="historyFiles"
          :checkedData.sync="checkedFiles"
          :loading="uploadEditLoading"
          @doFunc="changeChecked"
        ></history-files>
        <br />
        <p class="tips">
          请上传考核结果相关证明材料，支持扩展名：.rar .zip .doc .docx .pdf
          .jpg...
        </p>
        <div class="attach-div" v-loading="uploadEditLoading">
          <span class="attach" v-for="(file, index) in initFiles" :key="index">
            <span>
              <img src="@/assets/img/fujian.png" alt />
              <span @click="common.downloadFile(file.ID)">
                {{
                file.TITLE
                }}
              </span>
              <i class="el-icon-close" @click="deleteEditFiles(index,file.ID)"></i>
            </span>
          </span>
        </div>
      </template>
    </div>
    <div class="drawer-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        header-row-class-name="table-header"
        v-loading="tableLoading"
      >
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.username }}（{{ scope.row.userid }}）</template>
        </el-table-column>
        <el-table-column
          prop="orgname"
          label="部门"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="groupname"
          label="考核分组"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="joblvname"
          label="领导岗位级别"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column
          prop="rylxm"
          label="人员类型"
          show-overflow-tooltip
          :formatter="common.defaultFormat"
        ></el-table-column>
        <el-table-column prop="specialsalary" label="发放金额(元)" :formatter="common.defaultFormat">
          <template slot-scope="scope">
            <i>{{ scope.row.specialsalary }}</i>
          </template>
        </el-table-column>
      </el-table>
      <!-- ----------------------- 补充材料上传组件 ----------------------- -->
      <upload
        v-show="false"
        :multiple="false"
        :size="51200"
        exts="pdf|rar|zip|doc|docx|jpg|png|jpeg|xlsx|xls|txt"
        @done="uploadedEdit"
        @choose="uploadEditLoading = true"
        :url="uploadUrl"
        ref="uploadEdit"
      ></upload>
    </div>
  </el-drawer>
</template>

<script>
import { findCollectById } from '@/api/kpi/collect.js'
import upload from '@/components/BaseUpload'
import { fetchFileInfo } from '@/api/kpi/awardList'
import { saveAttachment } from '@/api/kpi/manage'
import HistoryFiles from './historyFiles.vue'
import { saveFileBatch } from '@/api/kpi/historyFile'
export default {
  components: {
    upload,
    HistoryFiles
  },
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      id: null,
      title: null,
      tableData: [],
      tableLoading: false,
      initFiles: [], // 初始文件列表
      checkedFiles: [], // 已选择的历史材料
      uploadEditLoading: false,
      uploadUrl: window.g.uploadUrl
    }
  },
  methods: {
    // 获取文件列表
    getFileList(ids) {
      // 获取考核文件
      if (ids.length > 0) {
        fetchFileInfo({ IDs: ids }).then(res => {
          if (res.success) {
            let data = res.data || {}
            let arr = []
            for (let key in data) {
              arr.push(data[key])
            }
            this.initFiles = arr
            this.checkedFiles = arr.map(i => {
              return {
                fileid: i.ID,
                filename: i.TITLE
              }
            })
          }
        })
      }
    },
    // 补充上传
    uploadEdit() {
      this.$refs.uploadEdit.toupload()
    },
    // 补充上传
    uploadedEdit(res) {
      this.uploadEditLoading = false
      if (res.success) {
        let file = res.data[0]
        this.saveFile(file, true)
      } else {
        this.$message({
          showClose: true,
          message: '上传失败！',
          type: 'error'
        })
      }
    },
    // 改变选择的历史材料
    changeChecked(file) {
      let tFile = {
        ID: file.fileid,
        TITLE: file.filename
      }
      let index = this.initFiles.findIndex(i => i.ID == file.fileid)
      if (file.checked) {
        if (index == -1) {
          this.saveFile(tFile)
        }
      } else {
        if (index > -1) {
          this.deleteEditFiles(index, file.fileid)
        }
      }
    },
    // 保存文件到这条发放记录中, isNew: 是否新上传
    saveFile(file, isNew) {
      this.uploadEditLoading = true
      let ids = this.initFiles.map(i => i.ID)
      let data = {
        attachment: [file.ID, ...ids].join(','),
        kpiid: this.id
      }
      saveAttachment(data).then(res => {
        this.uploadEditLoading = false
        if (res.success) {
          this.initFiles.push(file)
          if (isNew) {
            this.saveNewFile([file])
          }
        }
      })
    },

    // 保存新上传的材料到文件管理中
    saveNewFile(files) {
      if (files.length > 0) {
        let arr = files.map(i => {
          return {
            fileid: i.ID,
            filename: i.TITLE
          }
        })
        saveFileBatch(arr)
          .then(res => {})
          .catch(err => {})
      }
    },

    // 删除文件
    deleteEditFiles(index, fileid) {
      let arr = [...this.initFiles]
      arr.splice(index, 1)
      let data = {
        attachment: arr.map(i => i.ID).join(','),
        kpiid: this.id
      }
      this.uploadEditLoading = true
      saveAttachment(data)
        .then(res => {
          this.uploadEditLoading = false
          if (res.success) {
            this.initFiles.splice(index, 1)
            let cIndex = this.checkedFiles.findIndex(i => i.fileid == fileid)
            if (cIndex > -1) {
              this.checkedFiles.splice(cIndex, 1)
            }
          }
        })
        .catch(err => {
          this.uploadEditLoading = false
        })
    },

    // 打开抽屉
    openDrawer() {
      this.getTableData()
    },
    // 关闭抽屉
    closeDrawer() {
      this.title = null
      this.id = null
      this.$refs.historyFiles.getFileList();
      this.$refs.historyFiles.visible = false;
      this.resetData()
    },
    // 清空数据
    resetData() {
      this.tableData = []
      this.initFiles = []
      this.checkedFiles = []
    },
    // 获取数据
    getTableData() {
      this.tableLoading = true
      let param = {
        id: this.id,
        orignal: 'kpi'
      }
      findCollectById(param)
        .then(res => {
          this.tableLoading = false
          if (res.success) {
            this.tableData = res.data.kpidetails || []
            let kpiItmes = res.data
            if (kpiItmes.attachment) {
              let fileIds = kpiItmes.attachment.split(',')
              this.getFileList(fileIds)
            }
          } else {
            this.resetData()
          }
        })
        .catch(err => {
          this.resetData()
          this.tableLoading = false
        })
    }
  }
}
</script>

<style scoped>
.file-box {
  padding: 0 10px;
}
label {
  color: #5f6464;
}
.tips {
  margin-top: 10px;
  margin-left: 10px;
  color: rgba(0, 0, 0, 0.65);
}
</style>