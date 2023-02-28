<template>
  <van-popup
    v-model="centerShow"
    position="right"
    :style="{ height: '100%', width: '95%' }"
    @close="close"
  >
    <role-bar title="我要督查"></role-bar>
    <div class="title-bg all">
      <van-search
        :clearable="false"
        v-model="keyword"
        placeholder="请输入"
        autofocus
        show-action
        @cancel="close"
        maxlength="20"
        class="v_search wind"
        :autocomplete="false"
      />
      <van-cell v-for="item in label" :key="item.id" @click="goDetail(item)">
        <div class="div_flex font-s type-item">
          <div class="name ellipsis">{{ item.name }}</div>
        </div>
      </van-cell>
    </div>
  </van-popup>
</template>
<script>
export default {
  name: "MapSide",
  props: {
    form: Object
  },
  data() {
    return {
      centerShow: false,
      label: [],
      keyword: ""
    };
  },
  watch: {
    keyword(val) {
      this.label = this.form.locList.filter(f => f.name.indexOf(val) > -1);
    }
  },
  methods: {
    goDetail(item) {
      this.form.areaName = item.name;
      this.form.areaId = item.id;
      this.form.position = item;
      this.common.setStore(this.global.FORM, this.form);
      this.common.back();
    },
    close() {
      this.keyword = "";
      this.centerShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.all {
  height: 100vh;
}
.type-item {
  height: 20px;
  padding: 8px 0;
  text-align: left;
  color: #595959;
  &:hover {
    color: #ff9900;
  }
  &.on {
    color: #ff9900;
  }
  .name {
    flex-basis: 70%;
    margin-left: 3px;
  }
}
.v_search {
  width: 100%;
  /deep/ .van-search__action {
    color: #006457;
  }
}
/deep/ .van-search {
  //   padding-left: 0;
}
</style>
