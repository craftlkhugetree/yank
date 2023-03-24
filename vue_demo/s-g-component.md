1. g-dialog
center是否对头部和底部采用居中布局; 
内部： <template #footer v-if="$slots && $slots.footer">
      <slot name="footer" />
    </template>
外部可传入footer也可以不传入：
<template #footer>
        <div class="footer div_flex">
          <div></div>
          <el-button type="default" @click="handleClose" size="small"
            >取 消</el-button
          >
          <el-button type="primary" @click="handleOK" size="small"
            >确 定</el-button
          >
        </div>
</template>