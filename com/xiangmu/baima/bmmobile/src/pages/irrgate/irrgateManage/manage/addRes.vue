<template>
  <div>
    <van-nav-bar title="灌溉资源新增" :border="false" left-arrow @click-left="goBack" />
    <van-form ref="edifForm" input-align="right" error-message-align="right">
      <!-- 基本信息 -->
      <div class="form-box">
        <div class="form-box-title">基本信息</div>
        <div class="form-box-content">
          <van-field
            name="学院名称"
            label="学院名称"
            placeholder="请选择"
            readonly
            clickable
            v-model="editForm.orgname"
            @click="showTypePicker = true"
            :right-icon="editForm.orgname ? 'clear' : ''"
            @click-right-icon.stop="clearOrg"
          />
          <!-- <van-popup v-model="showTypePicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="orgList"
              @confirm="onConfirmOrg"
              @cancel="showTypePicker = false"
            />
          </van-popup>-->
          <van-popup v-model="showTypePicker" position="right" :style="{ height: '100%' }">
            <div class="user-select">
              <van-search
                v-model="query"
                placeholder="请输入学院名称"
                input-align="left"
                @input="searchOrg"
              ></van-search>
              <div class="user-list">
                <van-cell
                  v-for="item in orgList"
                  :key="item.id"
                  @click="onConfirmOrg(item)"
                >{{item.name}}</van-cell>
              </div>
            </div>
          </van-popup>
          <van-field
            v-model="editForm.restypename"
            name="灌溉类型"
            label="灌溉类型"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写灌溉类型' }]"
          />
          <van-field
            v-model="editForm.rescode"
            name="灌溉编号"
            label="灌溉编号"
            placeholder="请输入"
            :rules="[{ required: true, message: '请填写灌溉编号' }]"
          />
        </div>
      </div>
      <van-button type="primary" size="large" @click="doSubmit()">提交</van-button>
    </van-form>
  </div>
</template>

<script>
import BasicSelectOrg from "../../../../components/BasicSelectOrg";
export default {
  components: {
    BasicSelectOrg
  },
  data() {
    return {
      editForm: {
        orgid: "",
        orgname: "",
        restypename: "",
        rescode: ""
      },
      showTypePicker: false,
      query: "",
      orgList: []
    };
  },
  props: {
    id: String,
    orgname: String
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 清空学院
    clearOrg() {
      this.editForm.orgid = "";
      this.editForm.orgname = "";
    },
    // 搜索列表
    searchOrg() {
      let query = this.query;
      if (query !== "") {
        this.loading = true;
        this.common
          .getOrgList(query)
          .then(res => {
            this.loading = false;
            this.orgList = res;
            if ("公共资源".includes(query)) {
              this.orgList.push({
                id: "-1",
                name: "公共资源"
              });
            }
          })
          .catch(err => {
            this.loading = false;
            this.orgList = [];
          });
      } else {
        this.orgList = [];
      }
    },
    // 选择学院
    onConfirmOrg(item) {
      this.editForm.orgid = item.id;
      this.editForm.orgname = item.name;
      this.showTypePicker = false;
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
          let url = this.id ? "/irres/update" : "/irres/add";
          let params = {
            orgid: this.editForm.orgid || "-1",
            restypename: this.editForm.restypename,
            rescode: this.editForm.rescode
          };
          if(this.id) {
            params.id = this.id
          }
          this.util
            .postAjax({
              code: this.global.bmCode,
              url: url,
              isRep: true,
              data: params
            })
            .then(res => {
              this.$toast.clear();
              if (res.success) {
                this.$router.push("/irrgate-manage/add-success");
              } else {
                this.$toast.fail("提交失败" + "\n" + res.message);
              }
            })
            .catch(err => {
              this.$toast.clear();
              this.$toast.fail("提交失败" + "\n" + err);
            });
        })
        .catch(() => {
          this.$toast.fail("请填写正确信息");
        });
    },
    // 获取详情
    getDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/irres/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          if (res.success) {
            this.editForm = res.item;
            if (res.item.orgid === "-1") {
              // this.editForm.orgname = "公共资源";
              this.$set(this.editForm, "orgname", "公共资源");
            } else {
              this.$set(this.editForm, "orgname", this.orgname);
              // this.editForm.orgname = this.orgname;
            }
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
    // 获取详情
    if (this.id) {
      this.getDetail();
    }
  }
};
</script>

<style>
</style>