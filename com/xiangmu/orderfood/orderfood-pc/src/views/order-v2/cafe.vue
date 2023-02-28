<template>
  <div class="food">
    <div class="cafe-type" v-loading="typeLoading">
      <label>分类：</label>
      <div class="cafe-type-list">
        <span
          v-for="type in cafeTypeList"
          :key="type.id"
          :class="{'active': activeCafeType == type.id}"
          @click="chooseType(type.id)"
        >{{type.name}}</span>
      </div>
      <div class="search-box-right">
        <el-input
          class="input-box"
          v-model="keyword"
          placeholder="请输入名称"
          size="small"
          clearable
          style="width:170px;margin-right:10px;"
          prefix-icon="el-icon-search"
          @clear="getCafeList"
          @keyup.enter.native="getCafeList"
        ></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getCafeList">查询</el-button>
      </div>
    </div>
    <!---------------------------- 餐厅列表 -------------------------->
    <div class="cafe-list" v-loading="loading">
      <div v-if="openCafeList.length == 0" class="nodata animation-1">
        <img src="@/assets/img/nocafe.png" alt />
        <p>暂无餐厅</p>
      </div>
      <div
        class="cafe-box"
        v-for="(item,index) in openCafeList"
        :key="item.id"
        @click="chooseCafe(item)"
        :class="`animation-${index+1}`"
      >
        <img :src="item.url" />
        <div class="text">
          <span class="name ellipsis">{{item.shopname}}</span>
          <p>
            <span v-if="item.ordertype.includes('group')" class="tag">单位订餐</span>
            <span v-if="item.ordertype.includes('self')" class="tag">个人订餐</span>
          </p>
          <p class="ellipsis--l2">
            <label>配送时间：</label>
            {{sendTimeFormat(item.sendtime)}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAllCafeList, fetchCafeConfigList } from "@/api/admin/cafe";
import { fetchAllCafeTypeList } from "@/api/admin/cafeType";
export default {
  data() {
    return {
      typeLoading: false,
      loading: false,
      cafeTypeList: [],
      activeCafeType: "all",
      cafeList: [],
      keyword: null
    };
  },
  computed: {
    // 当前用户类型(1开头为学生，2开头为教职工)
    userType() {
      let userInfo = this.$store.state.userInfo;
      let rylx = userInfo.RYLX || null;
      let userType = null;
      if (/^1.*$/.test(rylx)) {
        userType = "student";
      } else if (/^2.*$/.test(rylx)) {
        userType = "teacher";
      }
      return userType;
    },
    // 开放的餐厅（开放时间，开放对象）
    openCafeList() {
      let list = this.cafeList.filter(i => {
        // 是否设置开放对象 和 开放时间
        if (
          !i.openobj ||
          !i.opentime ||
          !i.sendtime ||
          !i.ordertype ||
          !i.preparetime
        ) {
          return false;
        } else {
          // 开放对象是否包含当前用户
          if (i.openobj.includes(this.userType)) {
            // 开放时间是否包含当前时间
            let timeArr = i.opentime.split(",");
            let now = this.moment().format("MMDD");
            if (
              timeArr.some(j => {
                let time = j.split("-");
                let st = time[0];
                let et = time[1];
                return now >= st && now <= et;
              })
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }
      });
      list.sort((a, b) => {
        return a.level > b.level ? 1 : -1;
      });
      return list;
    }
  },
  methods: {
    // 获取餐厅类别列表
    getCafeTypeList() {
      this.typeLoading = true;
      fetchAllCafeTypeList({})
        .then(res => {
          this.typeLoading = false;
          if (res.success) {
            let data = res.data || [];
            this.cafeTypeList = data.filter(i => i.status == "1");
            this.cafeTypeList.sort((a, b) => {
              return a.level > b.level ? 1 : -1;
            });
            this.cafeTypeList.unshift({
              id: "all",
              name: "全部"
            });
            // 如果不存在当前餐厅类别
            if (
              this.cafeTypeList.findIndex(i => i.id == this.activeCafeType) ==
              -1
            ) {
              this.activeCafeType = "all";
            }
            this.chooseType(this.activeCafeType);
          } else {
            this.cafeTypeList = [
              {
                id: "all",
                name: "全部"
              }
            ];
          }
        })
        .catch(err => {
          this.typeLoading = false;
          this.cafeTypeList = [
            {
              id: "all",
              name: "全部"
            }
          ];
        });
    },
    // 选择餐厅类别
    chooseType(typeId) {
      this.activeCafeType = typeId;
      this.getCafeList();
    },
    // 获取餐厅列表
    getCafeList() {
      this.loading = true;
      let param = {
        name: this.keyword || null,
        shoptype: this.activeCafeType == "all" ? null : this.activeCafeType
      };
      fetchAllCafeList(param)
        .then(res => {
          this.loading = false;
          if (res.success) {
            let cafeList = res.data || [];
            fetchCafeConfigList({}).then(res => {
              if (res.success) {
                let configList = res.data || [];
                this.cafeList = cafeList.map(i => {
                  let index = configList.findIndex(j => j.shopid == i.id);
                  let obj = { ...i };
                  if (index > -1) {
                    obj = {
                      ...configList[index],
                      shopname: i.name,
                      level: i.level
                    };
                  }
                  obj.url = obj.photo
                    ? window.g.viewUrl + obj.photo
                    : require("@/assets/img/nophoto.png");
                  obj.mobile = obj.mobile
                    ? obj.mobile.split(",").join("，")
                    : "--";
                  return obj;
                });
              }
            });
            sessionStorage.setItem("orderParams", JSON.stringify(param));
          } else {
            this.cafeList = [];
          }
        })
        .catch(err => {
          this.loading = false;
          this.cafeList = [];
        });
    },
    // 格式转换
    sendTimeFormat(time) {
      let arr = time.split(",");
      let timeArr = [];
      arr.forEach(i => {
        let iTime = i.split("-");
        timeArr.push(`${iTime[0]} ~ ${iTime[1]}`);
      });
      return timeArr.join("，");
    },
    // 点击餐厅
    chooseCafe(cafe) {},

    // 初始化页面参数
    initParams() {
      let params = sessionStorage.getItem("orderParams");
      if (params) {
        let data = JSON.parse(params);
        this.keyword = data.name || null;
        this.activeCafeType = data.shoptype;
      }
    }
  },
  created() {
    this.initParams();
    this.getCafeTypeList();
  }
};
</script>

<style lang="scss" scoped>
.food {
  margin: 20px 0 20px 20px;
}
.cafe-type {
  position: relative;
  padding: 10px 20px;
  background: #ffffff;
  margin-bottom: 20px;
  label {
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    vertical-align: top;
    margin-top: 5px;
    margin-right: 10px;
  }
  .cafe-type-list {
    display: inline-block;
    width: calc(100% - 320px);
    white-space: pre-wrap;
    span {
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      color: #6e7384;
      line-height: 20px;
      margin: 5px 20px 5px 0;
      cursor: pointer;
      &.active {
        padding: 2px 10px;
        background: #3f86f7;
        border-radius: 12px;
        color: #fff;
        font-weight: 600;
        margin-right: 10px;
      }
    }
  }
  .search-box-right {
    position: absolute;
    right: 20px;
    top: 10px;
  }
}
.cafe-list {
  .cafe-box {
    display: inline-block;
    width: 210px;
    height: 300px;
    background: #ffffff;
    margin-bottom: 20px;
    margin-right: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all ease 0.4s;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05);
    }
    img {
      width: 210px;
      height: 158px;
      object-fit: cover;
      border-radius: 5px;
    }
  }
  .text {
    padding: 20px;
    .name {
      display: inline-block;
      max-width: 100%;
      font-size: 16px;
      font-weight: 600;
      color: #3f86f7;
      line-height: 22px;
    }
    .tag {
      font-size: 12px;
      font-weight: 400;
      color: #faad14;
      line-height: 20px;
      padding: 1px 8px;
      background: #fffbe6;
      border-radius: 2px;
      border: 1px solid #ffe58f;
      margin-right: 10px;
    }
    p {
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
      margin-top: 10px;
    }
  }
}
@for $i from 1 through 50 {
  $time: ($i * 100+200) + ms;
  .animation-#{$i} {
    transition: all 1s ease-out;
    animation-name: toTop; // toBottom
    animation-duration: 1s; // 注释掉 会没有动画 就是帕帕一帧一帧的出来
    animation-fill-mode: both;
    animation-delay: $time;
  }
}
// 方向 下-->上
@keyframes toTop {
  0% {
    opacity: 0;
    transform: translateY(200px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}
</style>