<template>
  <el-dialog
    class="common-dialog"
    title="临时关闭设置"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    :close-on-click-modal="false"
    width="480px"
    @close="cancelDialog"
  >
    <slot></slot>
    <el-form
      ref="editForm"
      :model="editForm"
      :rules="rules"
      label-position="top"
      label-width="125px"
    >
      <!-- <el-form-item label="区间名称"> -->
      <p style="margin:22px 0">
        区间名称：
        <span>{{formdata.name}}</span>
      </p>
      <!-- </el-form-item> -->
      <el-form-item label="临时关闭时间段" prop="date">
        <el-date-picker
          v-model="editForm.date"
          type="daterange"
          :disabled="formdata.status=='3'"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
          style="width:100%"
          :picker-options="expireTimeOption"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="关闭说明" prop="note">
        <el-input
          :maxlength="200"
          show-word-limit
          :disabled="formdata.status=='3'"
          type="textarea"
          v-model="editForm.note"
          :rows="5"
          resize="none"
          placeholder="不超过200个字符"
        ></el-input>
      </el-form-item>
      <!-- <span class="tips">该说明将会以消息的形式发送给已经占座或预约该区间座位的用户</span> -->
    </el-form>
    <span slot="footer">
      <el-button
        v-if="formdata.status=='3'"
        size="small"
        @click="cancelClose"
        :loading="loading"
      >取消临时关闭</el-button>
      <el-button v-else type="primary" size="small" @click="closeSure" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { changeStatus } from "@/api/manage/section";
export default {
  data() {
    return {
      dialogVisible: false,
      id: null,
      name: "",
      loading: false,
      formdata: {},
      editForm: {
        date: [],
        note: ""
      },
      rules: {
        date: [
          { required: true, message: "请选择关闭时间段！", trigger: "change" }
        ],
        note: [
          { required: true, message: "请输入关闭说明！", trigger: "change" }
        ]
      },

      expireTimeOption: {
        disabledDate(date) {
          //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      }
    };
  },
  mounted() {},
  methods: {
    handleFormVal() {
      if (this.formdata.closestart) {
        this.editForm.date = [this.formdata.closestart, this.formdata.closeend];
        this.editForm.note = this.formdata.closenote;
      } else {
        this.editForm.date = [];
        this.editForm.note = "";
      }
    },
    // 关闭弹窗
    cancelDialog() {
      this.$refs.editForm.resetFields();
    },
    //有临时关闭，可以取消临时关闭，即开放状态
    cancelClose() {
      this.$confirm(`确认取消临时关闭区间座位吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            id: this.formdata.id,
            status: "1"
          };
          changeStatus(data).then(res => {
            this.loading = false;
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: `取消临时关闭成功`
              });
              this.dialogVisible = false;
              this.$emit("doFunc");
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: `取消临时关闭失败 ${res.data.message}`
              });
            }
          });
        })
        .catch(err => {});
    },

    // 保存
    closeSure() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let data = {
            id: this.formdata.id,
            closestart: this.editForm.date[0],
            closeend: this.editForm.date[1],
            closenote: this.editForm.note,
            status: "3"
          };
          changeStatus(data)
            .then(res => {
              this.loading = false;
              if (res.success) {
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "临时关闭成功！"
                });
                this.dialogVisible = false;
                this.$emit("doFunc");
              } else {
                this.$message({
                  showClose: true,
                  type: "error",
                  message: "临时关闭失败" + res.data.message
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: "临时关闭失败" + err
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  margin-left: 125px;
  font-size: 14px;
  color: #f9784a;
  text-align: left;
  text-indent: 140px;
}
</style>