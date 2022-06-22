<template>
  <div style="margin-bottom: 20px">
    <div class="item-title">
      <img style="width: 24px;height: 20px" src="../../../../static/images/bm-basic-info.png" alt="">
      <span>基本信息</span>
    </div>
    <table class="normal-table" style="table-layout: fixed;width: 100%">
      <tr>
        <td>申请类型</td>
        <td>{{applyInfoForm.usetype}}</td>
        <td>资源编号</td>
        <td>{{applyInfoForm.orgname}}</td>
        <td>项目名称</td>
        <td colspan="3">
          <el-tooltip class="item" effect="dark" :content="applyInfoForm.projectname" placement="right">
            <div style="width: 100%" class="ellipsis">{{applyInfoForm.projectname}}</div>
          </el-tooltip>
        </td>
      </tr>
      <tr>
        <td>时长</td>
        <td>{{applyInfoForm.usecycle}}{{applyInfoForm.chargecycle}}</td>
        <td>课题负责人</td>
        <td>{{applyInfoForm.classleadername}}</td>
        <td>联系电话</td>
        <td>{{applyInfoForm.classleadermobile}}</td>
        <td>退出时间</td>
        <td>{{applyInfoForm.endtime}}</td>
      </tr>
      <tr>
        <td>待缴费用</td>
        <td>{{common.moneyFormatter("","",applyInfoForm.worker)}}元</td>
        <td>剩余使用时间</td>
        <td>{{applyInfoForm.irrestype}}</td>
        <td>入驻状态</td>
        <td>{{applyInfoForm.rescodes}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
    export default {
        name: "irrApplyTable",
      props:{
        applyInfoForm:Object
      }
    }
</script>

<style scoped>

</style>
