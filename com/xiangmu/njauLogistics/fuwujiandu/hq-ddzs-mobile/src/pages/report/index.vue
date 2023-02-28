<template>
  <div>
    <role-bar title="我要督查"></role-bar>
    <div class="bg">
      <map-card
        ref="mapCard"
        :asFinish="refPos"
        :unit="'calc((100vw) / 4 - 16px - 8px)'"
      ></map-card>
      <van-field
        v-model="form.areaName"
        left-icon="location-o"
        placeholder="（添加地点）必填"
        readonly
        @click="toMap"
      />
      <rich-text ref="rich"></rich-text>
      <v-List
        :list="voiceList"
        :delV="delVoice"
        v-show="util.isWeiXin()"
      ></v-List>
      <van-button round class="btn" :disabled="canBtn" @click.stop="next">
        下一步</van-button
      >
      <voice-area
        ref="voice"
        @getPosition="getPosition"
        v-show="util.isWeiXin()"
        @getId="getVoice"
        @getTranslate="getTranslate"
      ></voice-area>
    </div>
  </div>
</template>
<script>
import { workCampus_query, workArea_query } from "@/assets/js/api";

export default {
  name: "Report",
  components: {
    mapCard: () => import("@/components/mapCard"),
    richText: () => import("@/components/ddInput"),
    voiceArea: () => import("./voiceArea"),
    vList: () => import("@/components/voiceList")
  },
  data() {
    return {
      locList: [],
      campusList: [],
      form: {
        areaName: "",
        areaId: null,
        note: "",
        labels: "",
        innerHTML: "",
        innerText: "",
        voiceList: [],
        fileList: []
      },
      voiceList: []
    };
  },
  computed: {
    fileList() {
      return (this.$refs.mapCard && this.$refs.mapCard.fileList) || [];
    },
    canBtn() {
      return !(
        this.form.areaName &&
        this.form.innerText &&
        this.fileList.length
      );
    }
  },
  methods: {
    getTranslate(str) {
      let div = document.getElementById(this.global.richText);
      let innerHTML = div.innerHTML;
      div.innerHTML = innerHTML + str;
    },
    getVoice(id) {
      this.voiceList.push(id);
      this.form.voiceList.push(id);
    },
    delVoice(item) {
      this.voiceList = this.voiceList.filter(v => v !== item);
    },
    saveData() {
      this.form.fileList = this.fileList;
      if (!this.form.position) {
        this.getPosition();
      }
      if (this.voiceList.length !== this.form.voiceList) {
        this.form.voiceList = [...this.voiceList];
      }
      this.getRichText();
      this.common.setStore(this.global.FORM, this.form);
    },
    toMap() {
      this.saveData();
      this.$router.push("/report-map");
    },
    next() {
      this.saveData();
      this.$router.push("/report-handleDeptId");
    },
    getRichText() {
      let div = document.getElementById(this.global.richText);
      this.form.innerHTML = div.innerHTML;
      this.form.innerText = div.innerText.trim();
    },
    goDetail(item) {
      this.$router.push({
        path: "/labelDetail",
        query: { ...item, title: "共性标签" }
      });
    },
    refPos() {
      if (!this.form.areaName && this.$refs.voice) {
        this.$refs.voice.getPosition();
      }
    },
    LS(x1, x2, y1, y2) {
      let x = (x1 - x2) * (x1 - x2);
      let y = (y1 - y2) * (y1 - y2);
      return x + y;
    },
    getPosition(lat, lng) {
      let obj = null;
      if (lat && lng && this.locList.length) {
        obj = this.locList[0];
        let ls = this.LS(obj.longitude, lng, obj.latitude, lat);
        this.locList.forEach(c => {
          let tmp = this.LS(c.longitude, lng, c.latitude, lat);
          if (tmp < ls) {
            ls = tmp;
            obj = c;
          }
        });
      } else {
        obj = this.locList.find(c => c.workCampusId == "4") || this.locList[0];
      }
      this.form.position = obj;
      this.$set(this.form, "areaName", obj.name);
      this.form.areaId = obj.id;
    },
    getArea() {
      workArea_query({ isPage: false, filter: { status: 1 } }).then(res => {
        this.common.dealRes(res, () => {
          this.locList = res.data;
          this.form.locList = this.locList;
          this.form.campusList = this.campusList;
          this.refPos();
        });
      });
    },
    getCampus() {
      workCampus_query({ isPage: false }).then(res => {
        this.common.dealRes(res, () => {
          this.campusList = res.data;
          this.getArea();
        });
      });
    }
  },
  mounted() {
    this.getCampus();
    if (this.$store.state.isBack2Report) {
      let form = this.common.getStore(this.global.FORM);
      this.form = { ...form };
      if (this.$refs.mapCard) {
        this.$refs.mapCard.fileList = form.fileList;
      }
      this.voiceList = form.voiceList;
      let timer = setInterval(() => {
        let div = document.getElementById(this.global.richText);
        if (div) {
          div.innerHTML = form.innerHTML;
          div.focus();
          clearInterval(timer);
        }
      }, 500);
    }
  }
};
</script>
<style lang="scss" scoped>
.upload {
  display: none;
}
.bg {
  .btn {
    width: 100%;
    background: #006457;
    font-size: 16px;
    color: #ffffff;
    margin-top: $fixed_side;
  }
}
/deep/ .van-cell {
  padding-left: 0;
  padding-right: 0;
}
</style>
