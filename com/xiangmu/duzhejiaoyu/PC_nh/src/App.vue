<template>
  <div id="app" v-cloak>
    <router-view :key="$route.path" style="height: 100%" v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    provide(){
      return {
        reload:this.reload
      }
    },
    data:function () {
      return {
        isRouterAlive:true
      }
    },
    methods:{
      reload(){
        this.isRouterAlive = false;
        this.$nextTick(function () {
          this.isRouterAlive = true;
        })
      }
    }
  }
</script>

<style scoped>
  #app{
    height: 100%;
    width: 100%;
    position: fixed;
  }




</style>
