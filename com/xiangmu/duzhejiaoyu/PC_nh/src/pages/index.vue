<template>
    <div>
        <topheader></topheader>
        <router-view style="height: calc(100% - 154px);width: 100%;background:rgba(248,248,248,1);padding-top: 20px;overflow:auto"></router-view>
        <bottomfooter></bottomfooter>
    </div>
</template>
<script>
import topheader from '../common/header'
import bottomfooter from '../common/footer'
export default {
    components:{
        topheader,bottomfooter
    },
}
</script>
<style scoped>

</style>