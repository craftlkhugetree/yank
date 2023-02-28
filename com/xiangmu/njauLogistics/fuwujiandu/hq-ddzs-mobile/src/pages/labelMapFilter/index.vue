<template>
  <div>
    <role-bar :title="title"></role-bar>
    <lm-filter :obj="$route.query" @onDate="onDate"></lm-filter>
    <item :params="params" ref="photoItems"></item>
  </div>
</template>
<script>
export default {
  name: "LabelMapFilter",
  components: {
    lmFilter: () => import("@/components/filter"),
    item: () => import("@/components/photoItems")
  },
  props: {
    title: String
  },
  computed: {
    isLabel() {
      return this.title === "共性标签";
    }
  },
  data() {
    return {
      params: {
        filter: {},
        roleName: this.common.getStore(this.global.roleName)
      }
    };
  },
  methods: {
    resetPage() {
      this.$refs.photoItems.$refs.list.curPage = 1;
    },
    onDate(d1, d2) {
      this.resetPage();
      if (d1 && d2) {
        this.$set(this.params.filter, this.global.ST, d1.replace(/-/g, ""));
        this.$set(this.params.filter, this.global.ET, d2.replace(/-/g, ""));
      } else {
        this.$delete(this.params.filter, this.global.ST);
        this.$delete(this.params.filter, this.global.ET);
      }
    }
  },
  created() {
    if (this.isLabel) {
      // this.$set(this.params.filter, "labels", this.$route.query.name);
      this.params.filter.labels = this.$route.query.name;
    } else {
      // this.$set(this.params.filter, "areaId", this.$route.query.areaId);
      this.params.filter.areaId = this.$route.query.areaId;
    }
  }
};
</script>
<style lang="scss" scoped>
.type-item {
  height: 20px;
  padding: 8px 0;
  text-align: left;
  .name {
    flex-basis: 70%;
    margin-left: 3px;
    color: #595959;
  }
  span {
    margin-left: auto;
    color: #8c8c8c;
  }
}
</style>
