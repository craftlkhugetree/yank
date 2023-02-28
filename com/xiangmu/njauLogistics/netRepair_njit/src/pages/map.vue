<template>
  <div class="Map">
    <!-- <div id="wapmap" class="amap-wrapper"></div> -->
    <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="init">
      <!-- 自定义控件，自动填充搜索 -->
      <!-- <bm-control :offset="{ width: '50px', height: '10px' }">
        <bm-auto-complete :sugStyle="{ zIndex: 999999 }">
          <el-input
            v-model="inputValue"
            placeholder="输入关键字进行模糊查询"
            @change="confirmAddress"
          ></el-input>
        </bm-auto-complete>
      </bm-control> -->
      <!--缩放-->
      <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-navigation>
      <!--定位-->
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :showAddressBar="true"
        :autoLocation="true"
      ></bm-geolocation>

      <!-- <bm-walking
        :start="start"
        :end="end"
        :auto-viewport="true"
        location=""
        @markersset="getInfo"
      ></bm-walking> -->
      <!-- @infohtmlset="getInfo" -->
    </baidu-map>
  </div>
</template>

<script>
import { MP } from "@/assets/js/map";
export default {
  data() {
    return {
      inputValue: "",
      keyword: "",
      start: "南京工程学院江宁校区-南馆",
      end: "至诚苑经管楼",
      ak: "HUHdUbHBU9rkKXBerPdRSdMBSqSMxgxW",
      lng: 31.92851,
      lat: 118.88784,
      center: {
        lng: 118.88784,
        lat: 31.92851
      },
      zoom: 17,
      mapData: [],
      people: [
        {
          lng: 118.88784,
          lat: 31.92851,
          type: "people",
          orderNum: 5
        },
        {
          lng: 118.88784,
          lat: 31.92851,
          type: "people",
          orderNum: 3
        }
      ],
      orders: [
        {
          lng: 118.88784,
          lat: 31.92851,
          type: "order",
          stayTime: "12"
        },
        {
          lng: 118.88784,
          lat: 31.92851,
          type: "order",
          stayTime: "3"
        }
      ],
      map: null,
      infoBox: null,
      content: "",
      opts: null
    };
  },
  mounted() {
    this.mapData = this.people.slice();
    // this.$nextTick(() => {
    //   const _this = this;
    //   MP(_this.ak).then(BMap => {
    //     _this.BaiDuMapInit(BMap);
    //   });
    // });
  },
  methods: {
    // 搜索框的搜索事件
    confirmAddress(e) {
      // console.log("this.model.address:",this.model.address)
      if (this.inputValue != "") {
        // console.log("搜索字段为:" + this.inputValue)
        this.keyword = this.inputValue;
      }

      //为啥使用延时？？
      //因为上面搜索框是change事件，变化的太快了看起来效果不好所以添加了延时
      setTimeout(() => {
        //搜索时把需要标点的地址传入local.search中
        var local = new BMap.LocalSearch(this.map, {
          renderOptions: { map: this.map }
        });
        local.search(this.keyword);
      }, 600);
    },
    // 点击标记显示信息窗口
    addClickHandler(item, marker) {
      marker.addEventListener("click", e => {
        if (item.type == "order") {
          this.content = `
           <div class="pop_container" ref="popContainer">
              <section>
                 <p><label>到单时间：</label><span>2020-07-16 12:30</span></p>
                 <p><label>订单地址：</label><span>嘉兴中威苑12幢</span></p>
                 <p><label>业务号码：</label><span>122232543564656</span></p>
                 <p><label>装机单号：</label><span>122232543564656</span></p>
              </section>
              <section>
                 <p>${item.stayTime}H</p>
                 <p>留单时间</p>
              </section>
          </div>
                        `;

          this.opts = {
            width: 400,
            height: 150,
            enableMessage: true
          };
        }
        if (item.type == "people") {
          this.content = `
         <div class="pop_container people_container">
           <section>
             <p><label>装机经理：</label><span>张晓松（1234567）</span></p>
             <p><label>签到时间：</label><span>2020-07-16 12:30</span></p>
           </section>
           <section>
             <p>${item.orderNum}张</p>
             <p>剩余订单</p>
           </section>
        </div>
                        `;

          this.opts = {
            width: 400,
            height: 100,
            enableMessage: true
          };
        }
        this.titleName = item.deviceCode ? item.deviceCode : item.buildingName;
        var p = marker.getPosition(); //获取marker的位置
        var marker1 = new BMap.Marker(new BMap.Point(p.lng, p.lat));
        this.openInfo(item, marker1);
      });
    },
    openInfo(item, p) {
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      var infoWindow = new BMap.InfoWindow(this.content, this.opts); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point); //开启信息窗口
      setTimeout(() => {
        if (
          (item.type == "order" && item.stayTime < 12) ||
          (item.type == "people" && item.orderNum < 5)
        ) {
          document.getElementsByClassName(
            "BMap_bubble_content"
          )[0].style.backgroundColor = "rgba(26,179,148,0.8)";
        }
        if (item.type == "order" && item.stayTime >= 12) {
          document.getElementsByClassName(
            "BMap_bubble_content"
          )[0].style.backgroundColor = "rgba(248,172,89,0.8)";
        }
        if (item.type == "people" && item.orderNum >= 5) {
          document.getElementsByClassName(
            "BMap_bubble_content"
          )[0].style.backgroundColor = "rgba(230,93,93,0.8)";
        }
      }, 100);
    },
    setMarker() {
      var pointArray = [];
      if (this.mapData.length > 0) {
        // 清除地图上的覆盖物
        this.map.clearOverlays();
        for (var i = 0; i < this.mapData.length; i++) {
          var pt = new BMap.Point(this.mapData[i].lng, this.mapData[i].lat);
          pointArray.push(pt);
          if (
            this.mapData[i].type == "order" &&
            this.mapData[i].stayTime < 12
          ) {
            var myIcon = new BMap.Icon(
              require("@/../static/images/yixiufu.png"),
              new BMap.Size(40, 40)
            );
          }
          if (
            this.mapData[i].type == "order" &&
            this.mapData[i].stayTime >= 12
          ) {
            var myIcon = new BMap.Icon(
              require("@/../static/images/caogaoxiang-active.png"),
              new BMap.Size(40, 40)
            );
          }
          if (
            this.mapData[i].type == "people" &&
            this.mapData[i].orderNum < 5
          ) {
            var myIcon = new BMap.Icon(
              require("@/../static/images/weixiufu.png"),
              new BMap.Size(40, 40)
            );
          }
          if (
            this.mapData[i].type == "people" &&
            this.mapData[i].orderNum >= 5
          ) {
            var myIcon = new BMap.Icon(
              require("@/../static/images/finish-active.png"),
              new BMap.Size(40, 40)
            );
          }
          myIcon.setImageSize(new BMap.Size(40, 40));

          var marker = new BMap.Marker(pt, {
            icon: myIcon
          }); // 创建标注
          this.map.addOverlay(marker);
          this.addClickHandler(this.mapData[i], marker);
          var item = this.mapData[i];
        }
        var view = this.map.getViewport(pointArray);
        var mapZoom = view.zoom;
        var centerPoint = view.center;
        this.map.centerAndZoom(centerPoint, mapZoom);
      }
    },
    init({ BMap, map }) {
      this.map = map;
      // 初始化地图,设置中心点坐标
      var point = new BMap.Point(this.lat, this.lng);
      map.centerAndZoom(point, this.zoom);
    //   this.setMarker();
      //   this.BaiDuMapInit(BMap);
      // 添加鼠标滚动缩放
      map.enableScrollWheelZoom();
      const that = this;
      map.addEventListener("click", function(e) {
        // 点击地点获取经纬度
        console.log("click:", e);
        // that.getLoc(BMap, e.point);
        that.search(BMap, e.point);
      });
    },
    // 初始化地图
    BaiDuMapInit(BMap) {
      let wapmap = new BMap.Map("wapmap");
      wapmap.clearOverlays(); // 清除覆盖物
      // 初始化地图,设置中心点坐标
      let point = new BMap.Point(this.lat, this.lng);
      wapmap.centerAndZoom(point, 18);
      // 添加鼠标滚动缩放
      wapmap.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      var content =
        '<div style="margin:0;line-height:20px;padding:2px;">' +
        '<img src="../img/baidu.jpg" alt="" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
        "地址：北京市海淀区上地十街10号<br/>电话：(010)59928888<br/>简介：月亮大厦位于北京市海淀区西二旗地铁站附近，为综合研发及办公总部。" +
        "</div>";
      //创建检索信息窗口对象
      var searchInfoWindow = null;
      searchInfoWindow = new BMapLib.SearchInfoWindow(wapmap, content, {
        title: "月亮大厦", //标题
        width: 290, //宽度
        height: 105, //高度
        panel: "panel", //检索结果面板
        enableAutoPan: true, //自动平移
        searchTypes: [
          BMAPLIB_TAB_SEARCH, //周边检索
          BMAPLIB_TAB_TO_HERE, //到这里去
          BMAPLIB_TAB_FROM_HERE //从这里出发
        ]
      });
      var marker = new BMap.Marker(point); //创建marker对象
      marker.enableDragging(); //marker可拖拽
      marker.addEventListener("click", function(e) {
        searchInfoWindow.open(marker);
      });
      wapmap.addOverlay(marker); //在地图中添加marker
    },
    getLoc(BMapGL, point) {
      //创建坐标解析对象
      let geoc = new BMapGL.Geocoder();
      const that = this;
      //解析当前的坐标成地址

      geoc.getLocation(point, rs => {
        //获取地址对象
        let addressComp = rs.addressComponents;
        //拼接出详细地址
        let address =
          addressComp.province +
          addressComp.city +
          addressComp.district +
          addressComp.street +
          addressComp.streetNumber;
        console.log("address:", address, rs);
        this.leastSquareError(rs.surroundingPois);
        // this.map.clearOverlays();
        // var new_point = new BMapGL.Point(rs.point.lng, rs.point.lat);
        // var marker = new BMapGL.Marker(new_point); // 创建标注
        // this.map.addOverlay(marker); // 将标注添加到地图中
        // this.map.panTo(new_point);
      });
    },
    // bm-walking
    getInfo(poi) {
      console.log("poi:", poi);
    },
    // walking 步行导航，LocalSearchPoi实例
    search(BMap, point) {
      this.map.clearOverlays();
      const poi = {
        lat: 31.929808,
        lng: 118.888336
      };
      var walking = new BMap.WalkingRoute(this.map, {
        renderOptions: { map: this.map, autoViewport: false }
      });
      var point1 = new BMap.Point(poi.lng, poi.lat);
      var point2 = new BMap.Point(point.lng, point.lat);
      walking.search({ point: point1 }, { point: point2 });
      var point = new BMap.Point(point.lng, point.lat);
      var infoWindow = new BMap.InfoWindow(this.content, this.opts); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point); //开启信息窗口
    },
    leastSquareError(arr = []) {
      const poi = {
        lat: 31.929808,
        lng: 118.888336
      };
      let diff = { n: Infinity, id: 0 };
      arr.forEach((a, index) => {
        let lng = a.point.lng;
        let lat = a.point.lat;
        let lse =
          Math.pow(lng * lng - poi.lng * poi.lng, 2) +
          Math.pow(lat * lat - poi.lat * poi.lat, 2);
        if (lse < diff.n) {
          diff.n = lse;
          diff.id = index;
        }
      });
      if (diff.n !== Infinity) {
        this.end = arr[0].title;
      }
      console.log("choose:", this.end);
    }
  }
};
</script>

<style lang="scss" scoped>
.Map,
.bm-view {
  position: fixed;
  width: 100%;
  height: 100%;
  .amap-wrapper {
    width: 100%;
    height: 100%;
  }
}
.anchorBL,
.BMap_cpyCtrl {
  display: none;
}

.BMap_bubble_title {
  color: white;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  padding-left: 5px;
  padding-top: 5px;
  border-bottom: 1px solid gray;
  background-color: #0066b3;
}
/* 消息内容 */
.BMap_bubble_content {
  background-color: rgba(40, 40, 40, 0.8);
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 10px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
/* 内容 */
.BMap_pop div:nth-child(9) {
  top: 35px !important;
  border-radius: 7px;
}

.BMap_pop div:nth-child(5) {
  display: none;
}
/* 左上角删除按键 */
.BMap_pop img {
  // top: 43px !important;
  // left: 215px !important;
  display: none;
}

.BMap_top {
  display: none;
}

.BMap_bottom {
  display: none;
}

.BMap_center {
  display: none;
}
/* 隐藏边角 */
.BMap_pop div:nth-child(1) div {
  display: none;
}

.BMap_pop div:nth-child(3) {
  display: none;
}

.BMap_pop div:nth-child(7) {
  display: none;
}
</style>
