<template>
  <div>
    <!-- <div v-if="isQRTG"></div> -->
    <div class="pop" v-if="popName">
      <van-popup
        v-model="show"
        round
        position="bottom"
        class="date"
        @close="close"
      >
        <div class="font-s filter-title">{{ popName }}</div>
        <!-------------------------- 继续整改------------------------------>
        <div class="choose" v-if="isJXZG">
          <div class="tip-title">复查情况</div>
          <div class="div_flex imgs">
            <div
              v-for="(item, id) in fileList"
              :key="item.id"
              class="photo clearfix"
            >
              <van-image
                class="img"
                :src="global.viewUrl + item.id"
                fit="cover"
                @click="openImg(id)"
              />
              <img
                class="cross"
                :src="require('../../static/images/cross.png')"
                @click.stop="delList(item)"
              />
            </div>
            <div class="camera clearfix" @click="uploadFile">
              <div>
                <i class="iconfont iconpaizhao"></i>
                <span class="font-s">拍照</span>
              </div>
            </div>
          </div>
          <van-field
            class="area"
            v-model="message"
            rows="3"
            autosize
            type="textarea"
            :maxlength="maxL"
            placeholder="请详细描述你的复查结果（必填）"
            @click.stop="void 0"
          />
        </div>
        <!----------------------------反馈------------------------------>
        <div class="choose" v-else-if="isFK">
          <div class="tip-title">是否解决</div>
          <div class="div_flex large">
            <div
              class=" font-s month"
              :class="isChoose('1') ? 'is_choose' : ''"
              @click.stop="large('1')"
            >
              已解决
            </div>
            <div
              class=" font-s month"
              :class="isChoose('0') ? 'is_choose' : ''"
              @click.stop="large('0')"
            >
              未解决
            </div>
          </div>
          <div class="tip-title">
            {{ isChoose(1) ? "整改结果" : "情况说明" }}
          </div>
          <div class="div_flex imgs" v-if="isChoose(1)">
            <div
              v-for="(item, id) in fileList"
              :key="item.id"
              class="photo clearfix"
            >
              <van-image
                class="img"
                :src="global.viewUrl + item.id"
                fit="cover"
                @click="openImg(id)"
              />
              <img
                class="cross"
                :src="require('../../static/images/cross.png')"
                @click.stop="delList(item)"
              />
            </div>
            <div class="camera clearfix" @click="uploadFile">
              <div>
                <i class="iconfont iconpaizhao"></i>
                <span class="font-s">拍照</span>
              </div>
            </div>
          </div>
          <van-field
            class="area"
            v-model="message"
            rows="3"
            autosize
            type="textarea"
            :maxlength="maxL"
            :placeholder="
              isChoose(1)
                ? '请详细描述你的复查结果（必填）'
                : '请详细说明情况（必填）'
            "
            @click.stop="void 0"
          />
          <div class="div_flex label" @click.stop="void 0">
            <div
              v-for="item in topLabel"
              :key="item.id"
              class="no-wrap item"
              @click.stop="chooseLabel(item)"
            >
              <!-- :class="item.choose ? 'choose' : ''" -->
              {{ item.content }}
            </div>
            <div class="no-wrap item more" @click.stop="goMore">
              更多常用回复
            </div>
          </div>
        </div>

        <!--------------------------我要转移------------------------------>
        <div class="choose" v-else-if="isZY">
          <div class="tip-title">转移至</div>
          <van-cell is-link @click="openDeps" class="deps">
            <!-- <van-cell is-link @click="openDeps" :value="deps" class="deps"> -->
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <span class="font-s unit">{{
                deps || "请选择需要转移的业务中心"
              }}</span>
            </template>
          </van-cell>
        </div>

        <!-------------------------- 确认通过------------------------------>
        <div class="choose" v-else-if="isQRTG">
          <div class="tip-title">请确认整改是否通过？</div>
          <van-field
            class="area"
            v-model="message"
            rows="3"
            autosize
            type="textarea"
            :maxlength="maxL"
            placeholder="如有问题分析和建议，可在此处填写（非必填）"
            @click.stop="void 0"
          />
        </div>

        <van-button round class="btn" @click.stop="submit" :disabled="canBtn">
          <i class="iconfont iconcheck1 check"></i>提交</van-button
        >
      </van-popup>
      <more-reply :replyShow.sync="replyShow" @cho="chooseLabel"></more-reply>
      <business-center ref="center" @cho="chooseCenter"></business-center>
      <upload
        v-show="false"
        ref="upload"
        :url="uploadUrl"
        :multiple="false"
        :exts="global.imgType"
        @choose="chooseFile"
        @done="finish"
      ></upload>
    </div>
  </div>
</template>
<script>
import { ImagePreview, Dialog } from "vant";
import {
  commonReply_query,
  workOrder_handleReply,
  workOrder_checkReply,
  workOrder_move,
  historyReply_save
} from "@/assets/js/api";
export default {
  props: {
    obj: Object,
    popName: String,
    name: String
  },
  components: {
    upload: () => import("@/components/BaseUpload"),
    businessCenter: () => import("@/components/businessCenter"),
    moreReply: () => import("@/pages/reply")
  },
  data() {
    return {
      deps: "",
      depObj: {},
      replyShow: false,
      message: "",
      show: false,
      fileList: [],
      uploadUrl: window.g.uploadUrl,
      largeStr: "1",
      topLabel: [],
      maxL: 500,
      form: {},
      tmpForm: { message: "" }
    };
  },
  watch: {
    // popName(val) {
    //   if (this.isQRTG) {
    //     Dialog.confirm({
    //       title: val,
    //       message: "请确认整改是否通过",
    //       confirmButtonText: "确认提交",
    //       confirmButtonColor: "#006457"
    //     })
    //       .then(() => {
    //         // on confirm
    //         let param = {
    //           eventResult: 1,
    //           version: this.obj.version,
    //           workOrderId: this.obj.id
    //         };
    //         workOrder_checkReply(param).then(res => {
    //           this.common.dealRes(res, () => {
    //             this.reload();
    //             this.$emit("update:popName", "");
    //           });
    //         });
    //       })
    //       .catch(() => {
    //         // on cancel
    //         this.$emit("update:popName", "");
    //       });
    //   }
    // }
  },
  computed: {
    isChoose() {
      return function(str) {
        return str == this.largeStr;
      };
    },
    isJXZG() {
      return this.popName === this.global.STR.jxzg;
    },
    isFK() {
      return this.global.STR.fk === this.popName;
    },
    isZY() {
      return this.global.STR.zy === this.popName;
    },
    isQRTG() {
      return this.global.STR.qrtg === this.popName;
    },
    canBtn() {
      if (this.isJXZG) {
        return !this.message;
      } else if (this.isFK) {
        return !this.message || !this.largeStr;
      } else if (this.isZY) {
        return !this.deps;
      } else if (this.isQRTG) {
        return false;
      }
    }
  },
  methods: {
    openDeps() {
      this.$refs.center.centerShow = true;
    },
    chooseCenter(item) {
      this.deps = item.NAME;
      this.depObj = item;
    },
    large(str) {
      this.largeStr = str;
      let tmp = this.message;
      this.message = this.tmpForm.message;
      this.tmpForm.message = tmp;
    },
    // saveData() {
    //   this.form.fileList = this.fileList;
    //   this.form.eventNote = this.message;
    //   this.form.popName = this.popName;
    //   this.form.obj = { ...this.obj };
    //   this.common.setStore(this.global.FORM, this.form);
    // },
    chooseLabel(item) {
      this.message += item.content;
    },
    goMore() {
      //   this.saveData();
      this.replyShow = true;
      //   this.$router.push("/moreReply");
    },
    openImg(id) {
      ImagePreview({
        images: this.fileList.map(f => this.global.viewUrl + f.id),
        startPosition: id,
        closeable: true
      });
    },
    chooseFile(f) {
      console.log(f);
    },
    finish(res) {
      this.common.dealRes(res, () => {
        let data = { ...res.data };
        this.fileList.push(data);
        this.$forceUpdate();
      });
    },

    close() {
      this.message = "";
      this.fileList = [];
      this.deps = "";
      this.depObj = {};
      this.show = false;
    },
    reload() {
      let p = this.$parent;
      if (p && p.$refs.list && p.$refs.list.onLoad) {
        p.$refs.list.onLoad(1);
      } else if (p && this.name === "Detail") {
        //   } else if (p && p.$$options && p.$options.name === "Detail") {
        this.common.back();
      }
    },
    submit() {
      let param = {};
      if (this.isJXZG) {
        param = {
          eventNote: this.message,
          eventPhotos: this.fileList.map(f => f.id).join(","),
          eventResult: 0,
          version: this.obj.version,
          workOrderId: this.obj.id
        };
        workOrder_checkReply(param).then(res => {
          this.common.dealRes(res, () => {
            this.reload();
            this.close();
          });
        });
      } else if (this.isFK) {
        // eventPhotos: this.fileList.map(f => f.id).join(","),
        param = {
          eventNote: this.message,
          eventResult: this.largeStr,
          version: this.obj.version,
          workOrderId: this.obj.id
        };
        if (this.isChoose(1)) {
          param.eventPhotos = this.fileList.map(f => f.id).join(",");
        }
        historyReply_save({
          content: this.message,
          handleDeptId: this.obj.handleDeptId
        }).then();
        workOrder_handleReply(param).then(res => {
          this.common.dealRes(res, () => {
            this.reload();
            this.close();
          });
        });
      } else if (this.isZY) {
        let d = this.$store.state.departments;
        let tmp = d.find(item => item.ID === this.obj.handleDeptId) || {};
        param = {
          handleDeptId: this.obj.handleDeptId,
          handleDeptName: tmp.NAME,
          nextDeptId: this.depObj.ID,
          nextDeptName: this.deps,
          version: this.obj.version,
          workOrderId: this.obj.id
        };
        workOrder_move(param).then(res => {
          this.common.dealRes(res, () => {
            this.reload();
            this.close();
          });
        });
      } else if (this.isQRTG) {
        let param = {
          eventResult: 1,
          eventNote: this.message,
          version: this.obj.version,
          workOrderId: this.obj.id
        };
        workOrder_checkReply(param).then(res => {
          this.common.dealRes(res, () => {
            this.reload();
            this.close();
          });
        });
      }
    },
    delList(item) {
      this.fileList = this.fileList.filter(f => f.id !== item.id);
    },
    //点击上传
    uploadFile() {
      this.$refs.upload.$refs.uploaddom.click();
    },
    getReply() {
      commonReply_query({ filter: {} }).then(res => {
        this.common.dealRes(res, () => {
          let list = res.data || [];
          this.topLabel = list.slice(0, 3);
        });
      });
    }
    // globalReply() {
    //   let r = this.common.getStore(this.global.REPLY);
    //   if (r) {
    //     let form = this.common.getStore(this.global.FORM);
    //     this.$emit("update:popName", form.popName);
    //     this.$emit("update:obj", form.obj);
    //     this.fileList = form.fileList;
    //     this.message = form.eventNote + r;
    //     this.common.removeStore(this.global.REPLY, "");
    //     this.show = true;
    //   }
    // }
  },
  mounted() {
    if (this.common.getStore(this.global.roleName) === this.global.YWZX) {
      this.getReply();
    }
    // this.globalReply();
  }
};
</script>

<style lang="scss" scoped>
$size: calc((100vw) / 4 - 16px - 8px);
.pop {
  width: 100%;
}
.date {
  min-height: 30%;
  .filter-title {
    font-weight: 400;
    font-size: 19px;
    line-height: 28px;
    height: 28px;
    padding: 16px 0;
    text-align: center;
    color: #121212;
  }
  .choose {
    padding: 16px;
    .tip-title {
      margin-top: $fixed_mb;
      font-size: 17px;
      line-height: 24px;
      height: 24px;
      color: #121212;
    }
    .large {
      justify-content: space-between;
      padding: 12px 0;
      .month {
        width: 47%;
        height: 36px;
        border-radius: 24px;
        text-align: center;
        line-height: 36px;
        border: 1px solid #dddddd;
        color: #595959;
        background: #f5f5f5;
      }
      .is_choose {
        background: rgba(0, 100, 87, 0.08);
        border: 1px solid #006457;
        color: #006457;
      }
    }
  }
}
.btn {
  //   padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 90%;
  background: $c-green;
  font-size: 16px;
  color: #ffffff;
  margin: $fixed_side auto;
  .check {
    margin-right: $fixed_mb;
  }
}
.imgs {
  padding-top: 8px;
  flex-wrap: wrap;
  .photo {
    padding-right: 16px;
    padding-bottom: 16px;
    position: relative;
    .img {
      // object-fit: cover;
      width: $size;
      height: $size;
    }
    .cross {
      font-style: normal;
      position: absolute;
      // border-radius: 50%;
      top: 0;
      right: 0;
      transform: translate(-50%, -50%);
      // background: #ee3f15;
      // color: #fff;
    }
  }
  .camera {
    width: $size;
    height: $size;
    background: #f6f6f6;
    position: relative;
    margin-bottom: 16px;
    div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      i {
        color: #bfbfbf;
        display: block;
        // width: 17.5px;
        // height: 15.31px;
      }
      span {
        font-size: 12px;
        line-height: 16px;
        width: 100%;
        color: #bfbfbf;
      }
    }
  }
}
/deep/ .van-cell {
  padding-left: 0;
  padding-right: 0;
}
.area {
  /deep/ .van-cell {
    &::after {
      border: 0;
    }
  }
}
.deps {
  /deep/ .van-cell {
    border-bottom: 1px solid #000;
  }
  .unit {
    color: #bfbfbf;
  }
}
.label {
  border-bottom: 1px solid #d9d9d9;
  padding: $fixed_mb 0;
  .item {
    padding: 0 2px;
    max-width: 24%;
    margin-right: 1%;
    min-width: 72px;
    height: 26px;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    font-size: 12px;
    line-height: 26px;
    text-align: center;
    color: #8c8c8c;
  }
  .choose {
    border: 1px solid #ff9900;
    color: #ff9900;
  }
  .more {
    background: #f5f5f5;
  }
}
</style>
