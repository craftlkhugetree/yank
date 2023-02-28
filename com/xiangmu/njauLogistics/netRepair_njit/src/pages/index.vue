<template>
  <div class="main">
    <el-row :gutter="30">
      <!--------------------------------- 报修数据 --------------------------------->
      <el-col :span="12">
        <div class="basic-box data-box">
          <div class="data clearfix">
            <div class="data-item">
              <label>报修量</label>
              <!-- <p>{{repairNum}}</p> -->
              <countTo
                class="counttospan"
                :startVal="0"
                :endVal="repairNum"
                :duration="1000"
              ></countTo>
            </div>
            <div class="data-item">
              <label>完成量</label>
              <!-- <p>{{overNum}}</p> -->
              <countTo
                class="counttospan"
                :startVal="0"
                :endVal="overNum"
                :duration="1000"
              ></countTo>
            </div>
          </div>
          <div class="phone">
            <p>
              在线报修：
              <countTo
                class="counttospan"
                :startVal="0"
                :endVal="netNum"
                :duration="1000"
              ></countTo>
            </p>
            <p>
              电话报修：
              <countTo
                class="counttospan"
                :startVal="0"
                :endVal="telNum"
                :duration="1000"
              ></countTo>
            </p>
          </div>
          <el-button
            class="orange-btn big-btn"
            @click="$router.push('/repair-apply')"
          >
            我要报修
            <img src="@/../static/images/right.png" alt />
          </el-button>
        </div>
      </el-col>
      <!--------------------------------- 报修电话 --------------------------------->
      <el-col :span="12">
        <div class="basic-box phone-box">
          <div class="title">
            <div class="title-main">报修电话</div>
          </div>
          <el-row>
            <el-col :span="8" v-for="(item, index) in phoneList" :key="index">
              <div class="phone-item" v-for="phone in item" :key="phone.name">
                <h3>{{ phone.name }}</h3>
                <p>{{ phone.value }}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <!--------------------------------- 全部报修 --------------------------------->
      <el-col :span="12">
        <div class="list">
          <div class="title">
            <div class="title-main">全部报修</div>
            <div class="title-right">
              <el-input
                v-model="keyword"
                placeholder="请输入关键字查询"
                class="no-border"
                size="small"
                prefix-icon="el-icon-search"
                style="width:200px;"
                @change="$refs.allList.getList()"
                :on-icon-click="true"
              ></el-input>
            </div>
          </div>
          <div class="content">
            <list ref="allList" operType="view" :params="allParams"></list>
          </div>
        </div>
      </el-col>
      <!--------------------------------- 我的报修 --------------------------------->
      <el-col :span="12">
        <div class="list">
          <div class="title">
            <div class="title-main">我的报修</div>
            <div class="title-right" style="margin-top:7px;">
              <div
                :class="{ active: activeTab == '1' }"
                @click="changeTab('1')"
              >
                <img
                  v-if="activeTab == '1'"
                  src="@/../static/images/yibaoxiu-active.png"
                  alt
                />
                <img v-else src="@/../static/images/yibaoxiu.png" alt />
                已报修
              </div>
              <el-divider direction="vertical"></el-divider>
              <div
                :class="{ active: activeTab == '2' }"
                @click="changeTab('2')"
              >
                <img
                  v-if="activeTab == '2'"
                  src="@/../static/images/caogaoxiang-active.png"
                  alt
                />
                <img v-else src="@/../static/images/caogaoxiang.png" alt />
                草稿箱
              </div>
            </div>
          </div>
          <div class="content">
            <list
              ref="myList"
              v-if="userId"
              operType="edit"
              :isDraft="isDraft"
              :params="myParams"
            ></list>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import List from "./list";
import countTo from "vue-count-to";
export default {
  components: {
    List,
    countTo
  },
  data() {
    return {
      phoneList: [
        [
          { name: "24小时急修", value: "18151007209" },
          { name: "洗浴热水", value: "17721548961" }
        ],
        [
          { name: "宿舍用电", value: "025-86112044" },
          { name: "网络中心", value: "025-86118080" }
        ],
        [{ name: "宿舍空调", value: "18112919010" }]
      ],
      repairNum: 0,
      overNum: 0,
      netNum: 0,
      telNum: 0,
      keyword: null,
      activeTab: "1",
      isDraft: false
    };
  },
  computed: {
    // 用户id
    userId() {
      return this.$store.state.userInfo.ID;
    },

    // 全部报修 查询参数
    allParams() {
      return {
        keyword: this.keyword
      };
    },
    // 我的报修 查询参数
    myParams() {
      return {
        applyerid: this.$store.state.userInfo.ID
      };
    }
  },
  methods: {
    // 切换tab
    changeTab(tab) {
      this.activeTab = tab;
      this.isDraft = tab == "2" ? true : false;
    },
    // 报修量
    getData() {
      this.util
        .postAjax({
          code: this.global.code,
          url: "apply/callAndOver"
        })
        .then(res => {
          if (res.success) {
            let data = res.data || [];
            data.forEach(i => {
              switch (i.type) {
                case "complete":
                  this.overNum = i.num;
                  break;
                case "all":
                  this.repairNum = i.num;
                  break;
                case "net":
                  this.netNum = i.num;
                  break;
                case "telephone":
                  this.telNum = i.num;
                  break;
              }
            });
          }
        })
        .catch(err => {});
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 1400px;
  margin: 20px auto 0;
}
.basic-box {
  height: 320px;
  background: #ffffff;
  border-radius: 5px;
  margin-bottom: 35px;
}
.data-box {
  background: url("../../static/images/data-bg.png") no-repeat #ffffff;
  background-size: 320px 280px;
  background-position: 360px 20px;
  .data {
    padding: 60px 0 0 30px;
    .data-item {
      float: left;
      width: 128px;
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #eeeeee;
      label {
        font-size: 14px;
        color: #aaaaaa;
        line-height: 20px;
      }
      .counttospan {
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        display: block;
      }
      p {
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
      }
    }
  }
  .phone {
    padding: 20px 0 30px 60px;
    p {
      font-size: 14px;
      color: #aaaaaa;
      line-height: 20px;
      margin-bottom: 10px;
    }
  }
  .big-btn {
    width: 200px;
    height: 40px;
    box-shadow: 0px 10px 8px 0px rgba(255, 112, 0, 0.1),
      0px 16px 6px -12px rgba(255, 112, 0, 0.16);
    border-radius: 20px;
    margin-left: 30px;
    font-size: 14px;
    img {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      margin-left: 15px;
    }
  }
}

.phone-box {
  padding: 20px 0;
  .title {
    padding-left: 30px;
  }
  .el-row {
    height: calc(100% - 40px);
  }
  .el-col {
    height: 100%;
  }
  .el-col:not(:last-child) {
    border-right: 1px solid #f0f0f0;
  }
  .phone-item {
    padding: 15px 0 15px 30px;
    h3 {
      font-size: 16px;
      color: #fd7d18;
      line-height: 22px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      color: #666666;
      line-height: 20px;
    }
  }
}
.title {
  padding-bottom: 15px;
  .title-main {
    font-size: 16px;
    font-weight: bold;
    color: #464032;
    position: relative;
    z-index: 10;
    &::before {
      position: absolute;
      display: block;
      content: "";
      width: 30px;
      height: 4px;
      background: #fedec5;
      left: 0;
      top: 15px;
      border-radius: 24px;
      z-index: -10;
    }
  }
  & > div {
    display: inline-block;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      margin-right: 4px;
      vertical-align: text-bottom;
    }
    span {
      color: #666666;
    }
    &:hover {
      i,
      span {
        color: #fd7d18;
      }
    }
  }
  .title-right {
    float: right;
    > div {
      display: inline-block;
      color: #999;
      font-size: 12px;
      color: #999;
      // &:not(:last-child) {
      //   margin-right: 15px;
      // }
      img {
        width: 16px;
        height: 16px;
        margin-right: 0;
      }
      &.active {
        color: #fd7d18;
        font-weight: 600;
      }
    }
  }
  .el-divider--vertical {
    margin: 0 15px;
  }
}
.list {
  .title {
    margin-bottom: 5px;
    .title-main {
      margin-top: 7px;
    }
  }
}
</style>
