<template>
  <div style="margin-bottom:44px;">
    <van-nav-bar
      ref="navBar"
      title="资源详情"
      :border="false"
      left-arrow
      @click-left="goBack"
      right-text="功能首页"
      @click-right="$router.push('/fun-module')"
    />
    <div class="res-detail">
      <div class="res-detail-title">
        <h2>编号：{{ resDetail.name }}</h2>
        <van-row gutter="20">
          <van-col span="12">
            <img src="../../../../static/imgs/bm-res-area.png" alt />
            <span>面积</span>
            <span>{{ resDetail.area }} m²</span>
          </van-col>
          <van-col span="12">
            <img src="../../../../static/imgs/bm-res-price.png" alt />
            <span>单价</span>
            <span>
              {{ common.money(resDetail.price) }} 元/{{ restypeDetail.chargecycle }}/{{
                restypeDetail.ct2
              }}
            </span>
          </van-col>
        </van-row>
        <van-row>
          <van-col>
            <img src="../../../../static/imgs/bm-res-base.png" alt />
            <span>设施</span>
            <span>{{ resDetail.ownInfrastructure }}</span>
          </van-col>
        </van-row>
      </div>
      <div class="res-detail-content">
        <div
          class="res-detail-box"
          v-for="item in liveList.slice(0, 1)"
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
              已退租
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
                <p class="label">退租时间</p>
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
        <div v-if="!isMine && liveList.length" class="all-res-here" @click="gotoAll">
          <span>查看全部入驻信息</span>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div v-if="!liveList.length" class="res-detail-box">
          <div class="res-use-icon-no">
            <van-icon name="clock" color="#fff"></van-icon>
            {{ common.useStateFormatter('', '', resDetail.useState) }}
          </div>
          <div class="res-detail-box-rows" style="color:#faac16;">暂无入驻信息</div>
        </div>
      </div>
    </div>
    <!-- tab标签页 -->
    <div class="tabs" ref="tableTabs">
      <li
        :style="{ width: isMine || isIdle ? '50%' : '25%' }"
        :class="{ active: activeTableTab === item.value }"
        v-for="item in tabs"
        :key="item.value"
        @click="
          activeTableTab = item.value;
        "
      >
        {{ item.text }}
      </li>
      <van-button
        size="small"
        icon="plus"
        round
        type="primary"
        @click="addRecord({ eduResourceId: id }, 'add')"
        v-if="!(isMine || isIdle)"
      >
        新增记录
      </van-button>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" :height="tableHeight" ref="feeTable">
      <!-- stripe -->
      <el-table-column
        prop="createTime"
        label="记录时间"
        align="center"
        :formatter="timeFormatter"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="priceNum"
        :label="activeTableTab == 3 ? '数值(吨)' : '数值(度)'"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="price"
        :label="activeTableTab == 3 ? '单价(元/吨)' : '单价(元/度)'"
        align="center"
        :formatter="common.moneyFormatter"
        width="100"
      ></el-table-column>

      <el-table-column
        prop="amount"
        label="费用(元)"
        align="center"
        :formatter="common.moneyFormatter"
        width="100"
      ></el-table-column>
      <el-table-column prop="payerName" label="付方" align="center" width="100"></el-table-column>
      <el-table-column prop="photos" label="图片" align="center" width="100">
        <template slot-scope="scope">
          <div v-if="!scope.row.photos">--</div>
          <el-image
            v-else
            :src="fileUrl + scope.row.photos"
            :preview-src-list="[fileUrl + scope.row.photos]"
            fit="contain"
            style="
                width: 50px;
                height: 50px;"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="isPay" label="缴费状态" align="center" width="150">
        <template slot-scope="scope">
          <span :class="scope.row.isPay == 0 ? 'status-orange' : 'status-green'">
            {{ common.payFormatter('', '', scope.row.isPay + '') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="payTime"
        label="缴费时间"
        align="center"
        width="150"
        :formatter="timeFormatter"
      ></el-table-column>

      <el-table-column
        key="caozuo"
        v-if="!(isMine || isIdle) && tableData.some(a => a.isPay == 0)"
        label="操作"
        fixed="right"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <span
            v-show="scope.row.isPay == '0' && isFirstRecord(scope)"
            style="color:#faac16;padding:0 5px;font-weight:bold"
            @click="addRecord(scope.row, 'edit')"
          >
            编辑
          </span>
          <span
            v-show="scope.row.isPay == '0' && isFirstRecord(scope)"
            style="color:#fe3e61;padding:0 5px;font-weight:bold"
            @click="deletetr(scope.row)"
          >
            删除
          </span>
          <span
            v-show="scope.row.isPay == '0' && scope.row.amount != 0"
            style="color:#1788fb;padding:0 5px;font-weight:bold"
            @click="payment(scope.row)"
          >
            缴费
          </span>
        </template>
      </el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && tableData.length" style="cursor:none;">到底啦</p>
      </div>
    </el-table>

    <!-- 按钮 -->
    <div class="form-btns" ref="btns">
      <van-button style="width:100%;" type="default" @click="goBack" v-if="isIdle">返回</van-button>
      <div v-else-if="isMine">
        <van-button type="default" style="width:33%;" @click="goBack">返回</van-button>
        <van-button type="default" style="width:34%;" @click="toCheckOut">退租</van-button>
        <van-button type="primary" style="width:33%;" @click="toExtend">续租</van-button>
      </div>
      <div v-else>
        <van-button
          type="default"
          @click="goBack"
          :style="resDetail.useState == '1' ? '' : { width: '100%' }"
        >
          返回
        </van-button>
        <van-button type="primary" @click="toQuit(1)" v-if="resDetail.useState == '1'">
          强制退租
        </van-button>
      </div>
    </div>
    <!-- 是否确定退租 -->
    <van-action-sheet
      v-model="showConfirmCheckOut"
      :actions="[{ name: '一旦退租便不可再使用，确定退租吗？', color: '#fe3e61' }]"
      @select="confirmCheckOut"
      cancel-text="取消"
    />
    <!-- 是否确定缴费 -->
    <van-action-sheet
      v-model="showConfirmPay"
      :actions="[{ name: '确定缴费', color: '#1788fb' }]"
      @select="payFee"
      cancel-text="取消"
    />
    <!-- 是否确定删除 -->
    <van-action-sheet
      v-model="showConfirmDel"
      :actions="[{ name: '此操作将永久删除该记录, 是否继续?', color: '#fe3e61' }]"
      @select="delIt"
      cancel-text="取消"
    />
    <confirm-dialog
      :diagTitle="diagTitle"
      :diagBody="diagBody"
      :dVisible="dVisible"
      :hasCancel="true"
      v-if="dVisible"
      @confirm="forceQuit"
      @dropdown="dVisible = false"
    ></confirm-dialog>
  </div>
</template>

<script>
import {
  find,
  eduResourceUserecordPageQuery,
  eduResourceAmountPageQuery,
  eduResourceFind,
  eduResourceAmountDelete,
  eduResourceAmountPay,
  eduResourceCheckoutApply,
  forceCheckoutBatch,
} from '@/assets/js/api';

export default {
  components: {
    confirmDialog: () => import('@/components/confirmDialog'),
  },
  computed: {
    isFirstRecord() {
      return function(row) {
        return 1 == this.currentPage && row.$index === 0;
        // return 1 == this.currentPage && this.tableData.findIndex(i => i.id === row.id) === 0;
      };
    },
    isMine() {
      return this.prevPage === 'my';
    },
    isIdle() {
      return this.prevPage === 'idle';
    },
    isManage() {
      return this.prevPage === 'manage';
    },
    fileUrl() {
      return this.$store.state.fileUrl;
    },
  },
  data() {
    return {
      showConfirmDel: false,
      row: {},
      showConfirmPay: false,
      dVisible: false,
      totalPage: 0,
      activeTableTab: '3',
      tabs: [
        { text: '水表', value: '3' },
        { text: '电表', value: '4' },
      ],
      resDetail: {},
      restypeDetail: {},
      liveList: [],
      // curUseDetail: {},
      currentPage: 1,
      limit: 10,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false,
      showConfirmCheckOut: false,
    };
  },
  watch: {
    activeTableTab() {
      this.getList(1);
    },
  },
  props: {
    restypeid: String,
    id: String,
    prevPage: String,
  },
  methods: {
    // 续租
    toExtend() {
      this.$router.push(`/edures-staff/res-apply/2/${this.restypeid}/${this.id}`);
    },
    // 打开退租确认框
    toCheckOut() {
      this.showConfirmCheckOut = true;
    },
    // 退租
    confirmCheckOut() {
      this.$toast.loading({
        message: '提交中...',
        forbidClick: true,
        duration: 0,
      });
      eduResourceCheckoutApply({ id: this.id })
        .then(res => {
          if (res && res.success === true) {
            this.$toast.success('已提交退租申请，请等待基地审核');
            this.showConfirmCheckOut = false;
            this.getLiveList();
          } else {
            this.$toast.fail({ message: res.message || '内部错误', duration: 3000 });
          }
          this.$toast.clear();
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail(err || '内部错误');
        });
    },
    // 缴费
    payment(row) {
      this.showConfirmPay = true;
      this.row = row;
    },
    payFee() {
      this.$toast.loading({
        message: '缴费中...',
        forbidClick: true,
        duration: 0,
      });
      eduResourceAmountPay(this.row.id)
        .then(res => {
          if (res && res.success === true) {
            this.$toast.success({ message: '缴费成功' });
            this.showConfirmPay = false;
            this.getList(1);
          } else {
            this.$toast.fail({ message: res.message || '内部错误', duration: 3000 });
          }
          this.$toast.clear();
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail(err || '内部错误');
        });
    },
    // 删除水电记录
    deletetr(row) {
      this.showConfirmDel = true;
      this.row = row;
    },
    delIt() {
      this.$toast.loading({
        message: '删除中...',
        forbidClick: true,
        duration: 0,
      });
      eduResourceAmountDelete(this.row.id)
        .then(res => {
          if (res && res.success === true) {
            this.$toast.success({ message: '删除成功' });
            this.showConfirmDel = false;
            this.getList(1);
          } else {
            this.$toast.fail({ message: res.message || '内部错误', duration: 3000 });
          }
          this.$toast.clear();
        })
        .catch(err => {
          this.$toast.clear();
          this.$toast.fail(err || '内部错误');
        });
    },
    // 增加-编辑水电
    addRecord(obj, type) {
      let t;
      if ('add' === type) {
        t = this.activeTableTab == 3 ? 'waterfee' : 'elefee';
      } else {
        t = this.activeTableTab == 3 ? 'waterEdit' : 'eleEdit';
      }
      this.toModify(obj, t);
    },
    // 查看全部入驻信息
    gotoAll() {
      let isUser = this.isIdle || this.isMine ? 1 : 0;
      this.$router.push('/edures/res-list/detail-res/' + this.id + '/' + isUser);
      // this.$router.push(
      //     '/edures/res-list/detail-res/' + this.id + '?isUser=' + isUser,
      // );
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
    //时间转换
    timeFormatter(row, column, cellValue) {
      if (!cellValue) {
        return '--';
      } else {
        return this.util.formatTime(cellValue, 'yyyy.MM.dd hh:mm');
      }
    },

    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1).then(list => {
        this.tableData = this.tableData.concat(list);
        this.finishTable = this.totalPage === this.tableData.length;
      });
    },
    // 获取水电表列表
    getList(page) {
      return new Promise((resolve, reject) => {
        const filter = { eduResourceId: this.id, priceType: this.activeTableTab };
        const params = {
          page: page || this.currentPage,
          limit: this.limit,
          filter,
        };
        eduResourceAmountPageQuery(params)
          .then(res => {
            if (res.success == true) {
              let list = res.data || [];
              this.totalPage = res.total;
              if (page === 1) {
                this.tableData = list;
              }
              this.finishTable = list.length < this.limit || list.length === res.total;
              this.currentPage = page;
              this.$nextTick(() => {
                this.$refs.feeTable.doLayout();
              });
              resolve(list);
            }
          })
          .catch(e => {});
      });
    },
    // 获取资源详情
    getResDetail() {
      eduResourceFind(this.id).then(res => {
        if (res && res.success) {
          this.resDetail = res.data;
          let arr = this.common.comma(this.resDetail, 'ownInfrastructure');
          this.resDetail.baseList = arr;
        }
      });
    },
    // 获取资源类型详情
    getResTypeDetail() {
      find(this.restypeid).then(res => {
        if (res && res.success) {
          this.restypeDetail = res.data;

          const baseList = this.common.comma(this.restypeDetail, 'infrastructure');
          this.restypeDetail.baseList = baseList.map(b => ({ name: b, id: b }));
          const attrList = this.common.comma(this.restypeDetail, 'extraAttrKey');
          this.restypeDetail.attrList = attrList.map(b => ({ name: b }));

          let chargecycle = this.restypeDetail.billingCycle + '';
          let chargetype = this.restypeDetail.billingMethod + '';
          this.common.chargecycleFormatter(chargecycle, this.restypeDetail);
          this.common.chargetypeFormatter2(chargetype, this.restypeDetail, 'ct2', 'ct1');
        }
      });
    },
    // 获取入驻记录
    getLiveList() {
      const filter = { eduResourceId: this.id };
      if (this.isMine || this.isIdle) {
        filter.owner = this.$store.state.userInfo.ID;
      }
      const params = {
        page: 1,
        limit: 10000,
        filter,
      };
      eduResourceUserecordPageQuery(params)
        .then(res => {
          if (res.success == true) {
            this.liveList = res.data || [];

            this.liveList.forEach(v => {
              let r = v.apply;
              let chargecycle = r.billingCycle + '';
              let chargetype = r.billingMethod + '';
              this.common.chargecycleFormatter(chargecycle, r);
              this.common.chargetypeFormatter2(chargetype, r, 'ct2', 'ct1');
              v.isCollapse = false;
            });
            // 该资源当前唯一入驻放在最前
            if (this.liveList.length && this.liveList[0].status != 1) {
              this.liveList.forEach((v, index) => {
                if (v.status == 1) {
                  let tmp = JSON.stringify(v);
                  this.liveList[index] = this.liveList[0];
                  this.liveList[0] = JSON.parse(tmp);
                  throw 'nth';
                }
              });
            }
          }
        })
        .catch(e => {});
    },
    // 设置表格的高度
    setTableHeight() {
      this.$nextTick(() => {
        let domHeight = document.documentElement.clientHeight;
        let btnsHeight = this.$refs.btns.offsetHeight;
        this.tableHeight = domHeight - btnsHeight;
      });
    },
    // 修改联系人和电话
    toModify(item, type) {
      this.$router.push({
        path: `/edures/res-list/modify/${type}`,
        query: {
          data: JSON.stringify(item),
          hasData: this.totalPage,
        },
      });
    },
    // 强制退租
    forceQuit() {
      forceCheckoutBatch({ ids: this.id }).then(res => {
        if (res.success == true) {
          this.$toast.success({
            message: '强制退租完成',
          });
          this.dVisible = false;
          this.getList(this.currentPage);
          this.getLiveList();
        } else {
          this.$toast.fail({
            message: res.message,
          });
        }
      });
    },
    // 退租对话框
    toQuit(num) {
      if (num == 1) {
        let str = `#${this.resDetail.name},${this.restypeDetail.name || ''} `;
        this.diagBody = `确定要强制退租资源 ${str} 吗？`;
        this.diagTitle = '确认要强制退租吗？';
      } else {
        this.diagBody = '一旦退租后便不可再使用，确定退租吗？';
        this.diagTitle = '确认退租？';
      }
      this.dVisible = true;
    },
  },
  created() {
    // 获取资源类型详情
    this.getResTypeDetail();
    // 获取资源详情
    this.getResDetail();
    // 获取入驻记录
    this.getLiveList();
    // 获取列表
    this.getList(1);
  },
  mounted() {
    // 设置表格高度
    this.setTableHeight();
  },
  beforeCreate() {
    sessionStorage.removeItem('activeName');
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  position: relative;
  .van-button {
    position: absolute;
    top: 4px;
    right: 15px;
    height: 28px;
    width: 100px;
  }
}

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
.all-res-here {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 40px;
  background: #e2e2e2;
  border-radius: 6px;
  margin: 10px 0;
  padding: 0 20px;
  span {
    margin-right: auto;
    width: 112px;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #383a48;
    line-height: 20px;
  }
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
