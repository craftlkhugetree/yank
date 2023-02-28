<template>
  <div>
    <el-form :model="form2" ref="form2" :rules="rules">
      <!-- :hide-required-asterisk="true" -->
      <el-form-item
        :label="activeName == '3' ? '单价(元/吨)' : '单价(元/度)'"
        :label-width="formLabelWidth"
        prop="price"
      >
        <el-input-number
          v-model.number="form2.price"
          style="width: 100%"
          controls-position="right"
          :min="0"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :label="activeName == '3' ? '数值(吨)' : '数值(度)'"
        :label-width="formLabelWidth"
        prop="priceNum"
      >
        <el-input-number
          v-model.number="form2.priceNum"
          style="width: 100%"
          controls-position="right"
          :min="form2.lastshowv ? form2.lastshowv : 0"
          :precision="2"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="上传图片" :label-width="formLabelWidth">
        <div class="upload-btn" @click="uploadFile" v-if="files.length < 1">
          <span>上传图片</span>
          <img :src="require('st@tic/images/upload.png')" />
        </div>
        <!-- <div class="upload-box" v-if="files.length < 1">
          <el-button icon="el-icon-upload2" size="small" @click="uploadFile"
            >上传图片</el-button
          >
        </div> -->
      </el-form-item>
    </el-form>
    <div v-if="files.length">
      <div class="upload-imgs" v-for="(item, index) in files" :key="item.ID">
        <img :src="viewUrl + item.ID" alt />
        <i class="el-icon-close" @click="deleteFile(index)"></i>
      </div>
    </div>
    <!-- 上传组件 -->
    <upload
      v-show="false"
      ref="upload"
      class="my-upload"
      :url="uploadUrl"
      :multiple="false"
      :exts="fileType"
      :isCarmera="true"
      @done="finish"
    ></upload>
  </div>
</template>

<script>
export default {
  name: "applyDialog",
  props: {
    form2: Object,
    formLabelWidth: String,
    activeName: String
  },
  components: {
    upload: () => import("@/components/BaseUpload")
  },
  computed: {
    uploadUrl() {
      return this.$store.state.uploadUrl;
    },
    viewUrl() {
      return this.$store.state.viewUrl;
    }
  },
  data() {
    return {
      files: [],
      fileType: "jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF",
      jzgList: [], //教职工列表
      typeList: JSON.parse(sessionStorage.getItem("typeList")), //资源类型列表
      codeList: [], //资源编号列表
      groupList: JSON.parse(sessionStorage.getItem("groupList")), //学院列表
      rules: {
        price: [{ required: true, message: "请输入单价", trigger: "blur" }],
        priceNum: [{ required: true, message: "请输入数值", trigger: "blur" }]
      }
    };
  },

  methods: {
    //刷新
    forceUpdate() {
      this.$forceUpdate();
    },
    // 点击上传
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 上传文件
    finish(res) {
      if (res && res.success) {
        let data = res.data || [];
        data.forEach(i => {
          i.FILEID = i.ID;
        });
        this.files = data.concat(this.files);
      }
    },
    // 删除图片
    deleteFile(index) {
      this.files.splice(index, 1);
    }
  },
  created() {
    // console.log("222",this.form);
  }
};
</script>

<style scoped lang="scss">
.upload-box {
  display: inline-block;
  // margin-right: 20px;
  vertical-align: top;
  .img-des {
    color: rgba(0, 0, 0, 0.45);
  }
}
.upload-imgs {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #f6f6f6;
  text-align: center;
  margin: 10px 12px 10px 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  i {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.2);
    color: #ffffff;
    font-size: 10px;
    padding: 2px;
    cursor: pointer;
  }
}
// /deep/ .el-form-item__label:after {
//   content: "*";
//   color: #f56c6c;
// }
.upload-btn {
  width: 100%;
  height: 44px;
  background: rgba(243, 245, 249, 0.6);
  border-radius: 3px;
  border: 1px dashed #b8bbbe;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  span {
    display: inline-block;
    width: 56px;
    height: 44px;
    overflow-wrap: break-word;
    color: rgba(91, 94, 103, 1);
    font-size: 14px;
    white-space: nowrap;
    line-height: 44px;
  }
  img {
    float: right;
    width: 34px;
    height: 34px;
    margin: 5px 5px;
    vertical-align: middle;
  }
}
</style>
