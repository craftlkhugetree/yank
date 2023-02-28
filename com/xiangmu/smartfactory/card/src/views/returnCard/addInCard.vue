<template>
  <div class="scan">
    <div v-if="!errorText">
      <img class="bg" src="@/assets/img/scan.png" alt />
      <p>请把卡片插入屏幕下的读卡口</p>
      <img class="btn" src="@/assets/img/next-btn.png" alt @click="next" />
    </div>

    <!----------------------------- 无卡片 ----------------------------->
    <div v-else>
      <searching :text="errorText"></searching>
      <img class="btn" src="@/assets/img/back-btn.png" alt @click="errorText=null" />
    </div>
    <!----------------------------- 卡片 ----------------------------->
    <object
      classid="clsid:0be4f795-6a71-4192-8900-0932acd6100a"
      id="SmartCard"
      width="0"
      height="0"
    ></object>
  </div>
</template>

<script>
import Searching from '@/components/Searching'
export default {
  components: {
    Searching
  },
  data() {
    return {
      SmartCard: null,
      errorText: null,
      cardNumber: null
    }
  },
  methods: {
    // 下一步
    next() {
	  /**测试用数据开始**/
	 /** this.cardNumber = '34567894'; // 10进制
	  sessionStorage.setItem('cardNumber', this.cardNumber);
	  this.$router.push('/returncard/searchorder');
	  return ;
	  **/
	  
	   /**测试用数据结束**/
      try {
       
          let data = this.SmartCard.recoveryCard()
          //console.log("16进制卡号：" + data)
          if (data == -1) {
            this.errorText = '读卡故障，请联系管理员';
			this.SmartCard.reciveCard();
          } else {
            this.cardNumber = parseInt(data, 16) // 10进制
            //console.log("10进制卡号：" + this.cardNumber)
            sessionStorage.setItem('cardNumber', this.cardNumber)
            this.$router.push('/returncard/searchorder')
          }
        
      } catch (e) {
        this.SmartCard.reciveCard();
        this.errorText = '读卡故障，请联系管理员'
      }
    }
  },
  mounted() {
    this.SmartCard = document.getElementById('SmartCard')
  }
}
</script>

<style lang="scss" scoped>
</style>