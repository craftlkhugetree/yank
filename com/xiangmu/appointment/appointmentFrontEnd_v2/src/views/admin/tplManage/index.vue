<template>
  <div class="base-search-table bg-white">
    <div class="search-box clearfix">
      <h3>选择模板</h3>
    </div>
    <!---------------------------- 模板列表 ---------------------------->
    <div class="list-box clearfix" v-loading="loading">
      <div class="list-item" v-for="item in listData" :key="item.id" @click="chooseTemp(item)">
        <img class="list-item-bg" :src="item.img" alt />
        <img v-if="!item.isbuy" class="list-item-lock" src="@/assets/img/temp-lock.png" alt />
        <i class="el-icon-circle-plus"></i>
        <div class="list-item-info">
          <h3>{{item.name}}</h3>
          <span>{{item.note}}</span>
        </div>
      </div>
    </div>
    <!---------------------------- 创建应用弹窗 ---------------------------->
    <res-drawer ref="resDrawer" title="新增资源" @doFunc="$router.push('/appcenter/appManage');"></res-drawer>
  </div>
</template>

<script>
import ResDrawer from "./addResDrawer";
import { fetchTempList } from "@/api/admin/res";
export default {
  components: {
    ResDrawer
  },
  data() {
    return {
      loading: false,
      listData: []
    };
  },
  computed: {
    // 模板图片列表
    tplImages() {
      return this.$store.state.tplImages;
    }
  },
  methods: {
    // 选择模板
    chooseTemp(item) {
      if (item.isbuy) {
        this.openDrawer(item);
      } else {
        this.$confirm(
          "此模板暂未开放，联系管理员升至高级版本后方可选用。",
          "模板未开放",
          {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "warning"
          }
        );
      }
    },
    // 打开创建资源抽屉
    openDrawer(item) {
      this.$refs.resDrawer.drawer = true;
      this.$refs.resDrawer.editForm.templateid = item.id;
      this.$refs.resDrawer.temp = item;
    },
    // 获取数据
    getListData() {
      this.loading = true;
      fetchTempList()
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.listData = res.data || [];
            // 设置图片
            this.listData.forEach(i => {
              let index = this.tplImages.findIndex(j => j.id === i.id);
              if (index > -1) {
                i.img = this.tplImages[index].img;
              }
            });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getListData();
  }
};
</script>

<style lang="scss" scoped>
.list-box {
  width: 100%;
  height: 100%;
  padding: 15px 20px 20px;
  overflow: auto;
  .list-item {
    position: relative;
    float: left;
    width: 252px;
    height: 150px;
    box-shadow: 0px 5px 8px 4px rgba(0, 0, 0, 0.05),
      0px 3px 6px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
    border-radius: 2px;
    margin: 0 20px 20px 0;
    cursor: pointer;
    transition: all ease 0.4s;
    img.list-item-bg {
      width: 100%;
      height: 100%;
    }
    img.list-item-lock {
      position: absolute;
      right: 10px;
      top: 0;
      width: 28px;
      height: 36px;
    }
    i {
      position: absolute;
      left: 10px;
      top: 10px;
      color: #ffffff;
      font-size: 14px;
    }
    .list-item-info {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
      color: rgba(255, 255, 255, 0.85);
      h3 {
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        margin-bottom: 10px;
      }
      span {
        font-size: 14px;
        line-height: 20px;
      }
    }
    &:hover {
      transform: translateY(-4px);
    }
  }
}
</style>