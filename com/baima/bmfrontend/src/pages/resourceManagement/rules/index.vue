<template>
    <div class="common-content">
      <div class="rule-list-box" v-loading="loading">
        <div class="item">
          <div class="title">水资源规则</div>
          <el-row class="content">
            <el-col :span="20">
              水资源申请截止时间限制：提前
              <el-input-number v-if="!IRAPPLYDAY.isEdit" v-model="IRAPPLYDAY.rulevalue" size="small" controls-position="right" style="width: 100px" :min="0" :precision="0" placeholder="请输入内容"></el-input-number>
              <span v-else>（{{IRAPPLYDAY.rulevalue}}）</span> 天 ，

              <el-time-picker v-if="!IRAPPLYTIME.isEdit" v-model="IRAPPLYTIME.rulevalue" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" value-format="HHmmss" format="HH:mm" placeholder="任意时间点" size="small" style="width: 150px"></el-time-picker>
              <span v-else>{{common.add_comma_toThousands(IRAPPLYTIME.rulevalue)}}</span>
            </el-col>
            <el-col class="operate" :span="4" style="text-align: right">
              <div v-if="IRAPPLYDAY.isEdit" @click="edit('IRAPPLYDAY')" class="end-btn">
                <img src="../../../../static/images/bm-rule-edit.png" alt="">编辑
              </div>
              <div v-else @click="save('IRAPPLYDAY')" class="end-btn">
                <img src="../../../../static/images/bm-rule-save.png" alt="">保存
              </div>
            </el-col>

          </el-row>
         <!-- <el-row class="content">
            <el-col :span="20">
              当月撤回超过（3）次进入黑名单，本月不得再申请，下月自动开放
            </el-col>
            <el-col :span="4" style="text-align: right">
              编辑
            </el-col>
          </el-row>-->
        </div>

        <div class="item">
          <div class="title">科教资源规则</div>
          <el-row class="content">
            <el-col :span="20">
              资源最多可选择数：
              <el-input-number v-if="!SPAPPLYNUM.isEdit" v-model="SPAPPLYNUM.rulevalue" size="small" controls-position="right" style="width: 100px" placeholder="请输入内容" :min="0" :precision="0"></el-input-number>
              <span v-else>（{{SPAPPLYNUM.rulevalue}}）</span> 个
            </el-col>
            <el-col class="operate" :span="4" style="text-align: right">
              <div v-if="SPAPPLYNUM.isEdit" @click="edit('SPAPPLYNUM')" class="end-btn">
                <img src="../../../../static/images/bm-rule-edit.png" alt="">编辑
              </div>
              <div v-else @click="save('SPAPPLYNUM')" class="end-btn">
                <img src="../../../../static/images/bm-rule-save.png" alt="">保存
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="item">
          <div class="title">本科生实习规则</div>
          <el-row class="content">
            <el-col :span="20">
              教职工需提前
              <el-input-number v-if="!PRJZGDAY.isEdit" v-model="PRJZGDAY.rulevalue" size="small" controls-position="right" style="width: 100px" placeholder="请输入内容" :min="0" :precision="0"></el-input-number>
              <span v-else>（{{PRJZGDAY.rulevalue}}）</span> 天申请，领导审批提前
              <el-input-number v-if="!PRLDDYA.isEdit" v-model="PRLDDYA.rulevalue" size="small" controls-position="right" style="width: 100px" placeholder="请输入内容" :min="0" :precision="0"></el-input-number>
              <span v-else>（{{PRLDDYA.rulevalue}}）</span>天前可审批，超过该天数，系统自动设为审批不通过，原因超时
            </el-col>
            <el-col class="operate" :span="4" style="text-align: right">
              <div v-if="PRJZGDAY.isEdit" @click="edit('PRJZGDAY')" class="end-btn">
                <img src="../../../../static/images/bm-rule-edit.png" alt="">编辑
              </div>
              <div v-else @click="save('PRJZGDAY')" class="end-btn">
                <img src="../../../../static/images/bm-rule-save.png" alt="">保存
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="item">
          <div class="title">转账单模版
            <div class="my-button default" style="float: right" @click="uploadFile">上传文件</div>
          </div>
          <el-row class="content">
            <el-col :span="18">
              <img style="display: inline-block;vertical-align: top;margin-right: 10px" src="../../../../static/images/bm-filetype-common.png" alt="">
              <div style="display: inline-block;vertical-align: top">
                <div>{{BILLTEMPLATE && BILLTEMPLATE.TITLE ? BILLTEMPLATE.TITLE : ""}}</div>
              </div>
            </el-col>
            <el-col :span="6" style="text-align: right; display: flex; justify-content: end">
              <span style="margin-right: 15px;color: #00B09B;cursor: pointer;" @click="common.previewFile(BILLTEMPLATE.ID)" class="end-btn">
                <img style="width: 19px;height: 20px;margin-right: 10px" src="../../../../static/images/bm-file-preview.png" alt="">预览
              </span>
              <span>
                 <a :href=downUrl+BILLTEMPLATE.ID target="_blank" style="text-decoration: none;color: #00B09B" class="end-btn">
                  <img style="width: 21px;height: 19px;margin-right: 1px" src="../../../../static/images/bm-rule-file-down.png" alt="">
                  <span>下载</span>
                </a>
              </span>
            </el-col>
          </el-row>
        </div>

        <div class="item">
          <div class="title">在线报修</div>
          <el-row class="content">
            <el-col :span="20">
              自动确认修复时间：
              <el-input-number v-model="REPAIR.rulevalue" size="small" controls-position="right" style="width: 100px" placeholder="请输入" :min="0" :precision="0" :max="240"></el-input-number>
              <span>小时后用户未确认，则默认报修单已修复。</span> 
            </el-col>
            <el-col class="operate" :span="4" style="text-align: right">
              <div @click="save('REPAIR')" class="end-btn">
                <img :src="require('st@tic/images/bm-rule-save.png')" alt>保存
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <upload v-show="false" ref="upload" class="my-upload" :url="uploadUrl" :multiple="false" :exts="fileType" @choose="choosefile" @done="finish"></upload>
    </div>
</template>

<script>
  import upload from "../../../components/BaseUpload"
    export default {
        name: "index",
      components:{
        upload
      },
      data(){
        return{
          rulesList:[],
          // 报修单
          REPAIR: {rulevalue: 0},
          IRAPPLYDAY:{},    //水资源申请规则提前几天
          IRAPPLYTIME:{},    //水资源申请规则提前几天的几点
          SPAPPLYNUM:{},   //温网室可以同时申请几个资源
          PRJZGDAY:{},   //本科生教职工提前几天申请
          PRLDDYA:{},    //本科生实习领导提前几天审批
          BILLTEMPLATE:{},
          BILLTEMPLATEID:{},  //对账单模板文件
          fileId:"",
          fileType:"doc|DOC|docx|DOCX|jpg|JPG|png|PNG|xls|XLS|pdf|PDF",
          uploadUrl:window.g.ApiUrl3 +"rest/FileOut/saveFile",
          fileUrl:window.g.ApiUrl3 +"rest/FileOut/view/",
          downUrl:window.g.ApiUrl3 +"rest/FileOut/down?ID=",
          fullscreenLoading:"",  //全局加载
          loading:false
        }
      },
      methods:{
        previewFile(id){
          this.util.getUrlByCode(fileUrl+id)
        },

        //下载文件
        downFile(id){
          window.open(this.downFile+id,"_blank")
        },


        choosefile(){
          // this.fullscreenLoading = true;

          this.fullscreenLoading =this.$loading({
            lock: true,
            text: '上传中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        },

        //点击上传
        uploadFile(){
          this.$refs.upload.$refs.uploaddom.click();
        },

        //结束后返回
        finish(res){
          // console.log(res);
          // this.fullscreenLoading = false;
          this.fullscreenLoading.close();
          if(res.success ==true){
            this.fileId=res.data[0].ID;

           /* this.util.getUrlByCode(window.g.ApiUrl3+"rest/FileOut/view/"+fileId).then(res => {
              console.log(res);
            })*/

           this.getFileId();

           this.save("BILLTEMPLATEID")
          }
        },

        getFileId(){
          this.util.postAjax({
            code:this.global.code,
            url:"/rules/getFileInfo",
            data:{
              id:this.fileId
            }
          }).then(res => {
            // console.log(res);
            if(res.success == true){
              this.BILLTEMPLATE=res.item;
              // console.log(this.BILLTEMPLATE);
              // this.fileId=this.BILLTEMPLATE && this.BILLTEMPLATE.ID ? this.BILLTEMPLATE.ID : "";

              if(this.BILLTEMPLATE && this.BILLTEMPLATE.ID){
                this.fileId=this.BILLTEMPLATE.ID
              }
            }
          })
        },

          //编辑
          edit(type){
            this.$forceUpdate();
            switch (type) {
              case "IRAPPLYDAY":
                this.IRAPPLYDAY.isEdit = !this.IRAPPLYDAY.isEdit;
                this.IRAPPLYTIME.isEdit = !this.IRAPPLYTIME.isEdit;
                // console.log(this.IRAPPLYDAY);
                break;
              case "SPAPPLYNUM":
                this.SPAPPLYNUM.isEdit = !this.SPAPPLYNUM.isEdit;
                break;
              case "PRJZGDAY":
                this.PRJZGDAY.isEdit = !this.PRJZGDAY.isEdit;
                this.PRLDDYA.isEdit = !this.PRLDDYA.isEdit;
                break;
            }
            },

          //保存多个
          moreSave(arr,obj1,obj2){
            const loading = this.$loading({
                  lock: true,
                  text: "保存中",
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
            this.util.postAjax({
              code:this.global.code,
              url:"/rules/updateBatch",
              isRep:true,
              data:arr
            }).then(res => {
              loading.close();
              if(res.success == true){
                this.$forceUpdate();
                obj1.isEdit=true;
                obj2.isEdit=true;
                this.$message({
                  type:"success",
                  message:"保存成功"
                })
              }
            });
          },

          //保存单个
          singleSave(data,obj){
            const loading = this.$loading({
                  lock: true,
                  text: "保存中",
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
            this.util.postAjax({
              code:this.global.code,
              url:"/rules/update",
              isRep:true,
              data:data
            }).then(res => {
              loading.close();
              if(res.success == true){
                this.$forceUpdate();
                obj.isEdit=true;
                this.$message({
                  type:"success",
                  message:"保存成功"
                })
              }
            });
          },


          //保存
          save(type){

            // console.log("type",type);
            switch (type) {
              case "IRAPPLYDAY":
                let arr = [];
                arr.push({id:this.IRAPPLYDAY.id,rulevalue:this.IRAPPLYDAY.rulevalue});
                arr.push({id:this.IRAPPLYTIME.id,rulevalue:this.IRAPPLYTIME.rulevalue});
                // console.log(arr);
                this.moreSave(arr,this.IRAPPLYDAY,this.IRAPPLYTIME);
              break;
              case "SPAPPLYNUM":
                let data={
                  id:this.SPAPPLYNUM.id,
                  rulevalue:this.SPAPPLYNUM.rulevalue
                };
                this.singleSave(data,this.SPAPPLYNUM);
                break;
              case "PRJZGDAY":
                let arr2 = [];
                arr2.push({id:this.PRJZGDAY.id,rulevalue:this.PRJZGDAY.rulevalue});
                arr2.push({id:this.PRLDDYA.id,rulevalue:this.PRLDDYA.rulevalue});
                this.moreSave(arr2,this.PRJZGDAY,this.PRLDDYA);
                break;
              case "BILLTEMPLATEID":
                // console.log("this.BILLTEMPLATE",this.BILLTEMPLATE);
                let data2={
                  id:this.BILLTEMPLATEID.id,
                  rulevalue: this.fileId
                };
                // console.log("data2",data2);
                this.singleSave(data2,this.BILLTEMPLATEID);
                break;
              case "REPAIR":
                this.singleSave(this.REPAIR, this.REPAIR);
                break;
              default:
                break;
            }
          },


          //获取规则列表
          getRuleList(){
          this.loading=true;
            this.util.postAjax({
              code:this.global.code,
              url:"/rules/list",
            }).then(res => {
              this.loading=false;
              if(res.success == true){
                this.rulesList = res.items;
                this.rulesList.forEach(v=>{
                  v.isEdit=true;
                  switch (v.rulecode) {
                    case "IRAPPLYDAY":
                      this.IRAPPLYDAY=v;
                      break;
                    case "IRAPPLYTIME":
                      this.IRAPPLYTIME=v;
                      break;
                    case "SPAPPLYNUM":
                      this.SPAPPLYNUM=v;
                      break;
                    case "PRJZGDAY":
                      this.PRJZGDAY=v;
                      break;
                    case "PRLDDYA":
                      this.PRLDDYA=v;
                      break;
                    case "BILLTEMPLATEID":
                      this.BILLTEMPLATEID=v;
                      this.fileId =v.rulevalue;
                      this.getFileId();
                      break;
                    case "B01":
                      this.REPAIR = v;
                      break;
                    default:
                      break;
                  }
                })
              }
              // console.log(this.PRLDDYA);
            })
          }
      },
      created() {
          this.getRuleList();
          // this.getFileId()
      }
    }
</script>

<style scoped lang="scss">
.end-btn {
  cursor: pointer;
  display: flex;
  align-items: center; 
  justify-content: end;
}

</style>
