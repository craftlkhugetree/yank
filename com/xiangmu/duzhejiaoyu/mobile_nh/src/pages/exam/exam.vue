<template>
  <div>
    <div class="exam_content" v-if="!readerFlag_show&&!ispass_show">
      <!-- 没有激活的时候，没满足条件 -->
      <!-- <div class="single_exam" v-if="!inip || (islearnnum &&!((studytime>=neetime)&&isStudyed))||(!islearnnum&&!(studytime>=neetime))"> -->
      <!-- <div class="single_exam" v-if="!inip && (islearnnum && !isStudyed) && !(islearnnum && (studytime < neetime))&&(!islearnnum &&(studytime<neetime))"> -->
      <div class="single_exam" v-if="(studytime < neetime)||(islearnnum&&!isStudyed)">
        <div class="singleexam_top">
          <div
            class="singleexam_topimg"
            :style="{background:'url(./static/img/jihuo.png)',backgroundSize:'cover'}"
          ></div>
          <div class="singleexam_toptitle">
            <p>考试条件</p>
          </div>
        </div>
        <div class="singleexam_buttom" v-if="(studytime < neetime)||(islearnnum&&!isStudyed)">
          <p>
            1.需在线学习满{{neetime}}分钟
            <i v-if="studytime >= neetime"></i>
          </p>
          <p v-if="islearnnum">
            2.按顺序学习完所有文档
            <i v-if="isStudyed"></i>
          </p>
          <button class="gostudy" @click="gostudy">
            去学习
            <i></i>
          </button>
        </div>
      </div>
      <div
        class="single_exam"
        v-if="(!((studytime < neetime)||(islearnnum&&!isStudyed))&&isipoepn=='1'&&!inip)"
      >
        <div class="singleexam_top">
          <div
            class="singleexam_topimg"
            :style="{background:'url(./static/img/jihuo.png)',backgroundSize:'cover'}"
          ></div>
          <div class="singleexam_toptitle">
            <p>考试条件</p>
          </div>
        </div>
        <div class="singleexam_buttom">
          <p class="noexam1" v-if="examadd">请到{{examadd}}进行考试</p>
          <button class="noexam">
            无法考试
            <i></i>
          </button>
        </div>
      </div>
      <div
        v-if="exam_pt.length>0 && !((studytime < neetime)||(islearnnum&&!isStudyed))&&((isipoepn=='1'&&inip)||(isipoepn!='1'))"
      >
        <div class="single_exam" v-for="(v,i) in exam_pt" :key="i" @click="goexam(i,v)">
          <div class="singleexam_top">
            <div
              class="singleexam_topimg"
              :style="{background:'url(./static/img/'+v.img+')',backgroundSize:'cover'}"
            ></div>
            <div class="singleexam_toptitle">
              <p>{{v.examTitle}}</p>
            </div>
          </div>
          <div class="singleexam_buttom">
            <h3>{{v.name}}</h3>
            <p
              v-if="v.testType != 3"
            >此次考试需在{{v.validStart}} ~ {{v.validEnd}} 时间内完成试卷。 考试总时间为 {{v.needTime}} 分钟，{{v.minTime}} 分钟后方可提前交卷， 总分 {{v.score}} 分，达到 {{v.passScore}} 分即视为通过考试， 且不限考试次数。</p>
            <p
              v-if="v.testType == 3"
            >此次考试需在{{v.validStart}} ~ {{v.validEnd}} 时间内完成试卷。 共 {{v.score}} 关，闯过 {{v.passScore}} 关即视为通过考试， 且不限考试次数。</p>
            <div class="goexam_btn">开始考试</div>
          </div>
        </div>
      </div>
      <div class="noexamlist" v-if="!loading && exam_pt.length<1 && exam_mn.length<1">
        <div
          v-if="personinfo.readerFlag==2 && nh"
          style="color:rgba(0,176,155,1);"
        >你的校园卡图书馆权限处于挂失状态，请到图书馆证籍处处理。</div>
        <div v-else>暂无可用试卷</div>
      </div>
      <div class="noexamlist" v-if="loading ">数据加载中。。。</div>
      <!-- <div v-if="personinfo.readerFlag==2 && nh" style="color:rgba(0,176,155,1);" class="noexamlist">
                你的校园卡图书馆权限处于挂失状态，请到图书馆证籍处处理。
      </div>-->

      <div class="single_exam" v-for="(v,i) in exam_mn" :key="i" @click="goexam_mn(v)">
        <div class="singleexam_top">
          <div
            class="singleexam_topimg"
            :style="{background:'url(./static/img/'+v.img+')',backgroundSize:'cover'}"
          ></div>
          <div class="singleexam_toptitle">
            <p>{{v.examTitle}}</p>
          </div>
        </div>
        <div class="singleexam_buttom">
          <h3>{{v.name}}</h3>
          <p
            v-if="v.testType != 3"
          >此次考试需在{{v.validStart}} ~ {{v.validEnd}} 时间内完成试卷。 考试总时间为 {{v.needTime}} 分钟，{{v.minTime}} 分钟后方可提前交卷， 总分 {{v.score}} 分，达到 {{v.passScore}} 分即视为通过考试， 且不限考试次数。</p>
          <p
            v-if="v.testType == 3"
          >此次考试需在{{v.validStart}} ~ {{v.validEnd}} 时间内完成试卷。 共 {{v.score}} 关，闯过 {{v.passScore}} 关即视为通过考试， 且不限考试次数。</p>
          <div class="goexam_btn">开始考试</div>
        </div>
      </div>
    </div>
    <div v-else class="exam_content1" ref="content2">
      <div
        class="activate"
        style="width: 100%;height: 11rem;background: url(./static/img/person_card.png) no-repeat center center;
                        border-radius: .5rem;background-size:cover;position: relative;"
      >
        <h3
          style="position: absolute;top: 2rem;width: 100%;font-size: 0.9rem;
                    color: rgba(255,255,255,1);"
        >图书馆借书证</h3>
        <p
          style="position: absolute;top: 4rem;left: 1rem;color: #fff;font-size: 0.9rem;"
        >{{personinfo.name}}</p>
        <p
          v-if="readerFlag_show"
          style="position: absolute;bottom: 3rem;left: 1rem;color: #fff;font-size: 0.75rem;"
        >你已通过入馆考试，借书证已激活</p>
        <p
          v-if="ispass_show"
          style="position: absolute;bottom: 3rem;left: 1rem;color: #fff;font-size: 0.75rem;"
        >{{other?'你已通过入馆测试，请带校园卡到图书馆激活！':'你已通过入馆测试，入校后借书证自动激活'}}</p>
      </div>
      <div class="single_exam" v-for="(v,i) in exam_mn" :key="i" @click="goexam_mn(v)">
        <div class="singleexam_top">
          <div
            class="singleexam_topimg"
            :style="{background:'url(./static/img/'+v.img+')',backgroundSize:'cover'}"
          ></div>
          <div class="singleexam_toptitle">
            <p>{{v.examTitle}}</p>
          </div>
        </div>
        <div class="singleexam_buttom">
          <h3>{{v.name}}</h3>
          <p
            v-if="v.testType != 3"
          >此次考试需在{{v.validStart}} ~ {{v.validEnd}} 时间内完成试卷。 考试总时间为 {{v.needTime}} 分钟，{{v.minTime}} 分钟后方可提前交卷， 总分 {{v.score}} 分，达到 {{v.passScore}} 分即视为通过考试， 且不限考试次数。</p>
          <p
            v-if="v.testType == 3"
          >此次考试需在{{v.validStart}} ~ {{v.validEnd}} 时间内完成试卷。 共 {{v.score}} 关，闯过 {{v.passScore}} 关即视为通过考试， 且不限考试次数。</p>
          <div class="goexam_btn">开始考试</div>
        </div>
      </div>
    </div>
    <!-- 南航第一次登录进来的弹窗 -->
    <div class="first_meng" v-if="firstmeng">
      <div>
        <div class="loudspeaker"></div>
        <h3></h3>
        <div class="first_content">
          <p>第一条 校内读者凭本人校园卡入馆；校外读者凭本人身份证件到证籍管理处办理临时阅览证入馆；来访者凭介绍信或本人有效证件与办公室联系。严禁使用他人证件入馆。</p>
          <p>第二条 注意仪容仪表，勿穿着背心、拖鞋、溜冰鞋入馆；勿在馆内有不雅举止。</p>
          <p>第三条 图书馆是重点防火单位，严禁携带易燃易爆物品入馆，严禁在馆内任何地方吸烟、使用明火。读者须增强安全防范意识，本人贵重物品请妥善保管，严防丢失或被窃。</p>
          <p>第四条 遵守馆内秩序，保持室内安静；勿大声喧哗、朗读、追逐和打闹；随身电子设备须保持静音，接打手机须到室外，以免影响他人学习。</p>
          <p>第五条 爱护环境卫生、严禁携带食品、饮料入馆，馆内不随地吐痰，不乱扔纸屑杂物，不在公共物品或设施上乱涂乱画。</p>
          <p>第六条 爱护文献资源和公共设施，不污损建筑设施、不毁坏书刊资料，未经允许不得擅自携带本馆书刊出馆。</p>
          <p>第七条 注意文明阅读，讲究互谦互让。勿用私人物品占用座位和公共空间；读者离开座位半小时以上一律视为自动放弃，工作人员有权将座位上及其他公共空间的私人物品清理。</p>
          <p>第八条 读者须从规定通道离馆，如遇监测器报警，应配合接受工作人员检查，不应有不文明、不礼貌的言行。</p>
          <p>第九条 随身携带的包、文件夹（袋）等可存放于存包柜，并于当天取走。个人证件、钱款等贵重物品勿存入，如有遗失，责任自负。</p>
          <p>第十条 自觉遵守图书馆有关规章制度，配合工作人员管理</p>
        </div>
        <div class="first_bottom">
          <p @click="isreaded">
            <i :class="{'selected':readed}"></i>我已阅读，并承诺遵守
          </p>
          <button :class="{'selected':readed}" @click="sure_exam">确 认</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import code from "../../util/code";

export default {
  data() {
    return {
      examlist: [], //试卷列表
      studylist: [], //在线学习列表
      studyed: [], //学完的列表
      isStudyed: false, //是否学完
      studytime: 0,
      neetime: 0, //需要的事件
      personinfo: "",
      exam_mn: [],
      exam_pt: [],
      exam_cg: [],
      readerFlag_show: 0,
      islearnnum: false, //是否顺序阅读
      isipoepn: false,
      iprange: "",
      localip: "",
      examadd: "",
      readerFlag_show: false,
      ispass_show: false,
      inip: false,
      iniptext: "",
      needstudy: window.base.needstudy,
      nh: window.base.nh,
      other: window.base.other,
      loading: true,
      readed: false,
      isfirstlogin: "", //是不是第一次登录
      firstmeng: false, //南航第一次登录的蒙层
      examitem: "",
      examindex: "",
      ismnExam: "" //是不是模拟开始
    };
  },
  methods: {
    isreaded() {
      this.readed = !this.readed;
    },
    sure_exam() {
      if (this.readed) {
        this.isfirstlogin = "0";
        this.firstmeng = false;
        if (this.ismnExam == "pt") {
          this.goexam(this.examindex, this.examitem);
        } else {
          this.goexam_mn(this.examitem);
        }
      }
    },
    //去学习
    gostudy() {
      this.$router.push("study");
    },
    goexam(index, item) {
      if (this.isfirstlogin == "1") {
        //表示是第一次登录
        this.ismnExam = "pt";
        this.firstmeng = true;
        this.examitem = item;
        this.examindex = index;
        return;
      }
      if (window.base.nh && this.personinfo.readerFlag == "2") {
        this.Toast("你的校园卡图书馆权限处于挂失状态，请到图书馆证籍处处理。");
        return;
      }
      if (this.isipoepn == "1") {
        var iparr = this.iprange.split("-");
        var min = this.ipToNumber(iparr[0]);
        var max = this.ipToNumber(iparr[1]);
        var mynum = this.ipToNumber(this.localip);
        if (mynum <= max && mynum >= min) {
          //在ip范围内
          if (item.needstudytime) {
            if (item.needstudytime > this.studytime) {
              this.Toast("请先学习后再考试");
              return;
            }
          }
          if (item.testType == "3") {
            //
            window.sessionStorage.setItem(
              "fightexam_detail",
              JSON.stringify(item)
            );
            this.$router.push({
              path: "fightexam"
            });
          } else {
            var endtime = item.validEnd.replace(/-/g, "/");
            if (
              new Date(item.validStart.replace(/-/g, "/")).getTime() >
              new Date().getTime()
            ) {
              this.Toast("未到考试开始时间");
              return;
            } else if (
              new Date(endtime).getTime() + 24 * 60 * 60 * 1000 <
              new Date().getTime()
            ) {
              this.Toast("考试已经结束");
              return;
            } else {
              //two:2 有错题回顾   3 一题一题分析
              //testType  考试形式：1.普通考试 2.模拟考试   3.闯关考试  4.开卷考试
              if (item.testType == 1) {
                item.backpic = "putong.png";
                if (item.resultType == 1) {
                  item.two = "1";
                } else {
                  //一直到最后才会有分析
                  item.two = "2";
                }
              } else if (item.testType == 2) {
                item.backpic = "moniback.png";
                if (item.resultType == 1) {
                  item.two = "1";
                } else if (item.resultType == 2) {
                  item.two = "2";
                } else {
                  item.two = "3";
                }
              }
              window.sessionStorage.setItem(
                "examing_detail",
                JSON.stringify(item)
              );
              this.$router.replace({
                name: "examing"
              });
            }
          }
        } else {
          this.Toast("请到" + this.examadd + "考试");
        }
      } else {
        if (item.needstudytime) {
          if (item.needstudytime > this.studytime) {
            this.Toast("请先学习后再考试");
            return;
          }
        }
        if (item.testType == "3") {
          //
          window.sessionStorage.setItem(
            "fightexam_detail",
            JSON.stringify(item)
          );
          this.$router.push({
            path: "fightexam"
          });
        } else {
          var endtime = item.validEnd.replace(/-/g, "/");
          if (
            new Date(item.validStart.replace(/-/g, "/")).getTime() >
            new Date().getTime()
          ) {
            this.Toast("未到考试开始时间");
            return;
          } else if (
            new Date(endtime).getTime() + 24 * 60 * 60 * 1000 <
            new Date().getTime()
          ) {
            this.Toast("考试已经结束");
            return;
          } else {
            //two:2 有错题回顾   3 一题一题分析
            //testType  考试形式：1.普通考试 2.模拟考试   3.闯关考试  4.开卷考试
            if (item.testType == 1) {
              item.backpic = "putong.png";
              if (item.resultType == 1) {
                item.two = "1";
              } else {
                //一直到最后才会有分析
                item.two = "2";
              }
            } else if (item.testType == 2) {
              item.backpic = "moniback.png";
              if (item.resultType == 1) {
                item.two = "1";
              } else if (item.resultType == 2) {
                item.two = "2";
              } else {
                item.two = "3";
              }
            }
            window.sessionStorage.setItem(
              "examing_detail",
              JSON.stringify(item)
            );
            this.$router.replace({
              name: "examing"
            });
          }
        }
      }
    },
    goexam_mn(item) {
      if (this.isfirstlogin == "1") {
        //表示是第一次登录
        this.ismnExam = "mn";
        this.firstmeng = true;
        this.examitem = item;
        this.examindex = index;
        return;
      }

      if (window.base.nh && this.personinfo.readerFlag == "2") {
        this.Toast("你的校园卡图书馆权限处于挂失状态，请到图书馆证籍处处理。");
        return;
      }
      item.backpic = "moniback.png";
      if (item.resultType == 1) {
        item.two = "1";
      } else if (item.resultType == 2) {
        item.two = "2";
      } else {
        item.two = "3";
      }
      window.sessionStorage.setItem("examing_detail", JSON.stringify(item));
      this.$router.replace({
        name: "examing"
      });
    },
    // 试卷列表
    examLists() {
      this.util
        .postAjax({
          code: code.base,
          url: code.userInfo,
          isRep: true,
          data: {}
        })
        .then(res => {
          this.personinfo = res.item;
          if (this.personinfo.readerFlag == 2 && this.nh) {
            return;
          }
          if (this.personinfo.readerFlag == 1) {
            //表示老生或者新生
            this.readerFlag_show = true;
          } else {
            if (this.personinfo.ispass == 1) {
              this.ispass_show = true;
            }
          }
          this.util
            .postAjax({
              code: code.base,
              url: code.ruleslist,
              data: {
                code: "ISLEARNNUMOPEN" //是否顺序阅读
              }
            })
            .then(res1 => {
              if (res1.item.rval == "1") {
                this.islearnnum = true;
                this.studylistAll(res.item.campusId);
              } else {
                this.islearnnum = false;
              }
            });
          //获取考试的试题的套数
          this.util
            .postAjax({
              code: code.base,
              url: code.getExam,
              data: {
                campusId: res.item.campusId,
                userType: res.item.readerType
              } //campusId 校区ID ,userType 读者类型
            })
            .then(res => {
              if (res.success) {
                this.loading = false;
                if (res.items) {
                  this.exam_pt = [];
                  this.exam_mn = [];
                  //根据试卷的类型，改变背景色
                  res.items.forEach(element => {
                    if (element.testType == 2) {
                      //testType 1.普通考试 2.模拟考试   3.闯关考试  4.开卷考试
                      element.img = "moni.png";
                      element.examTitle = "模拟考试";
                      this.exam_mn.push(element);
                    } else {
                      if (element.testType == 1) {
                        element.img = "jihuo.png";
                        element.examTitle = "普通考试";
                      } else {
                        element.img = "chuangguan.png";
                        element.examTitle = "闯关考试";
                      }
                      this.neetime = element.needstudytime;
                      this.exam_pt.push(element);
                    }
                  });
                }
              }
            });
        });
    },
    //考试时间查询
    lrecordqueryUserRecord() {
      this.util
        .postAjax({
          code: code.base,
          url: code.lrecordqueryUserRecord
        })
        .then(res => {
          this.studytime = res.studytime;
          if (!this.studytime) {
            this.studytime = 0;
          }
        });
    },
    isipopen() {
      this.util
        .postAjax({
          code: code.base,
          url: code.ruleslistall
        })
        .then(res => {
          res.items.forEach(e => {
            if (e.rcode == "ISIPOPEN") {
              this.isipoepn = e.rval;
            }
            if (e.rcode == "IPSCOPE") {
              this.iprange = e.rval;
            }
            if (e.rcode == "KAOSHIADDR") {
              this.examadd = e.rval;
            }
          });
          if (this.isipoepn == "1") {
            //开启了ip限制
            var iparr = this.iprange.split("-");
            var min = this.ipToNumber(iparr[0]);
            var max = this.ipToNumber(iparr[1]);
            var mynum = this.ipToNumber(this.localip);
            if (mynum <= max && mynum >= min) {
              //在ip范围内
              this.inip = true;
              this.iniptext = "inip";
            }
          } else {
            this.inip = false;
          }
        });
    },
    //获取本地ip
    getUserIP(onNewIP) {
      //  onNewIp - your listener function for new IPs
      //compatibility for firefox and chrome
      var myPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      var pc = new myPeerConnection({
          iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

      function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
      }

      //create a bogus data channel
      pc.createDataChannel("");

      // create offer and set local description
      pc.createOffer()
        .then(function(sdp) {
          sdp.sdp.split("\n").forEach(function(line) {
            if (line.indexOf("candidate") < 0) return;
            line.match(ipRegex).forEach(iterateIP);
          });

          pc.setLocalDescription(sdp, noop, noop);
        })
        .catch(function(reason) {
          // An error occurred, so handle the failure to connect
        });
      //sten for candidate events
      pc.onicecandidate = function(ice) {
        if (
          !ice ||
          !ice.candidate ||
          !ice.candidate.candidate ||
          !ice.candidate.candidate.match(ipRegex)
        )
          return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    },
    ipToNumber(ip) {
      var numbers = ip.split(".");
      return (
        parseInt(numbers[0]) * 256 * 256 * 256 +
        parseInt(numbers[1]) * 256 * 256 +
        parseInt(numbers[2]) * 256 +
        parseInt(numbers[3])
      );
    },
    //学完的列表
    endlists() {
      this.studyed = [];
      this.util
        .postAjax({
          code: code.base,
          url: code.userStudyed
        })
        .then(res => {
          res.items.forEach(e => {
            var obj = { id: e.lsourceid };
            this.studyed.push(obj);
            var obj = {};
            this.studyed = this.studyed.reduce((cur, next) => {
              obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
              return cur;
            }, []); //设置cur默认类型为数组，并且初始值为空的数组
          });
        });
    },
    //获取在线学习不分页列表
    studylistAll(campusId) {
      this.studyed = [];
      this.util
        .postAjax({
          code: code.base,
          url: code.userStudyed
        })
        .then(res => {
          res.items.forEach(e => {
            var obj = { id: e.lsourceid };
            this.studyed.push(obj);
            var obj = {};
            this.studyed = this.studyed.reduce((cur, next) => {
              obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
              return cur;
            }, []); //设置cur默认类型为数组，并且初始值为空的数组
          });
          this.util
            .postAjax({
              code: code.base,
              url: code.listAll,
              data: {
                campusId: campusId,
                readerType: this.personinfo.readerType
              } //campusId 校区ID
            })
            .then(response => {
              this.studylist = response.items;
              var listall = [];
              this.studylist.forEach(e => {
                if (window.base.needstudy) {
                  if (e.isNeedstudy == 0) {
                    this.studyed.push({ id: e.id });
                    return;
                  }
                }
                var obj = {
                  id: e.id
                };
                listall.push(obj);
              });
              var obj = {};
              this.studyed = this.studyed.reduce((cur, next) => {
                obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
                return cur;
              }, []); //设置cur默认类型为数组，并且初始值为空的数组
              var flag = 0;
              listall.forEach(e => {
                this.studyed.forEach(ee => {
                  if (e.id == ee.id) {
                    flag++;
                  }
                });
              });
              if (listall.length == flag) {
                this.isStudyed = true;
              } else {
                this.isStudyed = false;
              }
              // console.log(this.isStudyed)
            });
        });
    },
    getUserIPa() {
      this.util
        .postAjax({
          code: code.base,
          url: "user/userIP"
        })
        .then(res => {
          this.localip = res.IP;
          this.isipopen();
        });
    }
  },
  beforeMount() {},
  created() {
    this.isfirstlogin = window.sessionStorage.getItem("isfirstlogin");
    this.getUserIPa();
    // this.getUserIP((ip)=>{
    //     this.localip = ip;
    //     this.isipopen();
    // });
    this.lrecordqueryUserRecord();
    this.examLists();
  }
};
</script>
<style>
.first_meng {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 9;
}
.first_meng > div {
  width: 83%;
  height: 70%;
  background: #fff;
  border-radius: 0.48rem;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.first_meng > div > h3 {
  width: calc(100% - 2.68rem);
  height: 2.08rem;
  background: url(../../../static/img/title_.png) no-repeat center center;
  background-size: contain;
  margin: 1.52rem auto 0.8rem;
}
.loudspeaker {
  width: 7.08rem;
  height: 5.68rem;
  background: url(../../../static/img/loudspeaker.png) no-repeat center center;
  background-size: contain;
  margin: -2.08rem auto;
}
.first_bottom {
  width: 100%;
  height: 4.4rem;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0 0.84rem;
  box-sizing: border-box;
}
.first_bottom > p {
  width: 100%;
  height: 0.8rem;
  font-size: 0.56rem;
  font-weight: 400;
  color: #999999;
  line-height: 0.8rem;
  margin-bottom: 0.8rem;
}
.first_bottom > p > i {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background: url(../../../static/img/noselect.png) no-repeat center center;
  background-size: contain;
  float: left;
  margin-top: 0.1rem;
  margin-right: 0.24rem;
}
.first_bottom > p > i.selected {
  background: url(../../../static/img/selected.png) no-repeat center center;
  background-size: contain;
}
.first_content {
  width: 100%;
  height: calc(100% - 10.36rem);
  overflow: auto;
  font-size: 0.56rem;
  font-weight: 400;
  color: #555555;
  line-height: 0.84rem;
  padding: 0 0.84rem;
  box-sizing: border-box;
}
.first_content > p {
  margin-bottom: 0.4rem;
}
.first_bottom > button {
  width: 100%;
  height: 1.8rem;
  background: #eeeeee;
  border: none;
  outline: none;
  border-radius: 1.8rem;
  font-size: 0.64rem;
  font-weight: 500;
  color: #cccccc;
  line-height: 1.8rem;
}
.first_bottom > button.selected {
  background: linear-gradient(90deg, #19a1fb 0%, #1472ff 100%);
  color: #ffffff;
}
.goexam_btn {
  width: 6.5rem;
  height: 1.75rem;
  background: #2d94fb;
  border-radius: 0.88rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.75rem;
  text-align: center;
  margin: 0 auto;
  margin-top: 0.75rem;
}
.noexamlist {
  width: 100%;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  font-style: 0.5rem;
}
.noexam {
  width: 6.65rem;
  height: 2rem;
  background: rgba(216, 218, 219, 0.3);
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 400;
  color: rgba(184, 187, 190, 1);
  line-height: 2rem;
  letter-spacing: 2px;
  outline: none;
  border: none;
  margin-top: 1.25rem;
  margin-left: calc(50% - 3.08rem);
}
.noexam1 {
  width: 100%;
  height: 1.05rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(248, 101, 121, 1);
  line-height: 1.05rem;
}
.singleexam_buttom > p {
  font-size: 0.75rem;
}
.singleexam_buttom > p > i {
  display: inline-block;
  width: 0.9rem;
  height: 0.9rem;
  background: url(../../../static/img/complete.png) no-repeat center center;
  background-size: cover;
  float: right;
}
.gostudy,
.gostudy1 {
  width: 6.16rem;
  height: 1.75rem;
  background: rgba(45, 148, 251, 1);
  border-radius: 0.88rem;
  border: none;
  outline: none;
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 1.75rem;
  margin-top: 1.25rem;
  margin-left: calc(50% - 3.08rem);
}
.gostudy1 {
  background: rgba(153, 153, 153, 1);
}
.gostudy > i,
.gostudy1 > i {
  display: inline-block;
  width: 0.63rem;
  height: 0.55rem;
  background: url(../../../static/img/gostudy.png) no-repeat center center;
  background-size: cover;
}
.exam_content {
  width: 100%;
  background: rgba(248, 248, 248, 1);
  padding-top: 0.5rem;
  padding-bottom: 3.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-sizing: border-box;
  height: 100%;
  position: fixed;
  overflow: auto;
}
.exam_content1 {
  width: 100%;
  margin: 0 auto;
  background: #fff;
  font-size: 14px;
  padding: 0.8rem;
  padding-bottom: 3.5rem;
  box-sizing: border-box;
  text-align: center;
}
.single_exam {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rem 0rem 0.25rem 0.15rem rgba(0, 0, 0, 0.06);
  border-radius: 0.25rem;
  margin: 0 auto;
  margin-top: 0.75rem;
  padding-bottom: 0.75rem !important;
  box-sizing: border-box;
}
.singleexam_top {
  width: 100%;
  height: 4.18rem;
  background: #fff;
  position: relative;
}
.singleexam_topimg {
  width: 100%;
  height: 3.52rem;
  background: url(../../../static/img/moni.png) no-repeat center center;
  background-size: cover;
}
.singleexam_toptitle {
  width: 50%;
  height: 1.6rem;
  background: url(../../../static/img/examtitle.png) no-repeat center center;
  background-size: cover;
  position: absolute;
  bottom: 0;
  left: 25%;
}
.singleexam_toptitle > p {
  width: 100%;
  text-align: center;
  height: 1.05rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(140, 79, 37, 1);
  line-height: 1.05rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.singleexam_buttom {
  width: 90%;
  margin: 0 auto;
  /* height:4.2rem; */
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 1.05rem;
  margin-top: 0.68rem;
  text-align: justify;
}
.singleexam_buttom > h3 {
  width: 80%;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin: 0 auto 0.5rem;
}
</style>