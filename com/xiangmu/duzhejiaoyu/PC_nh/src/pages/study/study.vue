<template>
  <div>
    <div class="study_content">
      <div class="study_img"></div>
      <p v-if="studytime != 0">
        总共已在线学习 <i>{{ studytime[0] }}</i
        >:<i>{{ studytime[1] }}</i
        >:<i>{{ studytime[2] }}</i>
        <!-- <p v-else>总共已在线学习 <i>0</i><i>0</i>:<i>0</i><i>0</i>:<i>0</i><i>0</i> -->
      </p>

      <h3>
        学习资料
        <span class="totalnum">{{ total }}个</span>
        <span v-if="islearnnum" class="study_order"
          >已开启按顺序学习：需学完当前资料才可点击下一资料</span
        >
      </h3>
      <!-- fileType= 1视频2文档3超文本 -->
      <div
        class="study_list"
        ref="studys"
        v-for="(v, i) in studylists"
        :class="{ endstudy: v.end }"
        :key="i"
        @click="godetail(v)"
        @mouseover="in_study(i)"
        @mouseout="out_study(i)"
      >
        <i v-if="islearnnum && v.ending" :class="{ ending: v.ending }">未读</i>
        <div
          class="clearfix"
          :style="'padding: 20px 43px;box-sizing: border-box;'"
        >
          <div v-if="v.fileType == '1'" class="study_list_img">
            <span class="imgSpan">视频</span>
            <video
              style="width: 100%; height: 100%"
              v-if="v.photourl"
              :poster="v.photourl"
              :src="v.url"
            >
              您的浏览器不支持 video 标签。
            </video>
            <video
              style="width: 100%; height: 100%"
              v-else
              :src="v.url"
              poster="../../../static/img/default1.png"
            >
              您的浏览器不支持 video 标签。
            </video>
            <div class="time_num"><i></i></div>
          </div>
          <div v-else class="study_list_img">
            <span v-if="v.fileType == '2'" class="imgSpan2">文档</span>
            <span v-if="v.fileType == '3'" class="imgSpan3">在线文章</span>
            <img v-if="v.photourl" :src="v.photourl" alt="" srcset="" />
            <img
              v-if="!v.photourl"
              src="../../../static/img/default1.png"
              alt=""
              srcset=""
            />
          </div>
          <div class="study_list_title">
            <h3 v-if="v.fileType == '1'">{{ v.name }}</h3>
            <h3 v-if="v.fileType == '2'">{{ v.name }}</h3>
            <h3 v-if="v.fileType == '3'">{{ v.name }}</h3>
            <p class="intro" v-html="v.description"></p>
            <div class="pub_time">
              <span class="pub_time_icon"
                ><i class="see_icon"></i>{{ v.watchCount
                }}<i class="down_icon"></i>{{ v.downloadCount }}</span
              >
            </div>
          </div>
        </div>
        <div :class="{ lock: !v.end }"></div>
      </div>
      <el-pagination
        class="fenye"
        background
        layout="prev, pager, next"
        @current-change="currentchange"
        :current-page.sync="page"
        :total="total"
      >
      </el-pagination>
    </div>
    <div v-if="isIE9" class="ie_box">
      <div class="ie_box_">
        <div class="ie_box_img"></div>
        <p>为了不影响系统使用，请升级浏览器版本</p>
        <div class="btn" @click="close">确定</div>
      </div>
    </div>
    <guideUse v-if="showUse" @closeuseguide="closeuse"></guideUse>
  </div>
</template>
<script>
import code from "../../util/code";
import guideUse from "../../common/use";
export default {
  components: { guideUse },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      searchkeyword: "",
      studylists: [],
      studytime: "", //学习时间
      domain: window.base.baseURL,
      islearnnum: false,
      isIE9: false,
      needstudy: window.base.needstudy,
      showUse: false,
    };
  },
  methods: {
    closeuse() {
      this.showUse = false;
      window.sessionStorage.removeItem("useguide");
    },
    haslearnnum() {
      this.util
        .postAjax({
          code: code.base,
          url: code.ruleslist,
          data: {
            code: "ISLEARNNUMOPEN", //是否顺序阅读
          },
        })
        .then((res) => {
          if (res.item.rval == "1") {
            this.islearnnum = true;
          } else {
            this.islearnnum = false;
          }
        });
    },
    in_study(i) {
      // var classStr = this.$refs.studys[i].getAttribute('class');
      // if(classStr.indexOf('endstudy')== -1){
      //     this.$refs.studys[i].setAttribute('class','study_act')
      // }else{
      //     this.$refs.studys[i].setAttribute('class','study_act endstudy')
      // }
    },
    out_study(i) {
      // this.$refs.studys[i].setAttribute('class','study_list')
    },
    //获取学习列表
    loadstudylists() {
      this.util
        .postAjax({
          code: code.base,
          url: code.ruleslist,
          data: {
            code: "ISLEARNNUMOPEN", //是否顺序阅读
          },
        })
        .then((res) => {
          if (res.item.rval == "1") {
            this.islearnnum = true;
            this.studyed = [];
            this.util
              .postAjax({
                code: code.base,
                url: code.userStudyed,
              })
              .then((res) => {
                res.items.forEach((e) => {
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
                    url: code.getstudy,
                    data: {
                      page: this.page,
                      limit: this.limit,
                      filter: JSON.stringify({
                        name: this.searchkeyword,
                        readerType: window.sessionStorage.getItem("readerType"),
                        campusId: window.sessionStorage.getItem("campusId"),
                      }),
                    },
                  })
                  .then((response) => {
                    this.studylists = response.items;
                    this.studylists.forEach((e) => {
                      e.end = true; //放开所有
                    });
                    //id不相同的
                    // let add = this.studylists.filter(item => !this.studyed.some(ele=>ele.id===item.id));
                    // add.forEach((e,i)=>{
                    //     e.end = false;
                    //     if(i==0){//把后一个放开
                    //         e.end = true;
                    //         e.ending = true;
                    //     }
                    // })
                    //id不相同的
                    let add = this.studylists.filter(
                      (item) => !this.studyed.some((ele) => ele.id === item.id)
                    );
                    if (this.needstudy) {
                      add.forEach((e, i) => {
                        e.end = false;
                        if (e.isNeedstudy == 0) {
                          e.end = true;
                        }
                      });
                      let index = this.studylists.findIndex(
                        (item) => item.end == false
                      );
                      if (index != -1) {
                        this.studylists[index].ending = true;
                        this.studylists[index].end = true;
                      }
                    } else {
                      add.forEach((e, i) => {
                        e.end = false;
                        if (i == 0) {
                          //把后一个放开
                          e.end = true;
                          e.ending = true;
                        }
                      });
                    }
                    console.log("tag", this.studylists);
                    this.total = response.total;
                  });
              });
          } else {
            this.islearnnum = false;
            this.util
              .postAjax({
                code: code.base,
                url: code.getstudy,
                data: {
                  page: this.page,
                  limit: this.limit,
                  filter: JSON.stringify({
                    name: this.searchkeyword,
                    readerType: window.sessionStorage.getItem("readerType"),
                    campusId: window.sessionStorage.getItem("campusId"),
                  }),
                },
              })
              .then((res) => {
                this.studylists = res.items;
                this.studylists.forEach((e) => {
                  e.end = true; //放开所有
                });
                this.total = res.total;
              });
          }
        });
    },
    //学习时间查询------
    lrecordqueryUserRecord() {
      this.util
        .postAjax({
          code: code.base,
          url: code.lrecordqueryUserRecord,
        })
        .then((res) => {
          if (res.success) {
            if (!res.studytime) {
              res.studytime = 0;
            }
            this.studytime = res.studytime;
            if (this.studytime == null) {
              this.studytime = 0;
            } else {
              this.studytime = this.util
                .formatSeconds(parseInt(res.studytime) * 60)
                .split(":");
            }
          }
        });
    },
    //学完的列表
    endlists() {
      this.studyed = [];
      this.util
        .postAjax({
          code: code.base,
          url: code.userStudyed,
        })
        .then((res) => {
          res.items.forEach((e) => {
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
    //分页
    currentchange(curr) {
      this.page = curr;
      this.loadstudylists();
    },
    close() {
      this.isIE9 = false;
    },
    //详情<!-- fileType= 1视频2文档3超文本 -->
    godetail(obj) {
      window.sessionStorage.setItem("page", this.page);
      if (this.islearnnum) {
        var ended = false;
        this.studyed.forEach((e) => {
          if (e.id == obj.id) {
            ended = true;
          }
        });
        if (!obj.end) {
          //
          this.$message({
            message: "按顺序学习后方可解锁当前资料",
            type: "warning",
          });
          return;
        }
        switch (obj.fileType) {
          case 1:
            this.$router.push({
              path: "vediodetail",
              query: {
                id: obj.id,
                ended: ended,
                islearnnum: true,
              },
            });
            break;
          case 2:
            // var browser=navigator.appName
            // var b_version=navigator.appVersion
            // var version=b_version.split(";");
            // var trim_Version=version[1].replace(/[ ]/g,"");
            // if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0"){
            //     this.isIE9 = true;
            //     return
            // }
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE =
              userAgent.indexOf("compatible") > -1 &&
              userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isIE11 =
              userAgent.indexOf("Trident") > -1 &&
              userAgent.indexOf("rv:11.0") > -1;
            if (isIE) {
              var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
              reIE.test(userAgent);
              var fIEVersion = parseFloat(RegExp["$1"]);
              if (fIEVersion == 9) {
                this.isIE9 = true;
                return;
              }
            }
            this.$router.push({
              path: "docdetail",
              query: {
                id: obj.id,
                ended: ended,
                islearnnum: true,
              },
            });

            break;
          case 3:
            this.$router.push({
              path: "arcdetail",
              query: {
                id: obj.id,
                ended: ended,
                islearnnum: true,
              },
            });
            break;
        }
      } else {
        switch (obj.fileType) {
          case 1:
            this.$router.push({
              path: "vediodetail",
              query: {
                id: obj.id,
                islearnnum: false,
              },
            });
            break;
          case 2:
            // var browser=navigator.appName
            // var b_version=navigator.appVersion
            // var version=b_version.split(";");
            // var trim_Version=version[1].replace(/[ ]/g,"");

            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE =
              userAgent.indexOf("compatible") > -1 &&
              userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isIE11 =
              userAgent.indexOf("Trident") > -1 &&
              userAgent.indexOf("rv:11.0") > -1;
            if (isIE) {
              var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
              reIE.test(userAgent);
              var fIEVersion = parseFloat(RegExp["$1"]);
              if (fIEVersion == 9) {
                this.isIE9 = true;
                return;
              }
            }
            // if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0"){
            //     this.isIE9 = true;
            //     return
            // }
            this.$router.push({
              path: "docdetail",
              query: {
                id: obj.id,
                islearnnum: false,
              },
            });
            break;
          case 3:
            this.$router.push({
              path: "arcdetail",
              query: {
                id: obj.id,
                islearnnum: false,
              },
            });
            break;
        }
      }
    },
  },
  created() {
    this.showUse =
      window.sessionStorage.getItem("useguide") == "1" ? true : false;
    this.haslearnnum();
    this.page = window.sessionStorage.getItem("page")
      ? parseInt(window.sessionStorage.getItem("page"))
      : 1;
    this.lrecordqueryUserRecord();
    this.loadstudylists();
  },
};
</script>
<style scoped>
.ie_box {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
}
.ie_box_img {
  width: 36px;
  height: 36px;
  background: url(../../../static/img/info.png) no-repeat center center;
  background-size: cover;
  margin: 30px auto;
}
.ie_box_ {
  width: 383px;
  height: 211px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.ie_box_ > p {
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(31, 35, 47, 1);
  line-height: 20px;
  text-align: center;
}
.ie_box_ > .btn {
  width: 83px;
  height: 38px;
  background: rgba(20, 114, 255, 1);
  border-radius: 3px;
  position: absolute;
  bottom: 30px;
  left: calc(50% - 41.5px);
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 38px;
  letter-spacing: 1px;
  text-align: center;
}
.study_list_img {
  width: 214px;
  height: 120px;
  float: left;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
}
.imgSpan,
.imgSpan3,
.imgSpan2 {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 68px;
  height: 27px;
  background: #dcd1fd;
  font-size: 12px;
  font-weight: 500;
  color: rgba(113, 68, 249, 1);
  line-height: 27px;
  text-align: center;
}
.imgSpan2 {
  background: #10b5e5;
  color: #d6f4fe;
}
.imgSpan3 {
  background: #c0f3dd;
  color: rgba(13, 207, 123, 1);
}
.study_list_img > img {
  width: 100%;
  height: 100%;
}
.fenye {
  text-align: right;
  margin-top: 20px;
}
.study_content {
  width: 1100px;
  /* height: 100%; */
  background: #fff;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
}
.study_content > p {
  margin: 40px 0 0px 0;
  text-align: right;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(26, 119, 255, 1);
  line-height: 20px;
}
.study_content > p > i {
  display: inline-block;
  /* width:17px; */
  height: 20px;
  background: rgba(205, 225, 255, 1);
  border-radius: 3px;
  margin: 0 2px;
  font-style: normal;
  text-align: center;
}
.study_img {
  width: 100%;
  height: 232px;
  background: url(../../../static/img/study.png) no-repeat center center;
  background-size: cover;
}
.study_content > h3 {
  width: 100%;
  height: 25px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(31, 35, 47, 1);
  line-height: 25px;
  /* margin: 40px 0 20px 0; */
}
.totalnum {
  width: 22px;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(98, 101, 109, 1);
  line-height: 20px;
  margin-left: 10px;
}
.study_order {
  font-size: 14px;
  font-weight: 400;
  color: #eec15a;
  line-height: 20px;
  margin-left: 10px;
}
.titaltime {
  font-size: 14px;
  font-weight: 400;
  color: rgba(26, 119, 255, 1);
  float: right;
}
.titaltime > .titaltime_ {
  float: left;
  margin-right: 5px;
}
.titaltime > i {
  display: inline-block;
  width: 17px;
  height: 20px;
  background: rgba(205, 225, 255, 1);
  line-height: 20px;
  text-align: center;
  border-radius: 3px;
  margin: 2px;
}
.study_list {
  background: rgba(243, 245, 249, 1);
  opacity: 0.49;
  width: 100%;
  border-bottom: 1px solid #e8ebef;
  position: relative;
}
.lock {
  width: 48px;
  height: 48px;
  background: url(../../../static/img/lock.png) no-repeat center center;
  background-size: cover;
  position: absolute;
  right: 40px;
  top: calc(50% - 24px);
}
.ending {
  position: absolute;
  width: 40px;
  height: 20px;
  background: #ffcd43;
  font-style: normal;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
}
.study_list.endstudy {
  background: #fff;
  opacity: 1;
}
.study_act {
  background: rgba(205, 225, 255, 0.39);
  border-bottom: 1px solid #fff;
}
.study_list_title {
  width: calc(100% - 243px);
  height: 120px;
  float: right;
  position: relative;
}
.study_list_title > h3 {
  width: 100%;
  height: 25px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(31, 35, 47, 1);
  line-height: 25px;
}
.study_list_title > h3 > span {
  display: inline-block;
  width: 63px;
  height: 25px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(113, 68, 249, 1);
  line-height: 25px;
  margin-left: 20px;
  text-indent: 15px;
}
.intro {
  width: 60%;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(98, 101, 109, 1);
  line-height: 20px;
  margin-top: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pub_time {
  width: 100%;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(98, 101, 109, 1);
  line-height: 17px;
  margin-top: 22px;
  position: absolute;
  bottom: 0;
}
/* .pub_time_icon{
        float: right;
    } */
.see_icon {
  display: inline-block;
  width: 15px;
  height: 11px;
  background: url(../../../static/img/see.png) no-repeat center center;
  background-size: cover;
  margin-right: 5px;
  /* float: left; */
  margin-top: 3px;
}
.down_icon {
  display: inline-block;
  width: 15px;
  height: 11px;
  background: url(../../../static/img/down.png) no-repeat center center;
  background-size: contain;
  margin-right: 5px;
  /* float: left; */
  margin-top: 3px;
  margin-left: 20px;
}
</style>
