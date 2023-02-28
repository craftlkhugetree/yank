<template>
  <div>
    <el-table :data="list" border stripe>
      <el-table-column label="文件名称" prop="name"></el-table-column>
      <el-table-column label="备份时间" prop="time"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button class="table-btn" type="text" size="mini" @click="download(scope.row.name)" title="下载">
			下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="page.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
          </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '数据备份',
      allList: [],
      list: [],
      page: {
        page: 1,
        limit: 10,
        total: 0
      },
      downloadUrl: this.util.global.url['book2']
    }
  },
  methods: {
    handleSizeChange (limit) {
      this.page.limit = limit
      this.updateList()
    },
    handleCurrentChange (page) {
      this.page.page = page
      this.updateList()
    },
    updateList () {
      const startIndex = (this.page.page - 1) * this.page.limit
      const endIndex = startIndex + this.page.limit
      const maxIndex = this.page.total
      const realEndIndex = endIndex >= maxIndex ? maxIndex : endIndex
      let list = []
      for (let i = startIndex; i < realEndIndex; i++) {
        list.push(this.allList[i])
      }
      this.list = list
    },
    getList () {
      this.util.postAjax({
        code:this.global.code,
        url:"Data/getBackUpList",
        data:{}
      }).then( res => {
        if(res && res.success) {

          this.allList = res.items
        this.page.total = res.items.length
        this.updateList()
        }
      })
    },
    download (name) {
      window.open(this.downloadUrl + "/Data/downloadBackup?name=" + name)
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped>
  .el-table {
    margin-top: 20px;
  }
</style>
