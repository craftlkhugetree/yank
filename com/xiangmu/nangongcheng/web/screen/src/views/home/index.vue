<template>
  <div class="clearfix" style="height: 100vh; background: #fff">
    <img src="@/assets/img/schoolname.svg#svgView(preserveAspectRatio(none))" class="schoolname" />
    <div class="home-search">
      <el-select
        v-model="selValue"
        :placeholder="placeholder"
        class="eeselect"
        @change="handleChange"
      >
        <el-option
          v-for="item in tabs.filter(t => !this.hasSth(t.label, '首页'))"
          :key="item.route"
          :label="item.label"
          :value="item.route"
        ></el-option>
      </el-select>
      <el-input
        ref="ipt"
        v-model="iptValue"
        placeholder="输入要搜索的信息"
        :maxlength="100"
        class="eeinput"
        clearable
        @keyup.enter.native="searchJ"
      ></el-input>
      <!-- <el-button type="primary" class="eebutton" @click="search">搜&nbsp;索</el-button> -->
      <el-button type="primary" class="eebutton" @click="searchJ" :disabled="!selValue">
        搜&nbsp;索
      </el-button>
    </div>
    <img src="@/assets/img/iconbg.svg" class="iconbg" />
    <div class="home-body">
      <div v-for="item in homeCard" :key="item.route">
        <s-title :text="hasSth(item.label, '名师') ? '名师著作风采' :item.label"></s-title>
        <s-tips text="查看全部" class="stips" @inheritClick="jump(item.route)"></s-tips>
        <div v-if="hasSth(item.label, '院士')" class="yuanshi">
          <name-card
            :data="(list[item.route] && list[item.route][0]) || {}"
            :route="item.route"
            @jump="jumpDetail"
          >
            <div class="next" @click="next(item, 'next')" v-if="canNext(item)">
              <img src="@/assets/img/next.svg" />
            </div>
            <div class="pre" @click="next(item, 'pre')" v-if="canPre(item)">
              <img src="@/assets/img/pre.svg" />
            </div>
          </name-card>
        </div>
        <div v-else-if="hasSth(item.label, '名师')" class="mingshi">
          <div class="rongyu ">
            <div v-for="teacher in list[item.route]" :key="teacher.id">
              <div class="content">
                <div class="div_flex">
                  <span class="title">{{ teacher.name }}</span>
                  <span class="detail" @click="jumpDetail(item.route, teacher)">详细</span>
                </div>
                <div class="cover div_flex">
                  <el-image
                    v-for="obj in genTeach(teacher)"
                    :key="obj.id"
                    class="incover"
                    :src="obj.viewUrl"
                    :preview-src-list="[obj.viewUrl]"
                    fit="contain"
                  ></el-image>
                  <!-- <div class="right" v-if="canNext" @click="jumpDetail(item.route, teacher)">
                    <img src="@/assets/img/whiteright.svg" />
                  </div> -->
                </div>
                <div class="honor div_flex" v-for="honor in genHonor(teacher)" :key="honor.name">
                  <img src="@/assets/img/littleHonor.svg" />
                  <span class="ellipsis" :title="honor.name">{{ honor.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="hasSth(item.label, '教材')" class="year">
          <div>
            <div v-for="(year, index) in yearList" :key="year" class="vertical">
              <div :class="yearNum === index ? 'purple' : ''" @click="clickYear(item, index)">
                {{ year }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="hasSth(item.label, '教材')" class="card">
          <div class="div_flex">
            <div class="side">
              <img src="@/assets/img/cirleft.svg" @click="next(item, 'pre')" v-if="canPre(item)" />
            </div>
            <div class="mid">
              <div v-for="book in list[item.route]" :key="book.id">
                <div class="famous div_flex">
                  <el-image
                    class="left"
                    :src="viewUrl + book.cover"
                    :preview-src-list="[viewUrl + book.cover]"
                    fit="contain"
                  ></el-image>
                  <div class="right">
                    <span :title="book.name" class="title">
                      {{ book.name }}
                    </span>
                    <div>
                      <span class="ellipsis">
                        {{ genAuthor(book) }}
                      </span>
                      <br />
                      <span class="ellipsis date">
                        {{ genDate(book) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="side">
              <img
                src="@/assets/img/cirright.svg"
                @click="next(item, 'next')"
                v-if="canNext(item)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="donate">
        <s-title text="捐赠文库"></s-title>
        <div class="btn div_flex">
          <div
            @click="jumpBefore('/tc/specialSponser')"
            :class="isSpecial ? 'choose' : 'notchoose'"
          >
            &lt;&nbsp;&nbsp;{{ spec }}捐赠
          </div>
          <div
            @click="jumpBefore('/tc/alumnaSponser')"
            :class="!isSpecial ? 'choose' : 'notchoose'"
          >
            {{ mate }}捐赠&nbsp;&nbsp;&gt;
          </div>
        </div>
        <div class="dbook">
          <div v-for="dbook in (list[donateOwner] || []).slice(0, 5)" :key="dbook.id">
            <div class="bookowner">
              <h3 class="ellipsis" :title="dbook.name">
                {{ dbook.name }}
              </h3>
              <span
                class="ellipsis"
                v-for="ibook in dbook.personDonateBooks || []"
                :key="ibook.id"
                :title="ibook.name"
              >
                {{ ibook.name }}
              </span>
              <s-tips
                text="更多"
                class="more"
                @inheritClick="jumpDetail(donateOwner, dbook)"
                :hasArrow="false"
              ></s-tips>
            </div>
          </div>
        </div>
        <s-tips text="查看全部" class="stips" @inheritClick="jump(donateOwner)"></s-tips>
        <div style="height: 110rem"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { tabs } from '@/assets/js/options';
import { QUERY } from '@/api/all';
export default {
  name: 'Home',
  components: {
    nameCard: () => import('@/components/nameCard'),
  },
  data() {
    return {
      selValue: '/tc/academician',
      iptValue: '',
      placeholder: '请选择',
      tabs,
      tabs_limit: [],
      list: {},
      viewUrl: window.g.viewUrl,
      yearNum: -1,
      donateOwner: '/tc/specialSponser',
      spec: '专家',
      mate: '校友',
    };
  },
  computed: {
    isSpecial() {
      return this.donateOwner === '/tc/specialSponser';
    },
    genAuthor() {
      return function(t) {
        let name = (t.author + '').split(/[,，]/g) || [];
        t.authorFirst = name.length > 1 ? name[0] + ' 等' : t.author;
        return t.authorFirst;
      };
    },
    genDate() {
      return function(row) {
        let month = row.publishMonth ? row.publishMonth + '月' : '';
        let day = row.publishDay ? row.publishDay + '日' : '';
        return row.publishYear + '年' + month + day;
      };
    },
    genTeach() {
      return function(obj) {
        let arr = (obj && obj.personPublishBooks) || [];
        arr.forEach(a => {
          a.viewUrl = this.viewUrl + a.cover;
        });
        return arr.slice(0, 4);
      };
    },
    genHonor() {
      return function(obj) {
        let arr = (obj && obj.personHonors) || [];
        return arr.slice(0, 2);
      };
    },
    homeCard() {
      return this.tabs_limit.filter(
        t => !this.hasSth(t.label, '捐赠') && !this.hasSth(t.label, '首页')
      );
    },
    canPre() {
      return function(item) {
        return item.page > 1 && this.list[item.route].length;
      };
    },
    canNext() {
      return function(item) {
        return item.total > item.page * item.limit && this.list[item.route].length;
      };
    },
    yearList() {
      let year = new Date().getFullYear();
      const arr = [year];
      for (let i = 1; i < 5; i++) {
        arr.unshift(year - i);
      }
      return arr;
    },
  },
  methods: {
    jumpBefore(path) {
      this.donateOwner = path;
    },
    clickYear(item, index) {
      this.yearNum = index;
      let obj = this.tabs_limit.find(t => t.route === item.route);
      obj.page = 1;
      obj.filter.publishYear = this.yearList[index];
      this.next(item);
    },
    next(item, type) {
      this.tabs_limit.forEach(t => {
        if (t.route === item.route) {
          this.selValue = item.route;
          if (type === 'next') {
            t.page++;
          } else if (type === 'pre') {
            t.page--;
          }
        }
      });
      this.search();
    },
    search(route, page = 1) {
      if (this.tabs.includes(t => t.route === route)) {
        console.log('next', route, page);
      } else if (this.selValue) {
        let obj = this.tabs_limit.find(t => t.route === this.selValue);
        if (obj) {
          obj.filter.name = this.iptValue;
          QUERY(obj).then(res => {
            if (res && res.code === '000000') {
              this.$set(this.list, this.selValue, res.data || []);
              obj.total = res.total;
            }
          });
        }
      }
    },
    hasSth(title, str, con = true) {
      return this.common.judgeTitle(title, str, con);
    },
    handleChange(val) {
      this.selValue = val;
    },
    jump(route, name) {
      let obj = { path: route };
      if (name) obj.query = { name };
      this.$router.push(obj);
    },
    jumpDetail(route, obj) {
      this.$router.push(route + '/' + obj.id);
    },
    searchJ() {
      if (this.selValue) {
        this.$router.push({
          path: this.selValue,
          query: { name: this.iptValue },
        });
      }
    },
  },
  created() {
    const tabs = this.tabs.filter(t => !this.hasSth(t.label, '首页'));
    tabs.forEach(t => {
      let obj = { page: 1, limit: 6 };
      obj.apiPre = t.apiPre;
      obj.route = t.route;
      obj.label = t.label;
      obj.filter = { ...t.filter };
      if (this.hasSth(t.label, '院士')) {
        obj.limit = 1;
      }
      this.tabs_limit.push(obj);
    });
    this.tabs_limit.forEach(t => {
      QUERY(t).then(res => {
        if (res && res.code === '000000') {
          this.$set(this.list, t.route, res.data);
          t.total = res.total || 0;
        }
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.schoolname {
  top: 0;
  width: 100%;
  display: block;
  position: absolute;
  height: $schoolname-height;
  object-fit: cover;
}
.home-search {
  position: absolute;
  height: 68rem;
  width: 680rem;
  left: 50%;
  transform: translate(-50%);
  top: 275rem;
  background: rgba(255, 255, 255, 0.4);

  /* 紫1 */
  box-shadow: 0rem 4rem 12rem rgba(179, 132, 222, 0.2);
  backdrop-filter: blur(5rem);

  /* Note: backdrop-filter has minimal browser support */
  border-radius: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  /deep/ .el-input__inner {
    border: 0;
  }
  /deep/ .el-input {
    height: 44rem;
    line-height: 44rem;
  }
  .eeselect {
    background: #ffffff;
    border-radius: 6rem;
    width: 150rem;
    line-height: 44rem;
    height: 44rem;
    /deep/ .el-input__inner {
      font-size: 14rem * $arq;
      vertical-align: middle;
    }
  }
  .eeinput {
    /deep/ .el-input__inner {
      font-size: 14rem * $arq;
      vertical-align: middle;
    }
    width: 410rem;
    height: 44rem;
    line-height: 44rem;
    background: #ffffff;
    border-radius: 6rem;
  }
}
.home-body {
  position: absolute;
  width: 100%;
  top: $schoolname-height;
  // margin-top: 40rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #f9f4fe 100%);
  // background: #f5f5f5;
  .stips {
    text-align: center;
    width: 100%;
  }
  .yuanshi {
    margin: 40rem $m-left;
  }
  .mingshi {
    width: 100%;
    height: 458rem;
    margin: 40rem 0;
    // background: $color-purple;
    background: url('../../assets/img/mingshi.svg') no-repeat center;
    background-size: cover;
    .rongyu {
      padding: 30rem $m-right;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > div {
        border: 1rem solid #ffffff;
        width: 30%;
        height: 184rem;
        margin-left: 28rem;
        margin-bottom: 30rem;
        .content {
          margin: 12rem 20rem;
          .title {
            @include fz(16rem, #fff, 700);
            line-height: 22rem;
            height: 22rem;
          }
          .detail {
            @include fz(12rem, rgba(255, 255, 255, 0.6));
            margin-left: auto;
            cursor: pointer;
          }
          .honor {
            margin: 10rem 0;
            span {
              @include fonts(14, #fff);
              margin-left: 10rem;
            }
          }
          .cover {
            width: 100%;
            height: 83rem;
            border-bottom: 1rem solid #ffffff;
            .right {
              margin-left: auto;
              cursor: pointer;
            }
            .left {
              width: 10%;
              cursor: pointer;
            }
            .incover {
              width: 23%;
              height: 59rem;
              margin-right: 2%;
            }
          }
        }
      }
    }
  }
  .year {
    width: 100%;
    height: 51rem;
    margin-top: 30rem;
    > div {
      width: 560rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .vertical {
        width: 127rem;
        @include fonts(20, #333);
        line-height: $arq * 27rem;
        height: 27rem;
        text-align: center;
        &:not(:last-child) {
          border-right: 1rem solid #cccccc;
        }
        .purple {
          color: $color-purple;
          border-bottom: 4rem solid $color-purple;
        }
        > div {
          width: $arq * 47rem;
          height: 51rem;
          margin: 0 auto;
          cursor: pointer;
        }
      }
    }
  }
  .card {
    width: 100%;
    height: 388rem;
    // background: #faf9fb;
    background: url('~@/assets/img/2-header.svg') no-repeat;
    > div {
      padding: 50rem 0;
    }
    .side {
      width: $m-left;
      img {
        cursor: pointer;
        display: block;
        margin: 0 auto;
      }
    }
    .mid {
      flex: 1;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      flex-wrap: wrap;
      > div {
        width: 31%;
        height: 124rem;
        margin: 14rem 0;
        margin-right: 2%;
        background: #ffffff;
        box-shadow: 0rem 10rem 30rem #f3effa;
        border-radius: 4rem;
        .famous {
          padding: 20rem;
          .left {
            width: 84rem;
            height: 84rem;
          }
          .right {
            text-align: left;
            margin-left: 15rem;
            height: 84rem;
            width: 60%;
            .title {
              width: 100%;
              @include fz(16rem, #333, 700);
              @include moreEllipsis(1);
              line-height: $arq * 22rem;
              height: $arq * 22rem;
              word-break: break-all;
            }
            > div {
              margin-top: 5rem;
              line-height: $arq * 16rem;
              span {
                width: 100%;
                @include fz(12rem, #333);
              }
              .date {
                margin-bottom: 0;
                @include fz(14rem, #333);
              }
            }
          }
        }
      }
    }
  }
  .donate {
    .btn {
      width: 30%;
      height: 43rem;
      margin: 40rem auto;
      > div {
        width: 50%;
        text-align: center;
        @include fonts(18, #333);
        height: 43rem;
        line-height: 43rem;
        cursor: pointer;
      }
      .choose {
        border: 1rem solid #333333;
      }
      .notchoose {
        border: 1rem solid #cccccc;
        color: #cccccc;
      }
    }
    .dbook {
      margin: 0 $m-left 40rem $m-right;
      height: 302rem;
      // wi
      display: flex;
      align-items: center;
      justify-content: space-between;
      > div {
        background: linear-gradient(to right, #e6e6fa, #fcf9ff) !important;
        width: 16%;
        .bookowner {
          position: relative;
          height: $arq * 222rem;
          padding: 20rem;
          h3 {
            @include fonts(18, #000, 700);
            height: $arq * 25rem;
            line-height: $arq * 25rem;
            margin-bottom: 5rem;
            width: 100%;
          }
          span {
            display: block;
            @include fonts(14, #000);
            line-height: $arq * 150%;
            width: 100%;
          }
          .more {
            text-align: left;
            position: absolute;
            cursor: pointer;
            bottom: 20rem;
          }
        }
      }
    }
  }
}
.eebutton {
  font-size: 14rem * $arq;
  border-radius: 6px;
}
.iconbg {
  width: 100%;
  position: absolute;
  top: 400rem;
}
</style>
