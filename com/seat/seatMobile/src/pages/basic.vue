<template>
  <div>
    <router-view></router-view>
    <ul class="navs">
      <li v-for="(v,i) in mymenu" :key="i" @click="swtichIndex(v.id)" :class="{isactive : v.navs}">
        <div v-show="!v.navs">
          <img :src="'./static/img/'+v.img" alt />
          <span class="names">{{v.name}}</span>
        </div>
        <div v-show="v.navs">
          <img :src="'./static/img/'+v.actimg" alt />
          <span class="names actnames">{{v.name}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import code from "../util/code";
export default {
  data() {
    return {
      mymenu: [
        {
          name: "首页",
          id: "0",
          DISPLAYURL: "/index",
          img: "home.png",
          actimg: "homeact.png",
          navs: true
        },
        {
          name: "我的",
          id: "1",
          DISPLAYURL: "/person",
          img: "person.png",
          actimg: "personact.png",
          navs: false
        }
      ],
      fromwhere: ""
    };
  },
  methods: {
    swtichIndex(i) {
      this.mymenu.forEach(item => {
        item.navs = false;
        if (item.id == i) {
          item.navs = true;
        }
      });
      switch (i) {
        case "0":
          this.$router.push("/index");
          this.fromwhere = "/index";
          break;
        case "1":
          this.$router.push("/person");
          this.fromwhere = "/person";
          break;
      }
    }
  },
  created() {
    //判断当前路由地址
    this.mymenu.forEach(item => {
      item.navs = false;
      if (item.DISPLAYURL == this.$route.path) {
        item.navs = true;
      }
    });
  }
};
</script>

<style scoped>
.navs {
  width: 100%;
  height: 110px;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  z-index: 0;
  border-top: 1px solid rgba(196, 194, 194, 0.5);
}
.navs > li {
  box-sizing: border-box;
  padding-top: 16px;
  color: #999;
  font-size: 20px;
  text-align: center;
  position: relative;
  width: 50%;
}
.navs > li > div {
  position: absolute;
  width: 100%;
}
.navs > li > div > img {
  width: 44px;
  height: 39px;
}

.navs > li > div > span {
  display: block;
  font-size: 20px;
}
.navs > li > div > span.actnames {
  color: #ffa033;
}
</style>
