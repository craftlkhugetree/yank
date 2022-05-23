<template>
  <div class="base-search-table">
    <div class="search-box clearfix">
      <h3>分配座位</h3>
      <div class="search-box-right">
        <span class="title-reload" @click="reload">
          <i class="el-icon-refresh-right">&nbsp; &nbsp;重置</i>
        </span>
      </div>

      <el-divider></el-divider>
      <div class="map-content">
        <section class="section">
          <span class="h3-title">{{ row.name }}【{{ row.location }}】</span>
          <el-tag type="warning" v-if="row.islocakers == 1">有柜子</el-tag>
          <seat-map
            ref="seatSet"
            :detailData="seatDeatil"
            @chooseSeat="chSeat"
          ></seat-map>
        </section>

        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="已选位置" required="">
            <span style="color: #999999" v-if="showTag">{{ form.name }}</span>
            <el-tag
              :key="form.name"
              closable
              type="info"
              @close="closeTag(form)"
              v-if="!showTag"
            >
              {{ form.name }} 号座</el-tag
            >
          </el-form-item>
          <el-form-item label="选择时间段" required="">
            <template v-if="selectTimes.length">
              <el-tag
                :key="v.starttime + index"
                closable
                type="info"
                @close="closeTimeTag(v, index)"
                v-for="(v, index) in selectTimes"
                style="margin-right: 5px"
              >
                {{ (v.orderdate || startdate) + " "
                }}{{ v.starttime.substring(0, 2) }}:{{
                  v.starttime.substring(2, 4)
                }}～{{ v.endtime.substring(0, 2) }}:{{
                  v.endtime.substring(2, 4)
                }}</el-tag
              >
            </template>
            <el-button :disabled="!seat" type="primary" plain @click="openTime" size="small"
              >去选择</el-button
            >
          </el-form-item>
          <el-form-item label="选择预分配人" required="">
            <el-autocomplete
              v-model="form.user"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>

          <el-form-item style="float: right">
            <el-button type="primary" @click.stop="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <time-choose
        :startdate="startdate"
        :enddate="enddate"
        @submit="transTime"
        :selectTimes="selT"
        ref="timeRef"
      ></time-choose>
    </div>
  </div>
</template>

<script>
import { querySectionSeats } from "@/api/manage/section";
import { fetchUserList } from "@/api/admin/roles";
import { adminOrder } from "@/api/manage/order";
export default {
  props: {
    row: Object,
  },
  components: {
    seatMap: () => import("./seatMap.vue"),
    timeChoose: () => import("./timeChoose.vue"),
  },
  data() {
    return {
      showTag: true,
      form: { name: "请点击座位选择", timeArr: [], user: "" },
      dialogVisible: false,
      seatDeatil: [],
      selectTimes: [], //已经选择的时间段times: [],
      selT: [],
      userList: [],
      userId: "",
      userName: "",
      seat: null,
      startdate: "",
      enddate: "",
    };
  },
  mounted() {
    this.querySectionSeats(this.row);
  },
  methods: {
    transTime(arr) {
      let that = this;
      const selectTimes = arr.filter((a) => a.selected);
      this.selT = _.cloneDeep(selectTimes);
      this.selectTimes = selectTimes.map((s) => ({
        starttime: s.starttime,
        endtime: s.endtime,
        orderdate: that.eraseDateDash(s.weekday || that.startdate),
      }));
    },
    openTime() {
      this.$refs.timeRef.queryOpenTime(
        this.row,
        this.seat,
        this.startdate,
        this.enddate
      );
      // this.$refs.timeRef.genData();
    },

    querySearchAsync(queryString, cb) {
      this.fetchUserList(queryString, cb);
    },
    handleSelect(item) {
      this.userId = item.ID;
      this.userName = item.NAME;
    },
    fetchUserList(queryString, cb) {
      let _this = this;
      fetchUserList({
        page: 1,
        limit: 1000,
        filter: JSON.stringify({ KEYWORD: queryString }),
      }).then((res) => {
        if (res && res.success) {
          _this.userList = res.items;
          _this.userList.forEach((u) => {
            u.value = u.NAME + ` (${u.ID || ""})`;
          });
          cb(_this.userList);
        }
      });
    },
    chSeat(val) {
      this.form.name = val.name;
      this.seat = val;
      this.showTag = false;
    },
    eraseDateDash(date) {
      return date.split("-").join("");
    },
    onSubmit() {
      if (!this.seat) {
        this.$message({
          type: "warning",
          message: "请先选择座位",
        });
        return;
      }
      if (!this.selectTimes.length) {
        this.$message({
          type: "warning",
          message: "请先选择时间",
        });
        return;
      }
      if (!this.userName) {
        this.$message({
          type: "warning",
          message: "请先选择人员",
        });
        return;
      }

      const param = {
        ruleid: this.row.ruleid, // (string, optional): 规则ID ,
        seatid: this.seat.id, // (string, optional): 座位ID ,
        seatname: this.form.name, // (string, optional): 座位名称 ,
        sectionid: this.row.sectionid, // (string, optional): 区间ID ,
        sectionname: this.row.name, // (string, optional): 区间名称 ,
        startdate: this.eraseDateDash(this.startdate), // (string, optional): 周期开始日期 ,
        enddate: this.eraseDateDash(this.enddate), // (string, optional): 周期结束日期 ,
        times: this.selectTimes, // (Array[TimeDto], optional): 预约时间段 ,
        type: "1", // (string, optional): 1预约2选座 ,
        userid: this.userId, // (string, optional): 用户id ,
        username: this.userName, // (string, optional): 用户姓名
      };
  
      adminOrder(param).then((res) => {
        if (res && res.success) {
          this.$message({
            type: "success",
            message: res.message || res.data.message,
          });
          this.querySectionSeats(this.row);
        } else {
          this.$message({
            type: "warning",
            message: res.message || res.data.message,
          });
        }
      });
    },
    closeTimeTag(v, id) {
      this.selectTimes.splice(id, 1);
      this.selT.splice(id, 1);
      this.selectTimes = [...this.selectTimes];
      this.selT = [...this.selT];
    },
    closeTag(form) {
      this.showTag = true;
      this.seatDeatil = [...this.seatDeatil];
      this.form.name = "请点击座位选择";
      this.seat = null;
    },
    reload() {
      this.form = { name: "请点击座位选择", timeArr: [], user: "" };
      this.userId = "";
      this.userName = "";
      this.selectTimes = [];
      this.selT = [];
      this.closeTag();
    },
    // 获取座位信息
    querySectionSeats(row) {
      this.reload();
      const date = (row.opendate && row.opendate.split("|")) || [];
      const startdate = date[0];
      const enddate = date.length > 1 ? date[1] : date[0];
      const obj = { sectionid: row.id, startdate, enddate };
      this.startdate = startdate;
      this.enddate = enddate;
      querySectionSeats(obj).then((res) => {
        if (res && res.success) {
          this.seatDeatil = _.cloneDeep(res.data);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.base-search-table {
  min-height: calc(100% - 20px);
  margin: 0 20px 20px 0;
  background: #ffffff;
  h3 {
    color: #333333;
    font-size: 20px;
    font-weight: bolder;
  }
}

.h3-title {
  width: auto;
  white-space: nowrap;
  margin-right: 10px;
  line-height: 30px;
}
.search-box-right {
  position: relative;
  .title-reload {
    cursor: pointer;
  }
}

.map-content {
  width: 90%;
  margin: 0 auto;
  justify-content: center;
  overflow: auto;
}

/deep/ .el-divider {
  margin: 0;
}
</style>
