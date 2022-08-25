<template>
  <div style="margin-bottom:44px;">
    <van-nav-bar
      ref="navBar"
      title="入驻信息"
      :border="false"
      left-arrow
      @click-left="goBack"
      right-text="功能首页"
      @click-right="$router.push('/fun-module')"
    />
    <div class="res-detail">
      <div class="res-detail-content">
        <div
          class="res-detail-box gap"
          v-for="item in liveList"
          :key="item.id"
          :style="item.status == 1 ? { background: 'rgba(254, 237, 205, 0.3)' } : ''"
        >
          <div class="flex-div">
            <h2>{{ item.apply.orgName }}</h2>
            <div class="res-use-icon" v-if="item.status == 1">
              <van-icon name="checked" color="#fff"></van-icon>
              已入驻
            </div>
            <div class="res-use-icon-grey outter-tips" v-else>
              <div class="tips" v-if="item.status == 3"><span>强制</span></div>
              <van-icon name="checked" color="#fff"></van-icon>
              已退出
            </div>
          </div>
          <div
            class="res-detail-box-rows"
            :style="{
              height: item.isCollapse ? 'auto' : '170px',
              overflow: 'hidden',
              'margin-bottom': '10px',
            }"
          >
            <van-row gutter="20">
              <van-col span="10">
                <p class="label">课题组</p>
                <p>{{ item.apply.classgroupName }}</p>
              </van-col>
              <van-col span="14">
                <p class="label">使用时长</p>
                <p class="ellipsis">{{ common.cycleUnit(item.apply) }}</p>
              </van-col>
            </van-row>

            <van-row gutter="20">
              <van-col span="10">
                <p class="label">课题组经费负责人</p>
                <p>
                  <img src="../../../../static/imgs/bm-res-man.png" alt />
                  {{ item.apply.classfeeLeaderName }}
                </p>
              </van-col>
              <van-col span="14">
                <p class="label">联系电话</p>
                <p>
                  <img src="../../../../static/imgs/bm-res-phone.png" alt />
                  {{ item.apply.classfeeLeaderMobile }}
                </p>
              </van-col>
            </van-row>
            <van-row gutter="20">
              <van-col span="10">
                <p class="label">日常联系人</p>
                <p>
                  <img src="../../../../static/imgs/bm-res-man.png" alt />
                  {{ item.apply.contacterName }}
                  <span @click="toModify(item, 'phone')">
                    <img :src="require('st@tic/imgs/bm-tip-edit.png')" class="phone" />
                  </span>
                </p>
              </van-col>
              <van-col span="14">
                <p class="label">联系电话</p>
                <p>
                  <img src="../../../../static/imgs/bm-res-phone.png" alt />
                  {{ item.apply.contacterMobile }}
                  <span @click="toModify(item, 'phone')">
                    <img :src="require('st@tic/imgs/bm-tip-edit.png')" class="phone" />
                  </span>
                </p>
              </van-col>
            </van-row>
            <van-row gutter="20">
              <van-col span="10">
                <p class="label">入驻时间</p>
                <p>
                  {{
                    item.checkinTime
                      ? common.formatTime(item.checkinTime, 'YYYY.MM.DD hh:mm')
                      : '--'
                  }}
                </p>
              </van-col>
              <van-col span="14">
                <p class="label">退出时间</p>
                <p>
                  {{
                    item.expectCheckoutTime
                      ? common.formatTime(item.expectCheckoutTime, 'YYYY.MM.DD hh:mm')
                      : '--'
                  }}
                </p>
              </van-col>
            </van-row>
            <van-row gutter="20">
              <van-col span="10">
                <p class="label">项目名称</p>
                <p class="ellipsis">{{ item.apply.projectName }}</p>
              </van-col>
              <van-col span="14">
                <p class="label">项目来源</p>
                <p>{{ item.apply.projectFrom }}</p>
              </van-col>
            </van-row>

            <van-row gutter="20">
              <van-col span="10">
                <p class="label">项目经费(万元)</p>
                <p class="ellipsis">{{ item.apply.projectFee }}</p>
              </van-col>
              <van-col span="14">
                <p class="label">项目时间</p>
                <p class="ellipsis">
                  {{
                    item.apply.projectStarttime && item.apply.projectEndtime
                      ? item.apply.projectStarttime + `-` + item.apply.projectEndtime
                      : '--'
                  }}
                </p>

                <p></p>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="24">
                <p class="label">项目概况</p>
                <p class="ellipsis">{{ item.apply.projectOverview }}</p>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="24">
                <p class="label">实验概况</p>
                <p class="ellipsis">{{ item.apply.experimentOverview }}</p>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="24">
                <p class="label">预期成果</p>
                <p class="ellipsis">{{ item.apply.expectedResult }}</p>
              </van-col>
            </van-row>
          </div>
          <div class="bottom-tip">
            <div v-if="!item.isCollapse" @click="collapse(item)">
              <span>展开详情</span>
              <i class="el-icon-arrow-down"></i>
            </div>
            <div v-else @click="collapse(item)">
              <span>收起信息</span>
              <i class="el-icon-arrow-up"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 无限加载 -->
    <div>
      <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
      <p v-show="!finishTable && !loading" @click="getMoreData" class="center">点击加载更多</p>
      <p v-show="finishTable && liveList.length" style="cursor:none;" class="center">到底啦</p>
    </div>
  </div>
</template>

<script>
import { eduResourceUserecordPageQuery } from '@/assets/js/api';

export default {
  name: 'AllResPage',
  props: {
    id: String,
  },
  data() {
    return {
      liveList: [],
      totalLive: 0,
      livePage: 1,
      limit: 10,
      loading: false,
      finishTable: false,
    };
  },
  props: {
    id: String,
  },
  methods: {
    // 修改联系人和电话
    toModify(item, type) {
      this.$router.push({
        path: `/edures/res-list/modify/${type}`,
        query: {
          data: JSON.stringify(item),
        },
      });
    },
    // 伸缩
    collapse(row) {
      let flag = row.isCollapse;
      this.liveList.forEach(v => {
        v.isCollapse ? (v.isCollapse = false) : null;
      });
      row.isCollapse = !flag;
      this.$forceUpdate();
    },

    // 返回
    goBack() {
      sessionStorage.setItem('activeName', JSON.stringify(this.activeName));
      this.$router.go(-1);
    },
    // 加载更多数据
    getMoreData() {
      this.getLiveList(this.livePage + 1).then(list => {
        this.liveList = this.liveList.concat(list);
        this.finishTable = this.totalLive === this.liveList.length;
      });
    },
    // 获取入驻记录
    getLiveList(page) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const filter = { eduResourceId: this.id };
        const params = {
          page: page || this.livePage,
          limit: this.limit,
          filter,
        };
        eduResourceUserecordPageQuery(params)
          .then(res => {
            this.loading = false;
            if (res && res.success === true) {
              this.totalLive = res.total;
              this.livePage = page;
              let list = res.data || [];

              list.forEach(v => {
                let r = v.apply;
                let chargecycle = r.billingCycle + '';
                let chargetype = r.billingMethod + '';
                this.common.chargecycleFormatter(chargecycle, r);
                this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');
                v.isCollapse = false;
              });
              // 该资源当前唯一入驻放在最前
              if (list.length && list[0].status != 1) {
                list.forEach((v, index) => {
                  if (v.status == 1) {
                    let tmp = JSON.stringify(v);
                    list[index] = list[0];
                    list[0] = JSON.parse(tmp);
                  }
                });
              }
              if (page == 1) {
                this.liveList = list;
              }
              this.finishTable = list.length < this.limit || list.length === res.total;
              resolve(list);
            }
          })
          .catch(e => {
            this.loading = false;
          });
      });
    },
  },
  created() {
    // 获取入驻记录
    this.getLiveList(1);
  },
};
</script>

<style lang="scss" scoped>
.flex-div {
  display: flex;
  align-items: center;
  h2 {
    display: inline-block;
    margin-right: auto;
  }
}
.outter-tips {
  .tips {
    width: 34px;
    height: 18px;
    background: #fe3e61;
    border-radius: 9px 9px 0px 9px;
    line-height: 18px;
    position: absolute;
    top: 0 !important;
    left: 0 !important;
    margin-left: -17px;
    margin-top: -9px;
    text-align: center;
    span {
      display: inline-block;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
}

.bottom-tip {
  z-index: 99;
  margin: 20px auto;
  div {
    margin: 0 auto;
    text-align: center;
    cursor: pointer;
  }
}
.center {
  text-align: center;
  margin: 10px 0;
  font-size: 13px;
  color: #b6bdc6;
}
.gap {
  margin-bottom: 20px;
}
.phone {
  cursor: pointer;
  width: 14px;
  height: 14px;
  transform: translateY(-600px);
  filter: drop-shadow(
    #00b09b 0 600px
  ); //颜色、x轴偏移量、y轴偏移量,这里的颜色就是你要指定的颜色，不管原来的图片是什么颜色，都会变成这个颜色
}
</style>
