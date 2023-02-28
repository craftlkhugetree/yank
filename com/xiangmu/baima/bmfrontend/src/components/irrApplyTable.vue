<template>
  <div style="margin-bottom: 20px">
    <div class="item-title">
      <img style="width: 24px;height: 20px" src="../../static/images/bm-basic-info.png" alt="">
      <span>申请信息</span>
    </div>
    <table class="normal-table" style="table-layout: fixed;width: 100%">
      <tr>
        <td>学院名称</td>
        <td>{{applyInfoForm.orgname}}</td>
        <td>项目名称</td>
        <td colspan="5">
          <el-tooltip class="item" effect="dark" :content="applyInfoForm.projectname" placement="right">
            <div style="width: 100%" class="ellipsis">{{applyInfoForm.projectname}}</div>
          </el-tooltip>
        </td>
      </tr>
      <tr>
        <td>课题负责人</td>
        <td>{{applyInfoForm.classleadername}}</td>
        <td>联系电话</td>
        <td>{{applyInfoForm.classleadermobile}}</td>
        <td>申请人</td>
        <td>{{applyInfoForm.eventername}}</td>
        <td>联系电话</td>
        <td>{{applyInfoForm.applyermobile}}</td>
      </tr>
      <tr>
        <td>田间值守人</td>
        <td>{{applyInfoForm.worker}}</td>
        <td>联系电话</td>
        <td>{{applyInfoForm.workermobile}}</td>
        <td>灌溉类型</td>
        <td>{{applyInfoForm.typename}}</td>
        <td>灌溉地块编号</td>
        <td>{{applyInfoForm.rescodes}}</td>
      </tr>
      <tr>
        <td>灌溉日期</td>
        <td>{{applyInfoForm.irdate + ' '}} {{timeRange}}</td>
        <td>备注</td>
        <td colspan="5">
          <el-tooltip class="item" effect="dark" :content="applyInfoForm.note && applyInfoForm.note.length > 0 ? applyInfoForm.note : '--'" placement="right">
            <div style="width: 100%" class="ellipsis">{{applyInfoForm.note && applyInfoForm.note.length > 0 ? applyInfoForm.note : "--"}}</div>
          </el-tooltip>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
    export default {
        name: "irrApplyTable",
      props:{
        applyInfoForm:Object
      },
      computed: {
        timeRange() {
          const timeOption = [
              { text: "全天", value: 1 },
              { text: "上午", value: 2 },
              { text: "下午", value: 3 },
          ];
          let obj = timeOption.find(t => t.value == this.applyInfoForm.daytype) || {}
          return obj.text || ''
        }
      }
    }
</script>

<style scoped>

</style>
