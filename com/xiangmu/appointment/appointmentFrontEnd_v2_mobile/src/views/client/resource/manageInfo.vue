<template>
  <div class="wrapper">
    <van-nav-bar
      title="管理办法"
      fixed
      :border="false"
      left-arrow
      @click-right="jumpSearch"
      @click-left="$router.go(-1)"
    >
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <section class="main-wapper">
      <div class="manager-html" v-html="managerinfo" v-if="managerinfo"></div>
      <div class="manager-html" v-else>无</div>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  components: {},
  created() {},
  computed: {
    managerinfo: function() {
      // F5刷新记录当前信息
      if (Object.keys(this.$route.params).length) {
        sessionStorage.setItem(
          "managerinfo",
          JSON.stringify(this.$route.params.managerinfo)
        );
      }
      let info = JSON.parse(sessionStorage.getItem("managerinfo"));
      return info;
    }
  },
  mounted() {},
  methods: {
    //跳转到搜索
    jumpSearch() {
      this.$router.push({
        name: "res-search"
      });
    }
  }
};
</script>
<style lang='scss'>
.manager-html {
  line-height: 26px;
  padding: 10px 0 20px;
  color: #474d51;
  border-top: 1px solid #f2f2f2;
  overflow-y: auto;
  /deep/ strong {
    font-weight: bold !important;
  }
  h1 {
    font-size: 2em !important;
  }
  h2 {
    font-size: 1.5em !important;
  }
  h3 {
    font-size: 1.17em !important;
  }
  h4 {
    font-size: 1em !important;
  }
  h5 {
    font-size: 0.83em !important;
  }
  p {
    font-size: 1em !important;
  }
  .placeholder {
    color: #d4d4d4;
    position: absolute;
    font-size: 11pt;
    line-height: 22px;
    left: 10px;
    top: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: -1;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  table,
  pre {
    margin: 10px 0 !important;
    line-height: 1.5 !important;
  }
  i {
    font-style: italic !important;
  }
  ul,
  ol {
    margin: 10px 0 10px 20px !important;
  }
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }
  code {
    display: inline-block;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }
  table {
    border-top: 1pt solid #ccc !important;
    border-left: 1pt solid #ccc !important;
  }
  table td,
  table th {
    border-bottom: 1pt solid #ccc !important;
    border-right: 1pt solid #ccc !important;
    padding: 3px 5px !important;
    min-height: 30px !important;
    height: 30px !important;
  }
  table th {
    border-bottom: 2px solid #ccc !important;
    text-align: center !important;
    background-color: #f1f1f1 !important;
  }
  :focus {
    outline: none;
  }
  img {
    cursor: pointer;
  }
  img:hover {
    box-shadow: 0 0 5px #333;
  }

  li {
    list-style: none;
    font-size: 1em;
  }
  li span:nth-child(1) {
    position: relative;
    left: -18px;
  }
  li span:nth-child(1) input {
    position: absolute;
    margin-right: 3px;
  }
  li span:nth-child(1) input[type="checkbox"] {
    top: 50%;
    margin-top: -6px;
  }
}
</style>
<style lang="scss" scoped>
.main-wapper {
  padding: 32px;
  margin-top: 64px;
}
</style>
