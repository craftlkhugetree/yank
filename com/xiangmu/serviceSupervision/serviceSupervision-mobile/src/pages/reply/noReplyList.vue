<template>
  <div style="background:#f3f3f3;">
    <!-------------------------- 列表 -------------------------->
    <van-list ref="list" v-model="loading" :finished="finished" @load="getList(currentPage,limit)">
      <list-item
        v-for="(item, index) in list"
        :key="item.id"
        :data-index="index"
        :item="item"
        operType="edit"
        :class="`animation-${index + 1}`"
      ></list-item>
      <div class="nodata animation-1" v-if="list.length === 0 && !loading">
        <img src="../../../static/images/nodata.png" width="100%" alt />
        <p>没有找到相关记录</p>
      </div>
    </van-list>
  </div>
</template>

<script>
import moment from "moment";
import listItem from "../../components/ListItem";
export default {
  components: {
    listItem
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      limit: 10,
      loading: false,
      finished: false
    };
  },
  computed: {
    // 是否后勤管理员
    isAdmin() {
      let userRoleIds = this.$store.state.userRoles.map(i => i.ID);
      return userRoleIds.includes("9100003-1");
    },
    // 管理部门
    deptIds() {
      let userOrgIds = this.$store.state.userDepts.map(i => i.ID) || [];
      return userOrgIds.join(",");
    }
  },
  watch: {
    isAdmin() {
      this.getList(1, this.limit);
    },
    deptIds() {
      this.getList(1, this.limit);
    }
  },
  methods: {
    // 获取列表数据
    getList(page, limit) {
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              applystatus: "1",
              // handledeptids: this.isAdmin ? null : this.deptIds
              handledeptids: this.deptIds
            },
            orderBy: "createtime",
            sort: "desc",
            limit: limit,
            page: page
          }
        })
        .then(res => {
          this.loading = false;
          let list = res.data || [];
          list.forEach(i => {
            i.markscore = parseInt(i.markscore);
          });
          this.list = page === 1 ? list : this.list.concat(list);
          this.finished = list.length < this.limit ? true : false;
          this.currentPage = page + 1;
        })
        .catch(err => {
          this.loading = false;
          this.finished = true;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
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