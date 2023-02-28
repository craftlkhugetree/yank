<template>
  <div class="process">
    <div class="font-s t">
      事件进展
    </div>
    <van-divider></van-divider>
    <van-steps direction="vertical">
      <van-step v-for="item in events" :key="item.id">
        <template v-slot:inactive-icon>
          <van-icon :name="item.icon" :class="item.classActive" />
        </template>

        <template v-slot:active-icon>
          <van-icon :name="item.icon" :class="item.classActive" />
        </template>
        <div class="content">
          <h3 class="title">{{ item.title }}</h3>
          <p class="person" v-if="type(item, 2) || type(item, 8)">
            反馈人：{{ item.createName }}({{ item.createId }})
          </p>
          <div class="person" v-if="type(item, 2)">
            <p class="hide">
              {{
                (item.eventResult == "1" ? "整改结果：" : "情况说明：") +
                  item.eventNote
              }}
            </p>
          </div>
          <div class="person" v-if="type(item, 3) && item.eventResult == '0'">
            <p class="hide">复查结果： {{ item.eventNote }}</p>
          </div>
          <div
            class="person"
            v-if="type(item, 3) && item.eventResult == '1' && item.eventNote"
          >
            <p class="hide">整改通过：{{ item.eventNote }}</p>
          </div>
          <div class="div_flex imgs" v-if="photos(item).length">
            <div
              v-for="(m, id) in photos(item)"
              :key="m + id"
              class="photo clearfix"
            >
              <van-image
                class="img"
                :src="global.viewUrl + m"
                fit="cover"
                @click="openImg(photos(item), id)"
              />
            </div>
          </div>
          <p class="person" v-if="type(item, 8)">转移至： {{ moveTo(item) }}</p>
          <span class="time">{{ item.createTime }}</span>
        </div>
      </van-step>
    </van-steps>
  </div>
</template>
<script>
import { ImagePreview } from "vant";
export default {
  name: "Process",
  props: {
    form: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      images: [],
      handleDept: ""
    };
  },
  computed: {
    photos() {
      return function(obj) {
        let arr = (obj.eventPhotos && obj.eventPhotos.split(",")) || [];
        return arr;
      };
    },
    isTime() {
      return function(obj) {
        return obj[this.global.handleNode] === this.global.YWZX;
      };
    },
    type() {
      return function(obj, type) {
        return obj.eventType == type;
      };
    },
    moveTo() {
      return function(obj) {
        let d = this.$store.state.departments;
        let tmp =
          d.find(p => p.ID === this.form[this.global.handleDeptId]) || {};
        return tmp.NAME || "--";
      };
    },
    events() {
      let reverse = true;
      let f = this.form;
      let e = f && f.events;
      if (e && e.length) {
        e.forEach(item => {
          item.icon = "checked";
          item.classActive = "successClass";
          if (this.type(item, 7)) {
            item.icon = "warning";
            item.classActive = "warningClass";
            item.title = this.isTime(item)
              ? "业务中心超时未处理"
              : "督查人员超时未复查确认";
          } else if (this.type(item, 2)) {
            if (item.eventResult == "1") {
              item.title = "处理反馈：已解决";
            } else {
              item.title = "处理反馈：未解决";
              item.icon = "info";
              item.classActive = "warningClass";
            }
          } else if (this.type(item, 3)) {
            if (item.eventResult == "1") {
              item.title = "督察人员已确认通过";
            } else {
              item.title = "督察人员未确认通过";
              item.icon = "info";
              item.classActive = "warningClass";
            }
          } else if (this.type(item, 8)) {
            item.title = "转移";
          }
        });
      }
      let arr = e || [];
      arr = arr.filter(a => a.eventType != "1");
      if (reverse) {
        arr = arr.sort((a, b) => {
          return (
            typeof a.createTime === "string" &&
            typeof b.createTime === "string" &&
            b.createTime.localeCompare(a.createTime)
          );
        });
      }
      return arr;
    }
  },
  methods: {
    openImg(arr, id) {
      ImagePreview({
        images: arr.map(a => this.global.viewUrl + a),
        startPosition: id,
        closeable: true
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
$size: calc(25% - 16px - 8px);
.process {
  padding: $fixed-mb;
  background: #ffffff;
  width: 100%;
  min-height: 50vh;
  .t {
    padding-left: $fixed-mb;
    font-size: 16px;
    line-height: 22px;
    height: 22px;
    color: #595959;
  }
}
.successClass {
  color: #07c160;
}
.errorClass {
  color: #ee0a24;
}
.warningClass {
  color: #ff9900;
}
.content {
  font-family: "PingFang SC";
  font-style: normal;
  color: #595959;
  font-weight: 400;
  font-size: 14px;
  .title {
    font-weight: 500;
    font-size: 16px;
    padding-bottom: $fixed_mb;
  }
  .person {
    padding-bottom: $fixed_mb;
    .hide {
      max-height: 42px;
      line-height: 20px;
      display: -webkit-box; // 必须有，否则clamp可能不兼容
      overflow: hidden;
      word-wrap: break-word;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal; // 必须有，否则可能不换行！！！
    }
  }
  .time {
    color: #8c8c8c;
    background: #f5f5f5;
  }
  .imgs {
    width: 100%;
    padding-top: 8px;
    flex-wrap: wrap;
    .photo {
      width: 24%;
      padding-right: 16px;
      padding-bottom: 16px;
      .img {
        width: 60px;
        height: 60px;
      }
    }
  }
}
/deep/ .van-divider {
  border-color: #f5f5f5;
  margin: $fixed_mb;
}
</style>
