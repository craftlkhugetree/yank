<template>
  <div class="tabbar" id="tabbar">
    <div
      class="tabbar-item"
      :class="{ active: item.path === $route.path }"
      v-for="item in tabmenu"
      :key="item.text"
      @click="toPath(item.path)"
    >
      <div><i class="icomoon" :class="item.icon"></i></div>
      <div>{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 科教资源、灌溉用水、本科生实习、农服信息
      tabmenu: [
        { icon: 'icon-bm-file', text: '农服信息', path: '' },
        { icon: 'icon-bm-house', text: '科教资源', path: '' },
        { icon: 'icon-bm-water', text: '灌溉用水', path: '' },
        { icon: 'icon-bm-practice', text: '本科生实习', path: '' },
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
        this.tabmenu = [
          { icon: 'icon-bm-file', text: '农服信息', path: '/service-info-view' },
          { icon: 'icon-bm-water', text: '灌溉用水', path: '/irrgate-apply' },
        ];
      } else if (this.curRole === '16000-3') {
        // 基地
        this.tabmenu[0].path = '/service-info';
        this.tabmenu[1].path = '/edures-bm';
        this.tabmenu[2].path = '/irrgate-manage';
        this.tabmenu[3].path = '/practice-audit-bm';
      } else if (this.curRole === '16000-2') {
        // 单位领导
        this.tabmenu[0].path = '/service-info-view';
        this.tabmenu[1].path = '/edures-leader';
        this.tabmenu[2].path = '/irrgate-apply';
        this.tabmenu[3].path = '/practice-audit-leader';
      } else if (this.curRole === '16000-1') {
        // 教职工
        this.tabmenu[0].path = '/service-info-view';
        this.tabmenu[1].path = '/edures-staff';
        this.tabmenu[2].path = '/irrgate-apply';
        this.tabmenu[3].path = '/practice';
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
.tabbar {
  width: 100%;
  position: fixed;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #f8f8f8;
  z-index: 100;
  display: flex;
  .tabbar-item {
    font-size: 10px;
    list-style: none;
    padding: 12px 0;
    color: #b6bdc6;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    i {
      display: block;
      font-size: 22px;
      margin-bottom: 4px;
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
