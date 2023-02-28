<template>
  <!-- <div class="noticeTitle clearfix">
            <div class="img">
            </div>
            <div class="hasimg">
                <div class="text">
                    <h3><i></i>标题标题标题标题标题标题标题标题标题标题标题标题标题标题题标题标题标题标题标题标题标题标题标题标题标题标</h3>
                    <span>2021/05/22</span>
                </div>
                <p>消息内容消息内容消息内容消息内容消息内容内容消息内容内容消息内容</p>
            </div>
  </div>-->
  <div class="noticebox">
    <van-list
      class="noticeContent"
      v-model="noticeLoading"
      :finished="noticefinished"
      finished-text="没有更多了"
      @load="getnoticeLists"
    >
      <div
        class="noticeTitle clearfix"
        v-for="(v,i) in noticeLists"
        :key="i"
        @click="godetail(v.id)"
      >
        <div>
          <div class="text">
            <h3 :class="{'istop':v.istop==1}">
              <i v-if="(v.istop==1)"></i>
              {{v.title}}
            </h3>
            <span>{{v.showtime}}</span>
          </div>
          <p v-html="$xss(v.content)"></p>
          <!-- <p v-html="$xss(`<img src=1 onerror=window.alert(1)>`)"></p> -->
        </div>
      </div>
    </van-list>
    <div class="bottom" @click="gohome">
      <div>返 回</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      noticeLists: [],
      noticeLoading: true,
      noticefinished: false
    };
  },
  methods: {
    getnoticeLists() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.noticeLists,
          data: {
            filter: {
              isrelease: "1"
            },
            limit: this.limit,
            page: this.page
          },
          isRep: true
        })
        .then(res => {
          if (res.success) {
            var data = res.data;
            if (data.length < this.limit || data.length === 0) {
              this.noticeLoading = false;
              this.noticefinished = true;
            } else {
              this.noticeLoading = false;
              this.page++;
              this.noticefinished = false;
            }
            data.forEach(e => {
              e.showtime =
                e.createtime.substring(0, 4) +
                "/" +
                e.createtime.substring(4, 6) +
                "/" +
                e.createtime.substring(6, 8);
              this.noticeLists.push(e);
            });
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    addNoticeReadNum(id) {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.addReadNum,
          data: {
            id: id
          }
          // isRep:true
        })
        .then(res => {
          if (res.success) {
            // console.log(res)
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    gohome() {
      this.$router.push("/");
    },
    godetail(id) {
      this.addNoticeReadNum(id);
      this.$router.push({
        path: "noticeDetail",
        query: {
          id: id
        }
      });
    }
  },
  created() {
    this.getnoticeLists();
  }
};
</script>
<style scoped>
.noticeContent {
  width: 100%;
  padding: 24px 0;
  box-sizing: border-box;
}
.noticeTitle {
  width: 100%;
  /* height: 4.9rem; */
  background: #ffffff;
  box-shadow: 0rem -0.02rem 0rem 0rem #eeeeee;
  padding: 30px;
  box-sizing: border-box;
}
.noticeTitle > div > p {
  width: 100%;
  margin-top: 0.4rem;
  height: 36px;
  font-size: 26px;
  font-weight: 400;
  color: #999999;
  line-height: 36px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  float: right;
}
.noticeTitle > div.hasimg > p {
  width: calc(100% - 4.85rem);
}
.noticeTitle > div.img {
  width: 4.25rem;
  height: 3.4rem;
  background: red;
  float: left;
}
.noticeTitle > div > div.text {
  width: 100%;
  float: right;
}
.noticeTitle > div.hasimg > div.text {
  width: calc(100% - 4.85rem);
}
.noticeTitle > div > div.text > h3 {
  width: calc(100% - 4rem);
  float: left;
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  line-height: 42px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  font-style: normal;
}
.noticeTitle > div > div.text > h3 > em {
}
.noticeTitle > div > div.text > h3.istop > em {
  margin-left: 1.7rem;
}
.noticeTitle > div > div.text > h3 > i {
  display: inline-block;
  width: 44px;
  height: 30px;
  background: url(../../../static/img/important.png) no-repeat center center;
  background-size: cover;
  border-radius: 4px;
  /* float: left; */
  margin-right: 20px;
  margin-top: 4px;
  /* position: absolute;
    left: .75rem; */
}
.noticeTitle > div > div.text > span {
  display: inline-block;
  width: 4rem;
  float: right;
  height: 36px;
  font-size: 24px;
  font-weight: 400;
  color: #999999;
  line-height: 42px;
  text-align: right;
}
</style>