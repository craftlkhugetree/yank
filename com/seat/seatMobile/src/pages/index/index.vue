<template>
  <div class="index_content">
    <div class="index_tab">
      <ul>
        <li v-for="(v,i) in tablist" :key="i" @click="godetail(v.id)">
          <div v-if="v.id==1" class="appoint"></div>
          <div v-if="v.id==2" class="monitor"></div>
          <div v-if="v.id==3" class="rules"></div>
          <div v-if="v.id==4" class="notice"></div>
          <p>{{v.name}}</p>
        </li>
      </ul>
    </div>
    <div class="sign_box" v-if="signList">
      <h3>签到提醒</h3>
      <div>
        <i class="location"></i>
        {{signList.sectionname}} {{signList.seatname}}号座
      </div>
      <div>
        <i class="time"></i>
        今日 {{signList.signStarttime.substring(8,10)}}:{{signList.signStarttime.substring(10,12)}}:{{signList.signStarttime.substring(12,14)}}～{{signList.signEndtime.substring(8,10)}}:{{signList.signEndtime.substring(10,12)}}:{{signList.signEndtime.substring(12,14)}}
      </div>
      <i class="sign-tips" v-if="IsOnlyWXSign">请用微信扫一扫签到！</i>
      <span v-else @click="sign(signList.id)">立刻签到</span>
    </div>
    <div class="using" v-if="usingDetail">
      <div class="using_title clearfix">
        <div class="using_pic clearfix">
          <span>使用中</span>
          <em></em>
        </div>
        <!-- <div class="using_time">剩余使用时间 <i>02</i><em>:</em><i>02</i>&nbsp;<em>:</em>&nbsp;<i>02</i></div> -->
      </div>
      <div class="using_detail">
        <h3>
          {{usingDetail.sectionname}} {{usingDetail.seatname}}号座
          <span @click="seeSeatMap">
            座位地图
            <i></i>
          </span>
        </h3>
        <p>{{usingDetail.starttime.substring(0,2)}}:{{usingDetail.starttime.substring(2,4)}}～{{usingDetail.endtime.substring(0,2)}}:{{usingDetail.endtime.substring(2,4)}}</p>
      </div>
      <div class="line"></div>
      <div class="using_bottom clearfix" v-if="usingDetail.status==1">
        <div @click="leaveSeat">暂 离</div>
        <div @click="cancelSeat">退 座</div>
      </div>
      <div class="using_bottom using_bottom1 clearfix" v-if="usingDetail.status==2">
        <div @click="cancelSeat">退 座</div>
      </div>
    </div>
    <div class="now_appoint" v-if="currentOrders.length>0">
      <h3>当前预约</h3>
      <div class="clearfix" v-for="(v,i) in currentOrders" :key="i">
        <div class="appoint_left" @click="seeTimedetail(v)">
          <h3>{{v.sectionname}} {{v.seatname}}号座</h3>
          <p
            v-if="v.dayfilter.length>1"
          >{{v.dayfilter[0].substring(0,4)}}-{{v.dayfilter[0].substring(4,6)}}-{{v.dayfilter[0].substring(6,8)}}~{{v.dayfilter[v.dayfilter.length-1].substring(0,4)}}-{{v.dayfilter[v.dayfilter.length-1].substring(4,6)}}-{{v.dayfilter[v.dayfilter.length-1].substring(6,8)}}</p>
          <p
            v-else
          >{{v.dayfilter[0].substring(0,4)}}-{{v.dayfilter[0].substring(4,6)}}-{{v.dayfilter[0].substring(6,8)}}</p>
          <span>
            查看详情
            <i></i>
          </span>
        </div>
        <div class="appoint_calcel" @click="cancelTime(v)">
          <div></div>
          <p>取消</p>
        </div>
      </div>
    </div>
    <div class="now_appoint nowno_appoint" v-else>
      <h3>当前预约</h3>
      <div>
        <div></div>
        <p @click="goAppoint">
          暂无预约，去预约
          <van-icon name="arrow" size="16" />
        </p>
      </div>
    </div>
    <div class="now_emptyseat">
      <h3>当前空座</h3>
      <div>
        <div class="commom_seat clearfix" v-if="mycommonLists.length>0">
          <div v-for="(v,i) in mycommonLists" :key="i">
            <h3>
              {{v.seatname}}号座
              <span>常用座位</span>
            </h3>
            <p>{{v.sectionname}}</p>
            <span
              v-if="!isBlack && showList"
              :class="{'noseat':v.canuse==0||v.sectionstatus!=1}"
              @click="goOccupy(v)"
            >{{v.canuse==1?'选座':'被选'}}</span>
            <span v-else class="isBlack">{{v.canuse==1?'选座':'被选'}}</span>
          </div>
        </div>
        <!-- <div class="occupy_seat"> -->
        <van-list
          class="occupy_seat"
          v-if="showList"
          v-model="indexLoading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getoccupyList"
        >
          <div>
            <div class="single_occupy_seat" v-for="(v,i) in occupyList" :key="i">
              <h3 v-if="v.islocakers==1">
                <span>{{v.name}}</span>
                <i>有柜子</i>
              </h3>
              <h3 v-else>{{v.name}}</h3>
              <p v-if="v.opentime">开放时间：{{v.starttime}}～{{v.endtime}}</p>
              <p v-if="!v.opentime">没有可用时间段</p>
              <h4 v-if="v.opentime" :class="{'fulltext':v.unusenum==0}">当前剩余：{{v.unusenum}}座</h4>
              <i
                @click="goOccupy(v)"
                :class="{'isBlack':isBlack}"
                v-if="v.unusenum!=0 && v.opentime"
              >选座</i>
              <i class="full" v-if="v.unusenum==0|| !v.opentime">满座</i>
              <!-- <i class="isBlack" v-if="isBlack">选座</i> -->
            </div>
            <div class="occupySeat_line"></div>
          </div>
        </van-list>
        <div v-else class="nodata">当前暂无可选座列表</div>
        <!-- </div> -->
      </div>
    </div>
    <!-- 暂离弹窗 -->
    <van-overlay :show="showLeave">
      <div class="Leavewrapper" @click.stop>
        <div>
          <div class="img"></div>
          <h3>选择暂离类型：</h3>
          <p @click="diningLeave('2')" :class="{'noleave':!candineLeave}">就餐暂离</p>
          <p @click="diningLeave('1')" :class="{'noleave':!cantemporaryLeave}">临时暂离</p>
          <div class="close" @click="closeshowLeave"></div>
        </div>
      </div>
    </van-overlay>
    <!-- 座位地图 -->
    <!-- <van-overlay :show="seatMap"> -->
    <div v-if="seatMap" class="seatMapmeng">
      <div class="seatMapwrapper" @click.stop>
        <div>
          <h3>{{usingDetail.sectionname}}</h3>
          <div>
            <div class="seatDetail" :class="{'scale':isScale}" v-pinch="pinchCtrl">
              <ul class="clearfix" v-for="(items,index) in seatDeatil">
                <li
                  v-for="(itemss, indexs) in items"
                  :class="[{'myselected':itemss.selected},'type'+itemss.type]"
                  @click="selectSeat(itemss)"
                >{{itemss.type==1?itemss.name:''}}</li>
              </ul>
            </div>
          </div>
          <p>
            <span>
              <i class="wall"></i>墙
            </span>
            <span>
              <i class="window"></i>窗
            </span>
            <span>
              <i class="door"></i>门
            </span>
            <span>
              <i class="pass"></i>过道
            </span>
            <span>
              <i class="pillar"></i>柱子
            </span>
          </p>
          <div class="close" @click="closeseatMap"></div>
        </div>
      </div>
    </div>
    <!-- </van-overlay> -->
    <!-- 取消的时间段弹窗 -->
    <!-- <van-overlay :show="showtime" v-if="showtime"> -->
    <div class="showtimemeng" v-if="showtime">
      <timeselect
        @closetimeselect="closetimeselect"
        :currentcancelTime="currentcancelTime"
        :appointTime="appointTime"
        :appoint="isappoint"
        :cancelAppoint="cancelAppoint"
        :isDetail="isDetail"
      ></timeselect>
    </div>
    <!-- </van-overlay> -->
  </div>
</template>
<script>
import timeselect from "@/components/timeselect";
import wx from "weixin-js-sdk";
export default {
  components: {
    timeselect
  },
  data() {
    return {
      IsOnlyWXSign: window.base.IsOnlyWXSign,
      noticeText:
        "公告正文内容不超过一行公告正文内容不超过一行公告正文内容不超过一行公告正文内容不超过一行…",
      tablist: [
        { name: "预约座位", id: 1 },
        { name: "监督举报", id: 2 },
        { name: "规章制度", id: 3 },
        { name: "通知公告", id: 4 }
      ],
      page: 1,
      limit: 10,
      showLeave: false,
      seatMap: false,
      showtime: false,
      occupyList: [],
      currentOrders: [], //当前预约列表
      currentcancelTime: [], //当前取消的时间段
      isDetail: false,
      signList: "", //签到提醒
      usingDetail: "", //使用中
      lunchStart: "",
      lunchEnd: "",
      dinnerStart: "",
      dinnereND: "",
      listShowTime: "", //占座展示时间点
      showList: false, //是不是显示占座列表
      leaveNum: 0, //每日临时暂离的次数
      candineLeave: false,
      cantemporaryLeave: false,
      showLeaveBtn: true, //是不是显示暂离按钮
      nowdata: "",
      seatDeatil: "", //座位地图得详情
      Opentime: [], //
      isappoint: false, //是预约还是占座进去的选择时间
      cancelAppoint: false,
      mycommonLists: [],
      detailtimeArr: [], //详情的数据
      indexLoading: true,
      finished: false,
      isBlack: "",
      sha1: "",
      appointTime: null,
      Base64: "",
      signid: "",
      isScale: false,
      scanType: 'wx_normal'
    };
  },
  methods: {
    pinchCtrl: function(e) {
      if (e === "pinchin") {
        console.log("捏合");
        this.isScale = false;
      }
      if (e === "pinchout") {
        console.log("扩大");
        this.isScale = true;
      }
    },
    godetail(id) {
      if (id == 1) {
        this.$router.push("appoint");
      } else if (id == 2) {
        this.$router.push("monitor");
      } else if (id == 3) {
        this.$router.push("rule");
      } else if (id == 4) {
        this.$router.push("notice");
      }
    },
    goAppoint() {
      this.$router.push("appoint");
    },
    getoccupyList() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.PickList,
          data: {
            filter: {
              ORDERUNIT: "none"
            },
            limit: this.limit,
            page: this.page
          },
          isRep: true
        })
        .then(res => {
          if (res.success) {
            var data = res.data;
            // this.occupyList = res.data;
            if (data.length < this.limit || data.length === 0) {
              this.indexLoading = false;
              this.finished = true;
            } else {
              this.indexLoading = false;
              this.page++;
              this.finished = false;
            }
            data.forEach(e => {
              if (e.opentime) {
                e.starttime =
                  e.opentime.split("|")[0].substring(0, 2) +
                  ":" +
                  e.opentime.split("|")[0].substring(2, 4);
                e.endtime =
                  e.opentime.split("|")[1].substring(0, 2) +
                  ":" +
                  e.opentime.split("|")[1].substring(2, 4);
              }
              this.occupyList.push(e);
            });
          }
        });
    },
    getcurrentOrders() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.currentOrders,
          isRep: true
        })
        .then(res => {
          if (res.success) {
            var currentLists = res.data;
            this.currentOrders = [];
            let tempArr = [];
            currentLists.forEach(e => {
              // if(e.type==2){//表示占座
              e.onlyid = e.sectionid + "" + e.seatid;
            });
            // console.log('currentLists', currentLists)
            for (let i = 0; i < currentLists.length; i++) {
              if (tempArr.indexOf(currentLists[i].onlyid) === -1) {
                this.currentOrders.push({
                  onlyid: currentLists[i].onlyid,
                  orderdate:
                    currentLists[i].orderdate.substring(0, 4) +
                    "-" +
                    currentLists[i].orderdate.substring(4, 6) +
                    "-" +
                    currentLists[i].orderdate.substring(6, 8),
                  sectionname: currentLists[i].sectionname,
                  location: currentLists[i].location,
                  seatname: currentLists[i].seatname,
                  islocakers: currentLists[i].islocakers,
                  type: currentLists[i].type,
                  origin: [currentLists[i]]
                });
                tempArr.push(currentLists[i].onlyid);
              } else {
                for (let j = 0; j < this.currentOrders.length; j++) {
                  if (this.currentOrders[j].onlyid == currentLists[i].onlyid) {
                    this.currentOrders[j].origin.push(currentLists[i]);
                    break;
                  }
                }
              }
            }

            this.currentOrders.forEach(e => {
              e.dayfilter = [];
              e.origin.forEach(ee => {
                if (e.dayfilter.indexOf(ee.orderdate) == -1) {
                  e.dayfilter.push(ee.orderdate);
                }
              });
              e.dayfilter.sort();
            });
            // console.log(this.currentOrders)
          }
        });
    },
    getsignRemind() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.signRemind,
          isRep: true
        })
        .then(res => {
          if (res.success) {
            if (res.data) {
              this.signList = res.data;
            } else {
              this.signList = "";
            }
          }
        });
    },
    //点击签到时，跳转至签到页
    sign(id) {
	  if (this.scanType === 'wx_uniapp_mp') {
        // uniapp小程序直接跳到打开扫一扫页面
        jWeixin.miniProgram.navigateTo({
          url: window.base.uniapp_mp_scan,
          events: {
            toAppointment: res => {
              const code = res.code
              window.open(code)
            }
          }
        })
      } else {
        this.util.scanqrcode(url => {
          window.open(url);
        });
      }
    },

    getUseing() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.isuseing,
          isRep: true
        })
        .then(res => {
          if (res.success) {
            if (res.data) {
              this.usingDetail = res.data;
            }
          }
        });
    },
    getconfigitems() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.configitems,
          isRep: true
        })
        .then(res => {
          var configs = res.data.configs;
          var nowHourMin = this.getNowHourMin();
          if (res.success) {
            this.lunchStart = configs
              .filter(m => {
                return m.identifycode == "D04";
              })[0]
              .codeval.substring(0, 4);
            this.lunchEnd = configs
              .filter(m => {
                return m.identifycode == "D05";
              })[0]
              .codeval.substring(0, 4);
            this.dinnerStart = configs
              .filter(m => {
                return m.identifycode == "D06";
              })[0]
              .codeval.substring(0, 4);
            this.dinnerEnd = configs
              .filter(m => {
                return m.identifycode == "D07";
              })[0]
              .codeval.substring(0, 4);
            this.leaveNum = configs.filter(m => {
              return m.identifycode == "D01";
            })[0].codeval;
            this.listShowTime = configs.filter(m => {
              return m.identifycode == "B02";
            })[0].codeval;
            if (
              (parseInt(nowHourMin) >= parseInt(this.lunchStart) &&
                parseInt(nowHourMin) <= parseInt(this.lunchEnd)) ||
              (parseInt(nowHourMin) >= parseInt(this.dinnerStart) &&
                parseInt(nowHourMin) <= parseInt(this.dinnerEnd))
            ) {
              this.candineLeave = true;
            } else {
              this.candineLeave = false;
            }
            if (!this.usingDetail.totalLeaveNum) {
              this.usingDetail.totalLeaveNum = 0;
            }
            if (
              parseInt(this.usingDetail.totalLeaveNum) >=
              parseInt(this.leaveNum)
            ) {
              //临时暂离次数多
              this.cantemporaryLeave = false;
            } else {
              this.cantemporaryLeave = true;
            }
          }
        });
    },
    leaveSeat() {
      this.getconfigitems();
      this.showLeave = true;
    },
    cancelSeat() {
      this.Dialog.confirm({
        message: "确认退座？"
      }).then(() => {
        this.util
          .postAjax({
            code: this.code.base,
            url: this.code.ordercancel,
            data: {
              ids: this.usingDetail.id
            }
          })
          .then(res => {
            if (res.success) {
              this.page = 1;
              this.occupyList = [];
              this.Toast("退座成功");
              this.usingDetail = "";
              this.getUseing();
              this.getoccupyList();
              this.getcurrentOrders();
              this.getsignRemind();
              this.getmycommonLists();
            } else {
              this.Toast(res.data.message);
            }
          });
      });
    },
    diningLeave(type) {
      if (type == "2") {
        //就餐暂离
        if (!this.candineLeave) {
          return;
        }
      } else {
        //临时暂离
        if (!this.cantemporaryLeave) {
          return;
        }
      }
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.leave,
          data: {
            id: this.usingDetail.id,
            leaveType: type
          }
          // isRep:true
        })
        .then(res => {
          if (res.success) {
            if (type == "2") {
              this.Toast("就餐暂离成功");
              this.getUseing();
            } else {
              this.Toast("临时暂离成功");
              this.getUseing();
            }
            this.showLeave = false;
            this.showLeaveBtn = false;
          } else {
            this.Toast(res.data.message);
            this.showLeave = false;
          }
        });
    },
    //座位地图
    getPickDetail() {
      var timeStartEnd = [];
      var obj = {
        starttime: this.usingDetail.starttime,
        endtime: this.usingDetail.endtime
      };
      timeStartEnd.push(obj);
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.PickDetail,
          data: {
            enddate: this.nowdata,
            sectionid: this.usingDetail.sectionid,
            startdate: this.nowdata,
            times: timeStartEnd
          },
          isRep: true
        })
        .then(res => {
          if (res.success) {
            var seats = res.data;
            var newseats = [];
            seats.forEach(m => {
              if (m.type == 1) {
                m.selected = false;
                if (m.id == this.usingDetail.seatid) {
                  m.selected = true;
                }
              }
              if (typeof newseats[m.rowno - 1] == "undefined") {
                newseats[m.rowno - 1] = [];
              }
              newseats[m.rowno - 1][m.colno - 1] = m;
            });
            this.seatDeatil = newseats;
          }
        });
    },
    closeshowLeave() {
      this.showLeave = false;
    },
    seeSeatMap() {
      this.seatMap = true;
      this.getPickDetail();
    },
    closeseatMap() {
      this.seatMap = false;
    },
    getNowHourMin(type) {
      var myDate = new Date();
      var hour = myDate.getHours(); // 时
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      var minutes = myDate.getMinutes(); // 分
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      var seconds = myDate.getSeconds(); // 分
      if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
      }
      if (type) {
        return "" + hour + minutes + seconds;
      } else {
        return "" + hour + minutes;
      }
    },
    cancelTime(obj, type) {
      if (obj.type == 2) {
        //2是占座
        this.isappoint = false;
        this.cancelAppoint = false;
        var showtimeArr = [];
        var nowHourMin = this.getNowHourMin();
        if (type) {
          this.isDetail = type;
        }
        obj.origin.forEach(e => {
          e.selected = false;
          if (parseInt(e.endtime) >= parseInt(nowHourMin)) {
            showtimeArr.push(e);
          }
        });
        this.currentcancelTime = showtimeArr;
        if (this.currentcancelTime.length < 1) {
          this.Toast("当前暂无可取消的时间段");
        } else {
          this.showtime = true;
        }
      } else {
        this.isappoint = false;
        this.cancelAppoint = true;
        this.currentcancelTime = [];
        if (type) {
          this.isDetail = type;
        }
        var timeArr = obj.origin;
        var tempArr = [];
        for (let i = 0; i < timeArr.length; i++) {
          timeArr[i].weekday =
            timeArr[i].orderdate.substring(4, 6) +
            "月" +
            timeArr[i].orderdate.substring(6, 8) +
            "日";
          timeArr[i].weekno = new Date(
            timeArr[i].orderdate.substring(0, 4) +
              "/" +
              timeArr[i].orderdate.substring(4, 6) +
              "/" +
              timeArr[i].orderdate.substring(6, 8)
          ).getDay();
          if (tempArr.indexOf(timeArr[i].weekno) === -1) {
            this.currentcancelTime.push({
              weekno: timeArr[i].weekno,
              weekday: timeArr[i].weekday,
              weekdaynum:
                timeArr[i].weekday.substring(0, 2) +
                timeArr[i].weekday.substring(3, 5),
              origin: [timeArr[i]]
            });
            tempArr.push(timeArr[i].weekno);
          } else {
            for (let j = 0; j < this.currentcancelTime.length; j++) {
              if (this.currentcancelTime[j].weekno == timeArr[i].weekno) {
                this.currentcancelTime[j].origin.push(timeArr[i]);
                break;
              }
            }
          }
        }
        this.currentcancelTime.sort(this.compare("weekdaynum"));
        this.currentcancelTime.forEach(e => {
          e.origin.sort(this.compare("starttime"));
        });
        this.appointTime = this.currentcancelTime[0].origin;
        this.showtime = true;
      }
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    seeTimedetail(obj) {
      var timeArr = obj.origin;
      var tempArr = [];
      this.detailtimeArr = [];
      for (let i = 0; i < timeArr.length; i++) {
        timeArr[i].weekday =
          timeArr[i].orderdate.substring(4, 6) +
          "." +
          timeArr[i].orderdate.substring(6, 8);
        timeArr[i].weekno = new Date(
          timeArr[i].orderdate.substring(0, 4) +
            "/" +
            timeArr[i].orderdate.substring(4, 6) +
            "/" +
            timeArr[i].orderdate.substring(6, 8)
        ).getDay();
        if (tempArr.indexOf(timeArr[i].weekno) === -1) {
          this.detailtimeArr.push({
            weekno: timeArr[i].weekno,
            weekday: timeArr[i].weekday,
            weekdaynum:
              timeArr[i].weekday.substring(0, 2) +
              timeArr[i].weekday.substring(3, 5),
            origin: [timeArr[i]]
          });
          tempArr.push(timeArr[i].weekno);
        } else {
          for (let j = 0; j < this.detailtimeArr.length; j++) {
            if (this.detailtimeArr[j].weekno == timeArr[i].weekno) {
              this.detailtimeArr[j].origin.push(timeArr[i]);
              break;
            }
          }
        }
      }
      this.detailtimeArr.sort(this.compare("weekdaynum"));
      window.sessionStorage.setItem(
        "detailtimeArr",
        JSON.stringify(this.detailtimeArr)
      );
      this.$router.push({
        path: "timedetail",
        query: {
          sectionname: obj.sectionname,
          location: obj.location,
          seatname: obj.seatname,
          type: obj.type,
          islocakers: obj.islocakers
        }
      });
      //
    },
    closetimeselect() {
      this.page = 1;
      this.showtime = false;
      this.occupyList = [];
      this.getoccupyList();
      this.getcurrentOrders();
      this.getsignRemind();
      this.getmycommonLists();
    },
    goOccupy(obj) {
      if (
        obj.canuse == 0 ||
        this.isBlack ||
        (obj.sectionstatus && obj.sectionstatus != 1)
      ) {
        return;
      }
      this.queryOpentime(obj.isCommon == 1 ? obj.sectionid : obj.id, obj);
    },
    queryOpentime(id, obj) {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.queryOpentime,
          data: {
            enddate: this.nowdata,
            sectionid: id,
            startdate: this.nowdata,
            type: 2 //占座传2
          },
          isRep: true
        })
        .then(res => {
          if (res.success) {
            if (res.data.length < 1) {
              this.Toast("当前暂无可选时间段");
              return;
            } else {
              this.$router.push({
                path: "occupySelect",
                query: {
                  opentime: obj.opentime,
                  id: obj.isCommon == 1 ? obj.sectionid : obj.id,
                  name: obj.isCommon == 1 ? obj.sectionname : obj.name,
                  location: obj.location,
                  islocakers: obj.islocakers,
                  pickendtime: obj.pickendtime,
                  ruleid: obj.ruleid,
                  seatname: obj.seatname,
                  seatid: obj.seatid
                }
              });
            }
          }
        });
    },
    getmycommonLists() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.mycommonLists
        })
        .then(res => {
          if (res.success) {
            this.mycommonLists = res.data;
            this.mycommonLists.forEach(e => {
              e.isCommon = 1;
            });
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    getRandomNum() {
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < 16; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    //初始化wx的ticket
    initwx() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.getTicket
          // isRep:true
        })
        .then(res => {
          if (res.success) {
            var str = this.getRandomNum();
            //生成签名
            var timeSign = Date.parse(new Date());
            var url = window.location.href.split("#")[0];
            var signature =
              "jsapi_ticket=" +
              res.data.ticket +
              "&noncestr=" +
              str +
              "&timestamp=" +
              timeSign +
              "&url=" +
              url;
            wx.config({
              debug: false, // 开启调试模式。
              appId: res.data.appid, // 必填，公众号的唯一标识
              timestamp: timeSign, // 必填，生成签名的时间戳
              nonceStr: str, // 必填，生成签名的随机串
              signature: this.sha1(signature), // 必填，签名
              jsApiList: ["scanQRCode", "chooseImage", "downloadImage"] // 必填，需要使用的JS接口列表
            });
          } else {
            // this.Toast(res.data.message)
          }
        });
    },
    // 初始化企业微信
    initQywx () {
      this.util
        .postAjax({
          code: this.code.idsbase,
          url: this.code.getQyTicket
          // isRep:true
        })
        .then(res => {
          if (res.success) {
            var str = this.getRandomNum();
            //生成签名
            var timeSign = Date.parse(new Date());
            var url = window.location.href.split("#")[0];
            var signature =
              "jsapi_ticket=" +
              res.data.ticket +
              "&noncestr=" +
              str +
              "&timestamp=" +
              timeSign +
              "&url=" +
              url;
            wx.config({
              debug: false, // 开启调试模式。
              appId: res.data.appid, // 必填，公众号的唯一标识
              timestamp: timeSign, // 必填，生成签名的时间戳
              nonceStr: str, // 必填，生成签名的随机串
              signature: this.sha1(signature), // 必填，签名
              jsApiList: ["scanQRCode", "chooseImage", "downloadImage"] // 必填，需要使用的JS接口列表
            });
          } else {
            this.Toast('企业微信交互失败')
          }
        });
    },
    getlistTime() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.configitems,
          isRep: true
        })
        .then(res => {
          var configs = res.data.configs;
          if (res.success) {
            var listShowTime = configs.filter(m => {
              return m.identifycode == "B02";
            })[0].codeval;
            var winterStart = configs.filter(m => {
              return m.identifycode == "C03";
            })[0].codeval;
            var winterEnd = configs.filter(m => {
              return m.identifycode == "C04";
            })[0].codeval;
            var summerStart = configs.filter(m => {
              return m.identifycode == "C01";
            })[0].codeval;
            var summerEnd = configs.filter(m => {
              return m.identifycode == "C02";
            })[0].codeval;
            //先判断当天是不是在寒暑假时间段
            var today = this.util.formatMYD();
            var nowHourMin = this.getNowHourMin("ss");
            // console.log('tag', today,winterStart,winterEnd,summerStart,summerEnd,listShowTime)
            if (
              (parseInt(today) <= parseInt(winterEnd) &&
                parseInt(today) >= parseInt(winterStart)) ||
              (parseInt(today) <= parseInt(summerEnd) &&
                parseInt(today) >= parseInt(summerStart))
            ) {
              // console.log('在寒暑假设置的时间内')
              this.showList = false;
            } else {
              // console.log('不在寒暑假设置的时间内',nowHourMin,listShowTime)
              if (parseInt(nowHourMin) >= parseInt(listShowTime)) {
                this.showList = true;
              } else {
                this.showList = false;
              }
            }
            // console.log('this.showList', this.showList)
            if (this.showList) {
              this.getoccupyList();
            } else {
              this.indexLoading = false;
              this.finished = true;
            }
          }
        });
    }
  },
  created() {
    this.getlistTime();
    this.sha1 = require("js-sha1");
    this.Base64 = require("js-base64").Base64;
    this.$store.dispatch("getBlackText");
    this.isBlack = this.$store.state.BlackText.isBlack;
    // 判断是微信环境还是企业微信环境
    let ua= window.navigator.userAgent.toLowerCase();
	if( (ua.match(/MicroMessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) == 'wxwork') ){
      // 企业微信客户端
      this.initQywx();
      this.scanType = 'qywx_normal'
    }else if( ua.match(/micromessenger/i) == 'micromessenger' ){
      // 微信客户端
      if (window.base.WXSIGN_TYPE === 'wx') {
        this.initwx();
        this.scanType = 'wx_normal'
      } else if (window.base.WXSIGN_TYPE === 'uniapp_mp') {
        this.scanType = 'wx_uniapp_mp'
      }
    }
    this.nowdata = this.util.formatMYD();
    this.getmycommonLists();
    // this.getoccupyList();
    this.getcurrentOrders();
    this.getsignRemind();
    this.getUseing();
  },
  mounted() {
    // 获取用户信息
    this.$store.dispatch("getBlackText");
  }
};
</script>
<style  lang="scss" scoped>
.seatMapmeng,
.showtimemeng {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9;
}
.index_content {
  width: 100%;
  height: 100%;
  background: #fafaf9;
  padding-bottom: 120px;
  box-sizing: border-box;
}
.index_tab {
  width: 100%;
  height: 212px;
  background: #fff;
  padding: 24px 55px;
  box-sizing: border-box;
}
.index_tab > ul {
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
}
.index_tab > ul > li {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.index_tab > ul > li > div {
  width: 88px;
  height: 88px;
  background: green;
  margin: 0 auto;
}
.index_tab > ul > li > div.appoint {
  background: url(../../../static/img/appointSeat.png) no-repeat;
  background-size: cover;
}
.index_tab > ul > li > div.monitor {
  background: url(../../../static/img/monotorIcon.png) no-repeat;
  background-size: cover;
}
.index_tab > ul > li > div.rules {
  background: url(../../../static/img/ruleIcon.png) no-repeat;
  background-size: cover;
}
.index_tab > ul > li > div.notice {
  background: url(../../../static/img/noticeIcon.png) no-repeat;
  background-size: cover;
}
.index_tab > ul > li > p {
  font-size: 28px;
  font-weight: 400;
  color: #333333;
  line-height: 40px;
  text-align: center;
  margin-top: 20px;
}
.sign_box {
  width: calc(100% - 60px);
  /* height: 100px; */
  background: url(../../../static/img/sign.png) no-repeat center center;
  background-size: cover;
  border-radius: 24px;
  opacity: 0.79;
  margin: 24px auto;
  padding: 30px 24px;
  box-sizing: border-box;
}
.sign_box > h3 {
  width: 100%;
  height: 39px;
  font-size: 34px;
  font-weight: 500;
  color: #ffffff;
  line-height: 39px;
  margin-bottom: 24px;
}
.sign_box > div {
  width: 100%;
  /* height: 30px; */
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
  line-height: 30px;
  margin-bottom: 18px;
}
.sign_box > div > i {
  display: inline-block;
  width: 24px;
  height: 29px;
  float: left;
  margin-right: 5px;
}
.sign_box > div > i.location {
  background: url(../../../static/img/location.png) no-repeat center center;
  background-size: cover;
}
.sign-tips {
  width: 100%;
  font-style: normal;
  font-size: 30px;
  color: #ed5f21;
  font-weight: 550;
}
.sign_box > div > i.time {
  background: url(../../../static/img/time.png) no-repeat center center;
  background-size: cover;
}
.sign_box > span {
  display: inline-block;
  width: 120px;
  height: 44px;
  background: #ffffff;
  box-shadow: 0rem 5px 0.25rem 0rem rgba(180, 101, 10, 0.2);
  border-radius: 28px;
  margin-top: 2px;
  font-size: 28px;
  font-weight: 400;
  color: #ffa033;
  line-height: 44px;
  text-align: center;
}
.using {
  width: calc(100% - 60px);
  height: 305px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0px 2px 10px 0px rgba(230, 230, 230, 0.2);
  border-radius: 5px;
  margin-bottom: 56px;
  margin-top: 24px;
}
.using > .using_title {
  width: 100%;
  height: 84px;
  background: linear-gradient(90deg, #fbeedf 0%, #fef7f1 100%);
  border-radius: 5px 5px 0rem 0rem;
  padding: 2px 24px;
  box-sizing: border-box;
}
.using > div > .using_pic {
  width: 4.1rem;
  height: 100%;
  float: left;
  display: flex;
  align-items: center;
}
.using_time {
  width: calc(100% - 4.1rem);
  height: 100%;
  float: right;
  font-size: 24px;
  font-weight: 400;
  color: #999999;
  line-height: 24px;
  text-align: right;
}
.using_time > i {
  display: inline-block;
  width: 36px;
  height: 36px;
  background: #333333;
  font-size: 24px;
  font-weight: 400;
  color: #ffffff;
  line-height: 36px;
  border-radius: 50%;
  font-style: normal;
  text-align: center;
  margin: 0 20px;
}
.using_time > em {
  color: rgba(51, 51, 51, 1);
  font-style: normal;
}
.using_time > i:first-of-type {
  margin-left: 24px;
}
.using > div > div > span {
  display: inline-block;
  font-size: 34px;
  line-height: 84px;
  font-weight: 550;
  background-size: cover;
  float: left;
}
.using > div > .using_pic > em {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: #1dc11d;
  float: left;
  border-radius: 50%;
  margin-left: 12px;
}
.using > .using_detail {
  width: 100%;
  /* height:144px;; */
  background: #fff;
  padding: 30px 24px;
  box-sizing: border-box;
}
.using_detail > h3 {
  width: 100%;
  /* height: 42px; */
  font-size: 30px;
  font-weight: 500;
  color: #1f232f;
  line-height: 42px;
  margin-bottom: 16px;
}
.using_detail > h3 > span {
  float: right;
  font-size: 24px;
  font-weight: 400;
  color: #f39f1b;
}
.using_detail > h3 > span > i {
  display: inline-block;
  width: 9px;
  height: 18px;
  background: url(../../../static/img/rightarr_w.png) no-repeat center center;
  background-size: cover;
  margin-left: 12px;
}
.using_detail > p {
  width: 100%;
  font-size: 26px;
  font-weight: 400;
  color: #999999;
  line-height: 26px;
  letter-spacing: 1px;
}
.using > .using_bottom {
  width: 100%;
  background: #fff;
}
.using > .using_bottom.using_bottom1 > div {
  width: 100%;
}
.using > .using_bottom > div {
  width: 50%;
  float: left;
  font-size: 28px;
  font-weight: 400;
  color: #333333;
  line-height: 76px;
  text-align: center;
}
.line {
  width: calc(100% - 48px);
  height: 1pt;
  background: #eeeeee;
  margin: 0 auto;
}
.now_appoint {
  margin: 24px 30px;
}

.now_appoint > div {
  width: 100%;
  /* height: 4.9rem; */
  background: #fff;
  padding: 30px 24px;
  box-sizing: border-box;
  margin-bottom: 16px;
}
.nowno_appoint > div {
  width: 100%;
  height: 280px;
  background: #ffffff;
  box-shadow: 0rem 0.05rem 0.25rem 0rem rgba(230, 230, 230, 0.2);
  border-radius: 5px;
}
.now_appoint.nowno_appoint > div {
  padding: 0;
  padding-top: 50px;
  box-sizing: border-box;
}
.nowno_appoint > div > div {
  width: 200px;
  height: 120px;
  background: url(../../../static/img/noAppoint.png) no-repeat center center;
  background-size: cover;
  margin: 0 auto;
  margin-bottom: 24px;
}
.nowno_appoint > div > p {
  width: 100%;
  height: 36px;
  font-size: 28px;
  font-weight: 400;
  color: #666666;
  line-height: 40px;
  text-align: center;
  position: relative;
}
.nowno_appoint > div > p > i {
  display: inline-block;
  position: absolute;
  top: 2px;
}
.now_appoint > h3,
.now_emptyseat > h3 {
  font-size: 30px;
  font-weight: 600;
  color: #333333;
  line-height: 42px;
  letter-spacing: 1px;
  margin-bottom: 12px;
}
.now_appoint > div > .appoint_left {
  width: calc(100% - 88px);
  height: 100%;
  background: #ffffff;
  box-shadow: 0rem 0.05rem 0.25rem 0rem rgba(230, 230, 230, 0.2);
  border-radius: 5px;
  float: left;
}
.appoint_left > h3 {
  width: 100%;
  font-size: 30px;
  font-weight: 550;
  color: #333333;
  line-height: 42px;
  letter-spacing: 1px;
}
.appoint_left > p {
  font-size: 26px;
  font-weight: 400;
  color: #999999;
  line-height: 26px;
  letter-spacing: 1px;
  margin-top: 16px;
  margin-bottom: 30px;
}
.appoint_left > span {
  display: inline-block;
  font-size: 26px;
  font-weight: 400;
  color: #999999;
  line-height: 26px;
  letter-spacing: 1px;
}
.appoint_left > span > i {
  display: inline-block;
  width: 9px;
  height: 18px;
  background: url(../../../static/img/rightarr_b.png) no-repeat center center;
  background-size: cover;
  margin-left: 12px;
}
.now_appoint > div > .appoint_calcel {
  width: 88px;
  height: 100%;
  float: right;
}
.appoint_calcel > div {
  width: 100%;
  height: 88px;
  background: url(../../../static/img/cancel.png) no-repeat center center;
  background-size: cover;
}
.appoint_calcel > p {
  width: 100%;
  height: 28px;
  font-size: 28px;
  font-weight: 400;
  color: #f23c3c;
  line-height: 28px;
  margin-top: 20px;
  text-align: center;
}
.now_emptyseat > div {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(230, 230, 230, 0.2);
  border-radius: 5px;
  margin: 0 auto;
  padding: 24px;
  padding-bottom: 0;
  box-sizing: border-box;
}
.now_emptyseat > div.nodata {
  padding-bottom: 2rem;
  box-sizing: border-box;
}
.commom_seat {
  width: 100%;
  background: #fff;
}
.commom_seat > div {
  width: 305px;
  height: 100%;
  background: url(../../../static/img/commonSeatBack.png) no-repeat center
    center;
  background-size: cover;
  border-radius: 5px;
  float: left;
  padding: 24px 30px;
  box-sizing: border-box;
  margin-left: 24px;
}
.commom_seat > div:first-of-type {
  margin-left: 0;
}
.commom_seat > div > h3 {
  width: 100%;
  height: 50px;
  font-size: 36px;
  font-weight: 600;
  color: #333333;
  line-height: 50px;
  letter-spacing: 1px;
  position: relative;
}
.commom_seat > div > h3 > span {
  color: #ffa033;
  font-size: 24px;
  font-weight: 400;
  background: #fce4c9;
  background-size: cover;
  border-radius: 4px;
  padding: 0px 8px;
  position: absolute;
  top: 0px;
  right: -20px;
}
.commom_seat > div > p {
  width: 100%;
  font-size: 26px;
  font-weight: 400;
  color: #333333;
  line-height: 36px;
  margin-top: 4px;
  margin-bottom: 30px;
}
.commom_seat > div > span {
  display: inline-block;
  width: 144px;
  height: 60px;
  background: #ffffff linear-gradient(90deg, #ffd200 0%, #ffa033 100%);
  border-radius: 30px;
  font-size: 28px;
  font-weight: 400;
  color: #ffffff;
  line-height: 60px;
  text-align: center;
}
.commom_seat > div > span.noseat {
  background: #eae3da;
  color: #a09686;
}
.commom_seat > div > span.isBlack {
  background: #eae3da;
  color: #a09686;
}
.Leavewrapper,
.seatMapwrapper,
.showtimewrapper {
  height: 100%;
  width: 100%;
  position: relative;
}
.Leavewrapper > div {
  // width: calc(100% - 3rem);
  // // height: 18.18rem;
  width: 630px;
  height: 727px;
  background: #ffffff;
  border-radius: 5px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.Leavewrapper > div > .img {
  width: 377px;
  height: 268px;
  background: url(../../../static/img/leaveback.png) no-repeat center center;
  background-size: cover;
  margin: 53px auto 30px;
}
.Leavewrapper > div > .close {
  width: 56px;
  height: 56px;
  background: url(../../../static/img/index_close.png) no-repeat center center;
  background-size: cover;
  margin-left: calc(50% - 28px);
  margin-top: 160px;
}
.Leavewrapper > div > h3 {
  width: 100%;
  height: 40px;
  font-size: 28px;
  font-weight: 400;
  color: #333333;
  line-height: 40px;
  text-align: center;
  margin-bottom: 60px;
}
.Leavewrapper > div > p {
  width: 288px;
  height: 78px;
  background: #ffffff;
  border-radius: 36px;
  border: 0.03rem solid #cccccc;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 40px;
  line-height: 78px;
  font-size: 30px;
  font-weight: 550;
  color: #333333;
  letter-spacing: 1px;
}
.Leavewrapper > div > p.noleave {
  background: #dddddd;
  color: #999999;
  border: none;
}
.seatMapwrapper > div {
  width: 630px;
  height: 696px;
  background: #ffffff;
  border-radius: 5px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  /* overflow: auto; */
}

.seatMapwrapper > div > h3 {
  width: 100%;
  height: 108px;
  color: #333333;
  line-height: 108px;
  padding: 0rem 24px;
  box-sizing: border-box;
  font-size: 34px;
  font-weight: 400;
  color: #1c2026;
}
.seatMapwrapper > div > p {
  width: 100%;
  height: 108px;
  text-align: center;
  padding-top: 30px;
  box-sizing: border-box;
}
.seatMapwrapper > div > p > span {
  display: inline-block;
  height: 100%;
  font-size: 18px;
  font-weight: 400;
  color: #666666;
  line-height: 26px;
  margin-right: 30px;
}
.seatMapwrapper > div > div {
  width: 100%;
  // height: calc(100% - 5.4rem);
  height: 480px;
  overflow: auto;
}
.seatMapwrapper > div > p > span:last-of-type {
  margin-right: 0;
}
.seatMapwrapper > div > p > span > i {
  display: inline-block;
  width: 26px;
  float: left;
  margin-right: 8px;
}
.seatMapwrapper > div > div > div {
  width: 100%;
  height: 100%;
  background: #f8f7f5;
  padding: 30px;
  box-sizing: border-box;
  overflow: auto;
}
.seatMapwrapper > div > div > div > ul {
  width: 100%;
  height: 39px;
  margin-bottom: 4px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.seatMapwrapper > div > div > div > ul > li {
  width: 39px;
  height: 39px;
  margin-right: 6px;
  margin-top: 6px;
  float: left;
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  line-height: 39px;
  text-align: center;
  flex-shrink: 0;
}
.seatMapwrapper > div > div.close {
  width: 56px;
  height: 56px;
  background: url(../../../static/img/index_close.png) no-repeat center center;
  background-size: cover;
  margin-left: calc(50% - 28px);
  margin-top: 80px;
}
</style>
