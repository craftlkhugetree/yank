<template>
  <div class="search-box clearfix">
    <h3 v-if="h3">{{ h3 }}</h3>
    <span v-if="totalTitle" class="text">{{totNum}}</span>
    <div class="search-box-right">
      <el-input
        v-if="!nosearch"
        class="input-box"
        v-model="inputStr"
        :placeholder="ph"
        size="small"
        style="width:190px;"
        clearable
        @keyup.enter.native="search"
      ></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search" v-if="!nosearch">
        查询
      </el-button>
      <el-divider direction="vertical" v-if="!nosearch"></el-divider>
      <el-button
        class="orange-btn"
        size="small"
        plain
        type="primary"
        icon="el-icon-plus"
        @click="openAdd"
      >
        新增
      </el-button>
      <el-button v-if="!nodown" type="primary" icon="el-icon-download" size="small" @click="download">
        下载模板
      </el-button>
      <el-button
        v-if="!noupload"
        type="primary"
        icon="el-icon-upload2"
        size="small"
        @click="uploadFile"
      >
        导入
      </el-button>
    </div>
    <input
      type="file"
      :multiple="false"
      @change="getFile"
      title="上传文件"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      class="upload-input"
      ref="uploadDom"
    />
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
    totalTitle: {
      type: String,
    },
    nosearch: {
      type: Boolean,
      default: false,
    },
    nodown: {
      type: Boolean,
      default: false,
    },
    noupload: {
      type: Boolean,
      default: false,
    },
    ph: {
      type: String,
    },
  },
  computed: {
    totNum() {
      return `共有${this.totalTitle}条`
    }
  },
  data() {
    return {
      inputStr: '',
    };
  },
  methods: {
    search: _.throttle(function() {
      this.$emit('search', this.inputStr);
    }, 1000),
    clear() {
      this.$refs.uploadDom.value = '';
    },
    openAdd() {
      this.$emit('openAdd');
    },
    download() {
      this.$emit('down');
    },
    getFile(e) {
      this.$emit('upload', e);
    },
    uploadFile() {
      this.$refs.uploadDom.click();
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-input {
  display: none;
}
</style>
