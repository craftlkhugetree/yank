<template>
  <div style="margin-bottom:44px;">
    <van-nav-bar ref="navBar" title="资源详情" :border="false" left-arrow @click-left="goBack" />
    <div class="res-detail">
      <div class="res-detail-title">
        <h2>编号：{{resDetail.rescode}}</h2>
        <van-row gutter="20">
          <van-col span="12">
            <img src="../../../../static/imgs/bm-res-area.png" alt />
            <span>面积</span>
            <span>{{resDetail.area}} m²</span>
          </van-col>
          <van-col span="12">
            <img src="../../../../static/imgs/bm-res-price.png" alt />
            <span>单价</span>
            <span>{{common.money(resDetail.price)}} 元/{{restypeDetail.chargecycle}}/{{restypeDetail.chargetype}}</span>
          </van-col>
        </van-row>
        <van-row>
          <van-col>
            <img src="../../../../static/imgs/bm-res-base.png" alt />
            <span>设施</span>
            <span>{{resDetail.baseListName}}</span>
          </van-col>
        </van-row>
      </div>
      <div class="res-detail-content">
        <div class="res-detail-box">
          <div v-if="curUseDetail.id">
            <div class="res-use-icon">
              <van-icon name="checked" color="#fff"></van-icon>已入驻
            </div>
            <h2>{{curUseDetail.orgname}}</h2>
            <div class="res-detail-box-rows">
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">课题组</p>
                  <p>{{curUseDetail.classname}}</p>
                </van-col>
                <van-col span="14">
                  <p class="label">项目名称</p>
                  <p class="ellipsis">{{curUseDetail.projectname}}</p>
                </van-col>
              </van-row>
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">申请人</p>
                  <p>
                    <img src="../../../../static/imgs/bm-res-man.png" alt />
                    {{curUseDetail.applyername}}
                  </p>
                </van-col>
                <van-col span="14">
                  <p class="label">联系电话</p>
                  <p>
                    <img src="../../../../static/imgs/bm-res-phone.png" alt />
                    {{curUseDetail.applyermobile}}
                  </p>
                </van-col>
              </van-row>
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">课题组负责人</p>
                  <p>
                    <img src="../../../../static/imgs/bm-res-man.png" alt />
                    {{curUseDetail.classleadername}}
                  </p>
                </van-col>
                <van-col span="14">
                  <p class="label">负责人联系电话</p>
                  <p>
                    <img src="../../../../static/imgs/bm-res-phone.png" alt />
                    {{curUseDetail.classleadermobile}}
                  </p>
                </van-col>
              </van-row>
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">项目来源</p>
                  <p>{{curUseDetail.projectfrom}}</p>
                </van-col>
                <van-col span="14">
                  <p class="label">项目经费(万元)</p>
                  <p class="ellipsis">{{curUseDetail.projectprice}}</p>
                </van-col>
              </van-row>
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">项目概况</p>
                  <p>{{curUseDetail.projectnote}}</p>
                </van-col>
                <van-col span="14">
                  <p class="label">实验概况</p>
                  <p>{{curUseDetail.situation}}</p>
                </van-col>
              </van-row>
              <van-row gutter="20">
                <van-col span="10">
                  <p class="label">入驻时间</p>
                  <p>{{common.formatTime(curUseDetail.applytime,"YYYY.MM.DD hh:mm")}}</p>
                </van-col>
                <van-col span="14">
                  <p class="label">退出时间</p>
                  <p>{{common.formatTime(curUseDetail.applyendtime,"YYYY.MM.DD hh:mm")}}</p>
                </van-col>
              </van-row>
            </div>
          </div>
          <div v-else>
            <div class="res-use-icon-no">
              <van-icon name="clock" color="#fff"></van-icon>
              {{common.useStateFormatter("","",resDetail.usestatus)}}
            </div>
            <div class="res-detail-box-rows" style="color:#faac16;">暂无入驻信息</div>
          </div>
        </div>
      </div>
    </div>
    <!-- tab标签页 -->
    <div class="tabs" ref="tableTabs">
      <li
        style="width:50%;"
        :class="{'active': activeTableTab === item.value}"
        v-for="item in tabs"
        :key="item.value"
        @click="activeTableTab = item.value;tableData = [];"
      >{{item.text}}</li>
    </div>
    <div class="tabs-bottom"></div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%;" :height="tableHeight">
      <el-table-column
        prop="createtime"
        label="记录时间"
        align="center"
        :formatter="common.dateFormatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="showv" :label="activeTableTab === '1' ? '数值(吨)' : '数值(度)'" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" :label="activeTableTab === '1' ? '单价(元/吨)' : '单价(元/度)'" align="center" show-overflow-tooltip :formatter="common.moneyFormatter"></el-table-column>
      <el-table-column prop="cost" label="费用(元)" align="center" show-overflow-tooltip :formatter="common.moneyFormatter"></el-table-column>
      <el-table-column
        prop="classleadername"
        label="付方"
        v-if="resDetail.usestatus === '3'"
        align="center"
        show-overflow-tooltip
        :formatter="common.defaultFormatter"
      ></el-table-column>
      <el-table-column
        prop="paystatus"
        label="缴费状态"
        v-if="resDetail.usestatus === '3'"
        align="center"
        :formatter="common.payFormatter"
        show-overflow-tooltip
      ></el-table-column>
      <!-- 无限加载 -->
      <div slot="append">
        <van-loading v-show="loading" type="spinner" color="#b6bdc6" />
        <p v-show="!finishTable && !loading" @click="getMoreData">点击加载更多</p>
        <p v-show="finishTable && tableData.length > 0" style="cursor:none;">到底啦</p>
      </div>
    </el-table>
    <!-- 按钮 -->
    <div class="form-btns" ref="btns">
      <van-button style="width:100%;" type="default" @click="goBack">返回</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTableTab: "1",
      tabs: [
        { text: "水表", value: "1" },
        { text: "电表", value: "2" }
      ],
      resDetail: {},
      restypeDetail: {},
      useList: [],
      curUseDetail: {},
      currentPage: 1,
      limit: 10,
      tableData: [],
      tableHeight: 0,
      loading: false,
      finishTable: false
    };
  },
  watch: {
    activeTableTab() {
      this.getList(1);
    }
  },
  props: {
    restypeid: String,
    id: String
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    // 加载更多数据
    getMoreData() {
      this.getList(this.currentPage + 1).then(list => {
        this.tableData = this.tableData.concat(list);
      });
    },
    // 获取水电表列表
    getList(page) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this.util
          .postAjax({
            code: this.global.bmCode,
            url: "/spreselec/pageList?date=" + new Date().getTime(),
            data: {
              params: JSON.stringify({
                page: page,
                limit: this.limit,
                resid: this.id,
                type: this.activeTableTab
              })
            }
          })
          .then(res => {
            this.loading = false;
            if (res.success == true) {
              let list = res.items || [];
              if (page === 1) {
                this.tableData = list;
              }
              this.finishTable = list.length < this.limit ? true : false;
              this.currentPage = page;
              resolve(list);
            } else {
              // this.finishTable = true;
              this.$toast.fail("获取数据失败" + '\n' + res.message);
              reject(res);
            }
          })
          .catch(err => {
            this.loading = false;
            // this.finishTable = true;
            // this.$toast.fail("获取数据失败" + '\n' + err);
            reject(err);
          });
      });
    },
    // 获取资源详情
    getResDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/spres/findById",
          data: {
            id: this.id
          }
        })
        .then(res => {
          if (res.success) {
            this.resDetail = res.item || {};
            this.resDetail.baseListName = this.resDetail.baseList
              .map(i => i.name)
              .join(",");
          } else {
            this.$toast.fail("获取数据失败" + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + '\n' + err);
        });
    },
    // 获取资源类型详情
    getResTypeDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/sprestype/findById",
          data: {
            id: this.restypeid
          }
        })
        .then(res => {
          if (res.success) {
            this.restypeDetail = res.item || {};
            this.restypeDetail.chargecycle = this.common.chargecycleFormatter(
              res.item.chargecycle
            );
            this.restypeDetail.chargetype = this.common.chargetypeFormatter(
              res.item.chargetype,
              "unit"
            );
          } else {
            this.$toast.fail("获取数据失败" + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + '\n' + err);
        });
    },
    // 获取入驻记录
    getUseDetail() {
      this.util
        .postAjax({
          code: this.global.bmCode,
          url: "/spresliveinfo/pageList?date=" + new Date().getTime(),
          data: {
            params: JSON.stringify({
              resid: this.id
            })
          }
        })
        .then(res => {
          if (res.success) {
            this.useList = res.items || [];
            this.curUseDetail = this.useList.filter(i => !i.endtime)[0] || {};
          } else {
            this.$toast.fail("获取数据失败" + '\n' + res.message);
          }
        })
        .catch(err => {
          // this.$toast.fail("获取数据失败" + '\n' + err);
        });
    },
    // 设置表格的高度
    setTableHeight() {
      this.$nextTick(() => {
        let domHeight = document.documentElement.clientHeight;
        let btnsHeight = this.$refs.btns.offsetHeight;
        this.tableHeight = domHeight - btnsHeight;
      });
    }
  },
  created() {
    // 获取资源类型详情
    this.getResTypeDetail();
    // 获取资源详情
    this.getResDetail();
    // 获取入驻记录
    this.getUseDetail();
    // 获取列表
    this.getList(1);
  },
  mounted() {
    // 设置表格高度
    this.setTableHeight();
  }
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
</style>