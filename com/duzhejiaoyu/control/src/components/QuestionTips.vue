<template>
  <div class="question-tips">
    <slot></slot>
    <el-popover
      popper-class="question-tips-popper"
      placement="bottom-start"
      :title="title"
      trigger="hover"
    >
      <el-table
        :data="tableData"
        class="small-table"
        style="width: 100%; margin-top: 10px"
        header-row-class-name="table-header"
      >
        <el-table-column
          prop="campusName"
          label="校区/用户"
          show-overflow-tooltip
          fixed
          min-width="100"
        ></el-table-column>
        <el-table-column
          v-for="item in Object.keys(usertypes)"
          :key="item"
          :prop="item"
          :label="item"
          show-overflow-tooltip
          min-width="90"
        >
        <template slot-scope="scope">
            <span :class="{'active':scope.row[item] == minNum}">{{scope.row[item]}}</span></template>
        </el-table-column>
      </el-table>
      <i slot="reference" class="el-icon-question"></i>
    </el-popover>
    <span class="tips">最多{{minNum}}题</span>
  </div>
</template>

<script>
export default {
  props: {
    type: String, // 题目类型：1-单选，2-多选，3-判断
    data: Array
  },
  computed: {
    title() {
      let name = ''
      switch (this.type) {
        case '1':
          name = '单选题池'
          break
        case '2':
          name = '多选题池'
          break
        case '3':
          name = '判断题池'
          break
      }
      return name
    },
    typeData() {
      return this.data.filter(i => i.type == this.type)
    },
    campus() {
      let obj = {}
      // 提取校区
      for (let i = 0; i < this.typeData.length; i++) {
        let item = this.typeData[i]
        if (!obj[`campus-${item.campusId}`]) {
          obj[`campus-${item.campusId}`] = item.campusName
        }
      }
      return obj
    },
    usertypes() {
      let obj = {}
      // 提取用户类型
      for (let i = 0; i < this.typeData.length; i++) {
        let item = this.typeData[i]
        if (!obj[`${item.usertypeName}`]) {
          obj[`${item.usertypeName}`] = item.usertypeCode
        }
      }
      return obj
    },
    tableData() {
      let arr = []
      // 转换数据
      for (let key in this.campus) {
        let colums = { campusName: this.campus[key] }
        for (let i = 0; i < this.typeData.length; i++) {
          let item = this.typeData[i]
          if (key == `campus-${item.campusId}`) {
            colums[`${item.usertypeName}`] = item.num
          }
        }
        arr.push(colums)
      }
      return arr
    },
    minNum() {
      let nums = this.typeData.map(i => i.num)
      return nums.length > 0 ? Math.min(...nums) : 0
    }
  }
}
</script>

<style scoped>
.el-icon-question {
  font-size: 14px;
  color: #faad14;
  margin-right: 7px;
}
.tips {
  color: #999999;
}
</style>

<style lang="scss">
.question-tips-popper.el-popover {
  min-width: 262px;
  max-width: 600px;
  .content {
    width: 100%;
    overflow: auto;
  }
}
.small-table.el-table {
  .table-header th {
    padding: 2px 0;
    .cell {
      font-size: 13px;
      line-height: 18px;
    }
  }
  .el-table__cell {
    padding: 2px 0;
    font-size: 13px;
    line-height: 18px;
  }
  .active {
      color: #3A78FC !important;
  }
}
</style>