<template>
  <div>
    <div v-if="liveList && liveList.length == 0" style="margin-bottom: 15px">
      暂无入驻信息
    </div>
    <div
      v-else
      class="item default"
      v-for="item in liveList"
      :key="item.id"
      :class="{
        yellow: item.status == 1
      }"
    >
      <div>
        <div class="title flex-div">
          <h3>{{ item.apply.orgName }}</h3>
          <div v-if="prevPage !== 'resource-apply'">
            <div
              v-if="item.status == 1"
              class="my-button blue round samll"
              style="cursor: inherit"
            >
              <img :src="require('st@tic/images/roundCheck.png')" />
              已入驻
            </div>
            <div
              v-else
              class="my-button grey round samll"
              style="margin-right:-15px; cursor: inherit"
            >
              <div class="tips" v-if="item.status == 3"><span>强制</span></div>
              <img :src="require('st@tic/images/roundCheck.png')" />
              已退租
            </div>
          </div>
        </div>
        <el-row
          class="live-list"
          :gutter="10"
          :style="{
            height: isMine ? 'auto' : item.isCollapse ? 'auto' : '180px',
            overflow: 'hidden',
            'margin-bottom': '10px'
          }"
        >
          <el-col :span="12">
            <div class="name">课题组</div>
            <div class="value more-ellipsis" :title="item.apply.classgroupName">
              {{ item.apply.classgroupName }}
              <!-- <el-tooltip class="item" effect="dark" :content="item.classname" placement="top">
            </el-tooltip>-->
            </div>
          </el-col>
          <el-col :span="12">
            <div class="name">使用时长</div>
            <div
              class="value more-ellipsis"
              :title="common.cycleUnit(item.apply)"
            >
              {{ common.cycleUnit(item.apply) }}
            </div>
          </el-col>

          <el-col :span="12">
            <div class="name">课题组经费负责人及电话</div>
            <div
              class="value more-ellipsis"
              :title="
                item.apply.classfeeLeaderName +
                  ' ' +
                  item.apply.classfeeLeaderMobile
              "
            >
              {{
                item.apply.classfeeLeaderName +
                  " " +
                  item.apply.classfeeLeaderMobile
              }}
            </div>
          </el-col>

          <el-col :span="12">
            <div class="name phone">
              日常联系人及电话
              <span style="cursor: pointer" @click="open(item)" v-if="!isUser">
                <img :src="require('st@tic/images/bm-tip-edit.png')" />
              </span>
            </div>
            <div
              class="value more-ellipsis"
              :title="
                item.apply.contacterName + ' ' + item.apply.contacterMobile
              "
            >
              {{ item.apply.contacterName + " " + item.apply.contacterMobile }}
            </div>
          </el-col>

          <el-col :span="12">
            <div class="name">入驻时间</div>
            <div
              class="value more-ellipsis"
              :title="util.formatTime(item.checkinTime, 'yyyy.MM.dd hh:mm:ss')"
            >
              {{ util.formatTime(item.checkinTime, "yyyy.MM.dd hh:mm:ss") }}
            </div>
          </el-col>

          <el-col :span="12">
            <div class="name">预计退租时间</div>
            <div
              class="value more-ellipsis"
              :title="
                item.expectCheckoutTime && item.expectCheckoutTime.length
                  ? util.formatTime(
                      item.expectCheckoutTime,
                      'yyyy.MM.dd hh:mm:ss'
                    )
                  : '--'
              "
            >
              {{
                item.expectCheckoutTime && item.expectCheckoutTime.length > 0
                  ? util.formatTime(
                      item.expectCheckoutTime,
                      "yyyy.MM.dd hh:mm:ss"
                    )
                  : "--"
              }}
            </div>
          </el-col>

          <el-col :span="12">
            <div class="name">项目名称</div>
            <div class="value more-ellipsis" :title="item.apply.projectName">
              {{ item.apply.projectName }}
            </div>
          </el-col>

          <el-col :span="12">
            <div class="name">项目来源</div>
            <div class="value more-ellipsis" :title="item.apply.projectFrom">
              {{ item.apply.projectFrom }}
            </div>
          </el-col>

          <el-col :span="12">
            <div class="name">项目经费(万元)</div>
            <div
              class="value more-ellipsis"
              :title="item.apply.projectFee ? item.apply.projectFee : '--'"
            >
              {{ item.apply.projectFee ? item.apply.projectFee : "--" }}
            </div>
          </el-col>

          <el-col :span="12">
            <div class="name">项目时间</div>
            <div
              class="value more-ellipsis"
              :title="
                item.apply.projectStarttime && item.apply.projectEndtime
                  ? item.apply.projectStarttime +
                    `-` +
                    item.apply.projectEndtime
                  : '--'
              "
            >
              {{
                item.apply.projectStarttime && item.apply.projectEndtime
                  ? item.apply.projectStarttime +
                    `-` +
                    item.apply.projectEndtime
                  : "--"
              }}
            </div>
          </el-col>

          <el-col :span="24">
            <div class="name">项目概况</div>
            <div
              class="value more-ellipsis"
              :title="item.apply.projectOverview"
            >
              {{ item.apply.projectOverview }}
            </div>
          </el-col>
          <el-col :span="24">
            <div class="name">实验概况</div>
            <div
              class="value more-ellipsis"
              :title="item.apply.experimentOverview"
            >
              {{ item.apply.experimentOverview }}
            </div>
          </el-col>
          <el-col :span="24">
            <div class="name">预期成果</div>
            <div class="value more-ellipsis" :title="item.apply.expectedResult">
              {{ item.apply.expectedResult }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="!isMine" class="bottom-tip">
        <div v-if="!item.isCollapse" @click="collapse(item)">
          <span>展开详情</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <div v-else @click="collapse(item)">
          <span>收起信息</span>
          <i class="el-icon-arrow-up"></i>
        </div>
      </div>
    </div>
    <p v-if="liveLoading" class="end-tips">加载中...</p>
    <p v-if="finishTable && !isMine && liveList.length" class="end-tips">
      没有更多了
    </p>

    <el-dialog
      v-if="phoneV"
      :visible.sync="phoneV"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="false"
      :show-close="true"
      width="300px"
    >
      <template #title>
        <div class="diag">
          <span class="diag-title">{{ diagTitle }}</span>
        </div>
      </template>

      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="contacterName">
          <el-select
            v-model="form.contacterName"
            filterable
            remote
            placeholder="请输入或选择"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            @change="dataFilter"
            style="width: 100%"
          >
            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
            <el-option
              v-for="item in jzgList"
              :label="item.name + '--' + item.id"
              :value="JSON.stringify({ id: item.id, name: item.name })"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="contacterMobile">
          <el-input v-model="form.contacterMobile">
            <!-- <el-input :value="form.contacterMobile" @input="onInput" @blur="check"> -->
            <i slot="prefix" class="el-input__icon el-icon-phone"></i>
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <div class="my-button green" @click="submitDiag()" style="width: 100%">
          保存修改
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eduResourceUserecordChangeContacter } from "@/assets/js/api";
export default {
  name: "liveList",
  props: {
    liveList: Array,
    prevPage: String,
    liveLoading: Boolean,
    finishTable: Boolean
  },
  computed: {
    isMine() {
      return this.prevPage === "resource-apply";
    },
    isUser() {
      return this.prevPage === "resource-apply" || this.prevPage === "idle";
    }
  },
  data() {
    return {
      phoneV: false,
      diagTitle: "日常联系人及电话",
      jzgList: [],
      selectLoading: false,
      form: { contacterName: "", contacterMobile: "", id: "" },
      rules: {
        contacterName: [
          { required: true, message: "请选择联系人", trigger: "blur" }
        ],
        contacterMobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          this.options.testPhone
        ]
      }
    };
  },
  methods: {
    // 伸缩
    collapse(row) {
      let flag = row.isCollapse;
      this.liveList.forEach(v => {
        v.isCollapse ? (v.isCollapse = false) : null;
      });
      row.isCollapse = !flag;
      this.$forceUpdate();
    },
    open(item) {
      this.phoneV = true;
      this.form.contacterName =
        (item && item.apply && item.apply.contacterName) || "";
      this.form.id = (item && item.id) || "";
      this.form.contacterMobile =
        (item && item.apply && item.apply.contacterMobile) || "";
    },
    // 保存电话
    submitDiag() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "提交中",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          const form2 = {};
          form2.id = this.form.id;
          form2.name = this.form.contacterName;
          form2.mobile = this.form.contacterMobile;

          eduResourceUserecordChangeContacter(form2)
            .then(res => {
              loading.close();
              if (res.success == true) {
                this.phoneV = false;
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                let item = this.liveList.find(v => v.id == this.form.id);
                this.$set(item.apply, "contacterName", form2.name);
                this.$set(item.apply, "contacterMobile", form2.mobile);
                this.$emit("pq");
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.message
                });
              }
            })
            .catch(e => loading.close());
        }
      });
    },
    remoteMethod(query) {
      this.selectLoading = true;
      if (query !== "") {
        this.common
          .getjzgList(query)
          .then(res => {
            this.selectLoading = false;
            this.jzgList = res.items;
          })
          .catch(err => {
            this.selectLoading = false;
            this.jzgList = [];
          });
      } else {
        this.selectLoading = false;
        this.jzgList = [];
      }
    },
    // 日常联系人
    dataFilter(val) {
      this.form.contacterName = JSON.parse(val).name;
      this.$forceUpdate();
      // this.form.contacter = JSON.parse(val).id;
    },
    onInput(val) {
      this.form.contacterMobile = val;
      // this.$forceUpdate()
      // this.check()
    },
    check() {
      this.$refs["form"].validateField("contacterMobile", valid => {});
    }
  },

  created() {}
};
</script>

<style scoped lang="scss">
.flex-div {
  display: flex;
  align-items: center;
  h3 {
    margin-right: auto;
  }
  div {
    div {
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin-right: -15px;
      position: relative;
      .tips {
        width: 34px;
        height: 18px;
        background: #fe3e61;
        border-radius: 9px 9px 0px 9px;
        line-height: 18px;
        position: absolute;
        // top: -9!important;
        // left: -17!important;
        margin-left: -67px;
        margin-top: -25px;
        text-align: center;
        span {
          display: inline-block;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }
}
// .more-ellipsis{
//   display: -webkit-box;
//   -webkit-box-orient:vertical;
//   -webkit-line-clamp: 2;
//   overflow : hidden;
//   text-overflow: ellipsis;
//   width: 100%;
// }
.bottom-tip {
  z-index: 99;
  margin-bottom: 10px;
  div {
    margin: 0 auto;
    text-align: center;
    cursor: pointer;
  }
}

.phone {
  img {
    cursor: pointer;
    width: 14px;
    height: 14px;
    transform: translateY(-600px);
    filter: drop-shadow(
      #00b09b 0 600px
    ); //颜色、x轴偏移量、y轴偏移量,这里的颜色就是你要指定的颜色，不管原来的图片是什么颜色，都会变成这个颜色
  }
}

.info44 {
  width: 341px;
  height: 20px;
  overflow-wrap: break-word;
  color: rgba(31, 35, 47, 1);
  font-size: 14px;
  letter-spacing: -0.12098753452301025px;
  text-align: left;
  white-space: nowrap;
  line-height: 20px;
  display: block;
  margin: 20px 0 0 0;
}
.diag {
  width: 100%;
  height: 27px;
  text-align: center;
  .diag-title {
    vertical-align: middle;
    height: 25px;
    line-height: 25px;
    margin: 0 auto;
  }
}
/deep/ .el-dialog {
  margin-right: 25px;
}
.end-tips {
  text-align: center;
  color: #b6bdc6;
}
</style>
