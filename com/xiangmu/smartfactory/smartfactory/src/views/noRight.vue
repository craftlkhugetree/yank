<template>
  <error-info :imgUrl="imgUrl" :errText="errText"></error-info>
</template>

<script>
import ErrorInfo from "@/components/ErrorInfo";
export default {
  components: {
    ErrorInfo
  },
  data() {
    return {
      imgUrl: require("@/assets/img/noright.png"),
      errText: "抱歉，您没有权限查看"
    }
  }
};
</script>