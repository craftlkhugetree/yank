<template>
  <div class="process-wrap">
    <!--        <el-alert v-if="applyInfoForm.applystatus == '8'" title="该申请已被驳回,进程结束" type="error" center :closable="false"></el-alert>-->
    <el-alert v-if="applyInfoForm.applystatus == '9'" title="该申请已被撤回,进程结束" type="error" center :closable="false" style="margin-bottom: 15px"></el-alert>
    <el-alert v-if="applyInfoForm.applystatus == '7'" title="超时间未被审批,系统退回" type="error" center :closable="false" style="margin-bottom: 15px"></el-alert>
    <div class="item" v-for="(item,index) in processData" :class="[{active:item.active},item.status]" :key="index">
      <div v-if="!item.rearService">
      <div class="process-line" v-show="!item.hideLine"></div>
      <div class="num-data">
        <div class="num" >
          {{item.num}}
          <!--              <span v-show="item.status !='fail'" style="display: inline-block">{{item.num}}</span>-->
          <div class="date">
            {{item.text}}
            <span v-if="item.date && item.date.length >0" >: {{item.date}}</span>
          </div>
        </div>

      </div>
    </div></div>
  </div>
</template>

<script>
    export default {
        name: "process",
      props:{
        processData:Array,
        applyInfoForm:Object
      },

      created() {
       /* if(this.applyInfoForm.usetype =='3'){
          this.processData[1].hideLine=true
        }*/
      }
    }
</script>

<style scoped>
  
</style>
