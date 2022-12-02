<template>
  <div id="editor"></div>
</template>

<script>
import wangEditor from "wangeditor";
export default {
  data() {
    return {
        editor: null
    };
  },
  mounted() {
    this.editor = new wangEditor("#editor");
    // 配置菜单
    this.editor.config.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'link', // 插入链接
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      // 'image', // 插入图片
      'table', // 表格
      'justify', //对齐
      'splitLine', //分割线
      'undo', // 撤销
      'redo' // 重复
    ];
    // 配置上传图片
    // this.editor.config.uploadImgShowBase64 = true; 
    this.editor.create();
  }
};
</script>

<style lang="scss" scoped>
</style>