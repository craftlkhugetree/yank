<template>
  <el-container class="main-wapper">
    <el-aside width="200px">
      <el-menu
        text-color="#474D51"
        active-text-color="#f56323"
        active-background-color="#fff"
        @select="selectMenu"
        v-loading="loading"
        :default-active="activeIndex"
      >
        <template v-for="item in menuData">
          <el-menu-item :key="item.name" :index="item.path" style="padding-left:30px;">
            <span slot="title">
              <span slot="title">{{item.name}}</span>
            </span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-main>
      <transition name="el-fade-in-linear" mode="out-in">
        <component :is="activeMenu"></component>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import { getUserMenu } from "@/api/admin/user";
import appoint from "./appoint"; // 我的预约
import message from "./message"; // 消息通知
export default {
  data() {
    return {
      loading: false,
      menuData: [
        {
          name: "我的预约",
          path: "appoint"
        },
        {
          name: "通知消息",
          path: "message"
        }
      ],
      activeMenu: "appoint",
      activeIndex: "appoint"
    };
  },

  components: {
    appoint,
    message
  },
  mounted() {
    if (Object.keys(this.$route.params).length) {
      this.activeMenu = this.$route.params.type;
      this.activeIndex = this.$route.params.type;
    }
  },

  methods: {
    selectMenu(path) {
      this.activeMenu = path;
    }
  }
};
</script>

<style lang="scss" scoped>
.main-wapper {
  margin-left: 200px;
  margin-top: 120px;
  .el-main {
    overflow-x: hidden;
    width: 100%;
  }
}
.el-menu {
  margin-top: 20px;
  border: 1px solid #f2f2f2;
  text-align: center;

  .el-menu-item {
    height: 60px;
    line-height: 60px;
    &.is-active {
      background: #fff;
      span {
        font-weight: 600;
        &::before {
          content: "";
          display: inline-block;
          width: 5px;
          height: 30px;
          background: #f56323;
          position: absolute;
          top: 10px;
          left: 0px;
        }
      }
    }
    &:hover {
      background: #fff;
    }
    &:first-child {
      border: 1px solid #f2f2f2;
    }
  }
}
</style>