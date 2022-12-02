<template>
  <div>
    <el-popover
      popper-class="popover-dialog"
      placement="bottom-start"
      width="370"
      :visible-arrow="false"
      v-model="visible"
    >
      <div class="field-list">
        <i class="el-icon-close" @click="visible=false"></i>
        <div class="field-list-box" v-for="(item, index) in fieldList" :key="index">
          <h3>{{item.title}}</h3>
          <p>
            <el-button
              v-for="(btn, index) in item.items"
              :key="index"
              class="white-btn"
              type="info"
              plain
              size="small"
              @click="addFiled(btn)"
            >{{btn.name}}</el-button>
          </p>
        </div>
      </div>
      <el-button
        slot="reference"
        class="white-btn"
        type="primary"
        plain
        size="small"
        icon="el-icon-plus"
      >添加表单</el-button>
    </el-popover>
    <div class="field-content">
      <div class="field-content-item" v-for="(item,index) in list" :key="index">
        <span v-if="['phone','email'].includes(item.fieldtype)">{{item.name}}</span>
        <el-input
          v-else
          style="width: 100px;"
          size="small"
          v-model="item.name"
          :placeholder="item.name"
        ></el-input>
        <el-checkbox :checked="item.isneed == '1'" @change="val => changeCheck(val,item)">必填</el-checkbox>
        <el-input
          style="width: 300px;"
          size="small"
          v-model="item.placeholder"
          placeholder="输入提示内容"
        ></el-input>
        <i class="el-icon-remove" @click="deleteField(index)"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    resDetail: Object
  },
  data() {
    return {
      visible: false,
      fieldList: [
        {
          title: "常用项",
          items: [
            { type: "phone", name: "联系方式" },
            { type: "email", name: "邮箱" }
          ]
        },
        {
          title: "自定义项",
          items: [
            { type: "input", name: "文本框" },
            { type: "upload", name: "附件" }
          ]
        }
      ],
      list: []
    };
  },
  watch: {
    resDetail() {
      this.list = this.resDetail.fields;
    }
  },
  methods: {
    // 添加表单
    addFiled(btn) {
      this.list.push({
        fieldtype: btn.type,
        isneed: "0",
        name: btn.name,
        placeholder: null
      });
      this.visible = false;
    },
    // 必填
    changeCheck(val, item) {
      item.isneed = val == true ? "1" : "0";
    },
    // 删除field
    deleteField(index) {
      this.list.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.field-list {
  position: relative;
  padding: 18px;
  i {
    position: absolute;
    right: 22px;
    top: 22px;
    cursor: pointer;
  }
  h3 {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    margin-bottom: 20px;
  }
  .el-button {
    width: 150px;
    &:not(:last-child) {
      margin-right: 20px;
    }
  }
  .field-list-box:not(:last-child) {
    margin-bottom: 30px;
  }
}
.field-content {
  padding: 20px 10px;
  .field-content-item {
    margin-bottom: 12px;
  }
  span {
    display: inline-block;
    width: 100px;
    margin-bottom: 4px;
  }
  .el-checkbox {
    margin: 0 20px 4px;
  }
  .el-input {
    margin-bottom: 4px;
  }
  i {
    margin-left: 10px;
    color: #e24234;
    font-size: 18px;
    cursor: pointer;
  }
}
</style>