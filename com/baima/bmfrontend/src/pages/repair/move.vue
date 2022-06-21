<template>
  <div id="move">
    <div class="my-tab-wrap">
      <el-tabs class="my-el-tabs" v-model="activeTab" @tab-click="changeTab">
        <el-tab-pane label="维修" name="repair"></el-tab-pane>
        <el-tab-pane label="转移" name="move"></el-tab-pane>
      </el-tabs>
    </div>
    <el-divider></el-divider>

    <el-form
      style=" font-family: PingFangSC-Regular, PingFang SC;"
      :model="editForm"
      ref="edifForm"
      input-align="right"
      error-message-align="right"
      label-position="top"
      size="small"
      v-if="activeTab == 'repair'"
    >
      <el-form-item
        label="选择操作："
        prop="result"
        :rules="[{ required: true, message: '请选择维修结果' }]"
      >
        <el-radio-group
          v-model="editForm.result"
          class="elRadio"
          @change="$refs.edifForm.clearValidate()"
        >
          <el-radio label="3-1" class="itemRadio">维修完工</el-radio>
          <el-radio label="3-2" class="itemRadio">不维修</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="详细说明："
        prop="note"
        :rules="[
          { required: editForm.result === '3-2', message: '请填写详细说明' }
        ]"
      >
        <el-input
          v-model.trim="editForm.note"
          type="textarea"
          maxlength="200"
          rows="3"
          resize="none"
          placeholder="请输入"
          :show-word-limit="true"
        ></el-input>
      </el-form-item>

      <el-form-item label="图片说明：" v-if="editForm.result === '3-1'">
        <div class="upload-box" v-if="files.length < 3">
          <el-button icon="el-icon-upload2" size="small" @click="uploadFile"
            >上传图片</el-button
          >
          <p class="img-des">最多可上传三张照片</p>
        </div>
      </el-form-item>
    </el-form>

    <template v-if="activeTab == 'repair' && editForm.result === '3-1'">
      <div class="upload-imgs" v-for="(item, index) in files" :key="item.ID">
        <img :src="viewUrl + item.ID" alt />
        <i class="el-icon-close" @click="deleteFile(index)"></i>
      </div>
    </template>

    <opinions
      :isCol="true"
      :isRepairMove="true"
      ref="opinions"
      v-if="activeTab === 'repair' && editForm.result === '3-2'"
      style="margin-bottom:20px"
    ></opinions>

    <span class="text" v-if="activeTab == 'move'">
      {{ diagBody }}
    </span>

    <div slot="footer" class="dialog-footer">
      <div
        class="my-button green"
        @click.stop="move"
        v-if="activeTab == 'move'"
      >
        确认
      </div>
      <div v-else>
        <div class="my-button green" @click="confirmHandle">提交</div>
        <div class="my-button" @click="clearForm">
          重置
        </div>
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
      @choose="imgLoading = true"
      @done="finish"
    ></upload>
  </div>
</template>

<script>
import { handleBatch, move } from "@/assets/js/api";
import { roleId, bizNode } from "@/assets/js/options";
export default {
  name: "RepairMove",
  props: {
    rInfo: Object
  },
  components: {
    upload: () => import("@/components/BaseUpload"),
    opinions: () => import("@/components/opinions")
  },
  computed: {
    curRole() {
      let url = document.location.href;
      if (url.indexOf("/repair/bm_handle") > -1) {
        return roleId.bm;
      } else if (url.indexOf("/repair/hq_handle") > -1) {
        return roleId.hq;
      }
      return "16000";
    },
    viewUrl() {
      return this.$store.state.viewUrl;
    },
    uploadUrl() {
      return this.$store.state.uploadUrl;
    }
  },
  data() {
    return {
      diagBody: "",
      activeTab: "repair",
      files: [],
      fileType: "jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF",
      editForm: {
        note: "",
        result: ""
      }
    };
  },
  methods: {
    // 点击上传
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 上传文件
    finish(res) {
      this.imgLoading = false;
      if (res.success) {
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
    },
    // 批量办理
    confirmHandle() {
      this.$refs.edifForm.validate().then(res => {
        const arr = [];
        const params = {};
        if (this.editForm.result === "3-1") {
          let photos = "";
          this.files.forEach(f => {
            photos += f.ID + ",";
          });
          params.photos = photos.substring(0, photos.length - 1);
        }
        params.note = this.editForm.note;
        params.result = this.editForm.result;
        params.eventType = 3;
        params.repairId = this.rInfo.id;
        params.repairVersion = this.rInfo.version;
        arr.push(params);
        handleBatch(arr)
          .then(res => {
            if (res.success == true) {
              this.$message({
                showClose: true,
                type: "success",
                message: "办理成功"
              });
              this.clearForm();
              this.$emit("triggerTab", "processed");
            } else {
              this.$message({
                showClose: true,
                type: "warning",
                message: res.message
              });
            }
          })
          .catch(err => {});
      });
    },
    clearForm() {
      this.$refs.edifForm.resetFields();
      this.$refs.edifForm.clearValidate();
      this.editForm = {
        note: "",
        result: ""
      };
      this.files = [];
    },
    // 身份
    selfRole() {
      if (this.curRole === roleId.hq) {
        return bizNode.hq;
      } else if (this.curRole === roleId.bm) {
        return bizNode.bm;
      }
    },
    // 切换tab
    changeTab() {},
    // move
    move() {
      const params = {};
      params.moveNode = this.curRole === roleId.bm ? bizNode.hq : bizNode.bm;
      params.repairId = this.rInfo.id;
      params.repairVersion = this.rInfo.version;
      move(params)
        .then(res => {
          if (res.success == true) {
            this.$message({
              showClose: true,
              type: "success",
              message: "转移成功"
            });
            this.$emit("triggerTab", "transfered");
          } else {
            this.$message({
              showClose: true,
              type: "warning",
              message: res.message
            });
          }
        })
        .catch(err => {});
    }
  },
  created() {
    this.diagBody =
      this.curRole === roleId.bm
        ? "是否转移至后勤管理员？"
        : "是否转移至白马管理员？";
  }
};
</script>

<style lang="scss" scoped>
.elRadio {
  display: flex;
  flex-wrap: wrap;
  .itemRadio {
    flex-basis: 20%;
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

.upload-box {
  display: inline-block;
  margin-right: 20px;
  vertical-align: top;
  margin-bottom: 10px;
  .img-des {
    color: rgba(0, 0, 0, 0.45);
  }
}
/deep/ .el-divider.el-divider--horizontal {
  margin-top: -16px;
}
.text {
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #172535;
  line-height: 20px;
  display: inline-block;
  margin: 20px 0;
}
</style>
