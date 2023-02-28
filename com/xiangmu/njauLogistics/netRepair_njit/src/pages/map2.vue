<template>
  <div class="content">
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
      center: { lng: 113.763924, lat: 22.938634 },
      zoom: 18,
      show: true,
      dragging: true,
      lng: 31.92851,
      lat: 118.88784
    }
  }),
  methods: {
    handler({ BMap, map }) {
      // 鼠标缩放
      map.enableScrollWheelZoom(true);
      // 点击事件获取经纬度
      var path = []; //本人的示例是要走规定经过的路线，所以中间有多经过点
      //   path.push([113.763924, 22.938634]);
      //   path.push([113.759621, 22.933625]);

      //   path.push([113.759621, 22.933625]);
      //   path.push([113.76654, 22.934174]);

      //   path.push([113.76654, 22.934174]);
      //   path.push([113.766558, 22.932916]);

      //   path.push([113.766558, 22.932916]);
      //   path.push([113.768745, 22.93173]);

      //   path.push([113.768745, 22.93173]);
      //   path.push([113.76945, 22.930731]);

      //   path.push([113.76945, 22.930731]);
      //   path.push([113.772022, 22.93014]);

      //   path.push([113.772022, 22.93014]);
      //   path.push([113.775806, 22.932607]);

      //   map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
      //   for (let i = 0; i < path.length; i += 2) {
      //     var walking = new BMap.WalkingRoute(map, {
      //       renderOptions: {
      //         map: map,
      //         autoViewport: true
      //       },
      //       onPolylinesSet: function(routes) {
      //         let searchRoute = routes[0].getPolyline(); //导航路线
      //         map.removeOverlay(searchRoute); //移除查询出来 的路线
      //       },
      //       onMarkersSet: function(routes) {
      //         map.removeOverlay(routes[0].marker); //删除起点
      //         map.removeOverlay(routes[routes.length - 1].marker); //删除终点
      //       }
      //     });
      //     let _this = this;
      //     var start = new BMap.Point(path[i][0], path[i][1]);
      //     var end = new BMap.Point(path[i + 1][0], path[i + 1][1]);
      //     walking.search(start, end);
      //     walking.setSearchCompleteCallback(function() {
      //       var plan = walking.getResults().getPlan(0);
      //       for (let j = 0; j < plan.getNumRoutes(); j++) {
      //         var pts = plan.getRoute(j).getPath();
      //         var polyline = new BMap.Polyline(pts, {
      //           strokeColor: "#ff0000",
      //           strokeWeight: 5,
      //           strokeOpacity: 1
      //         }); //重新划路线
      //         map.addOverlay(polyline);
      //       }
      //     });
      //   }
      //   map.addEventListener("click", function(e) {
      //     // 点击地点获取经纬度
      //     console.log(e.point.lng, e.point.lat);
      //   });

      // 百度地图API功能
      var point = new BMap.Point(this.lat, this.lng); //地图初始中心点
      map.centerAndZoom(point, 12);

      var geolocation = new BMap.Geolocation();
      var gc = new BMap.Geocoder();
      geolocation.getCurrentPosition(
        function(r) {
          //定位结果对象会传递给r变量
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            //通过Geolocation类的getStatus()可以判断是否成功定位。
            var pt = r.point;
            map.panTo(pt); //移动地图中心点
            //alert(r.point.lng);//X轴
            //alert(r.point.lat);//Y轴

            gc.getLocation(pt, function(rs) {
              console.log("r:", rs);

              var addComp = rs.addressComponents;
              alert(
                addComp.province +
                  addComp.city +
                  addComp.district +
                  addComp.street +
                  addComp.streetNumber
              );
            });
          } else {
            //关于状态码
            //BMAP_STATUS_SUCCESS   检索成功。对应数值“0”。
            //BMAP_STATUS_CITY_LIST 城市列表。对应数值“1”。
            //BMAP_STATUS_UNKNOWN_LOCATION  位置结果未知。对应数值“2”。
            //BMAP_STATUS_UNKNOWN_ROUTE 导航结果未知。对应数值“3”。
            //BMAP_STATUS_INVALID_KEY   非法密钥。对应数值“4”。
            //BMAP_STATUS_INVALID_REQUEST   非法请求。对应数值“5”。
            //BMAP_STATUS_PERMISSION_DENIED 没有权限。对应数值“6”。(自 1.1 新增)
            //BMAP_STATUS_SERVICE_UNAVAILABLE   服务不可用。对应数值“7”。(自 1.1 新增)
            //BMAP_STATUS_TIMEOUT   超时。对应数值“8”。(自 1.1 新增)
            switch (this.getStatus()) {
              case 2:
                alert("位置结果未知 获取位置失败.");
                break;
              case 3:
                alert("导航结果未知 获取位置失败..");
                break;
              case 4:
                alert("非法密钥 获取位置失败.");
                break;
              case 5:
                alert("对不起,非法请求位置  获取位置失败.");
                break;
              case 6:
                alert("对不起,当前 没有权限 获取位置失败.");
                break;
              case 7:
                alert("对不起,服务不可用 获取位置失败.");
                break;
              case 8:
                alert("对不起,请求超时 获取位置失败.");
                break;
            }
          }
        },
        { enableHighAccuracy: true }
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
