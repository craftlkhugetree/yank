<template>
  <div>
    <van-nav-bar :title="id ? '编辑资源类型' : '新增资源类型'" :border="false" left-arrow @click-left="goBack" />
    <van-form ref="edifForm" input-align="right" error-message-align="right">
      <!-- 基本信息 -->
      <div class="form-box">
        <div class="form-box-title">1.基本信息</div>
        <div class="form-box-content">
          <van-field
            v-model="editForm.name"
            name="资源类型名称"
            label="资源类型名称"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写资源类型名称' }]"
          />
        </div>
      </div>
      <!-- 资源属性 -->
      <div class="form-box">
        <div class="form-box-title">2.资源属性</div>
        <span class="form-box-title-btn" @click="showAttrDialog = true">
          <van-icon name="add" color="#00b09b"></van-icon>新增属性
        </span>
        <div class="form-box-content" style="padding:10px 15px;">
          <span class="tag tag-default" v-for="item in defaultList" :key="item.name">{{item.name}}</span>
          <span class="tag tag-green" v-for="(item,index) in editForm.attrList" :key="item.name">
            {{item.name}}
            <van-icon name="clear" @click="deleteAttr(item,index)"></van-icon>
          </span>
        </div>
      </div>
      <!-- 其他信息 -->
      <div class="form-box">
        <div class="form-box-title">3.其他</div>
        <div class="form-box-content">
          <van-field
            name="计费周期"
            v-model="editForm.chargecycle"
            label="计费周期"
            :rules="[{ required: true, message: '请选择计费周期' }]"
          >
            <template #input>
              <van-radio-group
                v-model="editForm.chargecycle"
                direction="horizontal"
                checked-color="#00b09b"
              >
                <van-radio name="1">天</van-radio>
                <van-radio name="2">月</van-radio>
                <van-radio name="3">年</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            name="计费方式"
            v-model="editForm.chargetype"
            label="计费方式"
            :rules="[{ required: true, message: '请选择计费方式' }]"
          >
            <template #input>
              <van-radio-group
                v-model="editForm.chargetype"
                direction="horizontal"
                checked-color="#00b09b"
              >
                <van-radio name="1">面积</van-radio>
                <van-radio name="2">房间</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            name="最大使用时长"
            v-model="editForm.maxusecycle"
            label="最大使用时长"
            type="digit"
            placeholder="请输入整数"
            :rules="[{ required: true, message: '请输入最大使用时长(整数)' }]"
          >
            <template #button>
              <!-- <van-button size="small" type="primary">发送验证码</van-button> -->
              <span style="color:#323233;">{{common.chargecycleFormatter(editForm.chargecycle)}}</span>
            </template>
          </van-field>
          <van-field
            name="基础设施"
            v-model="editForm.baseList.length"
            label="基础设施"
            :border="false"
            :rules="[{ validator:(v) => {return v > 0}, message: '请添加基础设施' }]"
          >
            <template #input>
              <span class="form-field-btn" @click="showBaseDialog = true">
                <van-icon name="add" color="#00b09b"></van-icon>新增设施
              </span>
            </template>
          </van-field>
          <div style="padding:0 15px 20px;">
            <span
              class="tag tag-green-border"
              v-for="(item,index) in editForm.baseList"
              :key="index"
            >
              {{item.name}}
              <van-icon name="clear" @click="deleteBase(item,index)"></van-icon>
            </span>
          </div>
        </div>
      </div>
      <!-- 规则 -->
      <div class="form-box">
        <div class="form-box-title">4.规则</div>
        <div class="form-box-content">
          <div class="field-box">
            <div class="field-box-textarea">
              <van-field
                v-model="editForm.rules"
                name="规则"
                placeholder="请输入"
                rows="3"
                type="textarea"
                maxlength="500"
                :show-word-limit="true"
                input-align="left"
                :rules="[{ required: true, message: '请填写规则' }]"
              />
            </div>
          </div>
        </div>
        <div style="width:100%; height:50px;"></div>
      </div>
      <div class="form-btns">
        <van-button type="default" @click="goBack">取消</van-button>
        <van-button type="primary" @click="doSubmit">提交</van-button>
      </div>
    </van-form>

    <!-- 属性弹窗 -->
    <van-dialog v-model="showAttrDialog" title="新增属性" show-cancel-button :before-close="addAttr">
      <van-form ref="attrForm">
        <van-field
          label="属性名称"
          v-model="newAttr"
          placeholder="请输入"
          :rules="[{required:true,message: '请填写属性名称'}]"
        ></van-field>
      </van-form>
    </van-dialog>

    <!-- 设施弹窗 -->
    <van-dialog v-model="showBaseDialog" title="新增设施" show-cancel-button :before-close="addBase">
      <van-form ref="baseForm">
        <van-field
          label="设施名称"
          v-model="newBase"
          placeholder="请输入"
          :rules="[{required:true,message: '请填写设施名称'}]"
        ></van-field>
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultList: [
        { name: "编号" },
        { name: "面积" },
        { name: "单价" },
        { name: "设施" }
      ],
      editForm: {
        name: "",
        attrList: [],
        chargecycle: "1",
        chargetype: "1",
        baseList: [],
        rules: ""
      },
      detail: {},
      showAttrDialog: false,
      newAttr: "",
      showBaseDialog: false,
      newBase: ""
    };
  },
  props: {
    id: String,
    operType: String
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 新增属性
    addAttr(action, done) {
      if (action === "cancel") {
        done();
      } else if (action === "confirm") {
        this.$refs.attrForm
          .validate()
          .then(() => {
            let attrList = this.editForm.attrList.concat(this.defaultList);
            if (attrList.some(i => i.name === this.newAttr)) {
              this.$toast.fail("该属性已存在");
              done(false);
            } else {
              this.editForm.attrList.push({
                name: this.newAttr
              });
              done();
            }
          })
          .catch(() => {
            done(false);
          });
      }
    },
    // 删除属性
    deleteAttr(item, index) {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/spres/validateTypeAttr",
          data: {
            id: item.id
          }
        })
        .then(res => {
          if (res.success) {
            this.editForm.attrList.splice(index, 1);
          } else {
            this.$toast.fail("删除失败，该属性已被资源选用！");
          }
        });
    },
    // 新增设施
    addBase(action, done) {
      if (action === "cancel") {
        done();
      } else if (action === "confirm") {
        this.$refs.baseForm
          .validate()
          .then(() => {
            let baseList = this.editForm.baseList;
            if (baseList.some(i => i.name === this.newBase)) {
              this.$toast.fail("该设施已存在");
              done(false);
            } else {
              this.editForm.baseList.push({
                name: this.newBase
              });
              done();
            }
          })
          .catch(() => {
            done(false);
          });
      }
    },
    // 删除设施
    deleteBase(item, index) {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/spres/validateTypeBase",
          data: {
            id: item.id
          }
        })
        .then(res => {
          if (res.success) {
            this.editForm.baseList.splice(index, 1);
          } else {
            this.$toast.fail("删除失败，该设施已被资源选用！");
          }
        });
    },
    // 提交
    doSubmit() {
      this.$refs.edifForm
        .validate()
        .then(() => {
          this.$toast.loading({
            message: "提交中...",
            forbidClick: true,
            duration: 0
          });
          let url = this.id ? "/sprestype/update" : "/sprestype/add";
          this.util
            .postAjax({
              code: this.global.bmCode,
              url: url,
              isRep: true,
              data: this.editForm
            })
            .then(res => {
              this.$toast.clear();
              if (res.success == true) {
                this.$toast.success("提交成功");
                this.goBack();
              } else {
                this.$toast.fail("提交失败" + "\n" + res.message);
              }
            })
            .catch(err => {
              this.$toast.clear();
              this.$toast.fail("提交失败" + "\n" + err);
            });
        })
        .catch(err => {
          this.$toast.fail("请填写正确信息");
        });
    },
    // 获取详情
    getDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/sprestype/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          if (res.success) {
            this.editForm = res.item || {};
            this.editForm.rules = this.editForm.rules || "";
          } else {
            this.$toast.fail("获取数据失败" + "\n" + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + "\n" + err);
        });
    }
  },
  created() {
    if (this.id) {
      this.getDetail();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/mixin.scss";
.tag {
  display: inline-block;
  padding: 10px 20px;
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 10px;
  &.tag-default {
    color: #8c8e95;
    background: #e7e9ef;
    border-radius: 20px;
  }
  &.tag-green,
  &.tag-green-border {
    color: #00b09b;
    background: #e3f9f5;
    border-radius: 20px;
    .van-icon-clear {
      color: #d4d8e2;
      vertical-align: middle;
      margin-left: 5px;
      font-size: 16px;
    }
  }
  &.tag-green-border {
    border: 1px solid #00b09b;
    border-radius: 5px;
  }
}
</style>