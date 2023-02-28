<template>
  <el-dialog
    class="common-dialog"
    title="查看公告"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="dialogVisible = false"
  >
    <slot></slot>
    <el-form
      ref="editForm"
      :model="editForm"
      label-position="right"
      label-width="100px"
      style="margin-right: 60px"
    >
      <el-form-item label="标题">
        <span>{{ editForm.title }}</span>
      </el-form-item>
      <el-form-item label="是否启用">
        <span>{{ editForm.isrelease == '1' ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item label="是否置顶" prop="istop">
        <span>{{ editForm.istop == '1' ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item label="公告内容">
        <div v-html="$xss(editForm.content)"></div>
        <!-- <div v-html="$xss(`'>< img src=1 onerror=window.alert(1)>`)"></div> -->
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button size="small" @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryById } from '@/api/manage/notice';
export default {
  data() {
    return {
      dialogVisible: false,
      row: {},
      editForm: {
        title: '',
        isrelease: '',
        istop: '',
        content: '',
      },
    };
  },
  mounted() {},
  methods: {
    getDetail() {
      let param = {
        id: this.row.id,
      };
      queryById(param).then(res => {
        if (res.success) {
          this.editForm = _.cloneDeep(res.data);
          // this.editForm.content = '&lt;img src=# onerror=alert(1)&gt;';
        }
      });
    },
  },
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
.el-form-item {
  margin-bottom: 0px;
}
</style>