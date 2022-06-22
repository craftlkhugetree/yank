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
    <div class="imgs" v-if="activeTab === R">
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
        <div class="edu-card-title" @click.stop="toDetail(item)">
          <h2>{{ item.title }}</h2>
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
              <span class="sp2" v-if="activeTab === R">{{ getStatus(item) }}</span>
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
        <div class="title-btns">
          <van-button
            plain
            type="primary"
            size="small"
            @click="toJudge(item)"
            v-if="activeTab === R && [3, 2].includes(item.status)"
          >
            评价
          </van-button>
          <van-button
            style="margin-left: 10px"
            type="primary"
            size="small"
            @click="toEdit(item)"
            v-if="activeTab === D"
          >
            编辑报修
          </van-button>
          <van-button
            plain
            type="default"
            size="small"
            @click="deleteRes(item)"
            v-if="activeTab === D"
          >
            删除
          </van-button>
        </div>
      </div>
    </van-list>

    <!-- 新增 -->
    <div class="btns">
      <van-button icon="plus" round type="primary" @click="toAdd">我要报修</van-button>
    </div>
    <!-- 是否确定删除 -->
    <van-action-sheet
      v-model="showConfirmDelete"
      :actions="[{ name: '确定删除', color: '#fe3e61' }]"
      @select="confirmDelete"
      cancel-text="取消"
    />
  </div>
</template>

<script>
import { getCountFlag, getMyRepairs, deleteId } from '@/assets/js/api';
import { repairStatus } from '@/assets/js/options';

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
      R: 'reported',
      D: 'draft',
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
      showConfirmDelete: false,
      deleteRow: {},
      userId: this.$store.state.userInfo.ID,
    };
  },
  watch: {
    activeTab() {
      this.onSearch();
    },
  },
  computed: {
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
      this.getCount();
      this.getList(1);
    },
    // 新增页面
    toAdd() {
      this.$router.push('/report/add');
    },
    // 编辑页面
    toEdit(row) {
      this.$router.push({ path: '/report/edit', query: { id: row.id } });
    },
    // 报修详情
    toDetail(row) {
      this.$router.push({ path: '/report/detail', query: { id: row.id } });
    },
    // 评价
    toJudge(row) {
      this.$router.push({ path: '/report/judge', query: { id: row.id } });
    },
    // 删除
    deleteRes(row) {
      this.showConfirmDelete = true;
      this.deleteRow = row;
    },
    // 确认删除
    confirmDelete() {
      this.$toast.loading({
        message: '删除中...',
        forbidClick: true,
        duration: 0,
      });
      this.showConfirmDelete = false;
      deleteId(this.deleteRow.id)
        .then(res => {
          this.$toast.clear();
          if (res.success == true) {
            this.$toast.success('删除成功');
            this.getList(1);
          } else {
            this.$toast.fail('删除失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('删除失败' + '\n' + err);
        });
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
      this.error = false;
      let status = this.activeTab === this.D ? 0 : this.status == '-1' ? '1,2,3,4' : this.status;
      let filter = { status };
      // if (this.starttime && !this.endtime) {
      //   this.$toast.fail('请选择结束时间');
      //   return;
      // }
      // if (!this.starttime && this.endtime) {
      //   this.$toast.fail('请选择开始时间');
      //   return
      // }

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

        getMyRepairs(params)
          .then(res => {
            this.$toast.clear();
            this.loading = false;
            if (res && res.success) {
              let list = res.data || [];
              if (page === 1) {
                this.tableData = list;
              }
              this.finished = list.length < this.limit || this.tableData.length === res.total;
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
      let params = { createId: this.userId, status: '1,2,3,4' };
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
      this.$forceUpdate();
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
  .title-btns {
    padding: 0 10px 10px;
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>
