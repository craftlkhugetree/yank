<template>
  <div class="search-box">
    <h3>{{ h3 }}</h3>
    <slot />
    <div class="search-box-right div_flex">
      <div class="input div_flex">
        <span class="preText">{{ preText }}&nbsp;&nbsp;|</span>
        <el-input
          class="input-box"
          maxlength="100"
          v-model="inputStr"
          :placeholder="ph"
          @keyup.enter.native="search"
        ></el-input>
      </div>
      <el-button type="primary" class="eebutton" @click="search">搜&nbsp;索</el-button>
      <!-- <el-button type="primary" class="eebutton" @click="search"><span class="sousuo">搜&nbsp;索</span></el-button> -->
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'SearchBar',
  props: {
    h3: {
      type: String,
    },
    preText: {
      type: String,
    },
    ph: {
      type: String,
    },
    searchName: {
      type: String,
    },
  },
  computed: {},
  data() {
    return {
      inputStr: this.searchName || '',
    };
  },
  methods: {
    search: _.throttle(function() {
      this.$emit('search', this.inputStr);
    }, 1000),
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  margin: 51rem 80rem;
  display: flex;
  align-items: center;
  h3 {
    @include fz(16rem, #000, 700);
    line-height: 22rem;
    height: 22rem;
  }
  .year-input {
    margin-left: 20rem;
    width: 160rem;
    /deep/ .el-input__inner {
      background-color: #f9f9f9;
      vertical-align: middle;
      @include fonts(14, $color-purple);
    }
  }
  .search-box-right {
    margin-left: auto;
    height: 44rem;
    width: 540rem;
    /deep/ .el-input__inner {
      border: 0;
      vertical-align: middle;
      background-color: #f9f9f9;
    }
    .input {
      margin-right: 12rem;
      width: 438rem;
      height: 44rem;
      background: #f9f9f9;
      border-radius: 6rem;
      .preText {
        margin: auto 16rem;
        @include fz();
      }
      .input-box {
        width: 70%;
        border-radius: 6rem;
      }
      /deep/ .el-input__inner {
        font-size: 14rem * $arq;
        vertical-align: middle;
      }
    }
  }
}
.eebutton {
  font-size: 14rem * $arq;
  border-radius: 6px;
}
// /deep/ .el-input__inner {
//   height: 100%;
//   font-size: 12rem;
// }
// /deep/ .el-input {
//   height: 100%;
// }
</style>
