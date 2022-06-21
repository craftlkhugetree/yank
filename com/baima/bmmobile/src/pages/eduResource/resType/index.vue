<template>
  <div style="background:#fff;">
    <!-- 列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="到底啦"
      @load="getList(currentPage)"
    >
      <div class="edu-card" v-for="item in list" :key="item.id">
        <div class="edu-card-title">
          <h2>{{item.name}}</h2>
          <img
            src="../../../../static/imgs/bm-ellipsis-btn.png"
            alt="操作"
            @click="item.showBtns = !item.showBtns"
          />
          <div class="title-btns" v-if="item.showBtns === true">
            <li>
              <van-button type="primary" size="small" @click="toManage(item)">资源管理</van-button>
            </li>
            <li>
              <van-button plain type="primary" size="small" @click="toEdit(item)">编辑</van-button>
            </li>
            <li>
              <van-button plain type="primary" size="small" @click="deleteRes(item)">删除</van-button>
            </li>
          </div>
        </div>
        <div class="edu-card-content">
          <div>
            <img src="../../../../static/imgs/bm-charge-cycle.png" alt />
            <span>计费周期：{{item.chargecycle}}</span>
          </div>
          <div>
            <img src="../../../../static/imgs/bm-charge-type.png" alt />
            <span>计费方式：{{item.chargetype}}</span>
          </div>
        </div>
      </div>
    </van-list>
    <!-- 新增类型 -->
    <div class="btns">
      <van-button icon="plus" round type="primary" @click="toAdd">新增类型</van-button>
    </div>
    <!-- 是否确定删除 -->
    <van-action-sheet
      v-model="showConfirmDelete"
      :actions="[{name: '确定删除', color: '#fe3e61'}]"
      @select="confirmDelete"
      cancel-text="取消"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      finished: false,
      currentPage: 1,
      limit: 10000,  // 列表无分页
      list: [],
      showConfirmDelete: false,
      deleteItem: {}
    };
  },
  methods: {
    // 新增
    toAdd() {
      this.$router.push("/edures-bm/add-type");
    },
    // 资源信息管理
    toManage(item) {
        this.$router.push("/edures-bm/res-info-manage/" + item.id);
    },
    // 编辑
    toEdit(item) {
      this.$router.push("/edures-bm/edit-type/" + item.id);
    },
    // 删除
    deleteRes(item) {
      this.showConfirmDelete = true;
      this.deleteItem = item;
    },
    // 确认删除
    confirmDelete() {
      this.$toast.loading({
        message: "删除中...",
        forbidClick: true,
        duration: 0
      });
      this.showConfirmDelete = false;
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/sprestype/deleteById",
          data: {
              id: this.deleteItem.id
          }
        })
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success("删除成功");
            this.getList(1);
          } else {
            this.$toast.fail("删除失败" + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail("删除失败" + '\n' + err);
        });
    },
    // 获取列表
    getList(page) {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/sprestype/list?date=" + new Date().getTime(),
          data: {
            params: JSON.stringify({
              page: page,
              limit: this.limit
            })
          }
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            let list = res.items || [];
            this.list = page === 1 ? list : this.list.concat(list);
            this.list.forEach(i => {
              i.chargecycle = this.common.chargecycleFormatter(i.chargecycle);
              i.chargetype = this.common.chargetypeFormatter(i.chargetype,"name");
              this.$set(i, "showBtns", false);
            });
            this.finished = list.length < this.limit ? true : false;
            this.currentPage = page + 1;
          } else {
            this.finished = true;
            this.$toast.fail("获取数据失败" + '\n' + res.message);
          }
        })
        .catch(err => {
          this.loading = false;
          this.finished = true;
          // this.$toast.fail("获取数据失败" + '\n' + err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/mixin.scss";
.van-list {
  padding: 20px 15px;
}
.edu-card {
  background: #f8f8f8;
  box-shadow: 0px 2px 5px 0px rgba(182, 189, 198, 0.22);
  border-radius: 5px;
  margin-bottom: 15px;
  .edu-card-title {
    background: url("../../../../static/imgs/bm-land-bg.png");
    background-size: cover;
    height: 52px;
    line-height: 52px;
    padding: 0 24px 0 20px;
    position: relative;
    color: #fff;
    @include clearfix;
    h2 {
      float: left;
      font-size: 16px;
      font-weight: 500;
    }

    img {
      float: right;
      width: 36px;
      height: 16px;
      margin-top: 16px;
    }

    .title-btns {
      position: absolute;
      top: 38px;
      right: 24px;
      width: 118px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px 0 rgba(182, 189, 198, 0.3);
      padding-top: 10px;
      z-index: 200;
      li {
        list-style: none;
        text-align: center;
        margin-bottom: 10px;
        line-height: 30px;
        .van-button {
          width: 94px;
          border-radius: 5px;
          font-size: 14px;
        }
      }
    }
  }
  .edu-card-content {
    padding: 15px 20px;
    div {
      margin-bottom: 5px;
      color: #8c8e95;
      font-size: 14px;
      img {
        width: 16px;
        height: 16px;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }
}
</style>