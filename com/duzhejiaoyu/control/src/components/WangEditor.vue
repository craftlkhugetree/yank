<template>
    <div id="editor" class="unique"></div>
</template>

<script>
import wangEditor from "wangeditor";
export default {
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.editor = new wangEditor("#editor");
    // 配置菜单
    this.editor.config.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      // 'fontName', // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "indent", // 缩进
      "lineHeight", // 行高
      "link", // 插入链接
      "justify", // 对齐方式
      "image", // 插入图片
      "table", // 表格
      "splitLine", //分割线
      "quote", // 引用
      "emoticon", // 表情
      "undo", // 撤销
      "redo", // 重复
    ];
    // 配置上传图片
    this.editor.config.uploadImgShowBase64 = true;
    this.editor.config.showLinkImg = false;

    // 配置触发 onchange 的时间频率，默认为 200ms
    this.editor.config.onchangeTimeout = 500; // 修改为 500ms
    // 回调函数
    this.editor.config.onchange = (newHtml) => {
      this.$emit("change", newHtml);
    };
    this.editor.create();
  },
  beforeDestroy() {
    this.editor = null;
  },
};
</script>

<style lang="scss">
.w-e-toolbar .w-e-menu {
  width: 34px;
  height: 34px;
}
.w-e-toolbar {
  z-index: 200 !important;
}
.w-e-text-container {
  z-index: 100 !important;
}
.unique {
  i {
    font-style: italic !important;
  }
}
</style>
