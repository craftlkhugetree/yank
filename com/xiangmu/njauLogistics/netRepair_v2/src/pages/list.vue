<template>
  <div class="main-list" v-loading="loading">
     <!-- <transition-group appear> -->
    <list-box 
      v-for="(item,index) in list"
      :key="item.id"
      :item="item"
      :operType="operType"
      :isDraft="isDraft"
      @doFunc="getList"
      :class="`animation-${index+1}`"
    ></list-box>
    <!-- </transition-group> -->
    <div class="no-data" v-if="total == 0">
      <img src="@/../static/images/nodata.png" alt />
      <span v-if="operType==='view'">没有找到报修记录</span>
      <div v-else>
        <p>没有找到报修记录</p>
        <p>在这里，创建你的报修单</p>
        <el-button class="orange-btn" size="small" @click="$router.push('/repair-apply')">我要报修</el-button>
      </div>
    </div>
    <!---------------------------- 分页 ---------------------------->
    <transition name="slide-fade">
    <div class="pagination-box" v-if="total > 0">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[5,10,15,20]"
        :current-page.sync="currentPage"
        @current-change="page => getList(page, pageSize)"
        @size-change="size =>{pageSize = size; getList(1, size)}"
      ></el-pagination>
    </div>
    </transition>
  </div>
</template>

<script>
import ListBox from "../components/ListBox";
export default {
  components: {
    ListBox
  },
  props: {
    operType: {
      type: String,
      default: "view" // view查看，edit编辑
    },
    isDraft: {
      type: Boolean, // 是否草稿
      default: false
    },
    params: Object // 查询参数
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      pageSize: 5,
      currentPage: 1
    };
  },
  watch: {
    isDraft() {
      this.getList();
    }
  },
  methods: {
    // 获取数据
    getList(page, pageSize) {
      this.total = 0;
      let url = this.isDraft ? "applydraft/pageQuery" : "apply/pageQuery";
      this.loading = true;
      this.currentPage = page;
      this.util
        .postAjax({
          code: this.global.code,
          url: url,
          isRep: true,
          data: {
            filter: {
              ...this.params
            },
            limit: pageSize || this.pageSize,
            page: page || 1
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.list = res.data || [];
            this.total = res.total || 0;
          } else {
            this.list = [];
            this.total = 0;
          }
        })
        .catch(err => {
          this.loading = false;
          this.list = [];
          this.total = 0;
        });
    }
  },
  created() {
    this.getList(this.currentPage, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
 .slide-fade-enter, .slide-fade-leave-to{
    transform: translateY(800px);
    opacity: 0;
  }
  .slide-fade-enter-active{
        transition: all 1.5s ease;
    }
  $grid-columns: 10; 
.list-box {
  background: #ffffff;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 15px 0px rgba(37, 38, 41, 0.06),
      0px 24px 20px -24px rgba(37, 38, 41, 0.16);
  }
}
@for $i from 1 through $grid-columns {
    $time: ($i * 100+200) + ms;
    .animation-#{$i} {
      transition: all 1s ease-out;
      animation-name: toTop; // toBottom
      animation-duration: 1s; // 注释掉 会没有动画 就是帕帕一帧一帧的出来
      animation-fill-mode: both;
      animation-delay: $time;
    }
  }
// 方向 下-->上
@keyframes toTop {
  0% {
    opacity: 0;
    transform: translateY(200px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
.no-data {
  width: 100%;
  padding: 30px 0;
  border-radius: 5px;
  border: 1px dashed #dbdbdb;
  text-align: center;
  color: #999;
  font-size: 14px;
  img {
    width: 100px;
    height: 100px;
    vertical-align: middle;
    margin-right: 20px;
  }
  & > div {
    display: inline-block;
    text-align: left;
    vertical-align: top;
    p {
      line-height: 20px;
      margin-bottom: 10px;
    }
    .el-button {
      width: 88px;
    }
  }
}
.pagination-box {
  margin-top: -20px;
}
</style>