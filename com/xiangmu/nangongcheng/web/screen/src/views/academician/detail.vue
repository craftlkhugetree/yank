<template>
  <div style="width: 100vw">
    <div class="bg">
      <div class="detail">
        <div class="title_back">
          <title-back title="院士文库" :name="pForm.name" :route="route"></title-back>
        </div>
        <profile :profile="pForm.profile" :name="pForm.name"></profile>
        <div class="cover">
          <cover-run :unit="3" :fileList="fileList"></cover-run>
        </div>
      </div>
    </div>
    <detail-table :id="id" :rs="rs"></detail-table>
  </div>
</template>

<script>
import { personFind } from '@/api/person';
export default {
  name: 'AcadeDetail',
  components: {
    detailTable: () => import('./detailTable'),
    titleBack: () => import('@/components/titleBack'),
    profile: () => import('@/components/profile'),
    coverRun: () => import('@/components/coverRun'),
  },
  props: {
    id: String,
    route: String,
    rs: Number,
  },
  data() {
    return {
      pForm: {},
      fileList: [],
    };
  },
  computed: {},
  methods: {
    getById() {
      personFind(this.id).then(res => {
        if (res && res.code === '000000') {
          this.pForm = res.data;
          this.fileList = [];
          res.data.attachs &&
            res.data.attachs.forEach(a => {
              let obj = { ...a };
              obj.viewUrl = window.g.viewUrl + a.id;
              this.fileList.push(obj);
            });
          this.common.getVideoCanvas(this.fileList, undefined, this);
        }
      });
    },
  },
  mounted() {
    this.getById();
  },
};
</script>
<style lang="scss" scoped>
.detail {
  padding: 0 $m-left;
  // background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f9f4fe 100%);
  .title_back {
    padding: 40rem 0 32rem;
  }
  .cover {
    margin: 30rem 0;
  }
}
</style>
