<template>
  <div>
    <van-nav-bar :title="id ? '编辑资源' : '新增资源'" :border="false" left-arrow @click-left="goBack" />
    <van-form ref="edifForm" input-align="right" error-message-align="right">
      <!-- 基本信息 -->
      <div class="form-box">
        <div class="form-box-title">资源信息</div>
        <div class="form-box-content">
          <van-field v-model="restypeDetail.name" name="资源类型" label="资源类型" disabled />
          <van-field
            v-model="editForm.rescode"
            name="资源编号"
            label="资源编号"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写资源编号' }]"
          />
          <van-field
            v-model="editForm.area"
            name="面积"
            label="面积（m²）"
            type="number"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写面积' }]"
          />
          <van-field
            v-model="editForm.price"
            name="单价"
            :label="`单价（元/${restypeDetail.chargecycle}/${common.chargetypeFormatter(restypeDetail.chargetype, 'unit')}）`"
            type="number"
            placeholder="请输入"
            label-width="140"
            :rules="[{ pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^0\.\d{1,2}$)/, message: '请填写单价(整数或两位小数)' }]"
            :border="false"
            style="padding-bottom:0;"
          />
          <van-cell style="padding-top:0;">
            <span
              style="color:#faac16;font-size:12px;"
            >计费周期：{{restypeDetail.chargecycle}}，计费方式：{{common.chargetypeFormatter(restypeDetail.chargetype, 'name')}}</span>
          </van-cell>
          <van-field
            v-for="(item,index) in editForm.attrList"
            :key="item.id"
            v-model="editForm.attrList[index].attrv"
            :name="item.name"
            :label="item.name"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写' + item.name }]"
          ></van-field>
          <van-field
            v-model="editForm.baseList.length"
            name="基础设施"
            label="基础设施"
            :border="false"
            :rules="[{ validator:(v) => {return v > 0}, message: '请选择基础设施' }]"
          >
            <template #input>
              <span style="color:#00b09b;font-size:12px;">点击选择基础设施</span>
            </template>
          </van-field>
          <div style="padding:0 15px 20px;">
            <span
              class="tag"
              :class="{'tag-default': !item.isChoosed,'tag-green': item.isChoosed}"
              v-for="item in restypeDetail.baseList"
              :key="item.id"
              @click="chooseBase(item)"
            >{{item.name}}</span>
          </div>
          <van-field
            name="资源状态"
            v-model="editForm.resstatus"
            label="资源状态"
            :rules="[{ required: true, message: '请选择资源状态' }]"
            class="van-hairline--top"
          >
            <template #input>
              <van-radio-group
                v-model="editForm.resstatus"
                direction="horizontal"
                checked-color="#00b09b"
                :disabled="usestatus !== '1'"
              >
                <van-radio name="1">开启</van-radio>
                <van-radio name="2">关闭</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </div>
      </div>
      <div class="form-btns">
        <van-button type="default" @click="goBack">取消</van-button>
        <van-button type="primary" @click="doSubmit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editForm: {
        rescode: "",
        area: "",
        price: "",
        baseList: [],
        attrList: [],
        resstatus: "1"
      },
      usestatus: "1", // 使用状态 1空闲
      restypeDetail: {}
    };
  },
  props: {
    restypeid: String,
    id: String,
    operType: String
  },
  computed: {
    uploadUrl() {
      return this.$store.state.uploadUrl;
    }
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 选择设施
    chooseBase(item) {
      if (item.isChoosed) {
        let index = this.editForm.baseList.findIndex(
          i => i.typebaseid === item.id
        );
        if (index !== -1) {
          this.editForm.baseList.splice(index, 1);
        }
      } else {
        this.editForm.baseList.push({
          typebaseid: item.id
        });
      }
      item.isChoosed = !item.isChoosed;
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
          let url = this.id ? "/spres/update" : "/spres/add";
          this.editForm.restypeid = this.restypeid;
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
          url: "/spres/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          if (res.success) {
            this.editForm = res.item || {};
            this.usestatus = res.item.usestatus || "";
            this.setChooseBase();

            // 修正属性：类型属性和详情属性数量不一致时
            if (
              this.restypeDetail.attrList.length !==
              this.editForm.attrList.length
            ) {
              let attrids = this.editForm.attrList.map(i => i.typeattrid);
              this.restypeDetail.attrList.forEach(i => {
                if (!attrids.includes(i.id)) {
                  this.editForm.attrList.push({
                    name: i.name,
                    attrv: "",
                    typeattrid: i.id
                  });
                }
              });
            }
          } else {
            this.$toast.fail("获取数据失败" + "\n" + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + "\n" + err);
        });
    },
    // 获取资源类型详情
    getResTypeDetail() {
      return new Promise((resolve, reject) => {
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: "/sprestype/findById",
            data: {
              id: this.restypeid
            }
          })
          .then(res => {
            if (res.success) {
              this.restypeDetail = res.item || {};
              this.restypeDetail.chargecycle = this.common.chargecycleFormatter(
                res.item.chargecycle
              );
              //   this.restypeDetail.chargetype = this.common.chargetypeFormatter(
              //     res.item.chargetype
              //   );

              // 初始化设施
              this.restypeDetail.baseList.forEach(i => {
                this.$set(i, "isChoosed", false);
              });
              // 初始化属性
              this.editForm.attrList = this.restypeDetail.attrList.map(i => {
                return {
                  name: i.name,
                  attrv: "",
                  typeattrid: i.id
                };
              });
              resolve(res);
            } else {
              this.$toast.fail("获取数据失败" + "\n" + res.message);
              reject(res);
            }
          })
          .catch(err => {
            // this.$toast.fail("获取数据失败" + "\n" + err);
            reject(err);
          });
      });
    },
    // 设置设施的选中状态
    setChooseBase() {
      let baseIds = this.editForm.baseList.map(i => i.typebaseid);
      this.restypeDetail.baseList.forEach(i => {
        let isChoosed = baseIds.includes(i.id) ? true : false;
        this.$set(i, "isChoosed", isChoosed);
      });
    }
  },
  created() {
    // 获取资源类型详情
    if (this.restypeid) {
      this.getResTypeDetail()
        .then(res => {
          // 获取资源详情
          if (this.id) {
            this.getDetail();
          }
        })
        .catch(() => {});
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