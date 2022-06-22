<template>
    <div>
      <!--申请信息-->
      <div style="margin-bottom: 20px">
        <div class="item-title">
          <img style="width: 24px;height: 20px" src="../../../static/images/bm-basic-info.png" alt="">
          <span>基本信息</span>
        </div>
        <table class="normal-table" style="table-layout: fixed;width: 100%">
          <tr>
            <td>资源类型</td>
            <td>{{applyInfoForm.restype.name}}</td>
            <td>资源编号</td>
            <td>{{applyInfoForm.rescodes}}</td>
            <td>学院名称</td>
            <td>{{applyInfoForm.orgname}}</td>
            <td>课题组名称</td>
            <td>{{applyInfoForm.classname}}</td>
          </tr>
          <tr>
            <td>申请人</td>
            <td>{{applyInfoForm.applyername}}</td>
            <td>联系电话</td>
            <td>{{applyInfoForm.applyermobile}}</td>
            <td>课题组负责人</td>
            <td>{{applyInfoForm.classleadername}}</td>
            <td>联系电话</td>
            <td>{{applyInfoForm.classleadermobile}}</td>
          </tr>
          <tr>
            <td>使用时长</td>
            <td>{{applyInfoForm.usecycle ? applyInfoForm.usecycle : "--"}}{{applyInfoForm.chargecycle}}</td>
            <td>项目名称</td>
            <td colspan="5">
              <el-tooltip class="item" effect="dark" :content="applyInfoForm.projectname" placement="right">
                <div style="width: 100%" class="ellipsis">{{applyInfoForm.projectname}}</div>
              </el-tooltip>
            </td>
          </tr>
          <tr>
            <td>项目来源</td>
            <td>{{applyInfoForm.projectfrom}}</td>
            <td>项目经费</td>
            <td>{{applyInfoForm.projectprice}}万元</td>
          </tr>
          <tr>
            <td >项目概况</td>
            <td :colspan="7">{{applyInfoForm.projectnote}}</td>
          </tr>
          <tr>
            <td>实验概况</td>
            <td :colspan="7">{{applyInfoForm.situation}}</td>
          </tr>
        </table>
      </div>

      <!-- 费用-->
      <div v-if="applyInfoForm.usetype !='3'" style="margin-bottom: 20px">
        <div class="item-title">
          <img style="width: 24px;height: 20px" src="../../../static/images/bm-fee-info.png" alt="">
          <span>费用</span>
        </div>
        <el-table class="my-table my-table-with-total" :data="applyInfoForm.ress" style="width: 100%" stripe show-summary >
          <el-table-column prop="rescode" label="资源编号" align="center"></el-table-column>
          <el-table-column prop="area" label="面积(㎡)" align="center" ></el-table-column>
          <el-table-column prop="price" :label="'单价（元/'+applyInfoForm.chargecycle+'/'+applyInfoForm.chargetype+'）'" :formatter="common.moneyFormatter" align="center"></el-table-column>
          <el-table-column prop="usecycle" :label="'时长('+applyInfoForm.chargecycle+')'" align="center">
<!--            <template slot-scope="scope">-->
<!--              {{scope.row.usecycle}}{{applyInfoForm.chargecycle}}-->
<!--            </template>-->
          </el-table-column>
          <el-table-column prop="cost" label="费用(元)" align="center" :formatter="common.moneyFormatter"></el-table-column>
        </el-table>

      </div>
    </div>
</template>

<script>
    export default {
      name: "applyInfoFee",
      props:{
        applyInfoForm:Object
      },
      created() {
        // console.log(this.applyInfoForm);
      }
    }
</script>

<style scoped>

</style>
