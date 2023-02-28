<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    per: Number,
    color: {
      type: String,
      default: "red",
    },
  },
  components: {},

  methods: {},
  mounted() {
    var draw = this.$refs["canvas"];
    var ctx = draw.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(246, 246, 246, 1)";
    ctx.arc(30, 30, 25, 0, Math.PI * 2, false);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = this.color;
    let perNum = (this.per / 100) * 2;
    ctx.arc(30, 30, 25, 0, Math.PI * perNum, Math.PI * 0, false);
    ctx.stroke();
    ctx.translate(30, 30);
    ctx.rotate((90 * Math.PI) / 180);
    ctx.font = "16px Arial";
    ctx.fillText(this.per + "%", -15, 5);
  },
};
</script>
<style lang='scss' scoped>
#canvas {
  height: 100%;
  width: 100%;
}
</style>
