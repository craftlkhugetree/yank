<template>
  <div class="audit">
    <van-nav-bar title="年终奖确认" fixed :border="false" left-arrow @click-left="$router.goBack()" />
    <div style="width:100%;height:46px;"></div>
    <van-tabs
      v-model="activeTab"
      color="#3F86F7"
      title-active-color="#3F86F7"
      title-inactive-color="#7D7D80"
      @change="getList"
    >
      <van-tab v-for="item in tabs" :key="item.id" :title="item.title" :name="item.id">
        <div class="audit-list">
          <div
            class="list-box"
            v-for="(item,index) in list"
            :key="index"
            @click="goDetail(item)"
            :class="`animation-${index + 1}`"
          >
            <h3>{{item.title}}</h3>
            <van-icon name="arrow"></van-icon>
            <div class="content" v-if="activeTab=='2'">
              <p>
                <label>确认结果：</label>
                <span
                  class="tag"
                  :class="{'nopass': item.result == '0'}"
                >{{item.result == "1" ? "确认通过" : "确认不通过"}}</span>
              </p>
              <p>
                <label>确认时间：</label>
                <span>{{common.defaultTimeFormat(item.confrimtime)}}</span>
              </p>
            </div>
          </div>
          <div v-if="list.length == 0" class="nodata">暂无数据</div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { fetchConfirmList, fetchConfirmedList } from "@/api/kpi/confirm";
export default {
  data() {
    return {
      activeTab: sessionStorage.getItem("yearConfirmTab") || "1",
      tabs: [
        {
          id: "1",
          title: "待确认"
        },
        {
          id: "2",
          title: "已确认"
        }
      ],
      list: []
    };
  },
  methods: {
    // 审核详情
    goDetail(item) {
      this.$router.push({
        path: `/year-confirm/detail`,
        query: {
          confirmType: this.activeTab
        }
      });
      sessionStorage.setItem("yearConfirmDetail", JSON.stringify(item));
    },
    // 获取列表
    getList() {
      let func = this.activeTab == "1" ? fetchConfirmList : fetchConfirmedList;
      func({
        type: 2
      }).then(res => {
        if (res.success) {
          sessionStorage.setItem("yearConfirmTab", this.activeTab);
          this.list = res.data || [];
          if (this.activeTab == "2") {
            this.list.sort((a, b) => {
              return a.confrimtime > b.confrimtime ? -1 : 1;
            });
          }
          this.list.forEach(i => {
            let title = "";
            // type: 1-月绩效，2-年绩效，3-特殊发放，4-领导绩效
            if (i.type == "1") {
              title = `『 ${i.groupname} 』${i.yeardate}年${i.monthdate}月绩效清单`;
            } else if (i.type == "2") {
              title = `『 ${i.groupname} 』${i.yeardate}年终绩效清单`;
            }
            i.title = title;
          });
        }
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.audit-list {
  width: 100%;
  padding: 24px;
  .list-box {
    padding: 24px;
    background: #ffffff;
    box-shadow: 0px 5px 20px 0px #e6e6e6;
    border-radius: 10px;
    position: relative;
    margin-bottom: 24px;
    h3 {
      font-size: 32px;
      font-weight: 600;
      color: #474d51;
      line-height: 38px;
      width: calc(100% - 22px);
    }
    .van-icon {
      position: absolute;
      right: 12px;
      top: 12px;
      font-size: 15px;
    }
    .content {
      margin: 24px -24px 0;
      padding: 24px 24px 0;
      border-top: 1px solid #dbdbdb;
      p {
        font-size: 24px;
        color: #7d7d80;
        line-height: 36px;
        &:not(:last-child) {
          margin-bottom: 18px;
        }
        span {
          color: #474d51;
        }
        .tag {
          font-size: 24px;
          color: #3f86f7;
          line-height: 36px;
          padding: 6px 8px;
          background: #ebf2fe;
          border-radius: 6px;
          border: 1px solid #85b2fa;
        }
        .nopass {
          color: #ff9f0a;
          background: #fff5e6;
          border: 1px solid #ffc162;
        }
      }
    }
  }
}
</style>