<template>
  <el-tag>标签一</el-tag>
</template>

<script>
import { list } from '@/api/'
export default {
  name: 'IndexPage',
  created() {
        list().then((res) => {})

  },
}
</script>
