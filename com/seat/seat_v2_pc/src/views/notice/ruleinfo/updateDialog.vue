<template>
  <el-dialog
    class="common-dialog"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="cancelDialog"
    v-if="dialogVisible"
  >
    <slot></slot>

    <el-form
      ref="editForm"
      :model="editForm"
      :rules="rules"
      label-position="right"
      label-width="100px"
      style="margin-right:60px"
    >
      <el-form-item label="制度名称" prop="name">
        <el-input :maxlength="40" show-word-limit v-model="editForm.name" placeholder="不超过40个字符"></el-input>
      </el-form-item>
      <el-form-item label="制度版本" prop="version">
        <el-input :maxlength="40" show-word-limit v-model="editForm.version" placeholder="不超过40个字符"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="status">
        <el-radio-group v-model="editForm.status" size="small">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="制度内容" prop="content">
        <wang-editor ref="editor" v-model="editForm.content"></wang-editor>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button type="primary" size="small" @click="handleSave">确定</el-button>
      <el-button size="small" @click="cancelDialog">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryById, saveRuleInfo } from "@/api/manage/ruleinfo";
import WangEditor from "@/components/WangEditor";
export default {
  components: {
    WangEditor
  },
  data() {
    let editorContent = (rule, value, callback) => {
      let html = this.$refs.editor.editor.txt.html();
      if (!html) {
        return callback(new Error("请输入制度内容！"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      row: {},
      title: "",
      editForm: {
        name: "",
        status: "1",
        istop: "",
        content: "",
        id: ""
      },
      rules: {
        name: [
          { required: true, message: "制度名称不能为空！", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择是否启用!", trigger: "change,blur" }
        ],
        version: [
          { required: true, message: "制度版本不能为空！", trigger: "change" }
        ],
        content: [
          { required: true, validator: editorContent, trigger: "change" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    getDetail() {
      let param = {
        id: this.row.id
      };
      queryById(param).then(res => {
        if (res.success) {
          this.editForm = _.cloneDeep(res.data);
          // 设置富文本内容
          this.$nextTick(() => {
            this.$refs.editor.editor.txt.html(this.editForm.content);
          });
        }
      });
    },
    // 关闭弹窗
    cancelDialog() {
      this.dialogVisible = false;
      this.$refs.editForm.resetFields();
      this.editForm.id = "";
    },
    // 保存
    handleSave() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let data = _.cloneDeep(this.editForm);
          data.content = this.$refs.editor.editor.txt.html();
          saveRuleInfo(data).then(res => {
            this.loading = false;
            if (res.success) {
              this.$message({
                showClose: true,
                type: "success",
                message: "保存成功！"
              });
              this.dialogVisible = false;
              this.$refs.editForm.resetFields();
              this.$emit("doFunc");
            } else {
              this.$message({
                showClose: true,
                type: "error",
                message: "保存失败：" + res.data.message
              });
            }
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