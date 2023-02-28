<template>
    <div class="content">
        <div class="booktop">
            <div class="mainperson">
                <!-- <span>经费负责人</span>
                <input type="text" id="cardsNum2" placeholder="请输入经费负责人" v-model="addbook.mainperson" @change="changename(addbook.mainperson)" @keyup="getGroup(addbook.mainperson)">
                <ul id="getGroup" v-show="isshowbookorders">
                    <li v-for="(v,i) in mainpersons" :key="i" @click="setvalue(v.NAME,v.ID)">{{v.NAME}}({{v.ID}})</li>
                </ul> -->
                <span>经费本号</span>
                <input type="text" id="cardsNum2" placeholder="请输入经费本号" v-model="addbook.Fundsnum" @change="addbook.Fundsnum = (addbook.Fundsnum || '').toUpperCase()" maxlength="100" />
            </div>
            <div class="bookstype">
                <div class="title">图书种类</div>
                <div class="selects">
                    <select v-model="addbook.bookstype" @change="isshowOA1(addbook.bookstype)">
                        <option value="" >请选择图书种类</option>
                        <option value="1" >境内出版</option>
                        <option value="0">境外出版</option>
                    </select>
                </div>
                <!-- <div>
                    <input type="radio" v-model="addbook.bookstype" @change="isshowOA1(1)" value="1" id="churchyard" name="radios">
                    <label for="churchyard">境内</label>
                    <input type="radio" v-model="addbook.bookstype" @change="isshowOA1(0)" value="0" id="overseas" name="radios">
                    <label for="overseas">境外</label>
                </div> -->
            </div>
            <!-- <div class="bookstype">
                <div class="title">经费类型</div>
                <div class="selects">
                    <select v-model="addbook.Fundstype" @change="changfunstyle(addbook.Fundstype)">
                        <option value="">请选择经费类型</option>
                        <option value="行政类">行政类</option>
                        <option value="非行政类">非行政类</option>
                    </select>
                </div>
            </div> -->
            <!-- <mt-field label="经费本编号" placeholder="请输入" v-model="addbook.Fundsnum" @change.native="changeFundsnum(addbook.Fundsnum)"></mt-field> -->
            <mt-field label="发票号" placeholder="请输入" v-model="addbook.invoicenumber" @change.native="checkInvoiceNum(addbook.invoicenumber)"></mt-field>
            <mt-field label="发票总金额" placeholder="请输入" v-model="addbook.invoicenvalue" @change.native="isshowOA(addbook.invoicenvalue)"></mt-field>
            <!-- <mt-field label="手机号" placeholder="请输入" v-model="addbook.PHONE" @change.native="validphone(addbook.PHONE)"></mt-field> -->
            <mt-field label="用途说明" placeholder="请输入" v-model="addbook.instructions" @change.native="changdeinstructions(addbook.instructions)"></mt-field>
        </div>
        <div class="bookbottom">
            <mt-cell title="上传购书清单" is-link @click.native="upload">
                <img v-for="(v,i) in bookorders.slice(0,3)" :key="i" :src="domain+'/fileManage/get?ID='+v.ID" height="30px" width="30px">
                <span style="color: #ccc" v-show="bookorders.length>3">...</span>
            </mt-cell>
            <mt-cell title="上传发票照片" >
                <!-- <img v-show="FPfiles[0].ID" :preview='1' preview-text="描述文字" :src="domain+'/fileManage/get?ID='+FPfiles[0].ID" height="30px" width="30px"> -->
                <img v-show="FPfiles[0].ID" :preview='1' :src="domain+'/fileManage/get?ID='+FPfiles[0].ID" height="30px" width="30px">
                <span class="rightadd" @click="uploadFP">
                    <upload style="display:none;"  ref="upload" exts="png|jpg|bmp|gif|PNG|JPG|HEIC|JPEG|jpeg|pdf|PDF" v-on:choose="choosefiel" v-on:done="finish" :url="uploadUrl"></upload>
                </span>
            </mt-cell>
            <!-- <mt-cell title="上传OA审核文件截图" v-if="(addbook.invoicenvalue>=2000&&addbook.bookstype==1)||(addbook.invoicenvalue>=5000&&addbook.bookstype==0)">
                <img v-show="OAfiles[0].ID" :preview='2' :src="domain+'/fileManage/get?ID='+OAfiles[0].ID" height="30px" width="30px">
                <span class="rightadd"  @click="uploadOA">
                    <upload style="display:none;"  ref="uploadOA" exts="png|jpg|bmp|gif|PNG|JPG|HEIC|JPEG|jpeg|pdf|PDF" v-on:choose="choosefiel" v-on:done="finishOA" :url="uploadUrl"></upload>
                </span>
            </mt-cell>
             <mt-cell title="上传文献资源项目采购申报表" v-if="(addbook.invoicenvalue>=2000&&addbook.bookstype==1)||(addbook.invoicenvalue>=5000&&addbook.bookstype==0)" >
                <img v-show="DOCfiles[0].ID" :preview='3' :src="domain+'/fileManage/get?ID='+DOCfiles[0].ID" height="30px" width="30px">
                <span class="rightadd" @click="uploadDOC">
                    <upload style="display:none;"  ref="uploadDOC" :multiple='true' exts="png|jpg|bmp|gif|pdf|PNG|JPG|HEIC|JPEG|jpeg|pdf|PDF" v-on:choose="choosefiel" v-on:done="finishDOC" :url="uploadUrl"></upload>
                </span>
            </mt-cell>
            -->
            <mt-cell title="上传采购结果公告" v-if="ifNeedPurchaseresult" >
                <img v-show="PURCHASERESULTfiles[0].ID" :preview='5' :src="domain+'/fileManage/get?ID='+PURCHASERESULTfiles[0].ID" height="30px" width="30px">
                <span class="rightadd" @click="uploadPUR">
                    <upload style="display:none;"  ref="uploadPUR" :multiple='true' exts="png|jpg|bmp|gif|pdf|PNG|JPG|HEIC|JPEG|jpeg|pdf|PDF" v-on:choose="choosefiel" v-on:done="finishPUR" :url="uploadUrl"></upload>
                </span>
            </mt-cell>
        </div>
        <div class="booklist" v-if="isadd">
            <div class="booklistsingle">
                <ul class="bookmiddle">
                    <li v-for="(item,index) in addArr" :key="index">
                        <i class="right_del" @click="del(index)"></i>
                        <div class="middle_left" @click="edit(item)" :style="{background:'url('+item.IMGURL+')',backgroundSize:'cover'}"></div>
                        <div class="middle_right">
                            <h6  @click="edit(item)">{{item.BOOKNAME}}</h6>
                            <p  @click="edit(item)">作者: {{item.AUTHOR}}</p>
                            <p  @click="edit(item)">ISBN:{{item.ISBN}}</p>
                            <p class="last">
                                <!-- <em>实付总价¥</em>{{item.total}} -->
                                <span>
                                    <i class="reduce" @click="reduce(item,index)"></i>
                                    <span class="text">{{item.QUANTITY}}</span>
                                    <i class="add" @click="add(item)"></i>
                                </span>
                            </p>
                        </div>
                    </li>
                </ul>
                <!-- <div class="totalnum">总金额:<span>￥{{sum}}</span></div> -->
            </div>
        </div>
        <div class="bookfixedbottom">
            <div class="bookfixedbottomleft" @click="adddetail">新增明细</div>
            <div class="bookfixedbottommiddle" @click="submit">提交审核</div>
            <div class="bookfixedbottomright" @click="back">返回</div>
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
import Vue from 'vue'
import code from '../util/code'
import upload from '../components/upload'
import { global } from '../util/global'
export default {
    components:{
        upload
    },
    data() {
        return {
            isadd:'',//下面的图书列表显示不显示
            bookorders:[],//购书单的数组--图片
            isshowbookorders:false,//是否显示负责人下拉框
            mainpersons:[],//负责人的下拉框
            addbook:{
                mainperson:'',//负责人的关键词
                bookstype:'',//图书种类
                Fundstype:'行政类',//经费类型
                Fundsnum:'',//经费编号
                invoicenumber:'',//发票号
                invoicenvalue:'',//发票金额
                instructions:'',//报账说明
                PHONE:'',//手机号
            },
            addArr:[],//点击每个新增传递过来的图书列表数组
            addArrs:[],//将每个传递过来的数组存起来
            sum:0,//图书列表的总金额
            uploadUrl:'',//上传发票图片的url
            FPfiles:[{ID:''}],//上传发票的数组
            showOA:'',//是否显示上传OA
            OAfiles:[{ID:''}],//上传OA的数组
            DOCfiles:[{ID:''}],//上传DOC的数组
            PURCHASERESULTfiles:[{ID:''}],// 上传采购结果公告
            domain:global,
            ismeng:false,//蒙版显示
            imgmeng:false,
            showOA1000:false,
            showOA1000OA:false,
            showOA1000DOC:false,
            isphone1:true

        }
    },
    methods: {
        back(){
            this.$router.push('/');
            this.$store.commit('setselected','图书')
            // window.sessionStorage.setItem('selected','图书');
        },
        upload(){
            var obj = {
                bookstype:this.addbook.bookstype,//是否是境内
                invoicenumber:this.addbook.invoicenumber,//发票号
                invoicenvalue:this.addbook.invoicenvalue,//发票总金额
                mainperson:this.addbook.mainperson,
                Fundstype:this.addbook.Fundstype,
                Fundsnum:this.addbook.Fundsnum,
                PHONE:this.addbook.PHONE,
                instructions:this.addbook.instructions,
            }
            window.sessionStorage.setItem('addbook',JSON.stringify(obj))
            //记录是从图书进去的还是从报刊进去的
            window.sessionStorage.setItem('formbook','formbook');
            this.$router.push('addupload')
        },
         //获取上传的url
        uploadFile(){
          this.util.getUrlByCode(code.base,code.fileManageupload).then(res => {
            this.uploadUrl = res;
          })
        },
        // 判断是否为手机号
        isPoneAvailable(pone) {
            // var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            var myreg = /^1\d{10}$/;
            if (!myreg.test(pone)) {
                return false;
            } else {
                return true;
            }
        },
        changdeinstructions(val){
            var adds = JSON.parse(window.sessionStorage.getItem('addbook'))
            adds.instructions = val;
            window.sessionStorage.setItem('addbook',JSON.stringify(adds))
        },
        //验证手机号
        validphone(phone){
            var adds = JSON.parse(window.sessionStorage.getItem('addbook'))
            adds.PHONE = phone;
            window.sessionStorage.setItem('addbook',JSON.stringify(adds))
            var isphone = this.isPoneAvailable(phone);
            if(!isphone){
                this.Toast("请输入正确的手机号码！");
                this.isphone1 = false
                // this.addbook.PHONE = '';
            }else{
                this.isphone1 = true;
            }
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
            this.showOA1000OA = 'true'
            this.OAfiles = [];
            res.FILE.forEach(element => {
                this.OAfiles.push(element);
            });
            Vue.set(this.OAfiles,res);
            window.sessionStorage.setItem('OAfiles',JSON.stringify(this.OAfiles))
        },
        finishDOC(res){
            this.imgmeng = false;
            this.showOA1000DOC = 'true'
            this.DOCfiles = [];
            res.FILE.forEach(element => {
                this.DOCfiles.push(element);
            });
            Vue.set(this.DOCfiles,res);
            window.sessionStorage.setItem('DOCfiles',JSON.stringify(this.DOCfiles))
        },
        finishPUR (res) {
            this.imgmeng = false;
            this.PURCHASERESULTfiles = [];
            res.FILE.forEach(element => {
                this.PURCHASERESULTfiles.push(element);
            });
            Vue.set(this.PURCHASERESULTfiles,res);
            window.sessionStorage.setItem('PURCHASERESULTfiles',JSON.stringify(this.PURCHASERESULTfiles))
        },
        //上传发票
        uploadFP(){
            this.$refs.upload.toupload();
        },
        //上传OA
        uploadOA(){
            this.$refs.uploadOA.toupload();

        },
        //上传pdf
        uploadDOC(){
            this.$refs.uploadDOC.toupload();

        },
        // 上传采购结果公告
        uploadPUR () {
          this.$refs.uploadPUR.toupload();
        },
        //新增明细
        adddetail(){
            window.sessionStorage.removeItem('singlelist');
            window.sessionStorage.setItem('isedit','false');//是新增，isedit是false
            // if(!this.addbook.mainperson){
            //     this.Toast('请选择经费负责人！')
            // }
            if(!this.addbook.Fundsnum){
                this.Toast('请输入经费本号！')
            }else if(!this.addbook.bookstype){
                this.Toast('请选择图书种类！')
            }
            // else if(!this.addbook.Fundstype){
            //     this.Toast('请选择经费类型！')
            // }
            // else if(!this.addbook.Fundsnum){
            //     this.Toast('请输入经费编号！')
            // }
            else if(!this.addbook.invoicenumber){
                this.Toast('请输入发票号！')
            }else if(!this.addbook.invoicenvalue){
                this.Toast('请输入发票金额！')
            }else if(this.addbook.invoicenvalue >= 20000){
                this.Toast("采购金额超过两万元（含两万元），请与资源建设部联系。联系电话：025-84396822")
            }
            // else if(!this.addbook.PHONE){
            //     this.Toast('请输入手机号！')
            // }
            // else if(this.addbook.PHONE&&!this.isphone1){
            //     this.Toast('请输入正确的手机号！')
            // }
            else if(this.bookorders.length<1){
                this.Toast('请上传购书清单！')
            }else if(!this.FPfiles[0].ID){
                this.Toast('请上传发票照片！');
            }
            // else if(((this.addbook.invoicenvalue>=2000&&this.addbook.bookstype==1)||(this.addbook.invoicenvalue>=5000&&this.addbook.bookstype==0))&&!this.OAfiles[0].ID){
            //      this.Toast('请上传OA审核文件截图！');
            // }else if(((this.addbook.invoicenvalue>=2000&&this.addbook.bookstype==1)||(this.addbook.invoicenvalue>=5000&&this.addbook.bookstype==0))&&!this.DOCfiles[0].ID){
            //         this.Toast('请上传文献资源项目采购申报表！');
            // }
            else if (this.ifNeedPurchaseresult && !this.PURCHASERESULTfiles[0].ID) {
              this.Toast('请上传采购结果公告！');
            }
            else{
                // this.$store.commit('setFundstype',this.bookstype);//将图书种类保存起来
                this.$router.push('adddetail')
            }
        },
        //获取经费负责人列表
        getGroup(val){
            console.log(val)
            // if(this.addbook.mainperson==''){
            //     return false;
            // }
            let Base64 = require("js-base64").Base64//还是require
            var pw = Base64.encode(this.addbook.mainperson)//还是那些操作
            this.isshowbookorders = true;
            this.util.postAjax({
                code:code.base,
                url:code.bookgetGroup,
                data:{
                    page:1,
                    limit:10,
                    filter: JSON.stringify({
                        // 'KEYWORD':this.addbook.mainperson,
                        KEYWORDBASE:pw
                    })
                }
            }).then( res => {
                console.log(res)
                if(res.items.length == 0){
                    this.mainpersons = [];
                    this.addbook.mainperson = ''
                }else{
                    this.mainpersons = res.items;
                }

            })
        },
        //文本框变化设置值
        setvalue(data,id){
            console.log(data)
            this.addbook.mainperson = data;

            if(window.sessionStorage.getItem('isadd')=='false'){
                var adds = JSON.parse(window.sessionStorage.getItem('addbook'))
                adds.mainperson = data;
                window.sessionStorage.setItem('addbook',JSON.stringify(adds))
            }

            window.sessionStorage.setItem('mainpersonID',id)
            // adds.CREATERID =  id;
            //
            //将负责人的id存起来
            this.mainpersons = [];
            this.isshowbookorders = false;
        },
        changename(val){
            // window.sessionStorage.setItem('mainpersonID','')
            this.addbook.mainperson = '';
        },
        changeFundsnum(val){
            var adds = JSON.parse(window.sessionStorage.getItem('addbook'))
            adds.Fundsnum = val;
            window.sessionStorage.setItem('addbook',JSON.stringify(adds))
        },
        //验证发票
        checkInvoiceNum(val){
            var adds = JSON.parse(window.sessionStorage.getItem('addbook'))
            // console.log(adds)
            if(adds){
                adds.invoicenumber = val;
            }
            window.sessionStorage.setItem('addbook',JSON.stringify(adds))
            var ID = '';
            if(window.sessionStorage.getItem('isadd') == 'true'){
                ID = '';
            }else{
                ID = window.sessionStorage.getItem('editID');
            }
            // console.log(this.addbook.bookstype)
            if(this.addbook.bookstype=='1'){//境内
                var reg1 = /^[0-9]{1,8}$/;
                // console.log(reg1.test(val))
                if(!reg1.test(val)){
                    this.Toast("一次填报一张发票，发票号码全数字，不超过八位");
                    // this.addbook.invoicenumber="";
                    return;
                }
            }
            // console.log(window.sessionStorage.getItem('showOA'))
            if(val){
                this.util.postAjax({
                    code:code.base,
                    url:code.checkInvoiceNum,
                    data:{
                        INVOICENUM:val,
                        ID:ID
                    }
                }).then( res => {
                    if(!res.status){
                        this.Toast("发票号已经被报销！");
                        // this.addbook.invoicenumber= ''
                    }
                })
            }else{
                this.Toast('发票号不能为空')
            }
        },
        //是否显示OA
        isshowOA(num){
            if(isNaN(num)){
                this.Toast('请输入数字');
                this.addbook.invoicenvalue = ''
                return
            }
            var adds = JSON.parse(window.sessionStorage.getItem('addbook'))
            adds.invoicenvalue = num;
            window.sessionStorage.setItem('addbook',JSON.stringify(adds))
                if(this.addbook.bookstype == 1){//境内
                    if(num >= 2000){
                        window.sessionStorage.setItem('showOA','true');
                    }else{
                        window.sessionStorage.setItem('showOA','false');
                    }
                }else{
                    if(num >= 5000){
                        window.sessionStorage.setItem('showOA','true');
                    }else{
                        this.showOA1000 = 'false';
                        window.sessionStorage.setItem('showOA','false');
                    }
                }
            // }

        },
        changebookstype(){
            console.log(this.addbook.bookstype)
        },
        changfunstyle(num){
            this.addbook.Fundstype = num;
            window.sessionStorage.setItem('addbook',JSON.stringify(this.addbook))
        },
        isshowOA1(num){
            this.addbook.bookstype = num;
            // console.log(this.addbook.invoicenumber)
            if(this.addbook.invoicenumber){
                if(num==1){//境内的
                    var reg1 = /^[0-9]{1,8}$/;
                    // console.log(!reg1.test(val))
                    if(!reg1.test(this.addbook.invoicenumber)){
                        this.Toast("一次填报一张发票，发票号码全数字，不超过八位");
                        // this.addbook.invoicenumber="";
                        return;
                    }
                }
            }
            window.sessionStorage.setItem('addbook',JSON.stringify(this.addbook))
            if(num == 1){//境内
                if(this.addbook.invoicenvalue >= 2000){
                    this.showOA = 'true';
                    window.sessionStorage.setItem('showOA','true');
                }else{
                    this.showOA = 'false';
                    window.sessionStorage.setItem('showOA','false');
                }
            }else{
                if(this.addbook.invoicenvalue >= 5000){
                    this.showOA = 'true';
                    window.sessionStorage.setItem('showOA','true');
                }else{
                    this.showOA = 'false';
                    window.sessionStorage.setItem('showOA','false');
                }
            }
        },
        //编辑
        edit(data){
            console.log(data)
            window.sessionStorage.setItem('isedit','true');//是新增，isedit是false
            var addlist = JSON.parse(window.sessionStorage.getItem('addlist'));
            addlist.forEach((e,i)=>{
                if(data.ID == e.ID){
                    addlist.splice(i, 1);
                }
            })
            window.sessionStorage.setItem('singlelist',JSON.stringify(data))
            this.$router.push('adddetail')
        },
        //提交审核
        submit(){
           this.showOA1000OA = (this.addbook.invoicenvalue>=2000&&this.addbook.bookstype==1)||(this.addbook.invoicenvalue>=5000&&this.addbook.bookstype==0);
           this.showOA1000DOC = (this.addbook.invoicenvalue>=2000&&this.addbook.bookstype==1)||(this.addbook.invoicenvalue>=5000&&this.addbook.bookstype==0);
            // if(!this.addbook.mainperson){
            //     this.Toast('请选择经费负责人！');
            // }
            if(!this.addbook.Fundsnum){
                this.Toast('请输入经费本号!')
            }else if(!this.addbook.bookstype){
                this.Toast('请选择图书种类！');
            }
            // else if(!this.addbook.Fundstype){
            //     this.Toast('请选择经费类型！');
            // }
            // else if(!this.addbook.Fundsnum){
            //     this.Toast('请输入经费编号！');
            // }
            else if(!this.addbook.invoicenumber){
                this.Toast('请输入发票号！');
            }else if(!this.addbook.invoicenvalue){
                this.Toast('请输入发票金额！');
            }else if(this.addbook.invoicenvalue >= 20000){
                this.Toast("采购金额超过两万元（含两万元），请与资源建设部联系。联系电话：025-84396822")
            }
            // else if(!this.addbook.PHONE&&!this.isphone1){
            //     this.Toast('请输入手机号！');
            // }
            else if(this.bookorders.length<1){
                this.Toast('请上传购书清单！');
            }else if(!this.FPfiles[0].ID){
                this.Toast('请上传发票照片！');
            }
            // else if(((this.addbook.invoicenvalue>=2000&&this.addbook.bookstype==1)||(this.addbook.invoicenvalue>=5000&&this.addbook.bookstype==0))&&!this.OAfiles[0].ID){
            //     this.Toast('请上传OA审核文件截图！');
            // }else if(((this.addbook.invoicenvalue>=2000&&this.addbook.bookstype==1)||(this.addbook.invoicenvalue>=5000&&this.addbook.bookstype==0))&&!this.DOCfiles[0].ID){
            //     this.Toast('请上传文献资源项目采购申报表！');
            // }
            else if (this.ifNeedPurchaseresult && !this.PURCHASERESULTfiles[0].ID) {
              this.Toast('请上传采购结果公告！');
            }
            else if(this.addArr.length < 1){
                this.Toast('请新增明细！');
            }else{
                var flag = true;
                if(this.addbook.bookstype=='1'){//境内
                    var reg1 = /^[0-9]{1,8}$/;
                    // console.log(reg1.test(val))
                    if(!reg1.test(this.addbook.invoicenumber)){
                        // this.Toast("一次填报一张发票，发票号码全数字，不超过八位；");
                        // this.addbook.invoicenumber="";
                        flag = false
                    }
                }
                this.$store.commit('setFundstype',this.bookstype);//将图书种类保存起来
                var obj = {
                    bookstype:this.addbook.bookstype,//是否是境内
                    invoicenumber:this.addbook.invoicenumber,//发票号
                    invoicenvalue:this.addbook.invoicenvalue,//发票总金额
                    mainperson:this.addbook.mainperson,
                    Fundstype:this.addbook.Fundstype,
                    Fundsnum:this.addbook.Fundsnum,
                    instructions:this.addbook.instructions,
                    id:window.sessionStorage.getItem('mainpersonID'),
                    PHONE:this.addbook.PHONE,
                }
                window.sessionStorage.setItem('addbook',JSON.stringify(obj));
                // if(this.addbook.invoicenvalue != Number(this.sum).toString()){
                //     this.Toast('报销总金额不等于发票金额，不能报销！')
                // }else{
                     var RECORD = {//--这里存放记录信息
                        ID: "",  //(新增时不传，修改时传)
                        "FUNDTYPE": obj.Fundstype,  //(经费类型  科研/其他)
                        "NOTEALLMONEY":  obj.invoicenvalue, //（发票总金额）
                        "INVOICENUM":  obj.invoicenumber, //（发票号）
                        "FUNDNUMBER":  obj.Fundsnum, //（经费本号）
                        "ALLSUM":  0, //（书的总数量）
                        "ALLMONEY":  obj.invoicenvalue,//（购买总金额，和发票号相同）
                        "ISCHINESE":  obj.bookstype, //（1境内图书  0境外图书）
                        "CREATERNAME":  obj.mainperson, //（负责人姓名，从1.3接口获取）
                        "CREATERID":  obj.id, //（负责人ID，从1.3接口获取）
                        "REASON":  obj.instructions, //（报账说明）
                        "BUYTIME":  this.util.formatTime(new Date().getTime(),'YYYYMMDD') ,//
                        "PHONE":obj.PHONE
                    }
                    if(this.isadd == 'false'){
                        RECORD.ID = window.sessionStorage.getItem('editID');
                    }else{
                        RECORD.ID = '';
                    }
                    //获取数目列表信息
                    var bookslist = JSON.parse(window.sessionStorage.getItem('addlist'));
                    console.log(bookslist)
                    var BOOKS = [];
                    var bookobj = {};
                    var imgobj = {};
                    var ALLSUM = 0;
                    for (let i = 0; i < bookslist.length; i++) {
                        bookobj = {
                            ISCHINESE : obj.bookstype,
                            ISBN : bookslist[i].ISBN,
                            BOOKNAME : bookslist[i].BOOKNAME,
                            AUTHOR : bookslist[i].AUTHOR,
                            PUBLISHER : bookslist[i].PUBLISHER,
                            BIDPRICE : bookslist[i].BIDPRICE,
                            QUANTITY :this.addArr[i].QUANTITY,
                            TRADINGPRICE : bookslist[i].TRADINGPRICE,
                            TOTAL : bookslist[i].TOTAL,
                            MONEYTYPE : "人民币",
                        }
                        imgobj = {
                            "TYPE":1,
                            "SHOWNAME":"COVER",
                            "URL":bookslist[i].IMGURL
                        }
                        BOOKS.push({
                            BOOK:bookobj,
                            IMG:{
                                COVER:imgobj
                            }
                        })
                        ALLSUM += Number(BOOKS[i].BOOK.QUANTITY);
                    }
                    RECORD.ALLSUM = ALLSUM;
                    //获得购书单
                    var NOTE = [];
                    this.bookorders.forEach(e=>{
                        NOTE.push({
                            TYPE:0,
                            NOTEID:e.ID
                        })
                    })
                    //发票数组
                    NOTE.push({
                         TYPE:2,
                         NOTEID:this.FPfiles[0].ID
                    })
                    // console.log(window.sessionStorage.getItem('showOA')== 'true'|| this.showOA1000=='true'|| this.showOA1000OA=='true')
                    // console.log(window.sessionStorage.getItem('showOA')== 'true')
                    // console.log( this.showOA1000=='true')
                    // console.log( this.showOA1000OA=='true')
                    // if((window.sessionStorage.getItem('showOA')== 'true'|| this.showOA1000=='true'|| this.showOA1000OA==true||this.showOA1000OA=='true')){
                    //     //OA数组
                    //     NOTE.push({
                    //         TYPE:3,
                    //         NOTEID:this.OAfiles[0].ID
                    //     })
                    //     //文献数组
                    //     NOTE.push({
                    //         TYPE:4,
                    //         NOTEID:this.DOCfiles[0].ID
                    //     })
                    // }
                    if (this.ifNeedPurchaseresult) {
                      NOTE.push({
                        TYPE: 5,
                        NOTEID: this.PURCHASERESULTfiles[0].ID
                      })
                    }
                    this.ismeng = true;
                    // return false
                    console.log(flag)
                    //提交审核
                if(flag){//可以提交
                    var ID = '';
                    if(window.sessionStorage.getItem('isadd') == 'true'){
                        ID = '';
                    }else{
                        ID = window.sessionStorage.getItem('editID');
                    }
                    this.util.postAjax({
                        code:code.base,
                        url:code.checkInvoiceNum,
                        data:{
                            INVOICENUM:RECORD.INVOICENUM,
                            ID:ID
                        }
                    }).then( res => {
                        if(!res.status){
                            this.Toast("发票号已经被报销！");
                            this.ismeng = false;
                            // this.addbook.invoicenumber= ''
                        }else{
                            this.util.postAjax({
                                code:code.base,
                                url:code.booksave,
                                data:{
                                    data: JSON.stringify({
                                        'RECORD':RECORD,
                                        'NOTE':NOTE,
                                        'BOOKS':BOOKS,
                                    })
                                }
                            }).then( res => {
                                if(res.success){
                                    this.ismeng = false;
                                    this.Toast(res.message);
                                    this.$router.push('/');
                                    this.$store.commit('setselected','图书')
                                    //清空缓存中的值
                                    // window.sessionStorage.removeItem('mainpersonID')
                                    window.sessionStorage.removeItem('addlist')
                                    window.sessionStorage.removeItem('FPfiles')
                                    window.sessionStorage.removeItem('addbook')
                                }else{
                                    this.ismeng = false;
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
        //左边的减少点击
        reduce(i,index){
            if(i.QUANTITY <= 1 ){
                i.QUANTITY = 1;
                // console.log(i.QUANTITY)
                this.Toast('已经是最小的数量了！')
                return;
            }else{
                this.sum = 0;//点击的时候将总金额清空
                i.QUANTITY--;
            }
            window.sessionStorage.setItem('addlist',JSON.stringify(this.addArr))
            // Vue.set(this.addArr,i.QUANTITY);
            this.calctotal()

        },
        add(i){

            this.sum = 0;
            i.QUANTITY++;
            window.sessionStorage.setItem('addlist',JSON.stringify(this.addArr))
            this.calctotal()

        },
        //计算图书总金额
        calctotal(){
            this.addArr.forEach(element => {
                element.total = element.TOTAL;
                this.sum += parseFloat(element.total);
            });
            this.sum = this.sum.toFixed(2)
        },
        //删除
        del(i){
            this.sum = 0;
            // var a = 0;
            //删除  i是index，即下标，删除1个长度
            this.addArr.splice(i, 1);
            this.calctotal()
            this.showOA1000 = this.addArr.some(e=>{
                return e.TRADINGPRICE>=1000
            })
            window.sessionStorage.setItem('showOA',this.showOA1000)
            //再将缓存中的更新一下
            window.sessionStorage.addlist = JSON.stringify(this.addArr);

        }

    },
    mounted() {
        this.uploadFile();//图片上传
        //拿到是否是添加的isadd变量
        this.isadd = window.sessionStorage.getItem('isadd');
        this.bookorders = this.$store.state.selectimgs;
        if(window.sessionStorage.getItem('addlist')){
            this.addArr = JSON.parse(window.sessionStorage.getItem('addlist'));
        //     var a = 0;
        //     this.addArr.forEach(e=>{
        //         a+=e.total;
        //     })
        //     if(a>0){
        //         this.showOA1000 = 'true';
        //         window.sessionStorage.setItem('showOA',this.showOA1000)
        //     }
        }
        //计算图书总金额
        this.calctotal();
        if(window.sessionStorage.getItem('addbook')){
            this.addbook = JSON.parse(window.sessionStorage.getItem('addbook')) || this.addbook;
        }
        //发票的数组
        if(window.sessionStorage.getItem('FPfiles')){
            this.FPfiles = JSON.parse(window.sessionStorage.getItem('FPfiles'))
        }
        if(window.sessionStorage.getItem('OAfiles')){
            this.OAfiles = JSON.parse(window.sessionStorage.getItem('OAfiles'))
        }
        if(window.sessionStorage.getItem('DOCfiles')){
            this.DOCfiles = JSON.parse(window.sessionStorage.getItem('DOCfiles'))
        }
        if (window.sessionStorage.getItem('PURCHASERESULTfiles')) {
            this.PURCHASERESULTfiles = JSON.parse(window.sessionStorage.getItem('PURCHASERESULTfiles'))
        }
        console.log(this.DOCfiles)
        if(this.addbook.bookstype == 1){
            if(this.addbook.invoicenvalue>=2000||this.showOA1000=='true'){
                this.showOA = 'true';
            }else{
                this.showOA = 'false';
            }
        }else{
            if(this.addbook.invoicenvalue>=5000||this.showOA1000=='true'){
                this.showOA = 'true';
            }else{
                this.showOA = 'false';
            }
        }
        console.log(this.sum)
    },
    watch: {

    },
    computed: {
      // 监听是否需要上传采购结果公告
      // 行政类的大于2万和非行政类的大于5万的 上传 采购结果公告
      ifNeedPurchaseresult () {
        return (this.addbook.Fundstype === '行政类' && this.addbook.invoicenvalue >= 20000)
          || (this.addbook.Fundstype === '非行政类' && this.addbook.invoicenvalue >= 50000)
      }
    }
}
</script>
<style scoped>
.content{
    background:#F5F5F5;
    padding-bottom: 2.25rem;
}
.last>em{
    font-style: normal;
    font-size: 12px;
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
.bookmiddle{
    width:100%;
    background:rgba(249,249,249,1);
}
.bookmiddle>li{
    width: 100%;
    display:flex;
    justify-content: space-around;
    padding: .5rem 1rem;
    box-sizing: border-box;
    position: relative;
}
#cardsNum2{
    line-height: 2.6rem;
}
.booklist{
    width: 100%;
    margin-top: 1rem;
    background: #fff;
}
.bookmiddle{
    background: #fff;
}
.bookmiddle>li{
    border-bottom: 1px solid #eee;
}
.right_del{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url(../../static/imgs/del.png) no-repeat center center;
    background-size: contain;
    position: absolute;
    right: .5rem;
}
.middle_right>h6{
    position: relative;
}
.middle_right>.last{
    height:1.4rem;
    font-size:1rem;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(255,59,48,1);
}
.last>span{
    float: right;
    display: flex;
    justify-content: space-between;
}
.last>span>i{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: red;
    margin-top: .2rem;
}
.last>span>i.add{
    background: url(../../static/imgs/add.png) no-repeat center center;
    background-size: cover;
}
.last>span>i.reduce{
    background: url(../../static/imgs/reduce.png) no-repeat center center;
    background-size: cover;
}
.last>span>.text{
    display: inline-block;
    width: 1.5rem;
    height:1rem;
    font-size:0.7rem;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(51,51,51,1);
    text-align: center;
    line-height: 1rem;
    margin-top: .2rem;
}
.totalnum{
    text-align: right;
    padding: .5rem;
    box-sizing: border-box;
    font-size: .7rem;
}
.totalnum>span{
    font-weight: 550;
    color: red;
}
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
}
.selects>select.n{
    color:#ccc;
}
.selects>select.m{
    color:#000;
}
/* .selects>select>option:first-of-type{
    color:#ccc;
} */
</style>
