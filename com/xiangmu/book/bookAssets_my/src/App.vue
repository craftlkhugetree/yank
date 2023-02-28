<!--<script src="../../../SVN/commonjs/03code/commjs/src/main/webapp/vuecommon/util/projectSettings.js"></script>-->
<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    provide(){
      return {
        reload:this.reload,
      }
    },
    data(){
      return {
        isRouterAlive:true
      }
    },
    methods:{
      reload(){
        this.isRouterAlive =false;
        this.$nextTick(function () {
          this.isRouterAlive=true
        })
      }
    }
  }
</script>

<style scoped>
  #app{
    height: 100%;
  }
</style>
