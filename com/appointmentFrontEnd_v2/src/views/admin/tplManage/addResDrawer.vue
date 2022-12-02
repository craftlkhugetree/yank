<template>
  <el-drawer
    class="base-drawer"
    title="新增资源"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <div class="edit-box">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="rules"
          label-position="right"
          label-width="100px"
        >
          <el-form-item label="选择模板:" prop="templateid">
            <div class="list-item">
              <img class="list-item-bg" :src="temp.img" alt />
              <div class="list-item-info">
                <h3>{{temp.name}}</h3>
                <span>{{temp.note}}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="资源名称:" prop="name">
            <el-input v-model="editForm.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="资源集:" prop="resgroupid" style="position:relative;">
            <res-group-select :resGroupId.sync="editForm.resgroupid"></res-group-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="toAddRes">下一步</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import ResGroupSelect from "../resManage/components/ResGroupSelect";
export default {
  components: {
    ResGroupSelect
  },
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      temp: {}, // 选择的模板
      editForm: {
        id: "",
        name: "",
        resgroupid: "",
        templateid: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入资源名称！", trigger: "change" }
        ],
        resgroupid: [
          { required: true, message: "请选择资源集！", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: "",
        name: "",
        resgroupid: "",
        templateid: ""
      };
    },

    // 保存资源集
    toAddRes() {
      let data = _.cloneDeep(this.editForm);
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let data = JSON.stringify(this.editForm);
          sessionStorage.setItem("newRes",data);
          this.$router.push("/res-manage/edit-res/null");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 0 20px 32px;
}

.list-item {
  position: relative;
  width: 252px;
  height: 150px;
  box-shadow: 0px 5px 8px 4px rgba(0, 0, 0, 0.05),
    0px 3px 6px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  margin-top: 10px;
  img.list-item-bg {
    width: 100%;
    height: 100%;
  }
  .list-item-info {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px 10px 0;
    color: rgba(255, 255, 255, 0.85);
    h3 {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
    }
    span {
      font-size: 14px;
      line-height: 20px;
    }
  }
}
.edit-box {
  position: relative;
}
.el-form {
  .el-select,
  .el-input {
    width: 300px;
  }
  .el-checkbox {
    display: block;
    height: 30px;
  }
  .el-form-item {
    margin-bottom: 14px;
  }
}
</style>