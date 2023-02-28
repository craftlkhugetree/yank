<template>
  <div class="main">
    <div class="icons">
      <icon-list :tabs="tabs" @genTab="clickIcon"></icon-list>
    </div>
    <s-card
      ref="acadeTable"
      :params="params"
      :getList="QUERY"
      :resHook="resHook"
      :limit="limit"
      isSecondPage
    >
      <div
        v-for="item in tableList"
        :key="item.id"
        class="publishbook"
        :class="hasSth(1) ? 'w25' : hasSth(2) ? 'w50' : ''"
      >
        <publish-book :data="item" :notPaper="true" v-if="hasSth(0)"></publish-book>
        <paper :data="item" date="发表日期：" v-if="hasSth(1)"></paper>
        <honor :data="item" :keyArr="honorArr" v-if="hasSth(2)" :titleLine="3"></honor>
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
    publishBook: () => import('@/components/publishBook'),
    paper: () => import('@/components/paper'),
    honor: () => import('@/components/honor'),
  },
  props: {
    id: String,
    rs: Number,
  },
  data() {
    return {
      honorArr: [{ label: '获得日期：', key: 'date' }],
      limit: 3,
      QUERY,
      viewUrl: window.g.viewUrl,
      tabs: [
        {
          label: '出版书籍信息',
          apiPre: 'personPublishBook',
          icon: 'shuji.png',
        },
        {
          label: '论文信息',
          apiPre: 'personPaper',
          icon: 'lunwen.png',
        },
        {
          label: '获奖荣誉信息',
          apiPre: 'personHonor',
          icon: 'rongyu.png',
        },
      ],
      active: {
        label: '出版书籍信息',
        apiPre: 'personPublishBook',
        icon: 'shuji.png',
      },
      tableList: [],
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
      if (this.hasSth(1)) {
        this.limit = 8;
      } else if (this.hasSth(2)) {
        this.limit = 6;
      } else {
        this.limit = 3;
      }
    },
    resHook(res) {
      this.tableList = [];
      this.tableList = res.data;
      this.tableList.forEach(t => {
        if (t.cover) {
          t.url = this.viewUrl + t.cover;
        }
      });
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
