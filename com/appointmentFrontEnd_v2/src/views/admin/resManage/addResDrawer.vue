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
    @open="getTplList"
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
          <el-form-item label="资源集:" prop="resgroupid" style="position:relative;">
            <res-group-select v-if="drawer" :resGroupId.sync="editForm.resgroupid"></res-group-select>
          </el-form-item>
          <el-form-item label="资源名称:" prop="name">
            <el-input v-model="editForm.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="选择模板:" prop="templateid">
            <div class="list-item" v-for="item in tplList" :key="item.id">
              <input type="radio" name="radio" v-model="editForm.templateid" :value="item.id" />
              <img class="list-item-bg" :src="item.img" alt />
              <div class="list-item-info">
                <h3>{{item.name}}</h3>
                <span>{{item.note}}</span>
              </div>
            </div>
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
import ResGroupSelect from "./components/ResGroupSelect";
import { fetchTempList } from "@/api/admin/res";
export default {
  components: {
    ResGroupSelect
  },
  data() {
    return {
      drawer: false,
      drawerLoading: false,
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
        ],
        templateid: [
          { required: true, message: "请选择模板！", trigger: "change" }
        ]
      },
      tplSelect: null,
      tplList: []
    };
  },
  computed: {
    // 模板图片列表
    tplImages() {
      return this.$store.state.tplImages;
    }
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

    // 获取模板列表
    getTplList() {
      fetchTempList()
        .then(res => {
          if (res.success) {
            this.tplList = res.data || [];
            // 设置图片
            this.tplList.forEach(i => {
              let index = this.tplImages.findIndex(j => j.id === i.id);
              if (index > -1) {
                i.img = this.tplImages[index].img;
              }
            });
            let tpl = this.tplList[0];
            if(tpl) {
              this.editForm.templateid = tpl.id;
            } 
          }
        })
        .catch(err => {});
    },

    // 保存资源集
    toAddRes() {
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
  input[type="radio"] {
    position: absolute;
    top: 10px;
    left: 10px;
  }
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