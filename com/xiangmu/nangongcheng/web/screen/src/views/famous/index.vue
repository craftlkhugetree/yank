<template>
  <div class="index">
    <search-bar
      ref="searchBar"
      h3="历代教材信息"
      preText="教材"
      ph="请输入教材名称"
      :searchName="name"
      @search="search"
    >
      <el-date-picker
        v-model="publishYear"
        type="year"
        placeholder="年"
        class="year-input"
        format="yyyy年"
        value-format="yyyy"
        clearable
      ></el-date-picker>
    </search-bar>
    <s-card ref="acadeTable" :params="params" :getList="QUERY" :resHook="resHook" :limit="12">
      <div class="honor">
        <div v-for="item in tableList" :key="item.id" class="sth">
          <honor :data="item" :keyArr="honorArr" :titleLine="1" height="172rem"></honor>
        </div>
      </div>
    </s-card>
  </div>
</template>

<script>
import { QUERY } from '@/api/all';
export default {
  components: {
    searchBar: () => import('@/components/SearchBar'),
    honor: () => import('@/components/honor'),
  },
  props: {
    name: String,
  },
  data() {
    return {
      publishYear: null,
      keyword: '',
      QUERY,
      tableList: [],
      honorArr: [
        { label: '作者：', key: 'authorFirst' },
        { label: '出版：', key: 'publisher' },
        { label: 'ISBN：', key: 'isbn' },
        { label: '日期：', key: 'date' },
      ],
    };
  },
  computed: {
    params() {
      return {
        filter: {
          name: this.keyword,
          publishYear: this.publishYear,
        },
        apiPre: 'book',
      };
    },
  },
  methods: {
    resHook(res) {
      this.tableList = res.data;
      this.tableList.forEach(t => {
        let name = (t.author + '').split(/[,，]/g) || [];
        t.authorFirst = name.length > 1 ? name[0] + ' 等' : t.author;
        t.url = window.g.viewUrl + t.cover;
      });
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
  created() {
    if (this.name) {
      this.keyword = this.name;
    }
    document.body.classList.add('indexClass')
  },
  beforeDestroy() {
    document.body.classList.remove('indexClass')
  }
};
</script>

<style lang="scss" scoped>
.index {
  // background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f9f4fe 100%);
  // background: url('~@/assets/img/1-body.svg') no-repeat;
  width: 100vw;
  // height: $indexh;
  // height: 100vh;
  // position: relative;
}
</style>
