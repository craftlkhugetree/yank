<template>
  <div>
    <div class="wind back div_flex" @click="back">
      <div class="div_flex">
        <i class="iconfont iconreturn"></i>
        <span>返回</span>
      </div>
    </div>
    <van-dropdown-menu class="wind drop" active-color="#006457">
      <van-dropdown-item v-model="value1" :options="option1" />
    </van-dropdown-menu>
    <div class="wind search div_flex" @click="onSearch">
      <i class="iconfont icon-search"></i>
    </div>
    <!-- <van-search
      :clearable="false"
      v-model="keyword"
      placeholder="请输入"
      @focus="onFocus"
      autofocus
      show-action
      @cancel="onCancel"
      maxlength="20"
      class="v_search wind"
      id="mapSearch"
      v-show="showKey"
      :autocomplete="false"
    /> -->
    <!-- <location-drop
      :selectDataList="locList"
      :nodeText="keyword"
      v-if="showList"
      @itemClick="choose"
      :pos="pos"
    ></location-drop> -->
    <!-- 地图容器 -->
    <div v-show="isJiangBei || first" :id="gis" class="whole"></div>
    <div :id="con" v-show="!isJiangBei" class="whole"></div>
    <map-side ref="center" :form="form"></map-side>
  </div>
</template>

<script>
import baidu from "@/assets/js/map";
import $ from "jquery";
export default {
  components: {
    locationDrop: () => import("./locationDrop"),
    mapSide: () => import("./mapSide")
  },
  data() {
    return {
      mp: null,
      bMapType: null,
      locList: [],
      campusList: [],
      form: {},
      longitude: null,
      latitude: null,
      position: null,
      value1: "",
      option1: [],
      showKey: false,
      keyword: "",
      showList: false,
      pos: null,
      con: "container",
      gis: "dd_map",
      first: true
    };
  },
  computed: {
    isJiangBei() {
      let obj = this.campusList.find(c => c.id === this.value1) || {};
      return obj.name && obj.name.indexOf("江北") > -1;
    }
  },
  watch: {
    value1(val) {
      if (this.mp && this.bMapType) {
        let obj = this.campusList.find(c => c.id === val) || {};
        var point = new this.bMapType.Point(obj.longitude, obj.latitude);
        this.mp.setCenter(point);
      }
    }
  },
  methods: {
    initGIS() {
      this.loading();
      //初始化地图变量
      let map = null;
      //初始化marker
      var markerlist = [];
      let marker = null;
      var oneMarker = null;
      //配置地图调用授权Token
      creeper.CreeperConfig.token = window.g.GISToken;
      // creeper.CreeperConfig.token = "eWFuZ3poZToxMjM0NTY=";
      map = new creeper.VectorMap(this.gis, 9, window.g.GISUrl);
      $.ajaxSettings.async = false;
      var draw = new creeper.Draw(map, true);
      // let arr = [104.0621822253949, 30.594548922105616];
      let arr = [this.longitude, this.latitude];
      map.setCenter(arr);
      map.on("load", e => {
        //添加marker与给marker添加弹框
        var popup = new creeper.Popup({
          className: "my-class"
        }).setHTML("<h1>demo7 地图marker </h1>");
        oneMarker = new creeper.Marker()
          .setPopup(popup)
          // .setLngLat([this.longitude, this.latitude])
          .setLngLat(arr)
          .addTo(map);
        markerlist.push(oneMarker);
        //点击地图添加marker
        map.on("click", function(e) {
          var coordinate = map.unproject(e.point);
          console.log(coordinate);
          // 当点击地图时，获取该点对应的屏幕坐标
          marker = new creeper.Marker().setLngLat(coordinate).addTo(map);
          markerlist.push(marker);
        });
        this.$toast.clear();
        this.loadBd();
      });
    },
    onSearch() {
      // this.showKey = true;
      // this.$router.push("/report-map-list");
      this.$refs.center.label = [...this.locList];
      this.$refs.center.centerShow = true;
    },
    onFocus() {
      let div = document.getElementById("mapSearch");
      let pos = div.getBoundingClientRect();
      console.log(pos);
      this.pos = pos.bottom;
      this.showList = true;
    },
    onCancel() {
      this.keyword = "";
      this.showKey = false;
      this.showList = false;
    },
    init(BMap) {
      var flag = 0;
      var BMap_GL = flag ? BMapGL : BMap;
      this.bMapType = BMap_GL;
      // var BMapLib_GL = flag ? BMapGLLib : BMapLib;
      this.mp = new BMap_GL.Map(this.con, { showControls: true });
      // 鼠标滚动缩放
      this.mp.enableScrollWheelZoom(true);
      // 地图中心点，并设置级别
      this.mp.centerAndZoom(
        new BMap_GL.Point(this.longitude, this.latitude),
        10
      );
      //   mp.centerAndZoom(new BMap_GL.Point(106.908, 28.1744), 10);
      // 地图类型，卫星地图
      //   mp.setMapType(BMAP_HYBRID_MAP);
      // 地图缩放级别
      this.mp.setZoom(17);
      this.setMark(BMap_GL);
      this.$toast.clear();
    },
    setMark(BMapGL) {
      this.locList.forEach(c => {
        var myIcon = new BMapGL.Icon(
          "../../../static/images/triangle.png",
          new BMapGL.Size(10, 6),
          { anchor: new BMapGL.Size(-30, 3) }
        );
        var markerPoint = new BMapGL.Point(c.longitude, c.latitude);
        var marker = new BMapGL.Marker(markerPoint, {
          icon: myIcon
        });

        var opts = {
          position: new BMapGL.Point(c.longitude, c.latitude), // 指定文本标注所在的地理位置
          offset: new BMapGL.Size(0, -30) // 设置文本偏移量
        };
        // 创建文本标注对象
        var label = new BMapGL.Label(c.name, opts);
        // 自定义文本标注样式
        label.setStyle({
          color: "#fff",
          textAlign: "center",
          borderRadius: "22px",
          border: 0,
          background: "#006457",
          fontSize: "14px",
          height: "28px",
          lineHeight: "28px",
          fontFamily: "PingFang SC",
          padding: "0px 16px"
          // transform: "translateY(-100%)"
        });

        this.mp.addOverlay(label);
        this.mp.addOverlay(marker);
        let that = this;
        label.addEventListener("click", function() {
          that.choose(c);
        });
      });
    },
    choose(obj) {
      this.form.position = obj;
      this.form.areaName = obj.name;
      this.form.areaId = obj.id;
      this.common.setStore(this.global.FORM, this.form);
      this.back();
    },
    back() {
      this.common.back();
    },
    loading() {
      this.$toast.loading({
        message: "地图加载中",
        forbidClick: true,
        overlay: true,
        duration: 0
      });
    },
    loadBd() {
      this.first = false;
      baidu
        .init()
        .then(BMap => {
          //在这里调用BMap的方法
          this.init(BMap);
        })
        .catch(e => this.$toast.clear());
    }
  },
  created() {
    this.loading();
    this.form = this.common.getStore(this.global.FORM);
    this.locList = this.form.locList;
    this.campusList = this.form.campusList;
    this.position = this.form.position || {};
    this.longitude = this.position.longitude || "118.84994947358905";
    this.latitude = this.position.latitude || "32.04068824603557";
    this.option1 = this.campusList.map(c => ({
      text: c.name,
      value: c.id
    }));
    this.value1 = this.position.workCampusId;
    // this.loadBd();
  },
  mounted() {
    try {
      this.initGIS();
    } catch (e) {
      this.$toast.clear();
      console.error(e);
    }
  }
};
</script>

<style lang="scss">
.my-class {
  color: red;
}
</style>
<style lang="scss" scoped>
.wind {
  z-index: 1000;
  position: absolute;
  top: 32px !important;
  background-color: #fff;
  font-family: "PingFang SC";
  font-style: normal;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  color: #595959;
}
.back {
  left: 24px;
  width: 88px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  justify-content: space-around;
  span {
    margin-left: 9px;
  }
}
.search {
  left: 240px;
  width: 52px;
  justify-content: space-around;
  i {
    font-size: 17.5px;
  }
}
/deep/ .van-dropdown-menu {
  width: 112px;
  left: 120px !important;
  height: 36px;
}
/deep/ .van-dropdown-menu__bar {
  width: 112px;
  height: 36px;
}
.v_search {
  width: 80%;
  left: 24px;
  top: 80px !important;
  /deep/ .van-search__action {
    color: #006457;
  }
}
/deep/ .van-search {
  padding-left: 0;
}
.whole {
  min-height: 100vh;
  width: 100%;
}
</style>
