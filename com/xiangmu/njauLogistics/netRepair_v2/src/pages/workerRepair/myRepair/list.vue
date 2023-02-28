<template>
  <div class="main-list" v-loading="loading">
    <list-box
      :class="{'active': curItem.id === item.id}"
      v-for="item in list"
      :key="item.id"
      :item="item"
      :activeTab="activeTab"
      @click.native="chooseCurItem(item)"
    ></list-box>
    <div class="no-data" v-if="total == 0">
      <img src="@/../static/images/nodata.png" alt />
      <span>没有找到记录</span>
    </div>
    <!---------------------------- 分页 ---------------------------->
    <div class="pagination-box" v-if="total > 0">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[5,10,15,20]"
        :current-page.sync="currentPage"
        @current-change="page => getList(page, pageSize)"
        @size-change="size => {pageSize = size; getList(1, size)}"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import ListBox from "./listBox";
export default {
  components: {
    ListBox
  },
  props: {
    activeTab: String,   // 1-待维修  2-已维修
    params: Object // 查询参数
  },
  data() {
    return {
      loading: false,
      curItem: "",
      list: [],
      total: 0,
      pageSize: 5,
      currentPage: 1
    };
  },
  watch: {
    params() {
      this.getList();
    }
  },
  methods: {
    // 点击
    chooseCurItem(item) {
      this.curItem = item;
      this.$store.commit("setCurItem", this.curItem);
    },
    // 获取数据
    getList(page, pageSize) {
      this.loading = true;
      this.currentPage = page;
      this.util
        .postAjax({
          code: this.global.code,
          url: "repair/pageQuery",
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
            this.list.forEach(item => {
              if (item.relationApplys.length > 0) {
                for (let i = 0; i < item.relationApplys.length; i++) {
                  if (item.relationApplys[i].title === item.title) {
                    item.note = item.relationApplys[i].note;
                    item.photos = item.relationApplys[i].photos;
                    break;
                  }
                }
              }
            });
            this.curItem = this.list[0] || {};
            this.total = res.total || 0;
          } else {
            this.list = [];
            this.curItem = {};
            this.total = 0;
          }
          this.$store.commit("setCurItem", this.curItem);
        })
        .catch(err => {
          this.loading = false;
          this.list = [];
          this.curItem = {};
          this.total = 0;
          this.$store.commit("setCurItem", this.curItem);
        });
    }
  },
  created() {
    this.getList(this.currentPage, this.pageSize);
  }
};
</script>

<style lang="scss" scoped>
.list-box {
  background: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  &:hover,
  &.active {
    box-shadow: 0px 0px 15px 0px rgba(37, 38, 41, 0.1),
      0px 24px 20px -24px rgba(37, 38, 41, 0.18);
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