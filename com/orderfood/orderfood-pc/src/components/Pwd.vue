<template>
  <div class="pwd">
    <input
      ref="input"
      type="password"
      :class="{'is-error': isError}"
      v-for="(item,index) in numList"
      :key="item.id"
      v-model="item.value"
      @input="onInput($event, index)"
      @focus="onFocus($event, index)"
      @keyup.delete="onDelete($event, index)"
    />
  </div>
</template>

<script>
import JsEncrypt from "@/assets/js/jsencrypt.min.js";
export default {
  props: {
    // 密码个数
    nums: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      numList: [],
      isError: false
    };
  },
  computed: {
    // 密码
    pwd() {
      if (this.numList.every(i => i.value)) {
        let data = this.numList.map(i => i.value).join("");
        // 加密密码
        const publicKey = window.g.publicKey;
        const jse = new JsEncrypt();
        jse.setPublicKey(publicKey);
        return jse.encrypt(data);
      } else {
        return null;
      }
    }
  },
  methods: {
    // 设置密码列表
    setNumList() {
      for (let i = 0; i < this.nums; i++) {
        this.numList.push({
          id: i,
          value: null
        });
      }
      this.$nextTick(() => {
        this.$refs.input[0].focus();
      });
    },
    // 输入
    onInput(e, index) {
      if (index < this.numList.length - 1) {
        this.$refs.input[index + 1].focus();
      } else {
        this.$refs.input[index].blur();
        this.validate();
      }
    },
    // 获取焦点
    onFocus(e, index) {
      this.numList[index].value = null;
    },
    // 删除
    onDelete(e, index) {
      this.numList[index].value = null;
      if (index > 0) {
        this.$refs.input[index - 1].focus();
      }
    },
    // 校验
    validate() {
      if (this.numList.every(i => i.value)) {
        this.isError = false;
      } else {
        this.isError = true;
      }
    }
  },
  created() {
    this.setNumList();
  }
};
</script>

<style lang="scss" scoped>
.pwd {
  input {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    text-align: center;
    margin-left: -1px;
    font-size: 18px;
    &:focus-visible {
      outline-color: rgba(0, 0, 0, 0.2);
    }
    &.is-error {
      outline: 1px solid #f56c6c;
    }
  }
}
</style>