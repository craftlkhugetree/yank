<template>
  <div style="background: #ffffff;">
    <!--面包屑-->
    <bread-crumb :breadList="breadList"></bread-crumb>

    <div class="back-top">
      <div class="my-button green" style="border-radius: 16px" @click="back">
        <i class="el-icon-back"></i>
        <span>返回</span>
      </div>
    </div>

    <!--申请信息和审批意见-->
    <div class="audit-content" style="margin-top: 30px">
      <irr-apply-table :applyInfoForm="applyInfoForm"></irr-apply-table>

      <div style="margin-bottom: 20px">
        <div class="item-title">
          <img
            style="width: 22px;height: 20px"
            src="../../../static/images/bm-audit-info.png"
            alt=""
          />
          <span>审批</span>
        </div>
        <opinions ref="opinions"></opinions>
      </div>

      <!--操作按钮-->
      <div style="text-align: center">
        <div class="my-button plain-red" @click="operate('0')">
          <span>审批不通过</span>
        </div>

        <div
          style="margin-left: 20px"
          class="my-button green"
          @click="operate('1')"
        >
          <span>审批通过</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Opinions from "../../components/opinions";
import irrApplyTable from "../../components/irrApplyTable";
import breadCrumb from "../../components/breadcrumb";

export default {
  name: "detail",
  components: {
    Opinions,
    irrApplyTable,
    breadCrumb
  },
  props: {
    id: String,
    breadList: Array,
    indexActiveName: String,
    indexCurrentPage: Number | String
  },
  data() {
    return {
      applyInfoForm: {}, //申请信息表格
      typeList: JSON.parse(sessionStorage.getItem("typeList")), //资源类型列表
      codeList: JSON.parse(sessionStorage.getItem("codeList")) //资源编号列表
    };
  },

  methods: {
    back() {
      window.history.go(-1);
      sessionStorage.setItem("activeName", this.indexActiveName);
      sessionStorage.setItem(
        "currentPage",
        JSON.stringify(this.indexCurrentPage)
      );
    },

    //添加常用字段
    addOpenUse() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/opinions/add",
          isRep: true,
          data: {
            note: this.$refs.opinions.eventnote
          }
        })
        .then(res => {
          if (res.success == true) {
            /* this.getTipList();
             this.dialogVisible = false;*/
          } else {
            this.$message({
              type: "warning",
              message: res.data.message
            });
          }
        });
    },

    //审核操作
    operate(type) {
      if (!this.$refs.opinions.eventnote) {
        this.$message({
          type: "warning",
          message: "请输入审批意见!"
        });
      } else {
        let params = {
          eventnote: this.$refs.opinions.eventnote,
          eventresult: type,
          eventtype: 4,
          applyid: this.id
        };

        const loading = this.$loading({
          lock: true,
          text: "提交审批中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.util
          .postAjax({
            code: this.global.code,
            url: "/irapply/saveEvent",
            isRep: true,
            data: params
          })
          .then(res => {
            // console.log(res);
            loading.close();
            if (res.success) {
              this.addOpenUse();
              this.$message({
                type: type == "0" ? "error" : "success",
                message: type == "0" ? "审批不通过" : "审批通过"
              });
              this.back();
            } else {
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          });
      }
    },

    //获取详情接口
    getDetail() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/irapply/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          if (res.success == true) {
            this.applyInfoForm = res.item.apply;

            //资源类型转换
            this.typeList.forEach(v => {
              if (v.id == this.applyInfoForm.irrestypeid) {
                this.applyInfoForm.irrestype = v.typename;
              }
            });
            //资源编号转换
            let arr = [];
            this.codeList.forEach(v => {
              res.item.ress.forEach(m => {
                if (v.id == m.id) {
                  arr.push(v.rescode);
                  this.applyInfoForm.rescodes = arr.join(",");
                }
              });
            });

            //审核列表转换
            let events = JSON.parse(JSON.stringify(res.item.events));
            events.forEach(v => {
              if (v.eventtype == "1") {
                // this.applyInfoForm.eventnote =v.eventnote;
                this.applyInfoForm.eventername = v.eventername;
              }
            });

            //日期转换
            this.applyInfoForm.irdate = this.util.formatTime(
              this.applyInfoForm.irdate,
              "yyyy.MM.dd"
            );
          }
        });
    }
  },

  created() {
    this.getDetail();
  }
};
</script>

<style scoped></style>
