<template>
  <el-drawer
    class="base-drawer"
    title="批量转移"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660"
  >
    <el-form :model="editForm" ref="editForm" style="padding:30px;">
      <el-form-item label="维修单位：" prop="repairdeptid" :rules="[{required: true,message:'请选择维修单位'}]">
        <el-select v-model="editForm.repairdeptid" size="small" clearable filterable style="width:350px;">
          <el-option v-for="item in deptList" :key="item.ID" :label="item.NAME" :value="item.ID"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转移说明：" prop="note" :rules="[{required: true,message:'请输入转移说明'}]">
        <el-input
          v-model="editForm.note"
          type="textarea"
          maxlength="200"
          rows="5"
          resize="none"
          placeholder="请输入说明，不超过200字"
          style="width:350px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="图片说明：" prop="photos" style="padding-left:10px;">
        <div class="upload-box" v-if="editForm.photos.length < 3">
          <el-button icon="el-icon-upload2" size="small" @click="upload" :loading="imgLoading">上传图片</el-button>
          <p class="img-des">最多可上传三张照片</p>
        </div>
        <div class="upload-imgs" v-for="(item,index) in editForm.photos" :key="item">
          <img :src="fileUrl + item" alt />
          <i class="el-icon-close" @click="deletePhoto(index)"></i>
        </div>
      </el-form-item>
    </el-form>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="doSubmit">提交</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>    
    <!------------------------- 上传组件 ------------------------->
    <upload
      v-show="false"
      :multiple="false"
      :size="5120"
      exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
      @done="uploaded"
      @choose="imgLoading=true"
      :url="$store.state.uploadUrl"
      ref="upload"
    ></upload>
  </el-drawer>
</template>

<script>
import upload from "../../../components/BaseUpload";
export default {
  props: {
    deptList: Array
  },
  components: {
    upload
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
  },
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      imgLoading: false,
      editForm: {
        repairdeptid: "",
        note: "",
        photos: []
      },
      selectArr: []
    };
  },
  methods: {
    closeDrawer() {
      this.$refs.editForm.resetFields();
    },
    // 上传
    upload() {
      this.$refs.upload.toupload();
    },
    // 上传完成
    uploaded(res) {
      this.imgLoading = false;
      if (res.success && this.editForm.photos.length < 3) {
        this.editForm.photos.unshift(res.data[0].ID);
      } else {
        this.$message({
          showClose: true,
          message: "上传失败！",
          type: "error"
        });
      }
    },
    // 删除图片
    deletePhoto(index) {
      this.editForm.photos.splice(index, 1);
    },
    // 转移
    doSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let arr = this.selectArr.map(i => {
            return {
              applyid: i.id,
              version: i.version,
              repairdeptid: this.editForm.repairdeptid,
              note: this.editForm.note,
              photos: this.editForm.photos.join(",")
            };
          });
          this.util
            .postAjax({
              code: this.global.code,
              url: "apply/moveBatch",
              isRep: true,
              data: arr
            })
            .then(res => {
              this.drawerLoading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: `转移成功`
                });
                this.drawer = false;
                this.$emit("doFunc");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `转移失败：${res.data.message}`
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `转移失败：${err}`
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-box {
  display: inline-block;
  margin-right: 20px;
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
  margin-right: 12px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
</style>