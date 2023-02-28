<template>
  <div class="index">
    <search-bar
      ref="searchBar"
      h3="名师著作文库信息"
      preText="名师"
      ph="请输入名师名称"
      :searchName="name"
      @search="search"
    ></search-bar>

    <s-card ref="acadeTable" :params="params" :getList="personQuery" :resHook="resHook">
      <div v-for="item in tableList" :key="item.id" class="academician">
        <name-card :data="item" :route="item.route" @jump="jump(item)" nozhuanli></name-card>
      </div>
      <!-- <transition-group name="slide">
      </transition-group> -->
    </s-card>
  </div>
</template>

<script>
import { personQuery } from '@/api/person';
export default {
  components: {
    searchBar: () => import('@/components/SearchBar'),
    nameCard: () => import('@/components/nameCard'),
  },
  props: {
    name: String,
    rs: Number,
  },
  data() {
    return {
      tableData: [],
      keyword: '',
      personQuery,
      tableList: [],
    };
  },
  computed: {
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
    resHook(res) {
      this.tableList = res.data;
    },
    // 查看
    jump(row) {
      this.$router.push('/tc/teacher/' + row.id);
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
    document.body.classList.add('indexClass');
  },
  beforeDestroy() {
    document.body.classList.remove('indexClass');
  },
};
</script>

<style lang="scss" scoped>
.index {
  // background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f9f4fe 100%);
  // background: url('~@/assets/img/1-body.svg') no-repeat center !important;
  // background-size: cover;
  width: 100vw;
  // height: 100%;
  // height: $indexh;
  // position: relative;
}
</style>
