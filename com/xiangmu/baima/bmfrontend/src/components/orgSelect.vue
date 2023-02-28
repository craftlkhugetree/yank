<template>
  <el-select
    v-model="orgname"
    filterable
    remote
    placeholder="请输入或选择"
    size="small"
    :remote-method="remoteMethod"
    :loading="selectLoading"
    style="width: 150px"
    clearable
    value-key="id"
    @change="changeOrg"
  >
    <el-option v-for="item in groupList" :label="item.name" :value="item" :key="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      orgname: "",
      selectLoading: false,
      groupList: []
    };
  },
  methods: {
    // 选择学院
    changeOrg(value) {
      if (value) {
        this.orgname = value.name;
      } else {
        this.orgname = "";
      }
      this.$emit("doFunc",value);
    },
    //搜索学院名称
    remoteMethod(query) {
      this.selectLoading = true;
      if (query !== "") {
        this.common
          .getGroupList2(query)
          .then(res => {
            this.selectLoading = false;
            this.groupList = res.items;
          })
          .catch(err => {
            this.selectLoading = false;
            this.groupList = [];
          });
      } else {
        this.selectLoading = false;
        this.groupList = [];
      }
    }
  }
};
</script>

<style>
</style>