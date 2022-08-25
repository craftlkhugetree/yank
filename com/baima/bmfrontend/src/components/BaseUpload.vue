<!--使用方法-->
<!--<upload-->
    <!--:url="this.util.getUploadUrl()"--><!--绑定url  必须-->

    <!--exts="png|jpg|bmp|gif"--><!--指定文件后缀  必须-->

    <!--v-on:choose="choosefiel"--><!--选择文件后的回调 -->

    <!--v-on:done="finish"--><!--完成上传后的回调-->

    <!--:carmera:"true"--><!--是否可以支持拍照上传，true是可以支持-->

<!--&gt;-->

<template>
    <div>
        <span class="uploadbtn" @click="toupload">上传文件</span>
        <!--<span>（单张不得超过3M）</span>-->
        <input type="file" rel="files" :multiple="multiple" @change="getFile" title="上传文件" ref="uploaddom" class="uploadinput">
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "upload",
        data(){
            return {
                fileList : []
            }
        },
        methods:{
            getCookie(name){
                let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg))
                    return unescape(arr[2]);
                else
                    return null;
            },
            getFile(e){
                this.fileList = e.target.files;
                if(!this.fileList.length){
                    return false;
                }
                let exts = this.exts.split('|');

                for(let i=0;i<this.fileList.length;i++){
                    let item = this.fileList[i];
                    let fileNameArr = item.name.split('.');
                    let fileext = fileNameArr[fileNameArr.length - 1];
                    if(exts.indexOf(fileext) === -1){
                        this.$message('上传了不符合后缀的文件！');
                        throw '上传了不符合后缀的文件！';
                    }
                    if(this.size){
                        let limitFileSize = this.size * 1024;
                        if(item.size > limitFileSize){
                            this.$message('上传文件超过限制大小！');
                            throw '上传文件超过限制大小！';
                        }
                    }

                }
                this.$emit('choose',this.fileList);
                let formData = new FormData();
                for(let i=0;i<this.fileList.length;i++){
                    formData.append('file',this.fileList[i]);

                    this.isNew ? null : formData.append('restypeid',this.activeResType);
                }
                let axiosSettings = {
                    url : this.url,
                    method : 'POST',
                    headers : {
                      "IDSTGC" : this.getCookie('IDSTGC') || "179392f4f5b1443e978a950e04a3c1d5",
                        // "IDSTGC" : this.getCookie('IDSTGC'),
                    },
                    data : formData,
                }
                axios(axiosSettings).then(data => {
                    let res = data.data;
                    if (res!==null && !res.success){
                        if (res.hasOwnProperty("login") && !res.login){
                            let pathName = window.document.location.pathname;
                            let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
                            let url=projectName+"/";
                            let purl=document.location.href;//
                            location.href = url+'rest/Idsclient/reqLogin?reqUrl='+encodeURIComponent(purl);
                        }else{
                          // console.log(Array.isArray(res.message) );
                          //判断返回错误状态

                          if(typeof res.message == "object"){
                            let message="";
                            for(var key in res.message){
                              let single="第"+key+"行："+res.message[key];
                              message += single + ",";
                            }
                            if(message.length >0 ){
                              message = message.substr(0,message.length-1);
                            }
                            const h = this.$createElement;
                            this.$message({
                              type:"warning",
                              // message:"<div>除以下问题数据外，其他数据都已上传成功：</div><div>"+message+"</div>",
                              message: h('p', null, [
                                h('p', {style:'color: orange;margin-bottom:10px'}, '除以下问题数据外，其他数据都已上传成功： '),
                                h('p', { style: 'color: red' }, message)
                              ]),
                              duration: 0,
                              showClose:true
                            });
                            this.$emit("unfinished")
                          }else {
                            this.$message(res.message);
                          }


                        }
                    }else{
                      // console.log(res);
                      this.$emit('done', res);
                    }
                })


            },

           dropFile(e){
             this.fileList = e.dataTransfer.files;
            if(!this.fileList.length || this.fileList.length>1){
              return false;
            }
            let exts = this.exts.split('|');

            for(let i=0;i<this.fileList.length;i++){
              let item = this.fileList[i];
              let fileNameArr = item.name.split('.');
              let fileext = fileNameArr[fileNameArr.length - 1];
              if(exts.indexOf(fileext) === -1){
                this.$message('上传了不符合后缀的文件！');
                throw '上传了不符合后缀的文件！';
              }
              if(this.size){
                let limitFileSize = this.size * 1024;
                if(item.size > limitFileSize){
                  this.$message('上传文件超过限制大小！');
                  throw '上传文件超过限制大小！';
                }
              }

            }
            this.$emit('choose',this.fileList);
            let formData = new FormData();
            for(let i=0;i<this.fileList.length;i++){
              formData.append('file',this.fileList[i]);
            }
            let axiosSettings = {
              url : this.url,
              method : 'POST',
              headers : {
                // "IDSTGC" : this.getCookie('IDSTGC') || "8cae33b595b04147a3a9e670783dcdbd",
                "IDSTGC" : this.getCookie('IDSTGC') ,
              },
              data : formData,
            }
            axios(axiosSettings).then(data => {
              let res = data.data;
              if (res!==null && !res.success){
                if (res.hasOwnProperty("login") && !res.login){
                  let pathName = window.document.location.pathname;
                  let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
                  let url=projectName+"/";
                  let purl=document.location.href;//
                  location.href = url+'rest/Idsclient/reqLogin?reqUrl='+encodeURIComponent(purl);
                }else{
                  this.$message(res.message);
                }
              }else{
                this.$emit('done', res);
              }
            })


          },
            toupload(){
                this.$refs.uploaddom.click();
            },
            Toast(message){
                let _div = document.createElement('div');
                let divCss = {
                    'position': 'fixed',
                    'top':'50%',
                    'width': '100%',
                };
                for (let i in divCss){
                    _div.style[i] = divCss[i];
                }
                let _message = document.createElement('sapn');
                _message.innerText = message;
                let spanCss = {
                    'background-color' : 'rgba(0,0,0,0.5)',
                    'padding': '15px 15px',
                    'border-radius': '5px',
                    'color': '#FFF',
                    'margin-left': 'auto',
                    'margin-right': 'auto',
                    'max-width' : '300px',
                    'font-size' : '1rem',
                    'display' : 'block',
                    'text-align' : 'center'
                };
                for (let i in spanCss){
                    _message.style[i] = spanCss[i];
                }
                _div.appendChild(_message);
                let _body = document.getElementsByTagName('body')[0];
                _body.appendChild(_div);
                setTimeout(function () {
                    _body.removeChild(_div);
                },3000)
            }
        },
        watch:{

        },
        props:{
            url:String,
            exts:String,
            size:[String, Number],
            multiple:Boolean !== false,
            choose:Function,
            filelist:Array,
            beforeupload:Function,
            done:Function,
            autoupload:Boolean !== false,
            isNew: Boolean,
            activeResType:String
            // carmera:Boolean !== false
        },
        created(){
            this.exts = this.exts ? this.exts : 'jpg|png|bmp|gif|txt';
            // this.carmera = this.carmera ? 'image/*' : '';
        },

    }
</script>

<style scoped>
    .uploadbtn {
        width:80px;
        height:16px;
        background:rgba(0,106,229,1);
        border-radius:5px;
        color: #fff;
        padding: 4px 10px;
        cursor: pointer;
    }
    .uploadinput {
        display: none;
    }
</style>
