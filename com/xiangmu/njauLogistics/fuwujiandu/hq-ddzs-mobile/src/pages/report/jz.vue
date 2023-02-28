<template>
  <div>
    <role-bar title="我要督查"></role-bar>
    <div class="bg all">
      <div class="title">请选择事件分类</div>
      <div class="div_flex list">
        <div
          v-for="item in tableList"
          :key="item.ID"
          class="font-s item"
          @click="choose(item)"
          :class="item.choose ? 'choose' : ''"
        >
          <span>{{ item.NAME }}</span>
        </div>
      </div>
    </div>
    <div class="div_flex bottom_btn">
      <van-button round class="btn pre" @click.stop="back">
        返回上一步</van-button
      >
      <van-button round class="btn" :disabled="canBtn" @click.stop="save">
        <i class="iconfont iconcheck1 check"></i>确定提交</van-button
      >
    </div>
  </div>
</template>
<script>
import { workOrder_save } from "@/assets/js/api";
export default {
  name: "JZ",
  data() {
    return {
      tableList: [],
      form: {}
    };
  },
  computed: {
    canBtn() {
      return !this.form[this.global.handleDeptId];
    }
  },
  methods: {
    back() {
      this.common.back();
    },
    save() {
      this.form = this.common.getStore(this.global.FORM);
      let param = {
        areaId: "", // 0,
        areaName: "", // "string",
        createId: "", // "string",
        createName: "", // "string",
        handleDeptId: "", // "string",
        handleNode: this.global.DCJC, // "string",
        jzEventId: "", // "string",
        jzEventName: "", // "string",
        labels: "", // "string",
        note: "", // "string",
        photos: "", // "string",
        voices: "" // "string"
      };
      for (let p in param) {
        param[p] = this.form[p];
      }
      let reg = /(<span.*?>.*?<\/span>){1}/;
      let labels = this.form.innerHTML.split(reg);
      let notes = labels.filter(b => !reg.test(b));
      let note = notes.join("").replace(/&nbsp;/g, "");
      param.note = note;
      let label = labels.filter(b => reg.test(b));
      let content = label.map(b => {
        let tmp = b.replace(/(<span.*?>|<\/span>|#)/g, "");
        return tmp;
      });
      let single = content.filter((c, id, arr) => {
        return arr.indexOf(c) === id;
      });
      param.labels = single.join(",");
      param.photos = this.form.fileList.map(f => f.id).join(",");
      param.voices = this.form.voiceList.join(",");
      workOrder_save(param).then(res => {
        this.common.dealRes(res, () => {
          this.$router.push("/success");
        });
      });
    },
    choose(item) {
      this.$set(this.form, this.global.handleDeptId, item.ID);
      this.transColor();
    },
    transColor() {
      this.tableList.forEach(t => {
        if (t.ID === this.form[this.global.handleDeptId]) {
          this.$set(t, "choose", true);
        } else {
          this.$set(t, "choose", false);
        }
      });
    }
  },
  mounted() {
    this.form = this.common.getStore(this.global.FORM);
    this.tableList = this.$store.state.departments;
    this.transColor();
  }
};
</script>
<style lang="scss" scoped>
.all {
  min-height: 100vh;
  // padding-left: $fixed_side;
  // padding-right: $fixed_side;
  .title {
    margin: $fixed_side 0;
    height: 24px;
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 24px;
    color: #121212;
  }
  .list {
    flex-wrap: wrap;
    .item {
      margin: 0 $fixed_mb $fixed_mb 0;
      height: 36px;
      line-height: 36px;
      text-align: center;
      color: #595959;
      background: #f5f5f5;
      border-radius: 24px;
      span {
        padding: 0 $fixed_side;
      }
    }
    .choose {
      background: rgba(0, 100, 87, 0.08) !important;
      border: 1px solid $c-green !important;
      border-radius: 24px !important;
      color: $c-green !important;
    }
  }
}
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
  color: #fff;
  // background: #fff;
}
</style>
