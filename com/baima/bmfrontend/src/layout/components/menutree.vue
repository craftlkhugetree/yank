<template>
  <div class="menutree">
    <label v-for="(menu,index) in data" :key="index">
      <el-submenu :index="menu.DISPLAYURL ? menu.DISPLAYURL : menu.ID" v-if="menu.children">
        <template slot="title">
<!--          <i class="el-icon-location"></i>-->

          <i style="display: inline-block;margin-right: 8px" :class="menu.ICONCLS"></i>
          <span slot="title">{{menu.NAME}}</span>
        </template>
        <label>
          <menutree :data="menu.children"></menutree>
        </label>
      </el-submenu>
      <el-menu-item v-else :index="menu.DISPLAYURL ? menu.DISPLAYURL : menu.ID">
        <span slot="title">
<!--                <i class="el-icon-location"></i>-->

          <i style="display: inline-block;margin-right: 8px" :class="menu.ICONCLS"></i>
          <span slot="title">{{menu.NAME}}</span>
        </span>
      </el-menu-item>
    </label>
  </div>
</template>

<script>
  import menutree from "../components/menutree";
    export default {
      name: "menutree",
      components: {
        menutree: menutree
      },
      data(){
        return {
          menu_data: {}
        }

      },
      props: ["data","collapse"],
      created() {
        /*console.log("data",this.data);
        console.log("collapse",this.collapse);*/
      }
    }
</script>

<style scoped>

</style>
