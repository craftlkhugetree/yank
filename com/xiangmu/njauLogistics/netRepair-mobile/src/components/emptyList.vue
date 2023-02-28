<template>
  <div class="empty">
    <img src="../../static/images/nodata.png" alt="" />
    <p class="emptytxt">{{ txt }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    txt: {
      type: String,
      default: "没有找到报修记录",
    },
  },
  components: {},

  methods: {},
};
</script>
<style lang='scss' scoped>
.empty {
  width: 100%;
  background-color: #fff;
  padding: 40px 0;
  border-radius: 3px;
  & > img {
    display: block;
    margin: 0 auto;
    width: 80px;
    height: 80px;
  }
  & > .emptytxt {
    margin-top: 12px;
    color: rgba(153, 153, 153, 1);
    font-weight: 400;
    font-size: 12px;
    text-align: center;
  }
}
</style>