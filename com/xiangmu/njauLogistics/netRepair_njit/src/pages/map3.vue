<template>
  <div class="content">
    <el-button type="primary" @click="click">location</el-button>
    <baidu-map
      class="map"
      :center="map.center"
      :zoom="map.zoom"
      @ready="handler"
    >
      <!--缩放-->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <!--定位-->
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :showAddressBar="true"
        :autoLocation="true"
      ></bm-geolocation>
      <!--点-->
      <bm-marker
        :position="map.center"
        :dragging="map.dragging"
        animation="BMAP_ANIMATION_BOUNCE"
      >
      </bm-marker>
      <!-- 全景 -->
      <!-- <bm-panorama></bm-panorama> -->
    </baidu-map>
  </div>
</template>

<script>
export default {
  name: "demo",
  data: () => ({
    map: {
      center: { lng: 118.88784, lat: 31.92851 },
      zoom: 18,
      show: true,
      dragging: true,
      lng: 31.92851,
      lat: 118.88784
    },
    opts: {
      enableHighAcuracy: false, //位置是否精确获取
      timeout: 5000, //获取位置允许的最长时间
      maximumAge: 1000 //多久更新获取一次位置
    }
  }),
  methods: {
    // 检测浏览器是否支持HTML5
    supportsGeoLocation() {
      return !!navigator.geolocation;
    },
    handler({ BMap, map }) {
      // 鼠标缩放
      map.enableScrollWheelZoom(true);
      if (this.supportsGeoLocation()) {
        // alert("你的浏览器支持 GeoLocation.");
      } else {
        alert("不支持 GeoLocation.");
        return;
      }
      this.getLocation(BMap);
      this.map = map;
    },
    // 单次位置请求执行的函数
    getLocation(BMap) {
      //   navigator.geolocation.getCurrentPosition(this.mapIt, this.locationError);
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position);
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;
          const pointBak = new BMap.Point(lng, lat);
          const convertor = new BMap.Convertor();
          // 将不准确的经纬度信息做了转换
          convertor.translate([pointBak], 1, 5, function(resPoint) {
            if (resPoint && resPoint.points && resPoint.points.length > 0) {
              lng = resPoint.points[0].lng;
              lat = resPoint.points[0].lat;
            }
            const point = new BMap.Point(lng, lat);
            const geo = new BMap.Geocoder();
            geo.getLocation(point, res => {
              console.log(res);
            });
          });
        },
        this.locationError,
        this.opts
      );
    },
    //定位成功时，执行的函数
    mapIt(position) {
      lon = position.coords.longitude;
      lat = position.coords.latitude;
      alert("您位置的经度是：" + lon + " 纬度是：" + lat);

      // 创建地理编码（地理解析器）实例
      var myGeo = new BMap.Geocoder();
      // 根据坐标得到地址描述    下面输入坐标。
      myGeo.getLocation(new BMap.Point(lon, lat), function(result) {
        if (result) {
          console.log(result);
          alert(JSON.stringify(result.addressComponents));
        }
      });
    },

    // 定位失败时，执行的函数
    locationError(error) {
      console.log(error);
      switch (error.code) {
        case 0:
          alert("无法定位.");
          break;
        case 2:
          alert("位置信息不可用.");
          break;
        case 3:
          alert("请求超时.");
          break;
        case 1:
          alert("未知错误.");
          break;
      }
    },
    click() {
      //getCurrentPosition与定时器setInterval类似多次请求，因为位置需要不间断的获取
      //直接navigator.geolocation表示单次获取位置
      navigator.geolocation.getCurrentPosition(
        function(position) {
          box.innerHTML += "经度" + position.coords.longitude;
          box.innerHTML += "纬度" + position.coords.latitude;
          box.innerHTML += "准确度" + position.coords.accuracy;
          box.innerHTML += "海拔" + position.coords.altitude;
          box.innerHTML += "海拔准确度" + position.coords.altitudeAcuracy;
          box.innerHTML += "行进方向" + position.coords.heading;
          box.innerHTML += "地面速度" + position.coords.speed;
          box.innerHTML += "请求的时间" + new Date(position.timestamp);
        },
        function(err) {
          console.log(err);
          alert(err.code);
          // code：返回获取位置的状态
          //          0  :  不包括其他错误编号中的错误
          // ​             1  :  用户拒绝浏览器获取位置信息
          // ​             2  :  尝试获取用户信息，但失败了
          // ​             3  :   设置了timeout值，获取位置超时了
        },
        this.opts
      );
    }
  },
  mounted() {}
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}

span {
  display: none;
}

.content {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
