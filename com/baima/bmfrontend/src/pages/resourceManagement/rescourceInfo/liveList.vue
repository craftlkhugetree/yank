<template>
  <div>
    <div v-if="liveList && liveList.length==0" style="margin-bottom: 15px">暂无入驻信息</div>
    <div v-else class="item default" v-for="item in liveList" :key="item.id" :class="{'pink':item.realendtime=='','yellow':prevPage == 'resource-apply'}">
      <div class="title">
        {{item.orgname}}
        <div v-show="item.endtime == null && prevPage != 'resource-apply'" class="my-button blue round samll" style="float: right">已入驻</div>
      </div>
      <el-row class="live-list" :gutter="10">
        <el-col :span="prevPage == 'resource-apply' ? 12 :6">
          <div class="name">课题组</div>
          <div class="value more-ellipsis" :title="item.classname">
            {{item.classname}}

           <!-- <el-tooltip class="item" effect="dark" :content="item.classname" placement="top">
            </el-tooltip>-->
          </div>
        </el-col>
        <el-col :span="prevPage == 'resource-apply' ? 12 :6">
          <div class="name">项目名称</div>
          <div class="value more-ellipsis" :title="item.projectname">
            {{item.projectname}}
          </div>
        </el-col>
        <el-col :span="prevPage == 'resource-apply' ? 12 :6">
          <div class="name">申请人</div>
          <div class="value more-ellipsis" :title="item.applyername">{{item.applyername}}</div>
        </el-col>
        <el-col :span="prevPage == 'resource-apply' ? 12 :6">
          <div class="name">联系电话</div>
          <div class="value more-ellipsis" :title="item.applyermobile">{{item.applyermobile}}</div>
        </el-col>
        <el-col :span="prevPage == 'resource-apply' ? 12 :6">
          <div class="name">课题组负责人</div>
          <div class="value more-ellipsis" :title="item.classleadername">{{item.classleadername}}</div>
        </el-col>
        <el-col :span="prevPage == 'resource-apply' ? 12 :6">
          <div class="name">负责人联系电话</div>
          <div class="value more-ellipsis" :title="item.classleadermobile">{{item.classleadermobile}}</div>
        </el-col>
        <el-col :span="prevPage == 'resource-apply' ? 12 :6">
          <div class="name">入驻时间</div>
          <div class="value more-ellipsis" :title="util. formatTime(item.applytime,'yyyy.MM.dd hh:mm:ss')">{{util. formatTime(item.applytime,"yyyy.MM.dd hh:mm:ss")}} </div>
        </el-col>
        <el-col :span="prevPage == 'resource-apply' ? 12 :6">
          <div class="name">退出时间</div>
          <div class="value more-ellipsis" :title="(item.lasttime && item.lasttime.length >0) ? util. formatTime(item.lasttime,'yyyy.MM.dd hh:mm:ss') : '--'">{{(item.lasttime && item.lasttime.length >0) ? util. formatTime(item.lasttime,"yyyy.MM.dd hh:mm:ss") : "--"}}</div>
        </el-col>
       
        <el-col :span="prevPage == 'resource-apply' ? 12 :6">
          <div class="name">项目来源</div>
          <div class="value more-ellipsis" :title="item.projectfrom">{{item.projectfrom}} </div>
        </el-col>
        <el-col :span="prevPage == 'resource-apply' ? 12 :6">
          <div class="name">项目经费(万元)</div>
          <div class="value more-ellipsis" :title="(item.projectprice ? item.projectprice : '--')">{{(item.projectprice ? item.projectprice : "--")}}</div>
        </el-col>
        <el-col :span="24">
          <div class="name">项目概况</div>
          <div class="value more-ellipsis" :title="item.projectnote">{{item.projectnote}} </div>
        </el-col>
        <el-col :span="24">
          <div class="name">实验概况</div>
          <div class="value more-ellipsis" :title="item.situation">{{item.situation}} </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
    export default {
        name: "liveList",
      props:{
        liveList:Array,
        prevPage:String
      },
      methods:{

      },

      created(){
        console.log(this.liveList)
      }
    }
</script>

<style scoped>

</style>
