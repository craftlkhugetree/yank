<template>
  <div>
    <div class="person_img clearfix">
      <div class="person_head" v-if="personInfo.HEADPICID">
        <img :src="personInfo.HEADPICID" alt />
      </div>
      <div class="person_head" v-else>
        <img src="../../../static/img/defaultHead.png" alt />
      </div>
      <div class="person_name">
        <h3>
          {{personInfo.NAME}}
          <span class="no-bind" @click="unbind">解除绑定</span>
        </h3>
        <p class="clearfix">
          <em>{{personInfo.ORGNAME}}</em>
          <i v-if="BlackText.isBlack"></i>
          <span v-if="BlackText.isBlack">{{BlackText.hfdate}} 恢复使用</span>
          <span v-if="!BlackText.isBlack && unsignText.unsignnum>0">已累计{{unsignText.unsignnum}}次未签到</span>
        </p>
      </div>
      <i></i>
    </div>
    <ul class="addCommonseat clearfix">
      <li v-for="(v,i) in mycommonLists" :key="i">
        <h3>
          {{v.seatname}}号座
          <i @click="delcommonseat(v.id)"></i>
        </h3>
        <p>{{v.sectionname}}</p>
      </li>
      <li class="add" @click="add" v-if="mycommonLists.length<2">
        <span></span>
        <p>添加常用座位</p>
      </li>
    </ul>
    <ul class="personList">
      <li @click="goorderHistory">
        <p>
          <i class="appointRecord"></i>历史记录
          <!-- <span>2</span> -->
        </p>
        <span></span>
      </li>
      <li @click="goranking">
        <p>
          <i class="rank"></i>排行榜
        </p>
        <span></span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mycommonLists: [],
      oneseatid: "",
      BlackText: "",
      unsignText: "",
      personInfo: ""
    };
  },
  methods: {
    //解除登录绑定
    unbind() {
      sessionStorage.clear();
      location.href = window.base.loginToUrl;
    },
    getuserDetail() {
      this.util
        .postAjax({
          code: this.code.authbase,
          url: this.code.userDetail
        })
        .then(res => {
          if (res.success) {
            this.personInfo = res.item;
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    add() {
      this.$router.push({
        path: "addCommon",
        query: {
          onlyid: this.oneseatid
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
              e.onlyid = e.sectionid + "" + e.seatid;
            });
            if (this.mycommonLists.length == 1) {
              this.oneseatid = this.mycommonLists[0].onlyid;
            } else {
              this.oneseatid = "";
            }
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    delcommonseat(id) {
      this.Dialog.confirm({
        message: "确认删除？"
      }).then(() => {
        this.util
          .postAjax({
            code: this.code.base,
            url: this.code.delcommonseat,
            data: {
              id: id
            }
          })
          .then(res => {
            if (res.success) {
              this.getmycommonLists();
              this.Toast("删除成功");
            } else {
              this.Toast(res.data.message);
            }
          });
      });
    },
    goorderHistory() {
      this.$router.push("orderHistory");
    },
    gobreakrecord() {
      this.$router.push("breakrecord");
    },
    goranking() {
      this.$router.push("ranking");
    },
    isInBlackList() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.isInBlackList
        })
        .then(res => {
          if (res.success) {
            if (res.data.isBlack) {
              //是黑名单
              this.BlackText = res.data;
            } else {
              this.unsignrecord();
            }
          } else {
            this.Toast(res.data.message);
          }
        });
    },
    unsignrecord() {
      this.util
        .postAjax({
          code: this.code.base,
          url: this.code.unsignrecord
        })
        .then(res => {
          if (res.success) {
            this.unsignText = res.data;
          } else {
            this.Toast(res.data.message);
          }
        });
    }
  },
  created() {
    this.getuserDetail();
    this.$store.dispatch("getBlackText");
    this.isInBlackList();
    this.getmycommonLists();
  }
};
</script>
<style scoped>
.person_img {
  width: 100%;
  background: #fff;
  padding: 24px 30px;
  box-sizing: border-box;
  position: relative;
}
.person_head {
  width: 120px;
  height: 120px;
  background: red;
  float: left;
  border-radius: 60px;
  margin-right: 24px;
}
.person_head > img {
  width: 100%;
  height: 100%;
}
.person_name {
  width: calc(100% -144px);
  height: 120px;
}
.person_name > h3 {
  width: 100%;
  height: 50px;
  font-size: 36px;
  font-weight: 550;
  color: #333333;
  line-height: 50px;
  margin-top: 8px;
}
.person_name > p {
  width: 100%;
  height: 42px;
  line-height: 42px;
  margin-top: 20px;
}
.person_name > p > em {
  float: left;
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  font-style: normal;
  margin-right: 24px;
}
.person_name > p > i {
  display: inline-block;
  width: 26px;
  height: 26px;
  background: url(../../../static/img/disabled.png) no-repeat center center;
  background-size: cover;
  margin-top: 8px;
}
.person_name > p > span {
  display: inline-block;
  height: 42px;
  font-size: 24px;
  font-weight: 400;
  color: #f23c3c;
  line-height: 42px;
  margin-left: 12px;
}
.person_img > i {
  display: inline-block;
  width: 20px;
  height: 24px;
  background: url(../../../static/img/timeArr.png) no-repeat center center;
  background-size: cover;
  position: absolute;
  right: 30px;
  top: 1.8rem;
  display: none;
}
.addCommonseat {
  width: 100%;
  background: #fff;
  padding: 0px 30px 40px 30px;
  box-sizing: border-box;
}
.addCommonseat > li {
  width: 333px;
  height: 134px;
  background: url(../../../static/img/mycommonseat.png) no-repeat center center;
  background-size: cover;
  border-radius: 16px;
  float: left;
  padding: 30px;
  box-sizing: border-box;
}
.addCommonseat > li.add {
  background: #f8f7f5;
  text-align: center;
}
.addCommonseat > li.add > span {
  display: inline-block;
  width: 36px;
  height: 36px;
  background: url(../../../static/img/addcommon.png) no-repeat center center;
  background-size: cover;
  border: 1px solid #f8f7f5;
}
.addCommonseat > li.add > p {
  width: 100%;
  height: 28px;
  font-size: 20px;
  font-weight: 400;
  color: #ffa033;
  line-height: 28px;
  text-align: center;
}
.addCommonseat > li > h3 {
  width: 100%;
  height: 26px;
  font-size: 32px;
  font-weight: 600;
  color: #333333;
  line-height: 26px;
}
.no-bind {
  font-size: 20px;
  font-weight: 400;
  color: #ffa033;
  background: #f8f7f5;
  float: right;
  border-radius: 5px;
  padding: 0px 8px;
  box-sizing: border-box;
  position: absolute;
  right: 30px;
}

.addCommonseat > li > h3 > i {
  width: 20px;
  height: 20px;
  background: url(../../../static/img/del.png) no-repeat center center;
  background-size: cover;
  float: right;
}
.addCommonseat > li > p {
  width: 100%;
  height: 26px;
  font-size: 24px;
  font-weight: 400;
  color: #333333;
  line-height: 26px;
  margin-top: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.addCommonseat > li:first-of-type {
  margin-right: 24px;
}
.personList {
  width: 100%;
  background: #fff;
  margin-top: 24px;
}
.personList > li {
  width: 100%;
  height: 100px;
  padding: 36px 39px;
  box-sizing: border-box;
  position: relative;
}
.personList > li > p {
  width: 100%;
  height: 42px;
  font-size: 30px;
  font-weight: 400;
  color: #333333;
  line-height: 42px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.personList > li > p > i {
  display: inline-block;
  width: 34px;
  height: 36px;
  background: #333333;
  margin-right: 24px;
}
.personList > li > p > i.appointRecord {
  background: url(../../../static/img/appointRecord.png) no-repeat center center;
  background-size: cover;
}
.personList > li > p > i.CriminalRecord {
  background: url(../../../static/img/CriminalRecord.png) no-repeat center
    center;
  background-size: cover;
}
.personList > li > p > i.rank {
  background: url(../../../static/img/rank.png) no-repeat center center;
  background-size: cover;
}
.personList > li > p > span {
  display: inline-block;
  width: 36px;
  height: 36px;
  background: #f23c3c;
  line-height: 36px;
  text-align: center;
  color: #fff;
  border-radius: 50%;
  font-size: 24px;
  font-weight: 400;
  margin-right: 24px;
}
.personList > li > span {
  display: inline-block;
  width: 24px;
  height: 24px;
  background: url(../../../static/img/rightarr_b.png) no-repeat center center;
  background-size: cover;
  position: absolute;
  right: 39px;
  top: 40px;
}
</style>