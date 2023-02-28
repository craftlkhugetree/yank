<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      @load="loadList"
      class="list"
    >
      <listItem
        class="listitem"
        v-for="(item, index) in results"
        :key="item.id"
        :info="item"
        @click.native="toDetail(item.id)"
        :showApplyer="false"
        :class="`animation-${index + 1}`"
      >
        <div slot="states">
          <div class="orderbtns clearfix">
            <!-- <span class="orderstate"> {{ item.statusname }} </span> -->
            <div class="btns">
              <!-- <span class="btn gray">评价</span> -->
              <span class="btn" @click.stop="toDetail(item.id)">查看更多</span>
            </div>
          </div>
        </div>
      </listItem>
      <emptyList
        class="emptylist animation-1"
        v-show="!results.length"
      ></emptyList>
    </van-list>
  </div>
</template>

<script>
import { setListInfo } from "@/assets/js/global";
import emptyList from "@/components/emptyList.vue";
import listItem from "@/components/listItem.vue";
export default {
  data() {
    return {
      results: [],
      page: 1,
      size: 10,
      loading: false,
      finished: false,
    };
  },

  components: { emptyList, listItem },

  methods: {
    loadList() {
      this.loading = true;
      this.util
        .postAjax({
          code: this.global.code,
          url: "/apply/pageQueryEncrypt",
          isRep: true,
          data: {
            filter: {},
            limit: this.size,
            page: this.page,
          },
        })
        .then((res) => {
          if (res.success) {
            this.loading = false;
            let results = _.map(res.data, (item) => {
              return setListInfo(item);
            });
            this.results =
              this.page === 1 ? results : this.results.concat(results);
            this.finished = results.length < this.size ? true : false;
            this.page++;
          }
        });
    },
    //查看详情
    toDetail(id) {
      this.$router.push({
        name: "userOrderView",
        params: { id: id },
      });
    },
  },
  created() {
    this.loadList();
  },
};
</script>
<style lang="scss" scoped></style>