<template>
  <div>
    <rotation :form="form"></rotation>
    <process :form="form"></process>
    <div class="div_flex bottom_btn">
      <van-button
        v-for="r in global.roleStatus[whatRole]"
        :key="r.text"
        round
        class="btn"
        :class="
          r.btn === global.STR.zy || r.btn === global.STR.jxzg ? 'pre' : ''
        "
        @click="r.btn ? op(r, form) : void 0"
        :style="{ display: r.exist(form) && r.btn ? 'block' : 'none' }"
      >
        <i :class="r.icon" class="check"></i>{{ r.btn }}</van-button
      >
    </div>
    <popup
      :popName.sync="popName"
      ref="popup"
      :obj.sync="rItem"
      name="Detail"
    ></popup>
  </div>
</template>
<script>
import { workOrder_find } from "@/assets/js/api";
export default {
  name: "Detail",
  components: {
    rotation: () => import("./rotation"),
    process: () => import("./process"),
    popup: () => import("@/components/popup")
  },
  props: {
    id: String
  },
  computed: {
    isLabel() {
      return this.title === "共性标签";
    },
    whatRole() {
      return this.common.getStore(this.global.roleName);
    }
  },
  data() {
    return {
      form: {},
      popName: "",
      rItem: {}
    };
  },
  methods: {
    op(r, item) {
      if (r.btn) {
        this.popName = r.btn;
        this.rItem = item;
        this.$refs.popup.show = true;
      }
    },
    cont() {},
    pass() {},
    getData() {
      workOrder_find(this.id).then(res => {
        this.common.dealRes(res, () => {
          this.form = res.data;
        });
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.bottom_btn {
  position: absolute;
  width: 100%;
  bottom: 42px;
  justify-content: space-around;
  .btn {
    width: 45%;
    background: $c-green;
    font-size: 16px;
    color: #ffffff;
    margin-top: $fixed_side;
  }
  .pre {
    background: #ffffff;
    color: #595959;
  }
}
.check {
  margin-right: $fixed_mb;
}
</style>
