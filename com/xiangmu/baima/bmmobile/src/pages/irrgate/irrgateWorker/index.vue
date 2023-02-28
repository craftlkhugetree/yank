<template>
  <div>
    <van-nav-bar
      ref="navBar"
      title="接收灌溉"
      :border="false"
      right-text="功能首页"
      @click-right="$router.push('/fun-module')"
    />
    <!-- 筛选 -->
    <div ref="searchBar" class="search-bar">
      <div class="select-group small-padding">
        <basic-select-calendar
          style="width: 50%"
          title="灌溉日期"
          :value="irdateFormat"
          @chooseDate="chooseIrdate"
        />
        <basic-select
          style="width: 50%"
          title="选择状态"
          :value="applyStatusName"
          :list="applyStatusList"
          optionName="name"
          optionValue="id"
          top="95px"
          @chooseItem="chooseApplyStatus"
        />
      </div>
    </div>
    <!-- tab标签页 -->
    <div class="tabs" ref="tableTabs">
      <li
        :class="{ active: activeTableTab === item.value }"
        v-for="item in tabs"
        :key="item.value"
        @click="
          activeTableTab = item.value;
        "
      >
        {{ item.text }}
      </li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 列表 -->
    <!-- <van-list
      v-model="loading"
      :finished="finished"
      finished-text="到底啦"
      @load="getList(currentPage)"
    >
      <div class="card-list">
        <li v-for="(item, index) in list" :key="item.id + index">
          <img src="../../../../static/imgs/bm-list-land.png" />
          <div class="card-content">
            <h3>{{ item.typename }}：{{ item.rescodes }}</h3>
            <span class="card-time">{{ common.formatTime(item.irdate, 'YYYY-MM-DD') }}</span>
            <span class="ellipsis">学院：{{ item.orgname }}</span>
            <span>项目：{{ item.projectname }}</span>
            <span class="card-note">备注：{{ item.note || '--' }}</span>
          </div>
          <div class="card-btns">
            <van-button
              v-if="item.applystatus !== '3' && item.applystatus !== '9'"
              plain
              type="primary"
              size="small"
              @click="accept(item)"
            >
              接收
            </van-button>
            <van-button
              v-if="item.applystatus === '3'"
              type="default"
              disabled
              color="#ccc"
              size="small"
            >
              已接收
            </van-button>
            <van-button
              v-if="item.applystatus === '9'"
              type="default"
              disabled
              color="#ccc"
              size="small"
            >
              已撤回
            </van-button>
          </div>
        </li>
      </div>
    </van-list> -->
    <el-table :data="list" style="width: 100%;">
      <el-table-column
        prop="orgname"
        label="学院名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column
        prop="projectname"
        label="项目名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column> -->
      <el-table-column
        prop="typename"
        label="灌溉类型"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="rescodes"
        label="资源编号"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="doingDay"
        label="灌溉日期"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="worker"
        label="田间值守人"
        align="center"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="workermobile"
        label="联系方式"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="applystatus" label="状态" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="common.statusColor('', '', scope.row.applystatus)">
            {{ common.statusFormatter('', '', scope.row.applystatus) }}
          </span>
        </template>
      </el-table-column>
      <!-- :formatter="common.statusFormatter" -->
      <el-table-column label="操作" fixed="right" width="70" align="center">
        <template slot-scope="scope">
          <span
            style="color:#00b09b;padding:0 5px;font-weight:bold"
            @click="accept(scope.row)"
            v-if="scope.row.applystatus !== '3' && scope.row.applystatus !== '9'"
          >
            接收
          </span>
        </template>
      </el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finished && !loading" @click="getList(currentPage)">点击加载更多</p>
        <p v-show="finished && list.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>
  </div>
</template>

<script>
import BasicSelectCalendar from '../../../components/BasicSelectCalendar';
import BasicSelect from '../../../components/BasicSelect';
export default {
  components: {
    BasicSelectCalendar,
    BasicSelect,
  },
  data() {
    return {
      activeTableTab: 1,
      tabs: [
        { text: '全天', value: 1 },
        { text: '上午', value: 2 },
        { text: '下午', value: 3 },
      ],
      irdate: '',
      irdatePopup: false,
      irdateFormat: '',
      applyStatus: '2',
      applyStatusName: '未接收',
      applyStatusList: [
        { name: '全部', id: '' },
        { name: '未接收', id: '2' },
        { name: '已接收', id: '3' },
      ],
      currentPage: 1,
      limit: 5,
      loading: false,
      list: [],
      finished: false,
    };
  },
  watch: {
    irdate() {
      this.getList(1);
    },
    applyStatus() {
      this.getList(1);
    },
    activeTableTab() {
      this.getList(1);
    },
  },
  methods: {
    // 选择日期
    chooseIrdate(date) {
      if (date) {
        this.irdateFormat = this.common.formatTime(date.getTime(), 'YYYY.MM.DD');
        this.irdate = this.common.formatTime(date.getTime(), 'YYYYMMDD000000');
      } else {
        this.irdateFormat = '';
        this.irdate = '';
      }
      this.irdatePopup = false;
    },
    // 选择状态
    chooseApplyStatus(item) {
      this.applyStatus = item.id;
      this.applyStatusName = item.name;
    },
    // 接收
    accept(item) {
      this.$toast.loading({
        message: '接收中...',
        forbidClick: true,
        duration: 0,
      });
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/irapply/saveEvent',
          isRep: true,
          data: {
            eventresult: 1,
            eventtype: 5,
            applyid: item.id,
          },
        })
        .then(res => {
          this.$toast.clear();
          if (res.success) {
            this.$toast.success('接收成功');
            this.getList(1);
          } else {
            this.$toast.fail('接收失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail('接收失败' + '\n' + err);
        });
    },
    // 获取列表
    getList(page) {
      let params = {
        page: page,
        limit: this.limit,
        daytype: this.activeTableTab,
      };
      if (this.irdate) {
        params.irdate = this.irdate;
      }
      if (this.applyStatus) {
        params.applystatus = this.applyStatus;
      }
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: '/irapply/pageList?date=' + new Date().getTime(),
          data: {
            params: JSON.stringify(params),
          },
        })
        .then(res => {
          this.loading = false;
          if (res.success == true) {
            let workerList = res.item ? res.item.workerList || {} : {};
            let list = workerList.list || [];
            list.forEach(l => {
              let doingDay = this.common.formatTime(l.irdate, 'yyyy.MM.dd') + ' ';
              let zone = this.tabs.find(t => t.value == l.daytype).text;
              l.doingDay = doingDay + zone;
            });
            this.list = page === 1 ? list : this.list.concat(list);
            this.finished = list.length < this.limit;
            this.currentPage = page + 1;
          } else {
            this.finished = true;
            this.$toast.fail('获取数据失败' + '\n' + res.message);
          }
        })
        .catch(err => {
          this.loading = false;
          this.finished = true;
          // this.$toast.fail("获取数据失败" + "\n" + err);
        });
    },
  },
  created() {
    this.irdate = this.common.formatTime(new Date().getTime(), 'YYYYMMDD000000');
    this.irdateFormat = this.common.formatTime(new Date().getTime(), 'YYYY.MM.DD');
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/css/mixin.scss';
.search-bar {
  border: 1px solid #ebedf0;
  border-left: none;
  border-right: none;
}
.card-list {
  background: #ffffff;
  li {
    list-style: none;
    padding: 15px 20px;
    position: relative;
    @include clearfix;
    img {
      float: left;
      width: 52px;
      height: 52px;
      margin-right: 10px;
    }
    .card-content {
      float: left;
      width: calc(100% - 62px);
      h3 {
        font-size: 14px;
        font-weight: bold;
        color: #1f232f;
        margin-bottom: 5px;
        max-width: 80%;
        white-space: normal;
        line-height: 20px;
      }
      span {
        display: inline-block;
        color: #5b5e67;
        max-width: 100%;
        line-height: 16px;
        margin-bottom: 4px;
        &.card-note {
          width: 100%;
          max-width: 100%;
          background: #f8f8f8;
          color: #62656d;
          line-height: 20px;
          padding: 5px 10px;
          white-space: normal;
          margin-top: 4px;
        }
        &.card-time {
          background: url('../../../../static/imgs/bm-date.png') no-repeat 10px 4px
            rgba(250, 172, 22, 0.2);
          background-size: 15px 15px;
          padding: 4px 15px 4px 30px;
          border-radius: 10px;
          color: #faac16;
          margin-bottom: 10px;
        }
      }
    }
    .card-btns {
      position: absolute;
      top: 15px;
      right: 20px;
      .van-button {
        border-radius: 5px;
      }
    }
  }
}

/deep/ .van-nav-bar__text {
  color: #00b09b;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
</style>