<template>
    <div class="content">
        <div class="booktop">
            <div class="mainperson">
                <!-- <span>经费负责人</span>
                <input type="text" id="cardsNum2" placeholder="请输入经费负责人" v-model="addPeriodical.CREATORNAME" @change="changename(addPeriodical.CREATORNAME)" @keyup="getGroup">
                <ul id="getGroup">
                    <li v-for="(v,i) in CREATORNAMEs" :key="i" @click="setvalue(v.NAME,v.ID)">{{v.NAME}}({{v.ID}})</li>
                </ul> -->
                <span>经费本号</span>
                <input type="text" id="cardsNum2" placeholder="请输入经费本号" v-model="addPeriodical.FUNDNUMBER" @change="addPeriodical.FUNDNUMBER = (addPeriodical.FUNDNUMBER || '').toUpperCase()" maxlength="100" />
            </div>
            <div class="bookstype">
                <div class="title">报刊种类</div>
                <div class="selects">
                    <select v-model="addPeriodical.ISChINESE" @change="isshowOA1(addPeriodical.ISChINESE)">
                        <option value="">请选择图书种类</option>
                        <option value="1">境内出版</option>
                        <option value="0">境外出版</option>
                    </select>
                </div>
                <!-- <div>
                    <input type="radio" id="churchyard" value="1" @change="isshowOA1(1)" v-model="addPeriodical.ISChINESE" name="radios">
                    <label for="churchyard">境内</label>
                    <input type="radio" id="overseas" value="0" @change="isshowOA1(0)" v-model="addPeriodical.ISChINESE" name="radios">
                    <label for="overseas">境外</label>
                </div> -->
            </div>
            <mt-field label="报刊种数" placeholder="请输入" v-model="addPeriodical.KINDNUM" @change="validnum(addPeriodical.KINDNUM)"></mt-field>
            <!-- <div class="bookstype">
                <div class="title">经费类型</div>
                <div class="selects">
                    <select v-model="addPeriodical.FUNDTYPE">
                        <option value="">请选择经费类型</option>
                        <option value="行政类">行政类</option>
                        <option value="非行政类">非行政类</option>
                    </select>
                </div>
            </div> -->
            <!-- <mt-field label="经费本编号" placeholder="请输入" v-model="addPeriodical.FUNDNUMBER"></mt-field> -->
            <mt-field label="发票号" placeholder="请输入" v-model="addPeriodical.INVOICENUMBER" @change.native="checkInvoiceNum(addPeriodical.INVOICENUMBER)"></mt-field>
            <mt-field label="发票总金额" placeholder="请输入" v-model="addPeriodical.ALLMONEY" @change.native="isshowOA(addPeriodical.ALLMONEY)"></mt-field>
            <!-- <mt-field label="手机号" placeholder="请输入" v-model="addPeriodical.PHONE" @change.native="validphone(addPeriodical.PHONE)"></mt-field> -->
            <mt-field label="用途说明" placeholder="请输入" v-model="addPeriodical.REASON"></mt-field>
            
        </div>
        <div class="bookbottom">
            <mt-cell title="上传购书清单" is-link  @click.native="upload">
                <img v-for="(v,i) in bookorders.slice(0,3)" :key="i" :src="domain+'/fileManage/get?ID='+v.ID" height="30px" width="30px">
                <span v-show="bookorders.length>3" style="color: #ccc">...</span>
            </mt-cell>
            <mt-cell title="上传发票照片" >
                <img v-show="FPfiles[0].ID" :preview='1' :src="domain+'/fileManage/get?ID='+FPfiles[0].ID" height="30px" width="30px">
                <span class="rightadd" @click="uploadFP">
                    <upload style="display:none;" ref="upload" :multiple='true' exts="png|jpg|bmp|gif|PNG|JPG|HEIC|JPEG|jpeg|pdf|PDF" v-on:choose="choosefiel" v-on:done="finish" :url="uploadUrl"></upload>
                </span>
            </mt-cell>
            <!-- <mt-cell title="上传OA审核文件截图" v-show="showOA == 'true'">
                <img v-show="OAfiles[0].ID" :preview='2' :src="domain+'/fileManage/get?ID='+OAfiles[0].ID" height="30px" width="30px">
                <span class="rightadd"  @click="uploadOA">
                    <upload style="display:none;" ref="uploadOA" :multiple='true' exts="png|jpg|bmp|gif|PNG|JPG|HEIC|JPEG|jpeg|pdf|PDF" v-on:choose="choosefiel" v-on:done="finishOA" :url="uploadUrl"></upload>
                </span>
            </mt-cell>
             <mt-cell title="上传文献资源项目采购申报表" v-show="showOA == 'true'" >
                <img v-show="DOCfiles[0].ID" :preview='3' :src="domain+'/fileManage/get?ID='+DOCfiles[0].ID" height="30px" width="30px">
                <span class="rightadd" @click="uploadDOC">
                    <upload style="display:none;" ref="uploadDOC" :multiple='true' exts="png|jpg|bmp|gif|pdf|PNG|JPG|HEIC|JPEG|jpeg|pdf|PDF" v-on:choose="choosefiel" v-on:done="finishDOC" :url="uploadUrl"></upload>
                </span>
            </mt-cell> -->
            <mt-cell title="上传采购结果公告" v-show="ifNeedPurchaseresult" >
                <img v-show="PURfiles[0].ID" :preview='3' :src="domain+'/fileManage/get?ID='+PURfiles[0].ID" height="30px" width="30px">
                <span class="rightadd" @click="uploadPUR">
                    <upload style="display:none;" ref="uploadPUR" :multiple='true' exts="png|jpg|bmp|gif|pdf|PNG|JPG|HEIC|JPEG|jpeg|pdf|PDF" v-on:choose="choosefiel" v-on:done="finishPUR" :url="uploadUrl"></upload>
                </span>
            </mt-cell>
        </div>
        <div class="bookfixedbottom1">
            <div class="bookfixedbottom1left" @click="Periodicalsave">提交审核</div>
            <div class="bookfixedbottom1right" @click="back">返回</div>
        </div>
        <div class="meng" v-show="ismeng">
            <p>保存中...</p>
        </div>
        <div class="imgmeng" v-show="imgmeng">
            <p>图片上传中...</p>
        </div>
    </div>
</template>
<script>
import code from '../util/code'
import upload from '../components/upload'
import Vue from 'vue'
import { global } from '../util/global'

export default {
    components: {
      upload  
    },
    data() {
        return {
            addPeriodical:{
                CREATORNAME:'',//经费负责人
                INVOICENUMBER:'',//发票号，唯一，注意先调接口判断）
                FUNDNUMBER: '',//经费本编号
                FUNDTYPE: '行政类',//经费类型
                KINDNUM: '',//报刊种数
                ALLMONEY: '',//总金额
                CREATORID: '',//负责人ID，从接口获取
                REASON:'',//说明
                PHONE:'',//手机号
                ISChINESE:'',//报刊种类
            },
            CREATORNAMEs:[],//负责人列表的数组
            uploadUrl:'',//上传发票图片的url
            bookorders:[],//购书单的数组
            FPfiles:[{ID:''}],//发票的数组
            showOA :'',//是否显示OA
            OAfiles:[{ID:''}],//上传OA的数组
            DOCfiles:[{ID:''}],//上传DOC的数组
            PURfiles:[{ID:''}],//上传采购结果公告的数组
            isadd:'',//是新增还是编辑
            domain:global,
            isphone1:true,
            ismeng:false,
            imgmeng:false,
        }
    },
    methods: {
        back(){
            this.$router.push('/');
            this.$store.commit('setselected','报刊')

            // window.sessionStorage.setItem('selected','报刊');
        },
        // 判断是否为手机号
        isPoneAvailable(pone) {
            var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            if (!myreg.test(pone)) {
                return false;
            } else {
                return true;
            }
        },
        //验证手机号
        validphone(phone){
            var isphone = this.isPoneAvailable(phone);
            if(!isphone){
                this.Toast("请输入正确的手机号码！");
                this.isphone1 = false
                // this.addPeriodical.PHONE = '';
            }else{
                this.isphone1 = true
            }
        },
        // selcolor(num){
        //     if(num){
        //         this.$refs.sel1.setAttribute('style','color:#000')
        //     }else{
        //         this.$refs.sel1.setAttribute('style','color:#ccc')
        //     }
        // },
        validnum(num){
            var re = /^\d+(\.\d+)?$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
        　　if (!re.test(num)) {
            　　this.Toast("请输入数字");
                this.addPeriodical.KINDNUM = '';
        　　　　 return false;
        　　}
        },
        Periodicalsave(){
            //   if(!this.addPeriodical.CREATORNAME){
            //     this.Toast('请选择经费负责人！');
            // }
            if(!this.addPeriodical.FUNDNUMBER){
                this.Toast('请输入经费本号！')
            }else if(!this.addPeriodical.ISChINESE){
                this.Toast('请选择报刊种类！');
            }else if(!this.addPeriodical.KINDNUM){
                this.Toast('请输入报刊种数！');
            }
            // else if(!this.addPeriodical.FUNDTYPE){
            //     this.Toast('请选择经费类型！');
            // }
            // else if(!this.addPeriodical.FUNDNUMBER){
            //     this.Toast('请输入经费编号！');
            // }
            else if(!this.addPeriodical.INVOICENUMBER){
                this.Toast('请输入发票号！');
            }else if(!this.addPeriodical.ALLMONEY){
                this.Toast('请输入发票总金额！');
            }else if(this.addPeriodical.ALLMONEY >= 20000){
                this.Toast("采购金额超过两万元（含两万元），请与资源建设部联系。联系电话：025-84396822")
            }
            // else if(!this.addPeriodical.PHONE){
            //     this.Toast('请输入手机号！');
            // }else if(this.addPeriodical.PHONE&&!this.isphone1){
            //     this.Toast('请输入正确的手机号！')
            // }
            else if(this.bookorders.length<1){
                this.Toast('请上传购书清单！');
            }else if(!this.FPfiles[0].ID){
                this.Toast('请上传发票照片！');
            }
            // else if(window.sessionStorage.getItem('showOA')== 'true' && !this.OAfiles[0].ID){
            //      this.Toast('请上传OA审核文件截图！');
            // }else if(window.sessionStorage.getItem('showOA')== 'true' && !this.DOCfiles[0].ID){
            //         this.Toast('请上传文献资源项目采购申报表！');
            // }
            else if (this.ifNeedPurchaseresult && !this.PURfiles[0].ID) {
              this.Toast('请上传采购结果公告')
            }
            else{
                var flag= true;
                if(this.addPeriodical.ISChINESE=='1'){//境内
                    var reg1 = /^[0-9]{1,8}$/;
                    // console.log(reg1.test(val))
                    if(!reg1.test(this.addPeriodical.INVOICENUMBER)){
                        flag = false
                        // this.Toast("一次填报一张发票，发票号码全数字，不超过八位；");
                        // this.addbook.invoicenumber="";
                        // return;
                    }
                }
                // this.$store.commit('setFundstype',this.bookstype);//将图书种类保存起来
                var obj = {
                    ISChINESE:this.addPeriodical.ISChINESE,//是否是境内
                    INVOICENUMBER:this.addPeriodical.INVOICENUMBER,//发票号=
                    ALLMONEY:this.addPeriodical.ALLMONEY,//发票总金额=
                    CREATORNAME:this.addPeriodical.CREATORNAME,//=
                    FUNDTYPE:this.addPeriodical.FUNDTYPE,//经费类型=
                    FUNDNUMBER:this.addPeriodical.FUNDNUMBER,//经费本编号=
                    REASON:this.addPeriodical.REASON,//报账说明
                    KINDNUM:this.addPeriodical.KINDNUM,//报刊种数=
                    CREATORID:window.sessionStorage.getItem('CREATORNAMEID'),//=
                    PHONE:this.addPeriodical.PHONE
                }
                // window.sessionStorage.setItem('addbook',JSON.stringify(obj));\
                var periodical = {//--这里存放记录信息
                    ID: "",  //(新增时不传，修改时传)
                    "FUNDTYPE": obj.FUNDTYPE,  //(经费类型  科研/其他=)
                    "INVOICENUMBER":  obj.INVOICENUMBER, //（发票号=）
                    "FUNDNUMBER":  obj.FUNDNUMBER, //（经费本号=）
                    "KINDNUM":  obj.KINDNUM, //（书的总数量=）
                    "ALLMONEY":  obj.ALLMONEY,//（购买总金额，和发票号相同=）
                    "ISCHINESE":  obj.ISChINESE, //（1境内图书  0境外图书）
                    "CREATORNAME":  obj.CREATORNAME, //（负责人姓名，从1.3接口获取=） 
                    "CREATORID":  obj.CREATORID, //（负责人ID，从1.3接口获取=）
                    "REASON":  obj.REASON, //（报账说明）
                    "PHONE":obj.PHONE
                }
                // console.log(this.isadd)
                    if(this.isadd == 'false'){
                        periodical.ID = window.sessionStorage.getItem('editPeriodicalID');
                    }else{
                        periodical.ID = '';
                    }
                    //获得购书单
                    var files = [];
                    this.bookorders.forEach(e=>{
                        files.push({
                            TYPE:0,
                            URL:e.ID
                        })
                    })
                    //发票数组
                    files.push({
                         TYPE:2,
                         URL:this.FPfiles[0].ID
                    })
                    // if(window.sessionStorage.getItem('showOA')== 'true'){
                    //     //OA数组
                    //     files.push({
                    //         TYPE:3,
                    //         URL:this.OAfiles[0].ID
                    //     })
                    //     //文献数组
                    //     files.push({
                    //         TYPE:4,
                    //         URL:this.DOCfiles[0].ID
                    //     })
                    // }
                    if (this.ifNeedPurchaseresult) {
                      files.push({
                          TYPE:5,
                          URL:this.PURfiles[0].ID
                      })
                    }
                    this.ismeng = true;
                    // return false
                    //提交审核
                    if(flag){
                        var ID= '';
                        if(window.sessionStorage.getItem('isperiodicaladd')=='true'){
                            ID = ''
                        }else{
                            ID = window.sessionStorage.getItem('editPeriodicalID');
                        }
                        this.util.postAjax({
                            code:code.base,
                            url:code.PeriodicalcheckInvoiceNum,
                            data:{
                                INVOICENUMBER:periodical.INVOICENUMBER,
                                ID:ID
                            }
                        }).then( res => {
                            if(!res.status){
                                this.Toast("发票号已经被报销！");
                                this.ismeng = false;
                                // this.addPeriodical.INVOICENUMBER = ''
                            }else{
                                this.util.postAjax({
                        code:code.base,
                        url:code.Periodicalsave,
                        data:{
                            data: JSON.stringify({
                                'periodical':periodical,
                                'files':files,
                            })
                        }
                    }).then( res => {
                        if(res.success){
                            this.ismeng = false;
                            this.Toast(res.message);
                            this.$router.push('/');
                            this.$store.commit('setselected','报刊')
                            //清空缓存中的值
                            // window.sessionStorage.removeItem('mainpersonID')
                            window.sessionStorage.removeItem('addlist')
                            window.sessionStorage.removeItem('FPfiles')
                            window.sessionStorage.removeItem('addbook')
                        }else{
                            this.ismeng = false;
                            // this.Toast(res.message);
                        }
                    })

                            }
                        })
                    
                    }else{
                        this.ismeng = false;
                        this.Toast("一次填报一张发票，发票号码全数字，不超过八位");
                    }
            }
            
        },
          //获取上传的url
        uploadFile(){
          this.util.getUrlByCode(code.base,code.fileManageupload).then(res => {
            this.uploadUrl = res;
            
          })
        },
        choosefiel(file){
            console.log("上传后回调");
            this.imgmeng = true;
        },
        finish(res){
            console.log("结束后");
            this.imgmeng = false;
            this.FPfiles = []; 
            res.FILE.forEach(element => {
                this.FPfiles.push(element);
            });
            Vue.set(this.FPfiles,res);
            window.sessionStorage.setItem('FPfiles',JSON.stringify(this.FPfiles))
        },
        finishOA(res){
            this.imgmeng = false;
            this.OAfiles = [];
            res.FILE.forEach(element => {
                this.OAfiles.push(element);
            });
            Vue.set(this.OAfiles,res);
            window.sessionStorage.setItem('OAfiles',JSON.stringify(this.OAfiles))
        },
        finishDOC(res){
            this.imgmeng = false;
            this.DOCfiles = [];
            res.FILE.forEach(element => {
                this.DOCfiles.push(element);
            });
            Vue.set(this.DOCfiles,res);
            window.sessionStorage.setItem('DOCfiles',JSON.stringify(this.DOCfiles))
        },
        finishPUR (res) {
            this.imgmeng = false;
            this.PURfiles = [];
            res.FILE.forEach(element => {
                this.PURfiles.push(element);
            });
            Vue.set(this.PURfiles,res);
            window.sessionStorage.setItem('PURfiles',JSON.stringify(this.PURfiles))
        },
        //获取负责人列表
        getGroup(){
            // if(!this.addPeriodical.CREATORNAME){
            //     return false;
            // }
            let Base64 = require("js-base64").Base64//还是require
            var pw = Base64.encode(this.addPeriodical.CREATORNAME)//还是那些操作
            this.util.postAjax({
                code:code.base,
                url:code.bookgetGroup,
                data:{
                    page:1,
                    limit:10,
                    filter: JSON.stringify({
                        'KEYWORDBASE':pw,
                    })
                }
            }).then( res => {
                if(res.items.length == 0){
                    this.CREATORNAMEs = [];
                    this.addPeriodical.CREATORNAME = '';
                }else{
                    this.CREATORNAMEs = res.items;
                }
                
            })
        },
        changename(val){
            // window.sessionStorage.setItem('CREATORNAMEID','');
            this.addPeriodical.CREATORNAME = '';
        },
        //负责人列表li点击事件设置值
        setvalue(data,id){
            this.addPeriodical.CREATORNAME = data;
            //将负责人的id存起来
            window.sessionStorage.setItem('CREATORNAMEID',id)
            this.CREATORNAMEs = [];
        },
        //上传购书单
        upload(){
            //记录是从图书进去的还是从报刊进去的
            window.sessionStorage.setItem('formbook','noformbook');
            var obj = {
                ISChINESE:this.addPeriodical.ISChINESE,//是否是境内
                INVOICENUMBER:this.addPeriodical.INVOICENUMBER,//发票号
                ALLMONEY:this.addPeriodical.ALLMONEY,//发票总金额
                CREATORNAME:this.addPeriodical.CREATORNAME,//经费负责人
                FUNDNUMBER:this.addPeriodical.FUNDNUMBER,//经费编号
                INVOICENUMBER:this.addPeriodical.INVOICENUMBER,//发票号
                FUNDTYPE:this.addPeriodical.FUNDTYPE,//经费类型
                KINDNUM:this.addPeriodical.KINDNUM,//报刊总数
                PHONE:this.addPeriodical.PHONE,
                REASON:this.addPeriodical.REASON,//说明
            }
            window.sessionStorage.setItem('addPeriodical',JSON.stringify(obj))
            this.$router.push('addupload')
        },
        //上传OA
        uploadOA(){
            this.$refs.uploadOA.toupload();
        },
        //上传pdf
        uploadDOC(){
            this.$refs.uploadDOC.toupload();
        },
        //上传发票
        uploadFP(){
            this.$refs.upload.toupload();
        },
        // 上传采购结果公告
        uploadPUR () {
          this.$refs.uploadPUR.toupload()
        },
        //验证发票号
        checkInvoiceNum(data){
            var ID= '';
            if(window.sessionStorage.getItem('isperiodicaladd')=='true'){
                ID = ''
            }else{
                ID = window.sessionStorage.getItem('editPeriodicalID');
            }
            if(this.addPeriodical.ISChINESE=='1'){//境内
                var reg1 = /^[0-9]{1,8}$/;
                // console.log(!reg1.test(val))
                if(!reg1.test(data)){
                    this.Toast("一次填报一张发票，发票号码全数字，不超过八位");
                    // this.addPeriodical.INVOICENUMBER="";
                    return;
                }
            }
            if(data){
                this.util.postAjax({
                    code:code.base,
                    url:code.PeriodicalcheckInvoiceNum,
                    data:{
                        INVOICENUMBER:data,
                        ID:ID
                    }
                }).then( res => {
                    if(!res.status){
                        this.Toast("发票号已经被报销！");
                        // this.addPeriodical.INVOICENUMBER = ''
                    }
                })
            }else{
                this.Toast('发票号不能为空')
            }
        },
        //判断是否出现OA这个选择框
        isshowOA(num){
            // if(num>=20000){
            //     this.Toast('该系统不支持大于20000以上(含20000)的报账');
            //     this.addPeriodical.ALLMONEY = '';
            //     return false;
            // }else{
                if(this.addPeriodical.ISChINESE == 1){//境内
                    if(num >= 2000){
                        this.showOA = 'true';
                        window.sessionStorage.setItem('showOA','true');
                    }else{
                        this.showOA = 'false';
                        window.sessionStorage.setItem('showOA','false');
                    }
                }else{
                    if(num >= 5000){
                        this.showOA = 'true';
                        window.sessionStorage.setItem('showOA','true');
                    }else{
                        this.showOA = 'false';
                        window.sessionStorage.setItem('showOA','false');
                    }
                }
            // }
            
        },
        isshowOA1(num){
            if(this.addPeriodical.INVOICENUMBER){
                if(num==1){//境内的
                    var reg1 = /^[0-9]{1,8}$/;
                    // console.log(!reg1.test(val))
                    if(!reg1.test(this.addPeriodical.INVOICENUMBER)){
                        this.Toast("一次填报一张发票，发票号码全数字，不超过八位");
                        // this.addPeriodical.INVOICENUMBER="";
                        return;
                    }
                }
            }
            // if(num){
            //     this.$refs.sel.setAttribute('style','color:#000')
            // }else{
            //     this.$refs.sel.setAttribute('style','color:#ccc')
            // }
            if(num == 1){//境内
                if(this.addPeriodical.ALLMONEY >= 2000){
                    this.showOA = 'true';
                    window.sessionStorage.setItem('showOA','true');
                }else{
                    this.showOA = 'false';
                    window.sessionStorage.setItem('showOA','false');
                }
            }else{
                if(this.addPeriodical.ALLMONEY >= 5000){
                    this.showOA = 'true';
                    window.sessionStorage.setItem('showOA','true');
                }else{
                    this.showOA = 'false';
                    window.sessionStorage.setItem('showOA','false');
                }
            }
        },


    },
    created() {
        this.uploadFile();
        this.isadd = window.sessionStorage.getItem('isperiodicaladd')
        //缓存中存取的填写的信息
        if(window.sessionStorage.getItem('addPeriodical')){
            this.addPeriodical = JSON.parse(window.sessionStorage.getItem('addPeriodical'));
        }
        //上传购书单的数组
        this.bookorders = this.$store.state.selectimgs;
        //发票的数组
        if(window.sessionStorage.getItem('FPfiles')){
            this.FPfiles = JSON.parse(window.sessionStorage.getItem('FPfiles'))
        }
        if(window.sessionStorage.getItem('OAfiles')){
            this.OAfiles = JSON.parse(window.sessionStorage.getItem('OAfiles'));
            this.DOCfiles = JSON.parse(window.sessionStorage.getItem('DOCfiles'))
        }
        if(window.sessionStorage.getItem('PURfiles')){
            this.PURfiles = JSON.parse(window.sessionStorage.getItem('PURfiles'));
        }
        if(this.addPeriodical.ISChINESE == 1){
            if(this.addPeriodical.ALLMONEY>=2000){
                this.showOA = 'true';
            }else{
                this.showOA = 'false';
            }
        }else{
            if(this.addPeriodical.ALLMONEY>=5000){
                this.showOA = 'true';
            }else{
                this.showOA = 'false';
            }
        }
    },
    computed: {
      // 监听是否需要上传采购结果公告
      // 行政类的大于2万和非行政类的大于5万的 上传 采购结果公告
      ifNeedPurchaseresult () {
        return (this.addPeriodical.FUNDTYPE === '行政类' && this.addPeriodical.ALLMONEY >= 20000)
          || (this.addPeriodical.FUNDTYPE === '非行政类' && this.addPeriodical.ALLMONEY >= 50000)
      }
    }
}
</script>
<style scoped>
.selects{
    /* width: 70% ; */
    height: 100%;
}
.selects>select{
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    float: right;
    -webkit-appearance:none;
    background-color:transparent; 
    border-color:transparent;
    direction: rtl;
    /* color:#ccc; */
}
.content{
    background:#F5F5F5; 
    /* overflow: scroll; */
    width: 100%;
    padding-bottom: 2.25rem;
    /* height: calc(100% - 3rem);
    position: fixed; */
}
.booktop{
    width: 100%;
}
.bookbottom{
    margin-top: 1rem;
}
.rightadd{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url(../../static/imgs/upload.png) no-repeat center center;
    background-size: cover;
}
.bookfixedbottom1{
    width:100%;
    height:2.25rem;
    display: flex;
    justify-content: space-around;
    position: fixed;
    left: 0;
    bottom: 0;
    /* background:rgba(255,255,255,1);
    border:0.03rem solid rgba(204,204,204,1); */
}
#cardsNum2{
    line-height: 2.6rem;
}

.bookfixedbottom1>div{
    width: 50%;
    height: 100%;
    font-size:0.65rem;
    color:rgba(255,255,255,1);
    line-height: 2.25rem;
}
.bookfixedbottom1left{
    background:rgba(71,122,219,1);
}
.bookfixedbottom1>div.bookfixedbottom1right{
    background: #fff;
    border:0.03rem solid rgba(204,204,204,1);
    color:rgba(51,51,51,1);
}
.bookstype{
    width: 100%;
    height: 2.6rem;
    display: flex;
    line-height: 2.6rem;
    justify-content: space-between;
    padding: 0 .5rem;
    box-sizing: border-box;
    background: #fff;
    border-bottom: 1px solid #eee;
}
.bookstype>.title,label{
    font-size:0.85rem;
    font-weight:400;
    color:rgba(51,51,51,1);
}
.booktop{
    width: 100%;
}

</style>
