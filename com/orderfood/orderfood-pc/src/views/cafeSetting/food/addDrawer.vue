<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="openDrawer"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <el-form
        ref="editForm"
        :model="editForm"
        style="padding:0 30px;"
        label-width="110px"
        label-position="right"
        :rules="rules"
      >
        <!-------------------------------- 图片 -------------------------------->
        <el-form-item label="菜品图片：" prop="photo">
          <div
            class="upload-box"
            v-if="!editForm.photo || editForm.photo == -1"
            @click="uploadIcon"
            v-loading="imgLoading"
          >
            <i class="el-icon-plus"></i>
            <span>上传图片</span>
          </div>
          <div class="upload-box" style="padding:0;" v-else>
            <img :src="url" />
            <span class="hoverStyle">
              <i class="el-icon-delete" @click="deleteIcon"></i>
            </span>
          </div>
          <!-- <span class="tips">支持.bmp .jpeg .jpg .gif .png，</span> -->
        </el-form-item>
        <!-------------------------------- 名称 -------------------------------->
        <el-form-item label="菜品名称：" prop="name" required>
          <el-input v-model="editForm.name" placeholder="请输入" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <!-------------------------------- 分类 -------------------------------->
        <el-form-item label="分类：" prop="shopitemtypeid" required>
          <el-select
            v-model="editForm.shopitemtypeid"
            placeholder="请选择"
            size="small"
            style="width:300px;"
          >
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-------------------------------- 价格 -------------------------------->
        <el-form-item label="价格：" prop="price" required>
          <el-input
            v-model="editForm.price"
            placeholder="请输入"
            size="small"
            style="width:300px;"
            @keyup.native="moneyLimit($event,'price')"
          >
            <i slot="suffix">元</i>
          </el-input>
          <div
            v-if="editForm.price == '0'|| editForm.price == '0.' || editForm.price == '0.0' || editForm.price == '0.00'"
            class="el-form-item__error"
          >价格输入为0，检查输入是否正确</div>
        </el-form-item>
        <!-------------------------------- 促销价 -------------------------------->
        <el-form-item label="促销价：" prop="promotionprice">
          <el-input
            v-model="editForm.promotionprice"
            placeholder="请输入"
            size="small"
            style="width:300px;"
            @keyup.native="moneyLimit($event,'promotionprice')"
          >
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>
        <!-------------------------------- 描述 -------------------------------->
        <el-form-item label="描述：" prop="note">
          <el-input
            v-model="editForm.note"
            placeholder="请输入"
            size="small"
            style="width:500px;"
            type="textarea"
            :rows="1"
            autosize
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="菜品状态：" prop="status" v-if="editForm.id">
          <el-radio-group v-model="status" @change="changeStatus">
            <el-radio label="1">在售</el-radio>
            <el-radio label="2">已下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-------------------------------- 总预订量 -------------------------------->
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜品总预订量：" prop="alllimit">
              <el-radio-group
                v-model="editForm.alllimit"
                :disabled="editForm.id && status == '1'"
                @change="v => changelimit(v,'all')"
              >
                <el-radio label="0">不限</el-radio>
                <el-radio label="1">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="alllimitnum" label-width="0" v-if="editForm.alllimit == '1'">
              <el-input
                v-model.number="editForm.alllimitnum"
                style="width:100px;"
                size="small"
                :disabled="editForm.id && status == '1'"
              >必须为整数</el-input>
              <span style="color: #999; margin-left: 10px;">剩余量{{lastnum}}份</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-------------------------------- 每人预订量 -------------------------------->
        <el-row>
          <el-col :span="12">
            <el-form-item label="每人可预订量：" prop="onelimit">
              <el-radio-group
                v-model="editForm.onelimit"
                :disabled="editForm.id && status == '1'"
                @change="v => changelimit(v,'one')"
              >
                <el-radio label="0">不限</el-radio>
                <el-radio label="1">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="onelimitnum" label-width="0" v-if="editForm.onelimit == '1'">
              <el-input
                v-model.number="editForm.onelimitnum"
                style="width:100px;"
                size="small"
                :disabled="editForm.id && status == '1'"
              >必须为整数</el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="tips" v-if="editForm.id">备注：请先下架菜品，再编辑预订量;</p>
        <p class="tips" v-if="editForm.id">编辑后需将菜品状态修改为“在售”。</p>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
    <!---------------------------- 上传组件 ---------------------------->
    <upload
      v-show="false"
      ref="upload"
      :url="uploadUrl"
      :multiple="false"
      :size="1024"
      exts="bmp|BMP|jpeg|JPEG|jpg|JPG|gif|GIF|png|PNG"
      @choose="chooseFile"
      @done="finish"
    ></upload>
  </el-drawer>
</template>

<script>
import { saveFood, changeFoodStatus } from "@/api/admin/food";
import upload from "@/components/BaseUpload";
export default {
  components: {
    upload
  },
  data() {
    let validateAllLimitNum = (rule, value, callback) => {
      if (this.editForm.alllimit == "1" && (value == null || value <= 0)) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };
    let validateOneLimitNum = (rule, value, callback) => {
      if (this.editForm.onelimit == "1" && (value == null || value <= 0)) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };
    return {
      drawer: false,
      drawerLoading: false,
      title: "新增菜品",
      imgLoading: false,
      uploadUrl: window.g.uploadUrl,
      status: "1",
      editForm: {
        id: null,
        photo: null,
        name: null,
        shopitemtypeid: null,
        price: null,
        promotionprice: null,
        note: null,
        shopid: null,
        alllimit: "0",
        alllimitnum: 0,
        onelimit: "0",
        onelimitnum: 0
      },
      rules: {
        name: [{ required: true, message: "请输入菜品名称" }],
        shopitemtypeid: [{ required: true, message: "请选择菜品分类" }],
        price: [{ required: true, message: "请输入价格" }],
        alllimitnum: [
          { validator: validateAllLimitNum, message: "请输入菜品总预订量" }
        ],
        onelimitnum: [
          { validator: validateOneLimitNum, message: "请输入每人可预订量" }
        ]
      }
    };
  },
  computed: {
    // icon地址
    url() {
      return window.g.viewUrl + this.editForm.photo;
    },
    // 菜品分类
    typeList() {
      return this.$store.state.typeList;
    },
    // 剩余量
    lastnum() {
      let totalnum = this.editForm.alllimitnum || 0;
      let buynum = this.editForm.allbuynum || 0;
      let num = totalnum - buynum;
      return num >= 0 ? num : 0;
    }
  },
  methods: {
    // 打开抽屉
    openDrawer() {},
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.status = "1";
      (this.editForm = {
        id: null,
        photo: -1,
        name: null,
        shopitemtypeid: null,
        price: null,
        note: null,
        promotionprice: null,
        alllimit: "0",
        alllimitnum: 0,
        onelimit: "0",
        onelimitnum: 0
      }),
        this.$emit("doFunc");
    },
    // 上传图标
    uploadIcon() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    // 选择图片
    chooseFile() {
      this.imgLoading = true;
    },
    // 上传完成
    finish(file) {
      this.imgLoading = false;
      let data = file.data[0] || "";
      if (data) {
        this.editForm.photo = data.ID;
      }
    },
    // 删除icon
    deleteIcon() {
      this.editForm.photo = -1;
    },
    // 限制金额输入（整数或两位小数）
    moneyLimit(e, prop) {
      this.common.moneyInput(e);
      this.editForm[prop] = e.target.value;
    },
    // 是否限制预订量
    changelimit(val, type) {
      let num = type == "all" ? "alllimitnum" : "onelimitnum";
      if (val == "0") {
        this.editForm[num] = 0;
      }
    },
    // 上下架菜品
    changeStatus(val) {
      let lastStatus = val == "1" ? "2" : "1";
      let msg = val == "1" ? "恢复上架" : "下架";
      let param = {
        id: this.editForm.id,
        status: val
      };
      changeFoodStatus(param)
        .then(res => {
          if (res.success) {
            this.$message({
              showClose: true,
              type: "success",
              message: `${msg}成功`
            });
            this.status = val;
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: `${msg}失败：${res.data.message}`
            });
            this.status = lastStatus;
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            type: "error",
            message: `${msg}失败：${err}`
          });
          this.status = lastStatus;
        });
    },
    // 保存
    save() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          this.editForm.status = this.status;
          let param = {
            ...this.editForm
          };
          saveFood(param)
            .then(res => {
              if (res.success) {
                this.drawerLoading = false;
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "保存成功！"
                });
                this.drawer = false;
              } else {
                this.drawerLoading = false;
                this.$message({
                  showClose: true,
                  type: "error",
                  message:
                    "保存失败：" + res.data.message ||
                    res.data.errInf.shortBusInf
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `保存失败:${err}`
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 12px;
}
.upload-box {
  position: relative;
  width: 110px;
  height: 80px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  border: 1px dashed rgba(0, 0, 0, 0.15);
  text-align: center;
  padding: 5px 0;
  margin-top: 5px;
  cursor: pointer;
  span {
    display: block;
    line-height: 14px;
  }
  i,
  span {
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
    font-size: 14px;
  }
  .tips {
    color: rgba(0, 0, 0, 0.45);
  }
  img {
    width: auto;
    max-width: 100%;
    height: 100%;
  }
  .hoverStyle {
    position: absolute;
    width: 110px;
    height: 80px;
    line-height: 80px;
    top: 0;
    left: 0;
    text-align: center;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.6);
    transition: opacity 0.3s;
    opacity: 0;
  }
  &:hover .hoverStyle {
    opacity: 1;
    i {
      color: #ffffff;
      font-size: 16px;
    }
  }
}
.tips {
  color: #f56c6c;
  line-height: 28px;
}
</style>
<style lang="scss">
.el-form-item__error {
  padding-top: 0;
}
.el-textarea .el-input__count {
  line-height: 20px;
}
</style>