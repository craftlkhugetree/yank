<template>
  <el-drawer
    class="base-drawer"
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :wrapperClosable="false"
    @open="openDrawer"
    @close="closeDrawer"
    v-loading="drawerLoading"
    size="660px"
  >
    <div class="drawer-container">
      <el-form
        ref="editForm"
        :model="editForm"
        style="padding:0 30px;"
        label-width="100px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="联系人：" prop="user" required>
          <el-input v-model="editForm.user" disabled size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="联系手机：" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入" size="small" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="配送地址：" prop="area">
          <el-select
            v-model="editForm.area"
            filterable
            remote
            placeholder="请输入楼宇名称查询"
            :remote-method="remoteMethod"
            :loading="arealoading"
            style="width:300px;"
            size="small"
          >
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <i class="el-icon-search select-search"></i>
        </el-form-item>
        <el-form-item prop="house">
          <el-input
            v-model="editForm.house"
            placeholder="请输入具体的门牌号"
            size="small"
            style="width:300px;"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button type="primary" size="small" @click="save">保存</el-button>
      <el-button size="small" @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { fetchBuildingList } from "@/api/admin/building";
import { fetchAddressList, saveAddress } from "@/api/admin/address";
export default {
  data() {
    return {
      drawer: false,
      drawerLoading: false,
      title: "新增地址",
      editForm: {
        id: null,
        user: null,
        userid: null,
        username: null,
        area: null,
        house: null,
        mobile: localStorage.getItem("mobile")
      },
      rules: {
        user: [{ required: true, trigger: "change", message: "请选择联系人" }],
        mobile: [
          {
            required: true,
            pattern: /^1\d{10}$/,
            trigger: "change",
            message: "请输入联系人手机号"
          }
        ],
        area: [{ required: true, trigger: "change", message: "请选择楼宇" }],
        house: [
          { required: true, trigger: "change", message: "请输入具体门牌号" }
        ]
      },
      areaList: [],
      arealoading: false
    };
  },
  methods: {
    // 打开抽屉
    openDrawer() {},
    // 关闭抽屉
    closeDrawer() {
      this.$refs.editForm.resetFields();
      (this.editForm = {
        id: null,
        user: null,
        userid: null,
        username: null,
        area: null,
        house: null,
        mobile: localStorage.getItem("mobile")
      }),
        this.$emit("doFunc");
    },

    // 搜索区域
    remoteMethod(query) {
      if (query !== "") {
        this.arealoading = true;
        fetchBuildingList({
          filter: {
            name: query
          },
          limit: 1000,
          page: 1
        })
          .then(res => {
            this.arealoading = false;
            this.areaList = res.data || [];
            this.areaList.push({
              id: "other",
              name: "其他"
            });
          })
          .catch(err => {
            this.arealoading = false;
            this.areaList = [
              {
                id: "other",
                name: "其他"
              }
            ];
          });
      } else {
        this.areaList = [
          {
            id: "other",
            name: "其他"
          }
        ];
      }
    },
    // 保存
    save() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.drawerLoading = true;
          let param = {
            ...this.editForm
          };
          delete param.user;
          saveAddress(param)
            .then(res => {
              if (res.success) {
                this.drawerLoading = false;
                this.$message({
                  showClose: true,
                  type: "success",
                  message: "保存成功！"
                });
                localStorage.setItem("mobile", this.editForm.mobile);
                this.drawer = false;
              } else {
                this.drawerLoading = false;
                this.$message({
                  showClose: true,
                  type: "error",
                  message:
                    "保存失败：" + res.data.message ||
                    res.data.errInf.shortBusInf
                });
              }
            })
            .catch(err => {
              this.drawerLoading = false;
              this.$message({
                showClose: true,
                type: "error",
                message: `保存失败:${err}`
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 12px;
}
.select-search {
  position: absolute;
  left: 280px;
  top: 14px;
  color: rgba(0, 0, 0, 0.35);
}
</style>