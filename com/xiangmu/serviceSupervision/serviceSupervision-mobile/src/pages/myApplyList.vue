<template>
  <div style="background:#f3f3f3;">
    <!-------------------------- 状态：待回复/已回复/评价 -------------------------->
    <div class="apply-box clearfix">
      <div
        class="apply-item"
        :class="{'active': applyStatus == item.id}"
        v-for="item in applyStatusList"
        :key="item.id"
        @click="changeStatus(item)"
      >
        <div class="badge">
          <img :src="applyStatus == item.id ? item.imageA : item.image" alt />
          <span>{{item.count}}</span>
        </div>
        <span>{{item.name}}</span>
      </div>
    </div>
    <!-------------------------- 列表 -------------------------->
    <van-list
      v-model="loading"
      :finished="finished"
      @load="getList(currentPage,limit)"
      :immediate-check="false"
      ref="list"
    >
      <list-item
        v-for="(item, index) in list"
        :key="item.id"
        :item="item"
        operType="view"
        isMy="1"
        :class="`animation-${index + 1}`"
      ></list-item>
      <div class="nodata animation-1" v-if="list.length === 0 && !loading">
        <img src="../../static/images/nodata.png" width="100%" alt />
        <p>没有找到相关记录</p>
      </div>
    </van-list>
  </div>
</template>

<script>
import moment from "moment";
import listItem from "../components/SimpleListItem";
export default {
  components: {
    listItem
  },
  data() {
    return {
      applyStatus: sessionStorage.getItem("myApplyStatus") || "1,2,3",
      applyStatusList: [
        {
          id: "1,2,3",
          name: "全部",
          image: "@/../static/images/status-quanbu.png",
          imageA: "@/../static/images/status-quanbu-active.png",
          count: 0
        },
        {
          id: "1",
          name: "待回复",
          image: "@/../static/images/status-daihuifu.png",
          imageA: "@/../static/images/status-daihuifu-active.png",
          count: 0
        },
        {
          id: "2",
          name: "已回复",
          image: "@/../static/images/status-yihuifu.png",
          imageA: "@/../static/images/status-yihuifu-active.png",
          count: 0
        },
        {
          id: "3",
          name: "评价",
          image: "@/../static/images/status-pingjia.png",
          imageA: "@/../static/images/status-pingjia-active.png",
          count: 0
        }
      ],
      list: [],
      currentPage: 1,
      limit: 10,
      loading: false,
      finished: false
    };
  },
  computed: {
    // 用户id
    applyerid() {
      return this.$store.state.userInfo.ID;
    }
  },
  watch: {
    applyerid() {
      this.getNums();
      this.getList(1, this.limit);
    }
  },
  methods: {
    // 切换状态
    changeStatus(item) {
      this.applyStatus = item.id;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      this.getList(1, this.limit);
    },

    // 获取列表数据
    getNums() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/applyNums",
          isRep: true,
          data: {
            applyerid: this.applyerid
          }
        })
        .then(res => {
          if (res.success) {
            this.applyStatusList.forEach(i => {
              let index = res.data.findIndex(j => j.applystatus == i.id);
              if (index >= 0) {
                i.count = res.data[index].num || 0;
              }
              if (i.id == "1,2,3") {
                let dataArr = res.data.map(j => j.num);
                i.count = dataArr.reduce((pre, cur) => pre + cur, 0);
              }
            });
          }
        })
        .catch(err => {});
    },

    // 获取列表数据
    getList(page, limit) {
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              applyerid: this.applyerid,
              applystatus: this.applyStatus
            },
            limit: limit,
            page: page
          }
        })
        .then(res => {
          this.$toast.clear();
          this.loading = false;
          let list = res.data || [];
          list.forEach(i => {
            i.markscore = parseInt(i.markscore);
          });
          this.list = page === 1 ? list : this.list.concat(list);
          this.finished = list.length < this.limit ? true : false;
          this.currentPage = page + 1;
          sessionStorage.setItem("myApplyStatus", this.applyStatus);
        })
        .catch(err => {
          this.$toast.clear();
          this.loading = false;
          this.finished = true;
        });
    }
  },
  mounted() {
    if (this.applyerid) {
      this.getNums();
      this.$refs.list.check();
    }
  }
};
</script>

<style lang="scss" scoped>
.apply-box {
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
}
.apply-item {
  float: left;
  width: 25%;
  padding: 20px 0 12px;
  text-align: center;
  .badge {
    display: inline-block;
    position: relative;
    span {
      position: absolute;
      top: -6px;
      right: -2px;
      height: 16px;
      padding: 1px 4px;
      border: 1px solid #cccccc;
      border-radius: 16px;
      min-width: 20px;
    }
  }
  img {
    width: 26px;
    height: 26px;
    vertical-align: middle;
    margin-right: 10px;
    margin-bottom: 2px;
  }
  span {
    font-size: 12px;
    color: #999999;
  }
  &.active {
    span {
      color: #666666;
    }
    .badge {
      span {
        color: #3a78fc;
        border-color: #3a78fc;
      }
    }
  }
}
.nodata {
  width: 100%;
  text-align: center;
  img {
    width: 80px;
    height: 80px;
    margin: 60px 0 12px;
  }
  p {
    font-size: 12px;
    color: #999999;
  }
}
</style>