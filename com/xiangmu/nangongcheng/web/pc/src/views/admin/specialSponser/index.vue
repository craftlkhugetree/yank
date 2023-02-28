<template>
  <div class="base-search-table bg-white" style="height: auto">
    <search-bar
      ref="searchBar"
      h3="专家捐赠管理"
      @openAdd="openDrawer('add')"
      @search="search"
      @down="down"
      @upload="upload"
      :ph="'请输入姓名查询'"
    ></search-bar>
    <!---------------------------- 表格 ---------------------------->
    <s-table ref="acadeTable" index :params="params" :getList="personQuery" :injFun="genRole">
      <el-table-column prop="name" label="捐赠人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="donateNum" label="捐赠图书" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="left" width="180" fixed="right">
        <template slot-scope="scope">
          <div class="more-span">
            <span @click="jump(scope.row)">查看</span>
            <span @click="openDrawer('edit', scope.row)">编辑</span>
            <span @click="deleteAccount(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </s-table>

    <!---------------------------- 新增 ---------------------------->
    <edit-drawer ref="editDrawer" :rs="rs" @doFunc="refGet"></edit-drawer>
  </div>
</template>

<script>
import { personQuery, personSaveBatch, personMove, personDelete } from '@/api/person';
export default {
  components: {
    searchBar: () => import('@/components/SearchBar'),
    editDrawer: () => import('./editDrawer'),
  },
  data() {
    return {
      loading: false,
      tableLoading: false,
      tableData: [],
      keyword: '',
      title: ['捐赠人', '人物介绍'],
      name: ['name', 'profile'],
      UP: 'up',
      DOWN: 'down',
      rs: 3,
      personQuery,
    };
  },
  computed: {
    canMove() {
      return function(direction, index) {
        let p = this.$refs.acadeTable.formInfo.pageNum,
          limit = this.$refs.acadeTable.formInfo.pageSize,
          total = this.$refs.acadeTable.total;
        if (direction === this.UP) {
          if (index == '0' && p == '1') {
            return false;
          }
          return true;
        } else if (direction === this.DOWN) {
          if (+index + 1 + (p - 1) * limit === total) return false;
          return true;
        }
      };
    },
    params() {
      return {
        filter: {
          name: this.keyword,
          // relationship (string, optional): 1院士2名师3专家4校友
          relationship: this.rs,
        },
      };
    },
  },
  methods: {
    move(str, row) {
      let data = {
        relationship: this.rs,
        id: row.id,
      };
      personMove(data, str).then(res => {
        if (res && res.code === '000000') {
          this.refGet();
        }
      });
    },
    down() {
      this.common.exportExcel([this.title], '专家捐赠列表模板.xlsx');
    },
    saveBatch(arrT) {
      personSaveBatch(arrT).then(res => {
        if (res && res.code === '000000') {
          this.$message({
            showClose: true,
            type: 'success',
            message: '导入成功！',
          });
          this.refGet();
        }
      });
    },
    regCheck(item) {
      let { obj } = item;
      let i = obj[this.title[0]];
      let p = obj[this.title[1]];
      let message = '';
      if (!i) {
        message += '姓名不能为空;';
      }
      if (!p) {
        message += '人物介绍不能为空;';
      }
      return message;
    },
    upload(e) {
      this.common.getFile({
        e,
        _this: this,
        key: this.name,
        title: this.title,
        commonParams: { relationship: this.rs },
        regCheck: this.regCheck,
        callback: this.saveBatch,
      });
    },
    // inject
    genRole(arr) {
      arr.forEach(a => {
        if (a.dataCount) {
          for (let key in a.dataCount) a[key] = a.dataCount[key];
        }
      });
    },
    // 打开弹窗
    openDrawer(type, row) {
      let drawer = this.$refs.editDrawer;
      if (type == 'add') {
        drawer.title = '新增捐赠专家';
      }
      if (type == 'edit') {
        drawer.title = '编辑捐赠专家-' + row.name;
        drawer.editForm = row;
        row.attachs &&
          row.attachs.forEach(a => {
            drawer.fileList.push({ ...a });
          });
      }
      drawer.drawer = true;
    },
    // 查看
    jump(row) {
      this.$router.push('/tc/specialSponser/' + row.id);
    },
    // 删除
    deleteAccount(row) {
      const obj = {
        _this: this,
        txt: `是否确认删除『 ${row.name} 』？`,
        tips: '提示',
        type: 'warning',
      };
      obj.fun = () => {
        this.loading = true;
        let param = row.id;
        personDelete(param)
          .then(res => {
            this.loading = false;
            if (res && res.code === '000000') {
              this.$message({
                showClose: true,
                type: 'success',
                message: `删除成功！`,
              });
              this.refGet();
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: `删除失败`,
              });
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message({
              showClose: true,
              type: 'error',
              message: `删除失败：${err}`,
            });
          });
      };
      this.common.showPopup(obj);
    },
    // useEffect
    search(str) {
      if (this.keyword === str) {
        this.refGet();
      }
      this.keyword = str;
    },
    refGet() {
      this.$refs.acadeTable.getData && this.$refs.acadeTable.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.grey {
  color: rgba(0, 0, 0, 0.25) !important;
  cursor: none !important;
}
</style>
