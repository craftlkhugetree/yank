<template>
  <div class="choose-role">
    <van-nav-bar ref="navBar" :border="false" left-text="首页" @click-left="$router.push('/')" />
    <div class="role-title">
      <h2>
        <img src="../../static/imgs/bm-role-logo.png" alt />
        基地科教资源管理
      </h2>
      <span>请选择功能模块：</span>
    </div>
    <div class="tab-bar">
      <div
        class="bd1"
        :class="{ active: item.path === $route.path }"
        v-for="item in tabmenu"
        :key="item.text"
        @click="toPath(item.path)"
      >
        <div class="icomoon" v-if="item.icon == 'zxbx'">
          <img :src="require('st@tic/imgs/zxbx.png')" />
          <span>{{ item.text }}</span>
        </div>
        <div v-else class="icomoon">
          <i :class="item.icon"></i>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { roleId } from '@/assets/js/options';
export default {
  data() {
    return {
      // 科教资源、灌溉用水、本科生实习、农服信息
      tabmenu: [
        { icon: 'icon-bmg-file', text: '农服信息', path: '' },
        { icon: 'icon-bmg-house', text: '科教资源', path: '' },
        { icon: 'icon-bmg-water', text: '灌溉用水', path: '' },
        { icon: 'icon-bmg-practice', text: '本科生实习', path: '' },
        { icon: 'zxbx', text: '在线报修', path: '/' },
      ],
    };
  },
  computed: {
    curRole() {
      return sessionStorage.getItem('curRole') || '';
    },
  },
  methods: {
    // 路由
    toPath(path) {
      this.$router.push(path);
    },
    // 初始化菜单
    initTabMenu() {
      if (this.curRole === '16000-5') {
        // 研究生
        this.tabmenu = [
          // { icon: 'icon-bmg-file', text: '农服信息', path: '/service-info-view' },
          { icon: 'icon-bmg-water', text: '灌溉用水', path: '/irrgate-apply' },
          { icon: 'zxbx', text: '在线报修', path: '/report' },
        ];
      } else if (this.curRole === '16000-7') {
        // 本科生
        this.tabmenu = [
          // { icon: 'icon-bmg-file', text: '农服信息', path: '/service-info-view' },
          // { icon: 'icon-bmg-water', text: '灌溉用水', path: '/irrgate-apply' },
          { icon: 'zxbx', text: '在线报修', path: '/report' },
        ];
      } else if (this.curRole === roleId.bm) {
        // 基地
        this.tabmenu[0].path = '/service-info';
        this.tabmenu[1].path = '/edures-bm';
        this.tabmenu[2].path = '/irrgate-manage';
        this.tabmenu[3].path = '/practice-audit-bm';
        this.tabmenu[4].path = '/repair';
      } else if (this.curRole === '16000-2') {
        // 单位领导
        // this.tabmenu[0].path = '/service-info-view';
        // this.tabmenu[1].path = '/edures-leader';
        // this.tabmenu[2].path = '/irrgate-apply';
        // this.tabmenu[3].path = '/practice-audit-leader';
        // this.tabmenu.pop()
        this.tabmenu = [
          { icon: 'icon-bmg-practice', text: '本科生实习', path: '/practice-audit-leader' },
          { icon: 'icon-bmg-house', text: '科教资源', path: '/edures-leader' },
        ];
      } else if (this.curRole === '16000-1') {
        // 教职工
        this.tabmenu[0].path = '/service-info-view';
        this.tabmenu[1].path = '/edures-staff';
        this.tabmenu[2].path = '/irrgate-apply';
        this.tabmenu[3].path = '/practice';
        this.tabmenu[4].path = '/report';
      } else if (this.curRole === '16000-4') {
        // 水电工
        this.tabmenu = [{ icon: 'icon-bmg-water', text: '灌溉用水', path: '/irrgate-worker' }];
      } else if (this.curRole === roleId.hq) {
        // 后勤
        this.tabmenu = [
          { icon: 'icon-bmg-practice', text: '本科生实习', path: '/practice-audit-bm' },
          { icon: 'zxbx', text: '在线报修', path: '/repair' },
        ];
      }
      // 如果是刚进入系统，则跳转到第一个菜单
      if (this.$route.path === '/tab') {
        this.$router.push(this.tabmenu[0].path);
      }
    },
  },
  created() {
    // 根据角色初始化菜单
    this.initTabMenu();
  },
};
</script>

<style lang="scss" scoped>
.choose-role {
  width: 100%;
  height: 100%;
  background: url('../../static/imgs/bm-role-bg.png') no-repeat;
  background-size: cover;
  .role-title {
    padding: 35px 0 70px 50px;
    h2 {
      font-size: 18px;
      color: #ffffff;
      line-height: 24px;
      margin-bottom: 10px;
      img {
        height: 20px;
        width: 24px;
        vertical-align: text-top;
      }
    }
    span {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

/deep/ .van-nav-bar__text {
  color: #00b09b;
}

.tab-bar {
  margin: 50px 0px;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  flex-direction: initial;
  .bd1 {
    box-shadow: 0px 5px 20px 0px rgba(1, 176, 155, 0.1);
    background-color: rgba(255, 255, 255, 1);
    border-radius: 8px;
    height: 61px;
    width: 137px;
    margin-bottom: 20px;
    text-align: center;
    vertical-align: middle;
    .icomoon {
      display: inline-block;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #20242f;
      line-height: 16px;
      height: 16px;
    }
    img {
      width: 56px;
      height: 56px;
      margin-bottom: -20px;
      margin-right: -5px;
    }
    i {
      font-size: 40px;
      margin-bottom: -24px;
    }
    &.active {
      color: #00b09b;
      i::before {
        color: #00b09b;
      }
    }
  }
}
</style>
