<template>
  <div>
    <div slot="footer" class="dialog-footer" style="margin-bottom:20px">
      <el-button size="small" @click="() => $emit('closeDialog')">取 消</el-button>
      <el-button type="primary" @click="confirm" size="small">确 定</el-button>
    </div>

    <el-form ref="form" :model="form" :rules="rules" label-width="110px" style="margin:0 50px">
      <el-form-item label="文件类型" prop="fileType">
        <el-select
          v-model="form.fileType"
          placeholder="请选择"
          style="width:100%"
          @change="fileTypeChange"
          :disabled="dialogType =='edit'"
        >
          <el-option
            v-for="item in fileList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="适用对象" prop="readerTypes">
        <el-select v-model="form.readerTypes" multiple style="width:100%">
          <el-option v-for="(v,k) in userTypes" :label="v.readname" :key="v.id" :value="v.readtype"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="校区" prop="campuss">
        <el-select v-model="form.campuss" multiple placeholder="请选择" style="width:100%">
          <el-option
            :label="item.name"
            :value="item.id"
            :key="index"
            v-for="(item,index) in campusList"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文件名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item v-if="form.fileType ==1" label="文件简介">
        <!-- <editor class="my-editor" id="editor_id" height="350px" :content="editorDes" :items="itemDes"
                    pluginsPath="/static/kindeditor/plugins/" :uploadJson="uploadJson"
        :loadStyleMode="false" @on-content-change="onDesChange"></editor>-->
        <angkeeditor id="editor_id" height="500px" width="100%" :option="option" ref="editor"></angkeeditor>
      </el-form-item>

      <el-form-item v-else label="文件简介">
        <el-input v-model="form.description" type="textarea"></el-input>
      </el-form-item>

      <el-form-item v-if="form.fileType ==3" label="文章内容" prop="dhtml">
        <!-- <editor class="my-editor" id="editor_id" height="350px" :content="editorText" :items="item"
                    pluginsPath="/static/kindeditor/plugins/" :uploadJson="uploadJson"
        :loadStyleMode="false" @on-content-change="onContentChange"></editor>-->
        <angkeeditor id="editor_id" height="500px" width="100%" :option="option" ref="editor"></angkeeditor>
      </el-form-item>

      <el-form-item label="资料图片" prop="photourl">
        <el-button type="primary" plain size="small" @click="uploadFile('image')">上传图片</el-button>
        <span style="color: red">(可上传格式有 png,jpg,gif)</span>
        <div v-if="form.photourl">
          <img :src="domain+form.photourl" style="width:150px;height:150px;object-fit:cover" />
          <el-tooltip effect="dark" content="删除图片" placement="top-start">
            <img
              class="photo-img-del"
              src="../../../static/images/type-item-delete.png"
              @click="deletePhoto"
            />
          </el-tooltip>
        </div>
      </el-form-item>

      <el-form-item label="附件" prop="url" v-if="form.fileType !=3">
        <el-button type="primary" plain size="small" @click="uploadFile('file')">上传附件</el-button>
        <span style="color: red" v-if="form.fileType==1">(可上传格式有 mpeg,mpg,dat,mp4,mkv)</span>
        <span style="color: red" v-if="form.fileType==2">(可上传格式有 pdf,doc,docx,xls,xlsx,ppt,pptx)</span>

        <div>{{this.form.url ? this.form.url.split("/")[this.form.url.split("/").length-1] : ""}}</div>
      </el-form-item>

      <el-form-item v-if="form.fileType != 3" label="是否开启下载" prop="showdown">
        <el-radio-group v-model="form.showdown">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否必学" v-if="islearnnum" prop="isNeedstudy">
        <el-radio-group v-model="form.isNeedstudy">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- <el-progress :percentage="percentage"></el-progress> -->

      <!-- <el-button icon="el-icon-plus" @click="increase" size="small"></el-button> -->
    </el-form>

    <!--上传组件-->
    <!-- <upload2  v-show="false" :url="uploadUrl" ref="child" :exts="suffixName" :size="fileSize" @choose="choosefile" @done="finish" @progress="getProgress"></upload2>     -->
    <upload
      v-show="false"
      :url="uploadUrl"
      ref="child"
      :exts="suffixName"
      :size="fileSize"
      @choose="choosefile"
      @done="finish"
    ></upload>

    <!--上传组件-->
    <!-- <upload  v-show="false" :url="uploadUrl" ref="child" :exts="suffixName" :size="fileSize" @choose="choosefile" @done="finish" 
    @increase="increase" @increaseLater="increaseLater" @error="error"></upload>-->

    <!--上传组件-->
    <upload
      v-show="false"
      :url="uploadUrl"
      ref="child2"
      exts="png|PNG|jpg|JPG|gif|GIF"
      @done="finishImg"
    ></upload>
  </div>
</template>

<script>
import upload from "../../components/BaseUpload.vue";
import upload2 from "../../components/BaseUpload2.vue";
import { VueEditor } from "vue2-editor";
import { defaultBar } from "../../assets/js/editorToolBar.js";
import axios from "axios";

export default {
  components: { upload, VueEditor, defaultBar, upload2 },
  props: {
    fileType: String,
    dialogTitle: String,
    dialogType: String,
    islearnnum: Boolean
  },

  data() {
    return {
      option: {
        uploadJson: "/uploadimg", //上传地址
        filePostName: "file", //上传文件字段
        templateUrl: "/static"
      },
      form: {
        id: "",
        name: "",
        fileType: "",
        campuss: [],
        description: "",
        dhtml: "",
        url: "",
        readerTypes: [],
        showdown: "1",
        isNeedstudy: "0"
      },
      fileList: this.options.fileList,
      campusList: [], //校区列表
      userTypes: [],
      rules: {
        name: [{ required: true, message: "请输入题目内容", trigger: "blur" }],
        description: [
          { required: true, message: "请选择答案", trigger: "blur" }
        ],
        url: [{ required: true, message: "请上传附件", trigger: "change" }],
        fileType: [
          { required: true, message: "请选择文件类型", trigger: "change" }
        ],
        campuss: [{ required: true, message: "请选择校区", trigger: "change" }],
        readerTypes: [
          { required: true, message: "请选择适用对象", trigger: "change" }
        ],
        showdown: [
          { required: true, message: "请选择是否开启下载", trigger: "change" }
        ],
        isNeedstudy: [
          { required: true, message: "请选择是否必学", trigger: "change" }
        ],
        dhtml: [{ required: true, message: "请输入文章内容", trigger: "blur" }]
      },
      domain: this.global.domain, //域名

      dialogTypeText: "",
      uploadUrl: "",
      suffixName: "",
      fileSize: "",
      item: [
        "undo",
        "redo",
        "|",
        "cut",
        "copy",
        "paste",
        "plainpaste",
        "wordpaste",
        "|",
        "justifyleft",
        "justifycenter",
        "justifyright",
        "justifyfull",
        "insertorderedlist",
        "insertunorderedlist",
        "indent",
        "outdent",
        "quickformat",
        "selectall",
        "|",
        "fontname",
        "fontsize",
        "|",
        "forecolor",
        "hilitecolor",
        "bold",
        "italic",
        "lineheight",
        "removeformat",
        "|",
        "table",
        "hr",
        "|",
        "image"
      ], //富文本框组件'formatblock',表示的是H1H2H3
      itemDes: [
        "undo",
        "redo",
        "|",
        "cut",
        "copy",
        "paste",
        "plainpaste",
        "wordpaste",
        "|",
        "justifyleft",
        "justifycenter",
        "justifyright",
        "justifyfull",
        "insertorderedlist",
        "insertunorderedlist",
        "indent",
        "outdent",
        "quickformat",
        "selectall",
        "|",
        "fontname",
        "fontsize",
        "|",
        "forecolor",
        "hilitecolor",
        "bold",
        "italic",
        "lineheight",
        "removeformat",
        "|",
        "table",
        "hr"
      ], //富文本框组件
      uploadJson: "http://file.dev.angke.com.cn/fileweb/rest/FileOut/saveFile", //富文本框上传地址
      editorText: "",
      editorDes: "",
      customToolbar: defaultBar,
      uploaderUrl: "http://app.dev.angke.com.cn/lres/rest/upload/add", //上传路径放至七牛

      inter: "",
      status: "",
      percentage: 5
    };
  },

  methods: {
    getProgress(res) {
      this.percentage = res;
      this.$forceUpdate();
    },

    increase() {
      this.inter = "";
      this.status = "";
      this.percentage = 5;
      this.inter = setInterval(() => {
        this.percentage += 5;

        console.log(this.result);
        if (this.percentage > 50) {
          this.percentage = 50;
        }
      }, 1000);
    },

    increaseLater(res) {
      clearInterval(this.inter);
      if (res.success) {
        this.percentage = 100;
        this.status = "success";
      } else {
        this.status = "exception";
        return this.percentage;
      }
    },

    error(err) {
      this.status = "exception";
      this.$message({
        type: "error",
        message: "网络异常,上传失败"
      });
    },

    // 图片删除
    deletePhoto() {
      this.form.photourl = "";
      this.$forceUpdate();
    },

    fileTypeChange() {
      switch (this.form.fileType) {
        case 1:
          this.fileTypeText = "视频";
          this.suffixName = "mpeg|mpg|dat|mp4|mkv";
          this.fileSize = 1024 * 10240;
          break;
        case 2:
          this.fileTypeText = "文档";
          this.suffixName = "pdf|doc|docx|xls|xlsx|ppt|pptx";
          this.fileSize = 1024 * 50;
          break;
        case 3:
          this.fileTypeText = "文章";
          this.fileSize = 1024 * 100;
          this.suffixName =
            "mpeg|mpg|dat|mp4|mkv|pdf|doc|docx|xls|xlsx|ppt|pptx";
          break;
      }
      // console.log(this.form.fileType)

      // console.log(this.suffixName)
    },

    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData();
      formData.append("file", file);
      axios({
        url: this.uploaderUrl,
        method: "POST",
        data: formData
      })
        .then(result => {
          // console.log(result.data.item);
          let url = result.data.item.fileUrl; // Get url from response
          Editor.insertEmbed(cursorLocation, "image", url);
          resetUploader();
        })
        .catch(err => {
          console.log(err);
        });
    },

    onContentChange(val) {
      // console.log(a);
      this.form.dhtml = val;
    },

    onDesChange(val) {
      this.form.description = val;
    },

    //获取上传的url
    getUploadFile() {
      this.util.getUrlByCode(this.global.code, "/upload/add").then(res => {
        this.uploadUrl = res;
      });
    },

    uploadFile(type) {
      switch (type) {
        case "file":
          this.$refs.child.$refs.uploaddom.click();
          break;
        case "image":
          this.$refs.child2.$refs.uploaddom.click();
          break;
      }
    },

    //上传图片
    choosefile(file) {
      // console.log(file)
    },

    // 图片上传完成后
    finish(res) {
      console.log("上传后回调", res);

      this.form.url = res.item.fileUrl;
      this.$forceUpdate();
    },

    finishImg(res) {
      this.form.photourl = res.item.fileUrl;
      // console.log("图片上传后",this.form.photourl)
      this.$forceUpdate();
    },

    // 提交
    submit() {
      let arr = [];
      this.form.campuss.forEach(v => {
        arr.push({ id: v });
      });

      let readerArr = [];
      if (this.form.readerTypes && this.form.readerTypes.length > 0) {
        this.form.readerTypes.forEach(v => {
          readerArr.push({ readtype: v });
        });
      }

      let form = {
        fileType: this.form.fileType,
        name: this.form.name,
        campuss: arr,
        description: this.form.description,
        dhtml: this.form.dhtml,
        url: this.form.url,
        id: this.form.id,
        photourl: this.form.photourl,
        readerTypes: readerArr,
        showdown: this.form.showdown,
        isNeedstudy: this.form.isNeedstudy
      };

      let url = "";
      switch (this.dialogType) {
        case "add":
          url = "/lresource/add";
          break;
        case "edit":
          url = "/lresource/update";
          break;
      }

      console.log(form);
      // return;

      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      this.util
        .postAjax({
          code: this.global.code,
          url: url,
          isRep: true,
          data: form
        })
        .then(res => {
          // console.log(res);
          loading.close();
          if (res.success) {
            this.$message({
              type: "success",
              message: this.dialogTitle + "成功"
            });

            switch (this.dialogType) {
              case "add":
                this.$emit("closeDialog");
                break;
              case "edit":
                this.$emit("closeEditDialog");
                break;
            }
          }
        });
    },

    confirm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.submit();
        }
      });

      // return;
    }
  },

  created() {
    console.log(this.islearnnum);
    this.getUploadFile();

    // this.fileTypeChange();

    // 获取校区列表
    this.common.getCampusList().then(res => {
      if (res.success) {
        this.campusList = res.items;
      }
    });

    //获取使用对象接口
    this.common.getUserTypes().then(res => {
      if (res.success) {
        this.userTypes = res.items;
        console.log(this.userTypes);
      }
    });

    if (this.dialogType == "add") {
      this.form.fileType = 1;
      this.fileTypeChange();
    }
  }
};
</script>