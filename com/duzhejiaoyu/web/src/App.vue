<template>
  <div id="app">
    <transition name="el-fade-in-linear" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: mapState({
    userInfo: state => state.userInfo,
    newbornLogin: state => state.newbornLogin,
    campusList: state => state.campusList
  }),
  created() {
    if (!this.userInfo.id) {
      this.$store.dispatch('getUserInfo')
    }
    // 获取是否新生登录
    if (!this.newbornLogin.code) {
      this.$store.dispatch('getConfig')
    }
    // 获取校区
    if (this.campusList.length == 0) {
      this.$store.dispatch('getCampusList')
    }
  }
}
</script>


<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
