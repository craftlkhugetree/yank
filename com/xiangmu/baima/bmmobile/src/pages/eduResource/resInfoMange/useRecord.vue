<template>
  <div>
    <van-nav-bar ref="navBar" title="入驻信息" :border="false" left-arrow @click-left="goBack" />
    <div class="res-detail">
      <div class="res-detail-content">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="到底啦"
          @load="getUseList(currentPage)"
        >
          <div class="res-detail-box" v-for="item in list" :key="item.id">
            <div class="res-use-icon" v-if="!item.endtime">
              <van-icon name="checked" color="#fff"></van-icon>
              已入驻
            </div>
            <h2>{{ item.orgname }}</h2>
            <div class="res-detail-box-rows">
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">课题组</p>
                  <p>{{ item.classname }}</p>
                </van-col>
                <van-col span="14">
                  <p class="label">项目名称</p>
                  <p class="ellipsis">{{ item.projectname }}</p>
                </van-col>
              </van-row>
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">申请人</p>
                  <p>
                    <img src="../../../../static/imgs/bm-res-man.png" alt />
                    {{ item.applyername }}
                  </p>
                </van-col>
                <van-col span="14">
                  <p class="label">联系电话</p>
                  <p>
                    <img src="../../../../static/imgs/bm-res-phone.png" alt />
                    {{ item.applyermobile }}
                  </p>
                </van-col>
              </van-row>
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">课题组负责人</p>
                  <p>
                    <img src="../../../../static/imgs/bm-res-man.png" alt />
                    {{ item.classleadername }}
                  </p>
                </van-col>
                <van-col span="14">
                  <p class="label">负责人联系电话</p>
                  <p>
                    <img src="../../../../static/imgs/bm-res-phone.png" alt />
                    {{ item.classleadermobile }}
                  </p>
                </van-col>
              </van-row>
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">项目来源</p>
                  <p>{{ item.projectfrom }}</p>
                </van-col>
                <van-col span="14">
                  <p class="label">项目经费(万元)</p>
                  <p class="ellipsis">{{ item.projectprice }}</p>
                </van-col>
              </van-row>
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">项目概况</p>
                  <p>{{ item.projectnote }}</p>
                </van-col>
                <van-col span="14">
                  <p class="label">实验概况</p>
                  <p>{{ item.situation }}</p>
                </van-col>
              </van-row>
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">入驻时间</p>
                  <p>{{ common.formatTime(item.applytime, 'YYYY.MM.DD hh:mm') }}</p>
                </van-col>
                <van-col span="14">
                  <p class="label">退租时间</p>
                  <p>
                    {{
                      item.endtime
                        ? common.formatTime(item.endtime, 'YYYY.MM.DD hh:mm')
                        : common.formatTime(item.applyendtime, 'YYYY.MM.DD hh:mm')
                    }}
                  </p>
                </van-col>
              </van-row>
            </div>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      finished: false,
      currentPage: 1,
      list: [],
      limit: 10,
    };
  },
  props: {
    id: String,
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 获取入驻记录
    getUseList(page) {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/spresliveinfo/pageList?date=' + new Date().getTime(),
          data: {
            params: JSON.stringify({
              page: page,
              limit: this.limit,
              resid: this.id,
            }),
          },
        })
        .then(res => {
          if (res.success) {
            let list = res.items || [];
            this.list = page === 1 ? list : this.list.concat(list);
            this.finished = list.length < this.limit ? true : false;
            this.currentPage = page + 1;
          } else {
            this.finished = true;
            this.$toast.fail('获取数据失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.finished = true;
          // this.$toast.fail("获取数据失败" + '\n' + err);
        });
    },
  },
  created() {
    this.getUseList(1);
  },
};
</script>

<style lang="scss" scoped>
.res-detail-box {
  margin-bottom: 10px;
}
</style>
