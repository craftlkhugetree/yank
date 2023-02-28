<template>
  <div class="base-search-table bg-white" style="height: auto">
    <search-bar
      ref="searchBar"
      h3="古籍管理"
      @openAdd="openDrawer('add')"
      @search="search"
      @down="down"
      @upload="upload"
      :ph="'请输入古籍名称查询'"
    ></search-bar>

    <s-table :ref="'acadeDetail'" index :params="params" :getList="QUERY" :injFun="injFun">
      <el-table-column
        :label="t"
        v-for="t of d[activeTab].filter(x => !hasSth(x, '摘要'))"
        :key="t"
        :show-overflow-tooltip="getKey(t) !== 'name'"
      >
        <!-- :width="getKey(t) === 'name' ? 600 : 0" -->
        <template slot-scope="scope">
          <div v-if="getKey(t) === 'name'" class="cover div_flex">
            <el-image
              class="coverimg"
              :src="viewUrl + scope.row.cover"
              :preview-src-list="[viewUrl + scope.row.cover]"
              placeholder="暂无封面"
              fit="contain"
            ></el-image>
            <div class="context">
              <div class="ellipsis title" :title="scope.row.name">{{ scope.row.name }}</div>
              <div class="more-ellipsis next" :title="scope.row.summary || ''">
                {{ scope.row.summary || '' }}
              </div>
            </div>
          </div>
          <div v-else-if="hasSth(t, '日期')">
            {{ genDate(scope.row) }}
          </div>
          <div v-else>
            {{ scope.row[getKey(t)] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="100" fixed="right">
        <template slot-scope="scope">
          <div class="more-span">
            <span @click="openDrawer('edit', scope.row)">编辑</span>
            <span @click="deleteAccount(scope.row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </s-table>
    <detail-drawer
      ref="detailDrawer"
      @doFunc="refGet"
      :d="d"
      :activeTab="activeTab + ''"
      :tk="tk"
    ></detail-drawer>
  </div>
</template>

<script>
import { QUERY, DELETE, SAVEBATCH } from '@/api/all';
export default {
  name: 'AcadeDetailTable',
  components: {
    searchBar: () => import('@/components/SearchBar'),
    detailDrawer: () => import('./detailDrawer'),
  },
  data() {
    return {
      QUERY,
      viewUrl: window.g.viewUrl,
      activeTab: 0,
      d: {
        apiPre: ['ancientBook'],
        tab: ['古籍'],
        0: ['书名', '书号', '朝代作者', '卷数', '册数'],
      },
      keyword: '',
      total: '0',
      reff: {},
    };
  },
  watch: {
    activeTab() {
      this.keyword = '';
      this.$nextTick(() => this.genRef());
    },
  },
  computed: {
    hasSth() {
      return function(title, str, condition = true) {
        return this.common.judgeTitle(title, str, condition);
      };
    },
    tk() {
      let title = this.d[this.activeTab];
      return {
        title,
        key: ['name', 'bookNo', 'author', 'volume', 'copies'],
      };
    },
    genDate() {
      return function(row) {
        let month = row.publishMonth ? row.publishMonth + '月' : '';
        let day = row.publishDay ? row.publishDay + '日' : '';
        return row.publishYear + '年' + month + day;
      };
    },
    getKey() {
      return function(title) {
        let index = this.tk.title.findIndex(k => k === title);
        return this.tk.key[index];
      };
    },
    params() {
      return {
        filter: {
          name: this.keyword,
        },
        apiPre: this.d.apiPre[this.activeTab],
      };
    },
    delete() {
      return function(data) {
        return DELETE(data, this.d.apiPre[this.activeTab]);
      };
    },
    saveBatch() {
      return function(data) {
        return SAVEBATCH(data, this.d.apiPre[this.activeTab]);
      };
    },
  },
  methods: {
    injFun(arr, that) {
      let { total } = that;
      this.total = total + '';
    },
    // 打开弹窗
    openDrawer(type, row) {
      let drawer = this.$refs.detailDrawer;
      if (type == 'add') {
        drawer.title = '新增' + this.d.tab[this.activeTab] + '信息';
      }
      if (type == 'edit') {
        drawer.title = '编辑' + this.d.tab[this.activeTab] + '信息';
        drawer.editForm = row;
        row.attachs &&
          row.attachs.forEach(a => {
            drawer.fileList.push({ ...a });
          });
      }
      drawer.drawer = true;
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
        this.delete(param)
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
    // useEffect, delete params leads to undefined
    search(str) {
      if (this.keyword === str) {
        this.refGet();
      }
      this.keyword = str;
    },
    refGet() {
      this.reff.getData && this.reff.getData();
    },
    down() {
      this.common.exportExcel([this.tk.title], this.d.tab[this.activeTab] + '列表模板.xlsx');
    },
    regCheck(item) {
      let { obj } = item;
      let title = this.tk.title;
      let message = '';
      let reg = /^[0-9]+$/;
      title.forEach(t => {
        let da = obj[t];
        if (!da) {
          message += `${t}不能为空;`;
        }
        if (['卷数', '册数'].includes(t) && da && !reg.test(da)) {
          message += `${t}为数字;`;
        }
      });
      return message;
    },
    upload(e) {
      this.common.getFile({
        e,
        _this: this,
        key: this.tk.key,
        title: this.tk.title,
        $searchBar: this.$refs.searchBar[0],
        regCheck: this.regCheck,
        callback: this.saveB,
      });
    },
    saveB(arrT) {
      this.saveBatch(arrT).then(res => {
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
    genRef() {
      let tmp = this.$refs['acadeDetail'];
      this.reff = Array.isArray(tmp) ? { ...tmp[0] } : { ...tmp };
    },
  },
  mounted() {
    this.genRef();
  },
};
</script>
<style lang="scss" scoped>
.cover {
  .coverimg {
    width: 80px;
    height: 80px;
  }
  .context {
    width: 70%;
    margin-left: 8px;
    .title {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      /* 黑色/85 */
      color: rgba(0, 0, 0, 0.85);
      display: block;
    }
    .next {
      font-size: 14px;
      line-height: 20px;
      height: 40px;
      /* 黑色/65 */
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
