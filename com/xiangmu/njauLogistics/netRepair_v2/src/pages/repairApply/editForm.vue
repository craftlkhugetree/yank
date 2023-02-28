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
        <el-radio-group v-model="editForm.faulttype">
          <el-radio v-for="item in repairTypeList" :key="item.id" :label="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="问题引导" class="is-required" v-if="showGuide">
        <div class="guide">
          <div class="guide-item" v-for="(item,index) in questionList" :key="index">
            <p>
              {{index + 1}}.
              <span v-html="item.question"></span>
              <i class="el-icon-question" v-if="item.guideImg" @click="showTw(item)"></i>
            </p>
            <el-radio-group v-model="item.result" @change="(val) => changeOption(index,val)">
              <el-radio
                v-for="option in item.options"
                :key="option.text"
                :label="option"
              >{{option.text}}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-form-item>
      <div v-if="selfRepairFail">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="物品类型" prop="goodstype" v-if="goodsTypeList.length > 0">
              <el-select
                v-model="editForm.goodstype"
                placeholder="请选择物品类型"
                size="small"
                style="width:100%;"
                value-key="id"
                @change="changeGoodsType"
              >
                <el-option
                  v-for="item in goodsTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="goodsname" style="margin-top:30px;" v-if="goodsList.length > 0">
              <el-select
                v-model="editForm.goodsname"
                placeholder="请选择物品名称"
                size="small"
                style="width:100%;"
                value-key="id"
              >
                <el-option
                  v-for="item in goodsList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="报修区域" prop="areatype" style="margin-bottom:0">
          <el-radio-group v-model="editForm.areatype" @change="changeArea">
            <el-radio v-for="item in repairAreaList" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="areaname"
          v-if="['1','2'].includes(editForm.areatype)"
          style="margin-bottom:18px"
        >
          <!-- <el-autocomplete
                v-model="editForm.areaname"
                :placeholder="placeholder"
                suffix-icon="el-icon-search"
                :fetch-suggestions="queryArea"
                style="width:100%"
          ></el-autocomplete>-->
          <el-select
            v-model="editForm.areaname"
            filterable
            remote
            :placeholder="placeholder"
            :remote-method="remoteMethod"
            :loading="arealoading"
            style="width:100%"
          >
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <i class="el-icon-search select-search"></i>
        </el-form-item>
        <el-form-item prop="roominfo" v-if="['1','2'].includes(editForm.areatype)">
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
        </el-form-item>
        <el-form-item prop="areaname" v-if="['3','4'].includes(editForm.areatype)">
          <el-input v-model="editForm.areaname" :placeholder="placeholder"></el-input>
        </el-form-item>
        <el-form-item label="详细描述" prop="note">
          <el-input
            v-model="editForm.note"
            type="textarea"
           
            rows="5"
            resize="none"
            placeholder="请输入说明"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="图片说明" prop="photos">
          <div class="upload-box" v-if="editForm.photos.length < 3">
            <el-button
              icon="el-icon-upload2"
              size="small"
              @click="upload"
              :loading="imgLoading"
            >上传图片</el-button>
            <p class="img-des">最多可上传三张照片</p>
          </div>
          <div class="upload-imgs" v-for="(item,index) in editForm.photos" :key="item">
            <img :src="fileUrl + item" alt />
            <i class="el-icon-close" @click="deletePhoto(index)"></i>
          </div>
        </el-form-item>
      </div>
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

    <!------------------------- 图文弹窗 ------------------------->
    <el-dialog class="tw-dialog" :visible.sync="dialogVisible" width="500px" :lock-scroll="true">
      <span slot="title" class="title">
        <i class="el-icon-question"></i>
        {{twTitle}}
      </span>
      <div>
        <img v-for="img in twImgs" :key="img" :src="img" alt />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import upload from "../../components/BaseUpload";
export default {
  components: {
    upload
  },
  props: {
    // 是否显示问题引导
    showGuide: {
      type: Boolean,
      default: true
    },
    // 自助排查是否失败
    selfRepairFail: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let checkGoodsName = (rule, value, callback) => {
      if (!value && this.goodsList.length > 0) {
        return callback(new Error(`请选择物品名称`));
      } else {
        callback();
      }
    };
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
    return {
      loading: false,
      editForm: {
        id: "",
        faulttype: "2",
        goodstype: "",
        goodsname: "",
        areatype: "1",
        areaname: "",
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
        goodstype: [
          { required: true, trigger: "change", message: "请选择物品类型" }
        ],
        goodsname: [
          { required: true, trigger: "change", validator: checkGoodsName }
        ],
        areatype: [
          { required: true, trigger: "change", message: "请选择报修区域" }
        ],
        areaname: [{ trigger: "change", validator: checkAreaName }],
        roominfo: [{ trigger: "change", validator: checkRoomInfo }],
        pubareainfo: [{ trigger: "change", validator: checkPubareainfo }],
        note: [{ required: true, trigger: "blur", message: "请输入详细描述" }],
        mobile: [
          {
            required: true,
            pattern: /^1\d{10}$/,
            trigger: "change",
            message: "请输入联系人手机号"
          }
        ]
      },
      placeholder: "请输入学生公寓名称",
      areaList: [],
      arealoading: false,
      imgLoading: false,
      goodsTypeList: [],
      goodsList: [],
      questionList: [],
      groupid: "", // 问题引导id
      dialogVisible: false,
      twTitle: "",
      twImgs: []
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
      return this.$store.state.repairAreaList;
    },
    // 问题引导流程
    repairFlow() {
      return this.$store.state.repairFlow;
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
        })
        .catch(() => {
          return;
        });
    },

    // 添加问题
    addQuestion(index) {
      let item = Object.assign({},this.repairFlow[index]);
      this.$set(item, "result", {});
      this.questionList.push(item);
    },

    // 最终保存选项
    doSaveOption(index, val) {
      let item = this.questionList[index];
      this.util
        .postAjax({
          code: this.global.code,
          url: "helpself/save",
          isRep: true,
          data: {
            groupid: this.groupid,
            itemid: item.id,
            item: item.question,
            option: val.text
          }
        })
        .then(res => {})
        .catch(err => {});
    },

    // 问题引导
    changeOption(index, val) {
      // 调用保存选项接口
      if (this.groupid) {
        this.doSaveOption(index, val);
      } else {
        this.util
          .postAjax({
            code: this.global.code,
            url: "helpself/getGroupId"
          })
          .then(res => {
            if (res.success) {
              this.groupid = res.data || "";
              this.doSaveOption(index, val);
            }
          });
      }
      // 去掉该选项后的问题
      this.questionList.splice(index + 1);
      // 处理选项结果
      let qid = val.qid;
      if (qid == "success") {
        // 问题已解决
        this.$emit("update:selfRepairFail", false);
        this.$confirm("您的问题已解决，即将关闭当前页面。", "即将关闭页面", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: "warning"
        })
          .then(() => {
            this.$router.push("/index");
          })
          .catch(() => {
            return;
          });
      } else if (qid == "fail") {
        // 问题未解决
        this.$emit("update:selfRepairFail", true);
        let notes = "";
        this.questionList.forEach(i => {
          let info = i.question + ":" + i.result.text + "\n";
          notes += info;
        });
        this.editForm.note = notes;
      } else {
        this.$emit("update:selfRepairFail", false);
        // 添加新的问题
        let new_index = this.repairFlow.findIndex(i => i.id == qid);
        if (new_index > -1) {
          this.addQuestion(new_index);
        }
      }
    },

    // 显示图文帮助
    showTw(item) {
      this.twTitle = item.guideTitle;
      this.twImgs = item.guideImg;
      this.dialogVisible = true;
    },

    // 选择物品类型
    changeGoodsType(val) {
      if (val) {
        this.editForm.goodsname = "";
        this.getGoodsList(val.id);
      }
    },
    // 选择报修区域
    changeArea(val) {
      let name = this.repairAreaList.filter(i => i.id === val)[0].name;
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

    // 删除问题引导id
    deleteGroupId() {
      if (this.groupid) {
        this.util
          .postAjax({
            code: this.global.code,
            url: "helpself/deleteByGroupId",
            data: {
              groupId: this.groupid
            }
          })
          .then(res => {})
          .catch(err => {});
      }
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
            // 拼物品名称
            if (data.goodstype) {
              data.itemname = data.goodsname.name
                ? `${data.goodstype.name}/${data.goodsname.name}`
                : `${data.goodstype.name}`;
            }
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
                  this.$emit("update:selfRepairFail", false);
                  if (this.editForm.areatype == "1") {
                    localStorage.setItem("areaname", this.editForm.areaname);
                    localStorage.setItem("roominfo", this.editForm.roominfo);
                  }
                  localStorage.setItem("tel", this.editForm.mobile);
                  // 删除问题引导groupid
                  this.deleteGroupId();
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
    },

    // 获取物品类型列表
    getGoodsTypeList() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "item/items",
          isRep: true,
          data: {
            pid: "-1"
          }
        })
        .then(res => {
          if (res.success) {
            this.goodsTypeList = res.data || [];
            if (this.editForm.id) {
              let name = this.editForm.goodstype;
              if (name) {
                this.editForm.goodstype = this.goodsTypeList.filter(
                  i => i.name == name
                )[0];
                this.getGoodsList(this.editForm.goodstype.id);
              }
            }
          }
        });
    },

    // 获取物品名称列表
    getGoodsList(typeid) {
      this.util
        .postAjax({
          code: this.global.code,
          url: "item/items",
          isRep: true,
          data: {
            pid: typeid
          }
        })
        .then(res => {
          if (res.success) {
            this.goodsList = res.data || [];
            if (this.editForm.id) {
              let name = this.editForm.goodsname;
              if (name) {
                this.editForm.goodsname = this.goodsList.filter(
                  i => i.name == name
                )[0];
              }
            }
          }
        });
    }
  },
  created() {
    // this.getGoodsTypeList();
    this.addQuestion(0);
  }
};
</script>

<style lang="scss" scoped>
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
.guide {
  background: #f6f6f6;
  padding: 20px 20px 10px;
  .guide-item {
    p {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      margin-bottom: 10px;
    }
    p::before {
      display: inline;
      content: "*";
      color: red;
      margin-right: 10px;
    }
    .el-radio {
      color: rgba(0, 0, 0, 0.65);
      margin-right: 20px;
      margin-bottom: 10px;
    }
    .el-icon-question {
      color: #faad14;
      font-size: 16px;
      cursor: pointer;
    }
  }
}

.tw-dialog {
  .title {
    display: inline-block;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    padding: 10px 0 0 10px;
    i {
      font-size: 22px;
      color: #FAAD14;
      margin-right: 10px;
      line-height: 24px;
      vertical-align: bottom;
    }
  }
  div {
    height: 80%;
    max-height: 600px;
    overflow-y: auto;
    padding: 0 10px;
  }
  img {
    width: 100%;
    height: auto;
    margin-bottom: 5px;
  }
}
</style>