<template>
  <div class="main">
    <div class="icons">
      <icon-list :tabs="tabs" @genTab="clickIcon" :noIcon="true" :total="total"></icon-list>
    </div>
    <s-card ref="acadeTable" :params="params" :getList="QUERY" :resHook="resHook" :limit="limit" isSecondPage>
      <div
        v-for="item in tableList"
        :key="item.id"
        class="publishbook w50"
      >
        <honor :data="item" :keyArr="honorArr" :titleLine="3"></honor>
      </div>
    </s-card>
  </div>
</template>

<script>
import { QUERY } from '@/api/all';
export default {
  name: 'TeacherTable',
  components: {
    iconList: () => import('@/components/icon'),
    honor: () => import('@/components/honor'),
  },
  props: {
    id: String,
    rs: Number,
  },
  data() {
    return {
      honorArr: [
        { label: '作者：', key: 'author' },
        { label: '日期：', key: 'date' },
        { label: '出版：', key: 'publisher' },
      ],
      limit: 6,
      QUERY,
      viewUrl: window.g.viewUrl,
      tabs: [
        {
          label: '捐赠图书',
          apiPre: 'personDonateBook',
        },
      ],
      active: {
        label: '捐赠图书',
        apiPre: 'personDonateBook',
      },
      tableList: [],
      total: 0,
    };
  },
  computed: {
    hasSth() {
      return function(index) {
        return this.active.label === this.tabs[index].label;
      };
    },
    genDate() {
      return function(row) {
        let month = row.publishMonth ? row.publishMonth + '月' : '';
        let day = row.publishDay ? row.publishDay + '日' : '';
        return row.publishYear + '年' + month + day;
      };
    },
    params() {
      return {
        filter: {
          personId: this.id,
          // relationship (string, optional): 1院士2名师3专家4校友
          relationship: this.rs,
        },
        apiPre: this.active.apiPre,
      };
    },
  },
  methods: {
    clickIcon(item) {
      this.active = item;
    },
    resHook(res) {
      this.tableList = [];
      this.tableList = res.data;
      this.tableList.forEach(t => {
        if (t.cover) {
          t.url = this.viewUrl + t.cover;
        }
      });
      this.total = res.total
    },
  },
  created() {
    this.common.addClass('detailTableClass');
  },
  beforeDestroy() {
    this.common.removeClass('detailTableClass');
  },
};
</script>
<style lang="scss" scoped>
.main {
  // width: 100%;
  .icons {
    padding-bottom: 20rem;
  }
  .w25 {
    width: 23%;
    margin-left: 2%;
    margin-top: 20rem;
  }
  .w50 {
    width: 48%;
    margin-left: 2%;
    margin-top: 20rem;
  }
}
</style>
