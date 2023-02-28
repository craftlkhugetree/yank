<template>
  <div>
    <div class="card">
      <list
        ref="list"
        :resHook="resHook"
        :getList="params.fun || getList"
        :params="params"
        :total="total"
      >
        <div class="div_flex all">
          <div v-for="item in data" :key="item.id" class="photo">
            <div @click.stop="goDetail(item)">
              <van-image
                class="img"
                :src="global.viewUrl + item.photo"
                fit="cover"
              />
              <!-- <img :src="item.photo" /> -->
              <div class="div_flex note">
                <div class="font-s timeout" v-if="common.isTimeout(item)">
                  超时
                </div>
                <span class="ellipsis font-s">{{ item.note }}</span>
              </div>
            </div>
            <div class="div_flex tips" v-if="params.funTab !== 'yzy'">
              <div
                v-for="r in global.roleStatus[whatRole]"
                :key="r.text"
                class="div_flex"
                :class="r.exist(item) ? '' : 'none'"
                @click="r.btn ? op(r, item) : void 0"
              >
                <i :class="r.icon"></i>
                <span :style="{ color: r.color }" class="font-s ptext">{{
                  r.text
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </list>
    </div>
    <popup :popName.sync="popName" ref="popup" :obj.sync="rItem"></popup>
  </div>
</template>
<script>
import { workOrder_query } from "@/assets/js/api";
export default {
  name: "PhotoItems",
  props: {
    params: Object
  },
  components: {
    list: () => import("@/components/list"),
    popup: () => import("@/components/popup")
  },
  data() {
    return {
      getList: workOrder_query,
      data: [],
      total: 0,
      popName: "",
      rItem: {}
    };
  },
  computed: {
    whatRole() {
      return (
        this.params[this.global.roleName] ||
        this.common.getStore(this.global.roleName)
      );
    }
  },
  methods: {
    op(r, item) {
      if (r.btn) {
        this.popName = r.btn;
        this.rItem = item;
        this.$refs.popup.show = true;
      }
    },
    goDetail(item) {
      this.$router.push("/detail/" + item.id);
    },
    resHook(res) {
      this.common.dealRes(res, () => {
        let list = res.data || [];
        list.forEach(t => {
          let imgs = t.photos.split(",");
          t.photo = imgs[0];
        });
        if (res.curPage === 1) {
          this.data = list;
        } else {
          this.data = this.data.concat(list);
        }
        this.total = this.data.length;
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.card {
  margin: 0 7px;
  .all {
    justify-content: space-between;
    flex-wrap: wrap;
    .photo {
      background: #ffffff;
      width: 48%;
      min-width: 183px;
      margin-bottom: 8px;
      .img {
        width: 100%;
        height: 137px;
        object-fit: cover;
        // object-fit: contain;
      }
      .note {
        padding: 0 6px 6px;
        .timeout {
          font-size: 12px;
          line-height: 20px;
          text-align: center;
          color: #ff9900;
          width: 40px;
          height: 20px;
          background: #f5f5f5;
          border-radius: 10px;
          margin-right: 4px;
        }
        span {
          font-weight: 500;
          color: #595959;
          text-align: left;
          height: 20px;
        }
      }

      .tips {
        padding: 0 6px;
        border-top: 1px solid #f0f0f0;
        justify-content: space-between;
        .ptext {
          padding: 8px 0;
          font-size: 12px;
          line-height: 16px;
          margin-left: 5px;
        }
      }
    }
  }
}
.none {
  display: none;
}
</style>
