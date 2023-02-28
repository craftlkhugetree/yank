<template>
  <div>
    <van-nav-bar title="网上报修" fixed/>
    <div style="width:100%;height:46px;"></div>
    <div class="orderlists">
      <div class="tabs clearfix">
        <div class="tabitem active">
          <p class="tablabel">报修录单</p>
          <div class="activelabel"></div>
        </div>
        <div class="searchbtn" @click="$router.push('/reportedSearch')">
          <i class="iconfont iconchaxun"></i>
          查询
        </div>
        <div class="addbtn" @click="$router.push('/addOrder')">
          <i class="iconfont icondingdan"></i>
          报修录单
        </div>
      </div>
      <div class="lists">
        <div class="status1list">
          <van-list
            v-model="loading"
            :finished="finish"
            @load="loadList"
            class="list"
          >
            <listItem
              class="listitem"
              v-for="(item,index) in results"
              :key="item.id"
              :info="item"
              @click.native="toHandle(item.id)"
              :class="`animation-${index + 1}`"
            >
              <div slot="states">
                <div class="orderbtns clearfix">
                  <!-- <span class="orderstate"> {{ item.statusname }} </span> -->
                  <div class="btns">
                    <span class="btn" @click.stop="toHandle(item.id)">查看更多</span>
                  </div>
                </div>
              </div>
            </listItem>
            <emptyList class="emptylist animation-1" v-show="!results.length"></emptyList>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emptyList from "@/components/emptyList.vue";
import listItem from "@/components/listItem.vue";
import { setListInfo } from "@/assets/js/global";
export default {
  data() {
    return {
      results: [],
      page: 1,
      size: 10,
      loading: false,
      finish: false,
    };
  },

  components: { emptyList, listItem },

  methods: {
    //加载列表
    loadList() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/pageQuery",
          isRep: true,
          data: {
            filter: {
              applyerid: this.$store.state.userInfo.userId,
              applytype: "1",
            },
            limit: this.size,
            page: this.page,
          },
        })
        .then((res) => {
          this.loading = false;
          let results = _.map(res.data, (item) => {
            return setListInfo(item);
          });
          this.results =
            this.page1 === 1 ? results : this.results.concat(results);
          this.finish = results.length < this.size ? true : false;
          if (!this.finish) {
            this.page++;
          }
        });
    },
    toHandle(id) {
      this.$router.push({
        name: "handleOrder",
        params: { id: id },
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.repirnums {
  height: 128px;
  background-color: #fff;
}
.num1,
.num2 {
  float: left;
  margin-top: 14px;
  .label {
    font-size: 12px;
    font-weight: 400;
    color: #aaaaaa;
  }
  .value {
    font-size: 16px;
    font-weight: 400;
    color: #464032;
    line-height: 24px;
  }
}
.num1 {
  margin-left: 24px;
}
.num2 {
  margin-left: 30px;
}
.startorderbtn {
  width: 190px;
  margin-top: 8px;
  margin-left: 18px;
  height: 40px;
  background: #fd7d18;
  box-shadow: 0px 7px 4px 0px rgba(255, 112, 0, 0.12),
    0px 14px 4px -10px rgba(255, 112, 0, 0.24);
  border-radius: 20px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
}
.orderlists {
  padding: 0 12px;
  padding-bottom: 12px;
  margin-top: 16px;
  background-color: rgba(246, 246, 246, 1);
}
.searchbtn {
  width: 75px;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 30px;
  float: right;
  padding: 0px 13px;
  margin-top: -7px;
  font-size: 12px;
  font-weight: 400;
  color: #666666;
}
.addbtn {
  //   width: 70px;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 30px;
  float: right;
  padding: 0px 13px;
  margin-top: -7px;
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  margin-right: 8px;
}
.lists {
  margin-top: 12px;
}
</style>