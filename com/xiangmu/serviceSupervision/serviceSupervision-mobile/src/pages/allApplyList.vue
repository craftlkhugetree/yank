<template>
  <div style="background:#f3f3f3;">
    <!-------------------------- 类型(多选) -------------------------->
    <!-- <div class="type-box clearfix">
      <div
        class="type-item"
        :class="{'active': types.length == serviceTypes.length}"
        @click="changeAll"
      >
        <span>全部</span>
      </div>
      <div
        class="type-item"
        :class="{'active': types.includes(item.type)}"
        v-for="item in serviceTypes"
        :key="item.id"
        @click="changeType(item)"
      >
        <span>{{item.name}}</span>
      </div>
    </div>-->
    <!-------------------------- 类型(单选) -------------------------->
    <div class="type-box clearfix">
      <div
        class="type-item"
        :class="{'active': type === item.type}"
        v-for="item in allServiceTypes"
        :key="item.id"
        @click="changeType(item)"
      >
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
      types: ["1,2,3,4,5"],
      type: "1,2,3,4,5",
      list: [],
      currentPage: 1,
      limit: 10,
      loading: false,
      finished: false
    };
  },
  computed: {
    // 服务类型
    serviceTypes() {
      return this.$store.state.serviceTypes;
    },
    allServiceTypes() {
      let types = _.cloneDeep(this.$store.state.serviceTypes);
      types.unshift({
        type: "1,2,3,4,5",
        name: "全部"
      });
      return types;
    }
  },
  methods: {
    // 多选
    // // 切换全部
    // changeAll() {
    //   this.types = this.types.length === this.serviceTypes.length ? [] : this.serviceTypes.map(i => i.type);
    //   this.$toast.loading({
    //     message: "加载中...",
    //     forbidClick: true
    //   });
    //   this.getList(1, this.limit);
    // },

    // // 切换类型
    // changeType(item) {
    //   let index = this.types.findIndex(i => i === item.type);
    //   if (index >= 0) {
    //     this.types.splice(index, 1);
    //   } else {
    //     this.types.push(item.type);
    //   }
    //   this.$toast.loading({
    //     message: "加载中...",
    //     forbidClick: true
    //   });
    //   this.getList(1, this.limit);
    // },

    // 单选
    changeType(item) {
      this.type = item.type;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true
      });
      this.getList(1, this.limit);
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
              applystatus: "2,3",
              types: this.type,
              isopen: 1
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
          sessionStorage.setItem("allApplyTypes", JSON.stringify(this.types));
        })
        .catch(err => {
          this.$toast.clear();
          this.loading = false;
          this.finished = true;
        });
    }
  },
  mounted() {
    let allApplyTypes = sessionStorage.getItem("allApplyTypes");
    if (allApplyTypes) {
      this.types = JSON.parse(allApplyTypes);
    }
    this.$refs.list.check();
  }
};
</script>

<style lang="scss" scoped>
.type-box {
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
}
.type-item {
  float: left;
  width: 16.5%;
  padding: 8px 0;
  text-align: center;
  span {
    display: inline-block;
    min-width: 50px;
    font-size: 12px;
    color: #666666;
    padding: 8px 0;
    background: #f6f6f6;
    border-radius: 5px;
  }
  &.active {
    span {
      background: url("../../static/images/select.png") no-repeat right bottom;
      background-size: 16px auto;
      background-color: #e7eefe;
      color: #3a78fc;
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