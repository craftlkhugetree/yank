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
            <el-select
              v-model="editForm.resgroupid"
              size="small"
              placeholder="请选择"
              filterable
              clearable
              popper-class="noarrow"
              ref="resGroupSelect"
            >
              <el-option
                v-for="item in resGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                <span style="float: left; color: rgba(0,0,0,0.65)">{{ item.name }}</span>
                <i
                  v-if="editForm.resgroupid === item.id"
                  style="float:right;margin-top:8px;"
                  class="el-icon-check"
                ></i>
              </el-option>
            </el-select>
            <i class="iconfont icon-add-circle" @click="$refs.resGroupDialog.dialogVisible = true"></i>
            <!---------------------------- 新增资源集弹窗 ---------------------------->
            <res-group-dialog class="fixed-dialog" ref="resGroupDialog" @doFunc="getResGroupList">
              <i class="el-icon-arrow-left" @click="goBackList"></i>
            </res-group-dialog>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="toAddRes">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { fetchResGroupList } from "@/api/admin/res";
import ResGroupDialog from "../resManage/resGroupDialog";
export default {
  components: {
    ResGroupDialog
  },
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      temp: {}, // 选择的模板
      resGroupList: [],
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
    // 获取资源集
    getResGroupList() {
      fetchResGroupList()
        .then(res => {
          this.resGroupList = res.data || [];
        })
        .catch(err => {});
    },

    // 返回下拉列表
    goBackList() {
      this.$refs.resGroupDialog.dialogVisible = false;
      this.$refs.resGroupSelect.focus();
    },

    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      this.editForm = {
        id: "",
        name: "",
        typeid: "",
        tplid: ""
      };
    },

    // 保存资源集
    toAddRes() {
      let data = _.cloneDeep(this.editForm);
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
        }
      });
    }
  },
  created() {
    this.getResGroupList();
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
  i.iconfont {
    margin-left: 5px;
    color: #3f86f7;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  i.iconfont.icon-add-circle {
    position: relative;
    width: 40px;
    height: 26px;
    line-height: 26px;
    margin-left: -45px;
    vertical-align: middle;
    display: inline-block;
    text-align: center;
    background: #ffffff;
  }
}

.fixed-dialog {
  position: absolute;
  width: 400px;
  height: 400px;
  left: -50px;
  top: -100px;
  .el-icon-arrow-left {
    position: absolute;
    top: 15px;
    left: 15px;
    cursor: pointer;
  }
}
</style>