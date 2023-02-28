<template>
  <div class="main-list" v-loading="loading">
    <!------------------------ 不可以勾选的 ------------------------>
    <div v-if="!canSelect">
      <list-box-simple
        :class="{ active: curItem.id === item.id }"
        v-for="item in list"
        :key="item.id"
        :item="item"
        operType="view"
        :canDown="canDown"
        @click.native="chooseCurItem(item)"
      ></list-box-simple>
    </div>
    <!------------------------ 可以勾选的 ------------------------>
    <div v-else>
      <list-box-simple-select
        :class="{ active: curItem.id === item.id }"
        v-for="item in curList"
        :key="item.id"
        :item="item"
        operType="view"
        :canDown="canDown"
        @chCheck="checkList"
        @click.native="chooseCurItem(item)"
      ></list-box-simple-select>
    </div>
    <div class="no-data" v-if="total == 0">
      <img src="@/../static/images/nodata.png" alt />
      <span>没有找到记录</span>
    </div>
    <!---------------------------- 分页 ---------------------------->
    <div class="pagination-box" v-if="total > 0 && !canSelect">
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[5, 10, 15, 20, 50, 100]"
        :current-page.sync="currentPage"
        @current-change="page => getList(page, pageSize)"
        @size-change="
          size => getList(1, size)
        "
      ></el-pagination>
    </div>
    <!---------------------------- 前端分页 ---------------------------->
    <div class="pagination-box pagecheck" v-if="total > 0 && canSelect">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        class="echeck"
        >全选</el-checkbox
      >
      <el-pagination
        background
        layout="sizes, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[5, 10, 15, 20, 50, 100]"
        :current-page.sync="currentPage"
        @current-change="page => changePage(page, pageSize)"
        @size-change="size => changePage(1, size)"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import ListBoxSimple from "../../components/ListBoxSimple";
import ListBoxSimpleSelect from "../../components/ListBoxSimpleSelect";
export default {
  name: "HandleList",
  components: {
    ListBoxSimple,
    ListBoxSimpleSelect
  },
  props: {
    params: Object, // 查询参数
    canDown: {
      // 是否可以下载报修单
      type: Boolean,
      default: false
    },
    canSelect: {
      // 是否可以选择
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      loading: false,
      curItem: "",
      list: [],
      curList: [],
      total: 0,
      pageSize: 5,
      currentPage: 1
    };
  },
  watch: {
    params() {
      this.getList(1, this.pageSize);
    }
  },
  methods: {
    checkList() {
      let num = 0;
      this.curList.forEach(c => {
        if (c.checked) {
          num++;
        }
      });
      if (num === 0) {
        this.checkAll = false;
        this.isIndeterminate = false;
      } else if (num === this.curList.length) {
        this.checkAll = true;
        this.isIndeterminate = false;
      } else {
        this.checkAll = false;
        this.isIndeterminate = true;
      }
    },
    handleCheckAllChange(val) {
      console.log(val, this.isIndeterminate);
      this.isIndeterminate = false;
      this.curList.forEach(i => {
        this.$set(i, "checked", val);
      });
    },
    // 点击
    chooseCurItem(item) {
      this.curItem = item;
      this.$store.commit("setCurItem", this.curItem);
    },
    // 获取数据
    getList(page, pageSize) {
      if(!(this.params.repairdeptid && this.params.repairleaderid) && this.$route.path.indexOf('dispatch') > -1) return
      this.loading = true;
      this.currentPage = page;
      this.pageSize = pageSize;
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              ...this.params
            },
            limit: pageSize || this.pageSize,
            page: page || 1,
            orderBy: this.params.activeTab == 1 ? 'createtime' : '',
            sort: this.params.activeTab == 1 ? 'asc' : ''
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success) {
            this.list = res.data || [];
            if (this.canSelect) {
              this.list.forEach(i => {
                this.$set(i, "checked", false);
              });
              this.curList = this.list
              // this.changePage(page || 1, pageSize || this.pageSize);
            }
            this.curItem = this.list[0] || {};
            this.total = res.total || 0;
            this.$emit("getTotal", this.total);
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
    },
    // 前端分页
    changePage(page, pageSize) {
      this.checkAll = false;
      this.isIndeterminate = false;
      //   if (this.canSelect) {
      // this.list.forEach(i => {
      //   this.$set(i, "checked", false);
      // });
      //   }
      // this.curList = this.list.slice((page - 1) * pageSize, page * pageSize);
      this.getList(page, pageSize)
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
.pagecheck {
  display: flex;
  align-items: center;
  .echeck {
    padding: 10px 30px;
    display: inline-block;
    margin-right: auto;
  }
}
</style>