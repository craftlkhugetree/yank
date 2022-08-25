<template>
  <div>
    <!-- 筛选 -->
    <div ref="searchBar">
      <van-search v-model.trim="keyword" shape="round" placeholder="请输入" @search="onSearch" />
      <div class="select-group">
        <basic-select-calendar
          style="width: 50%"
          title="开始时间"
          :value="startTimeFormat"
          @chooseDate="chooseStartTime"
        />

        <basic-select-calendar
          style="width: 50%"
          title="结束时间"
          :value="endTimeFormat"
          @chooseDate="chooseEndTime"
        />
      </div>
    </div>
    <!-- 状态图标 -->
    <div class="imgs" v-if="activeTab === D">
      <div v-for="item in img" :key="item.name" class="img-box" @click="clickImg(item)">
        <img
          :src="require(`st@tic/imgs/${item.icon}.png`)"
          :class="status === item.val ? 'click' : ''"
          alt
        />
        <div :class="status === item.val ? 'gap' : 'no-gap'">{{ item.count }}</div>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 列表 -->
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="到底啦"
      @load="getMoreData"
    >
      <div class="edu-card" v-for="item in tableData" :key="item.id">
        <div class="edu-card-title">
          <!-- :style="{ 'background-color': '#00b09b', 'border-color': '#00b09b' }" -->
          <!-- :checked="item.checked" -->
          <!-- <input
            type="checkbox"
            :id="'checkItem' + item.id"
            v-model="item.checked"
            checked
            @click.stop="itemCheck(item)"
            v-if="activeTab === P"
          /> -->
          <van-checkbox
            v-if="activeTab === P"
            v-model="item.checked"
            shape="square"
            icon-size="15"
            @change="itemCheck"
          ></van-checkbox>
          <h2 @click.stop="toDetail(item)">{{ item.title }}</h2>
        </div>
        <div class="edu-card-content" @click.stop="toDetail(item)">
          <div class="left">
            <div class="wrapper">
              {{ item.content }}
            </div>

            <div class="sp-text">
              <span class="sp1">
                {{ common.formatTime(item.createTime, 'YYYY.MM.DD hh:mm:ss') }}
              </span>
              <span class="sp2" v-if="activeTab !== P">{{ getStatus(item) }}</span>
            </div>
          </div>
          <div style="flex-grow: 1"></div>
          <div class="imgs2">
            <div class="text" v-if="imgLen(item)">
              <span>{{ imgLen(item) }}图</span>
            </div>
            <img :src="viewUrl + firstImg(item)" alt v-if="firstImg(item)" />
            <img :src="require('st@tic/imgs/noPhoto.png')" v-else />
          </div>
        </div>
      </div>
    </van-list>

    <!-- 批量 -->
    <div class="btn-co" v-if="activeTab === P && tableData.length">
      <div class="btn-left">
        <el-checkbox :indeterminate="isIndeterminate" v-model="isChecked" @change="kChange">
          全选
        </el-checkbox>
        <!-- <van-checkbox
          icon-size="15"
          v-model="isChecked"
          id="all-checked-batch"
          shape="square"
          @change="kChange"
        ></van-checkbox>
        <span>全选</span> -->
      </div>
      <div class="btn-right" @click.stop="batch">
        <img :src="require('st@tic/imgs/batch_approve.png')" />
        <span>批量办理</span>
      </div>
    </div>
  </div>
</template>

<script>
import { pageQuery, getCountFlag } from '@/assets/js/api';
import { roleId, bizNode, repairStatus } from '@/assets/js/options';

export default {
  name: 'RepairList',
  props: {
    activeTab: String,
  },
  components: {
    BasicSelectCalendar: () => import('@/components/BasicSelectCalendar'),
  },
  data() {
    return {
      isIndeterminate: false,
      isChecked: false,
      P: 'pending',
      D: 'processed',
      T: 'transfered',
      viewUrl: window.g.viewFile,
      status: -1,
      img: [{ val: -1, name: '全部', icon: 'quanbu', count: 0 }],
      finished: false,
      error: false,
      starttime: '',
      startTimeFormat: '',
      endtime: '',
      endTimeFormat: '',
      keyword: '',
      currentPage: 1,
      limit: 10,
      tableData: [],
      loading: false,
      userId: this.$store.state.userInfo.ID,
    };
  },
  watch: {
    activeTab(newVal) {
      this.getList(1);
      if (newVal === this.D) {
        this.getCount();
      }
    },
  },
  computed: {
    curRole() {
      return sessionStorage.getItem('curRole') || '';
    },
    getStatus() {
      return item => repairStatus.find(r => r.val == item.status).name;
    },
    // 列表预览第一张图
    firstImg() {
      return item => (item.photos ? item.photos.split(',')[0] : '');
    },
    imgLen() {
      return item =>
        item.photos && item.photos.split(',').length > 1 ? item.photos.split(',').length : '';
    },
  },
  methods: {
    // 选择日期
    chooseStartTime(date) {
      this.transTime(date, 'start');
    },
    chooseEndTime(date) {
      this.transTime(date, 'end');
    },
    // 时间转换
    transTime(date, str) {
      if (date && str) {
        this[str + 'TimeFormat'] = this.common.formatTime(date.getTime(), 'YYYY.MM.DD');
        this[str + 'time'] = this.common.formatTime(date.getTime(), 'YYYYMMDD000000');
      } else {
        this[str + 'TimeFormat'] = '';
        this[str + 'time'] = '';
      }
      this.onSearch();
    },
    // 搜索
    onSearch() {
      this.getList(1);
      this.getCount();
    },
    // 报修详情
    toDetail(row) {
      this.$router.push({ path: '/report/detail', query: { id: row.id } });
    },
    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1).then(list => {
        this.tableData = this.tableData.concat(list);
      });
    },
    ifInFilter(key, obj) {
      if (this[key]) {
        obj[key] = this[key];
      }
    },
    // 获取列表
    getList(page) {
      //         if (this.starttime && !this.endtime) {
      //   this.$toast.fail('请选择结束时间');
      //   return;
      // }
      // if (!this.starttime && this.endtime) {
      //   this.$toast.fail('请选择开始时间');
      //   return
      // }

      this.error = false;
      let filter = {};
      if (this.activeTab === this.P) {
        filter.bizNode = this.selfRole();
        this.status = -1;
        filter.status = 1;
      } else if (this.activeTab === this.D) {
        filter.handledNode = this.selfRole();
        filter.status = this.status == '-1' ? '2,3,4' : this.status;
      } else if (this.activeTab === this.T) {
        filter.movedNode = this.selfRole();
        this.status = -1;
      }
      return new Promise((resolve, reject) => {
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
        });
        this.loading = true;
        let params = {
          page: page,
          limit: this.limit,
        };
        this.ifInFilter('keyword', filter);
        this.ifInFilter('starttime', filter);
        this.ifInFilter('endtime', filter);
        params.filter = filter;

        pageQuery(params)
          .then(res => {
            this.$toast.clear();
            this.loading = false;
            if (res && res.success) {
              let list = res.data || [];
              if (page === 1) {
                this.tableData = list;
              }
              this.finished = list.length < this.limit || this.tableData.length == res.total;
              this.currentPage = page;
              resolve(list);
            } else {
              this.error = true;
              this.$toast.fail('获取数据失败' + '\n' + res.message);
              reject(res);
            }
          })
          .catch(err => {
            this.$toast.clear();
            this.error = true;
            this.loading = false;
            this.$toast.fail('获取数据失败' + '\n' + err);
            reject(err);
          });
      });
    },
    // 获取状态数量
    getCount() {
      let params = { handledNode: this.selfRole() };
      params.status = '2,3,4';
      // params.status = this.status == '-1' ? '2,3,4' : this.status;
      this.ifInFilter('keyword', params);
      this.ifInFilter('starttime', params);
      this.ifInFilter('endtime', params);
      getCountFlag(params)
        .then(res => {
          if (res && res.success) {
            this.$set(this.img[1], 'count', 0);
            this.$set(this.img[2], 'count', 0);
            this.$set(this.img[3], 'count', 0);
            let total = 0;
            res.data &&
              res.data.forEach(r => {
                if (r.status) {
                  total += r.num || 0;
                  this.img.some(i => {
                    if (i.val == r.status) {
                      i.count = r.num;
                      return 1;
                    }
                  });
                }
              });
            this.$set(this.img[0], 'count', total);
          } else {
          }
        })
        .catch(err => {});
    },
    // 生成状态图标数组
    genImg() {
      repairStatus.forEach(r => {
        if (r.icon) {
          this.img.push({ ...r, count: 0 });
        }
      });
    },
    // 点击状态图标
    clickImg(item) {
      this.status = item.val;
      this.getList(1);
      this.getCount()
    },
    // 身份
    selfRole() {
      if (this.curRole === roleId.hq) {
        return bizNode.hq;
      } else if (this.curRole === roleId.bm) {
        return bizNode.bm;
      }
    },
    // 勾选
    itemCheck(item) {
      let arr = this.tableData.filter(t => t.checked) || [];
      if (!arr.length) {
        this.isChecked = false;
        this.isIndeterminate = false;
      } else if (arr.length === this.tableData.length) {
        this.isChecked = true;
        this.isIndeterminate = false;
      } else if (arr.length < this.tableData.length) {
        this.isIndeterminate = true;
      }
    },
    batch() {
      let arr = this.tableData.filter(t => t.checked) || [];
      if (!arr.length) {
        this.$toast.fail('请先勾选数据');
        return;
      }
      this.$router.push({ path: '/repair/handle', query: { data: JSON.stringify(arr) } });
    },
    // 全选
    kChange() {
      this.tableData.forEach(t => {
        this.$set(t, 'checked', this.isChecked);
      });
    },
  },
  created() {
    this.genImg();
    this.getList(1);
    this.getCount();
  },
};
</script>

<style lang="scss" scoped>
.imgs {
  width: 100%;
  margin: 10px auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  .img-box {
    flex-basis: 25%;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    overflow: hidden;
    position: relative;
    img {
      margin: 0 auto;
      width: 32px;
      height: 32px;
    }
    div {
      position: absolute;
      left: 50%;
      top: 0;
      width: 32px;
      height: 18px;
      background: #ffffff;
      border-radius: 16px;
      text-align: center;
      line-height: 18px;
    }
    span {
      // 确保文字处于img下方
      flex-basis: 100%;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 18px;
    }
  }
}
// 点击使img变色，必须配合外围的overflow
.click {
  transform: translateY(-60px);
  //颜色、x轴偏移量、y轴偏移量
  filter: drop-shadow(#fd7d18 0 60px);
  -webkit-filter: drop-shadow(#fd7d18 0 60px); //兼容其它浏览器
}
.gap {
  border: 1px solid #fd7d18;
  color: #fd7d18;
}
.no-gap {
  border: 1px solid #cccccc;
  color: #cccccc;
}
.edu-card {
  background: #ffffff;
  box-shadow: 0px 2px 5px 0px rgba(182, 189, 198, 0.22);
  border-radius: 5px;
  margin: 5px;
  .edu-card-title {
    padding: 10px;
    width: 100%;
    height: 22px;
    line-height: 22px;
    h2 {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #172535;
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    input {
      vertical-align: middle;
      &:checked i {
        background-color: #00b09b;
        border-color: #00b09b;
      }
    }
  }

  .edu-card-content {
    padding: 10px;
    display: flex;
    align-items: center;
    .left {
      height: 80px;
      width: 70%;
      .wrapper {
        height: 50px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #172535;
        line-height: 22px;
        text-align: left;
        display: -webkit-box; // 必须有，否则clamp可能不兼容
        overflow: hidden;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
      }
      .sp-text {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .sp1 {
          width: 121px;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 17px;
        }
        .sp2 {
          width: 56px;
          height: 22px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #fd7d18;
          line-height: 22px;
        }
      }
    }

    .imgs2 {
      position: relative;
      height: 80px;
      width: 80px;
      background: #fff;
      line-height: 80px;
      text-align: center;
      vertical-align: middle;
      img {
        width: 80px;
        height: 80px;
        object-fit: contain;
        background-color: #f8f8f8;
      }
      .text {
        position: absolute;
        width: 30px;
        height: 20px;
        background: #000000;
        opacity: 0.3;
        z-index: 999;
        bottom: 0;
        right: 0;
        text-align: center;
        vertical-align: middle;
        // border-radius: 5px;
        border-top-left-radius: 3px;
        border-bottom-right-radius: 3px;
        span {
          position: absolute;
          bottom: 0;
          right: 5px;
          width: 20px;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #dcdcdc;
          line-height: 17px;
        }
      }
    }
  }
}
.btn-co {
  position: fixed;
  bottom: 10px;
  text-align: center;
  z-index: 100;
  opacity: 0.8;
  //   box-shadow: 0px 2px 2px 0px rgba(0, 176, 155, 0.3);
  left: 50%;
  transform: translate(-50%);
  background: #f8f8f8;
  display: flex;
  flex-wrap: nowrap;
  .btn-left {
    height: 42px;
    width: 94px;
    background: #ffffff;
    box-shadow: 0px 2px 2px 0px rgba(23, 37, 53, 0.1);
    border-radius: 21px 0px 0px 21px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      vertical-align: middle;
      margin-left: 5px;
      width: 28px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #383a48;
      line-height: 20px;
    }
  }
  .btn-right {
    overflow: hidden;
    width: 144px;
    height: 42px;
    background: #00b09b;
    box-shadow: 0px 2px 2px 0px rgba(0, 176, 155, 0.3);
    border-radius: 0px 21px 21px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 5px;
      width: 60px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #fff;
      line-height: 20px;
    }
  }
}

/deep/
  .van-checkbox__icon.van-checkbox__icon--square.van-checkbox__icon--checked
  .van-icon.van-icon-success {
  background-color: #00b09b;
  border-color: #00b09b;
}
/deep/ .van-checkbox {
  vertical-align: middle;
  display: inline-block;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #00b09b;
  border-color: #00b09b;
}
/deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #00b09b;
  border-color: #00b09b;
}
/deep/ .el-checkbox.is-checked .el-checkbox__label {
  color: #383a48;
}

/deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #00b09b;
}
</style>
