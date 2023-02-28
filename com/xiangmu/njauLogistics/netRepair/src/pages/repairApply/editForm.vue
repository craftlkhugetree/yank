<template>
  <div v-loading="loading">
    <el-form
      class="edit-form"
      :model="editForm"
      ref="editForm"
      :rules="rules"
      label-position="top"
      label-suffix="："
      size="small"
    >
      <el-form-item label="维修类型" prop="faulttype" style="margin-bottom:18px;">
        <el-radio-group v-model="editForm.faulttype" @change="changeFaulttype">
          <el-radio v-for="item in repairTypeList" :key="item.id" :label="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="报修区域" prop="areatype" style="margin-bottom:0">
        <el-radio-group v-model="editForm.areatype" @change="changeArea">
          <el-radio v-for="item in repairAreaList" :key="item.id" :label="item.id" >{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="areaname"
        v-if="['1','2'].includes(editForm.areatype)"
        style="margin-bottom:18px"
      >
        <el-select
          v-model="editForm.areaname"
          filterable
          remote
          :placeholder="placeholder"
          :remote-method="remoteMethod"
          :loading="arealoading"
          style="width:100%"
        >
          <el-option v-for="item in areaList" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
        <i class="el-icon-search select-search"></i>
      </el-form-item>
      <!-- <el-form-item prop="roominfo" v-if="['1','2'].includes(editForm.areatype)">
        <el-row>
          <el-col :span="11">
            <el-input
              :disabled="editForm.pubareainfo !==''"
              v-model="editForm.roominfo"
              placeholder="请输入房间号"
            ></el-input>
          </el-col>
          <el-col :span="2" style="text-align:center">或</el-col>
          <el-col :span="11">
            <el-input
              :disabled="editForm.roominfo !==''"
              v-model="editForm.pubareainfo"
              placeholder="请输入公共区域地点"
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>-->
      <el-form-item prop="roomOrPub" v-if="['1','2'].includes(editForm.areatype)">
        <el-radio-group v-model="editForm.roomOrPub" @change="changeRoom" style="width:100%;">
          <el-row :gutter="20" style="margin-bottom: 10px;">
            <el-col :span="4" style="line-height: 32px;">
              <el-radio label="room" style="vertical-align:middle;">房间号</el-radio>
            </el-col>
            <!-- 校园其他楼宇需要选择房间类型 -->
            <el-col :span="8" v-if="['2'].includes(editForm.areatype)">
              <el-select
                v-model="editForm.roomtype"
                placeholder="选择房间类型"
                style="width:100%"
                class="bottom-border"
                :class="{'error-inside': editForm.roomOrPub == 'room'}"
                :disabled="editForm.roomOrPub !== 'room'"
              >
                <el-option
                  v-for="item in roomTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="['2'].includes(editForm.areatype) ? 12 : 20">
              <el-input
                class="bottom-border"
                :class="{'error-inside': editForm.roomOrPub == 'room'}"
                :disabled="editForm.roomOrPub !== 'room'"
                v-model="editForm.roominfo"
                :placeholder="roomPlaceHolder"
              ></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="4" style="line-height: 32px;">
              <el-radio label="pub" style="vertical-align:middle;">公共区域</el-radio>
            </el-col>
            <el-col :span="20">
              <el-input
                class="bottom-border"
                :class="{'error-inside': editForm.roomOrPub == 'pub'}"
                :disabled="editForm.roomOrPub !== 'pub'"
                v-model="editForm.pubareainfo"
                :placeholder="editForm.faulttype == '1' ? '填写公共区域由物业中心维修' : '填写公共区域'"
              ></el-input>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="areaname" v-if="['3','4','5','6', '7'].includes(editForm.areatype)">
        <el-input v-model="editForm.areaname" :placeholder="placeholder"></el-input>
      </el-form-item>
      <el-form-item label="详细描述" prop="note">
        <el-input
          v-model="editForm.note"
          type="textarea"
          maxlength="200"
          rows="5"
          resize="none"
          placeholder="请输入说明，不超过200字"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input v-model="editForm.mobile" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="图片说明" prop="photos">
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
  </div>
</template>

<script>
import upload from "../../components/BaseUpload";
export default {
  components: {
    upload
  },
  data() {
    let checkAreaName = (rule, value, callback) => {
      if (!value) {
        let name = this.repairAreaList.filter(
          i => i.id === this.editForm.areatype
        )[0].name;
        return callback(new Error(`请输入${name}名称`));
      } else {
        callback();
      }
    };
    let checkRoomOrPub = (rule, value, callback) => {
      if (["1", "2"].includes(this.editForm.areatype)) {
        if (!value) {
          return callback(new Error(`请选择房间号或公共区域`));
        } else if (
          value == "room" &&
          this.editForm.areatype == "2" &&
          (!this.editForm.roomtype || !this.editForm.roominfo)
        ) {
          return callback(new Error(" "));
          // return callback(new Error(`请选择房间类型并填写房间号`));
        } else if (
          value == "room" &&
          this.editForm.areatype == "1" &&
          !this.editForm.roominfo
        ) {
          // return callback(new Error(`请填写房间号`));
          return callback(new Error(" "));
        } else if (value == "pub" && !this.editForm.pubareainfo) {
          return callback(new Error(" "));
          // return callback(new Error(`请填写公共区域`));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let checkRoomInfo = (rule, value, callback) => {
      if (
        ["1", "2"].includes(this.editForm.areatype) &&
        !value &&
        !this.editForm.pubareainfo
      ) {
        return callback(new Error("请输入房间号或者公共区域地点"));
      } else {
        callback();
      }
    };
    let checkPubareainfo = (rule, value, callback) => {
      if (
        ["1", "2"].includes(this.editForm.areatype) &&
        !value &&
        !this.editForm.roomInfo
      ) {
        return callback(new Error("请输入房间号或者公共区域地点"));
      } else {
        callback();
      }
    };
    let checkPhotos = (rule, value, callback) => {
      if (!value || value.length == 0) {
        return callback(new Error("请上传图片"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      editForm: {
        id: "",
        faulttype: "1",
        areatype: "1",
        areaname: "",
        roomOrPub: "",
        roomtype: "",
        roominfo: "",
        pubareainfo: "",
        note: "",
        mobile: localStorage.getItem("tel") || "",
        photos: []
      },
      rules: {
        faulttype: [
          { required: true, trigger: "change", message: "请选择维修类型" }
        ],
        areatype: [
          { required: true, trigger: "change", message: "请选择报修区域" }
        ],
        areaname: [
          {
            trigger: "change",
            validator: checkAreaName
          }
        ],
        roomOrPub: [
          {
            trigger: "change",
            validator: checkRoomOrPub
          }
        ],
        roominfo: [
          {
            trigger: "change",
            validator: checkRoomInfo
          }
        ],
        pubareainfo: [
          {
            trigger: "change",
            validator: checkPubareainfo
          }
        ],
        note: [{ required: true, trigger: "blur", message: "请输入详细描述" }],
        mobile: [
          {
            required: true,
            pattern: /^1\d{10}$/,
            trigger: "change",
            message: "请输入联系人手机号"
          }
        ],
        photos: [
          {
            required: true,
            trigger: "change",
            validator: checkPhotos,
            message: "请上传图片"
          }
        ]
      },
      placeholder: "请输入学生公寓名称",
      roomTypeList: [
        { id: "1", name: "实验室或办公室" },
        { id: "2", name: "教室及其他" }
      ],
      areaList: [],
      arealoading: false,
      imgLoading: false
    };
  },
  computed: {
    fileUrl() {
      return this.$store.state.fileUrl;
    },
    // 维修类型
    repairTypeList() {
      return this.$store.state.repairTypeList;
    },
    // 报修区域
    repairAreaList() {
      return this.$store.state.repairAreaList.filter((item) => {
        return this.editForm.faulttype=='1'||item.id!='6';
      });
    },

    // 房间号
    roomPlaceHolder() {
      let data = "填写房间号";
      if (this.editForm.faulttype == "1") {
        if (this.editForm.areatype == "1") {
          data = "填写房间号由物业中心维修";
        } else {
          switch (this.editForm.roomtype) {
            case "1":
              data = "填写房间号由维修能源中心维修";
              break;
            case "2":
              data = "填写房间号由物业中心维修";
              break;
          }
        }
      }
      return data;
    }
  },
  methods: {
    // 清空表单
    clearForm() {
      this.$confirm("是否确认清空内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs.editForm.resetFields();
          this.changeRoom();
        })
        .catch(() => {
          return;
        });
    },
    //选择报修类型
    changeFaulttype(val){
       if(val!='1'&&this.editForm.areatype=='6'){
         this.editForm.areatype = '1';
         this.placeholder = "请输入学生公寓名称";
       }
    },
    // 选择报修区域
    changeArea(val) {
      let name = this.repairAreaList.filter(i => i.id === val)[0].name;
      name = name == "浦口校区" ? "浦口校区区域" : name;
      this.placeholder = `请输入${name}名称`;
      this.areaList = [];
      this.editForm.areaname = "";
      this.editForm.roominfo = "";
      this.editForm.pubareainfo = "";
      this.$refs.editForm.clearValidate();
    },
    // 搜索区域
    remoteMethod(query) {
      if (query !== "") {
        this.arealoading = true;
        this.api
          .getAreaList(1, this.editForm.areatype, query)
          .then(res => {
            this.arealoading = false;
            this.areaList = res.data || [];
          })
          .catch(err => {
            this.arealoading = false;
            this.areaList = [];
          });
      } else {
        this.areaList = [];
      }
    },
    // 选择房间/公共区域
    changeRoom(val) {
      this.editForm.roomtype = "";
      this.editForm.roominfo = "";
      this.editForm.pubareainfo = "";
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
    /**
     * 提交
     * type: submit-提交，draft-草稿
     * applytype: "1"电话录单  "2"网络
     */
    onSubmit(type, applytype) {
      return new Promise((resolve, reject) => {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            let url = type === "submit" ? "apply/save" : "applydraft/save";
            let msg = type === "submit" ? "提交" : "保存";
            // 克隆数据
            let data = _.cloneDeep(this.editForm);
            data.photos = data.photos.join(",");
            // 拼标题
            let title_level_2 = `${this.common.areaTypeFormat(data.areatype)}/${
              data.areaname
            }`;
            let title_level_3 = `${data.roominfo}${data.pubareainfo}`;
            data.title = title_level_3
              ? `${title_level_2}/${title_level_3}`
              : title_level_2;
            // 发送请求
            this.loading = true;
            this.util
              .postAjax({
                code: this.global.code,
                url: url,
                isRep: true,
                data: {
                  ...data,
                  applytype: applytype
                }
              })
              .then(res => {
                this.loading = false;
                if (res.success) {
                  this.$message({
                    showClose: true,
                    type: "success",
                    message: `${msg}成功！`
                  });
                  localStorage.setItem("tel", this.editForm.mobile);
                  resolve(res);
                } else {
                  this.$message({
                    showClose: true,
                    type: "error",
                    message: `${msg}失败！` + res.data.message
                  });
                  reject(res.data.message);
                }
              })
              .catch(err => {
                this.loading = false;
                this.$message({
                  showClose: true,
                  type: "error",
                  message: `${msg}失败！` + err
                });
                reject(err);
              });
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-radio{
  margin-right:23px;
}
.select-search {
  position: absolute;
  right: 10px;
  top: 10px;
  color: rgba(0, 0, 0, 0.35);
}

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
<style lang="scss">
.el-form-item.is-error .error-inside .el-input__inner::placeholder {
  color: #F56C6C;
  font-size: 12px;
}

</style>
