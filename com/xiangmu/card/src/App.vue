<template>
  <div id="app">
    <img class="logo noPrint" src="@/assets/img/logo.png" alt />
    <div class="content">
      <transition name="el-fade-in-linear" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  background: url('~@/assets/img/bg.png');
  background-color: rgba(240, 242, 245, 0.7);
  padding-top: 120px;
  overflow: hidden;
}
.logo {
  display: block;
  margin: 0 auto 52px;
}
@media print {
	.noPrint{display:none;}
	#app {
		padding-top: 0px;
	}
}
.content {
  width: 900px;
  height: 643px;
  margin: 0 auto;
  background: #ffffff;
  box-shadow: 0px 0px 8px 6px rgba(88, 106, 221, 0.05);
  border-radius: 20px;
  opacity: 0.9;
  overflow: hidden;
}
</style>
