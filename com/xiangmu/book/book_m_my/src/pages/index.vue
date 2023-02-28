<template>
    <div>
         <mt-navbar v-model="selected">
            <mt-tab-item id="图书" class="tags" @click.native="tabs('图书')"><span >图书报账</span></mt-tab-item>
            <mt-tab-item id="报刊" class="tags" @click.native="tabs('报刊')"><span >报刊报账</span></mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="图书" >
                <div
                    class="books"
                    v-infinite-scroll="loadDate1"
                    :infinite-scroll-disabled=bookLoading
                    infinite-scroll-distance="20"
                    :v-if="selected == '图书'"
                    v-show="checklistshow"
                    >
                    <div class="book" v-for="(v,i) in checklist" :key="i">
                        <div class="booktop" @click="isshowmididle(v,i)">
                            <i class="left_icon" :style="{background:'url(./static/imgs/'+v.img+')',backgroundSize:'cover'}"></i>
                            <p v-if="v.ISCHINESE == 1">境内出版物<span v-if="v.ISCHECKED==1 && v.CHECKTIME">{{util.formatTime(v.CHECKTIME,'YYYY-MM-DD hh:mm:ss')}}通过审核</span></p>
                            <!-- <p v-if="v.ISCHINESE == 1">境内出版物<span v-if="v.ISCHECKED==1">{{v.CHECKTIME.slice(0,4)}}-{{v.CHECKTIME.slice(4,6)}}-{{v.CHECKTIME.slice(6,8)}} {{v.CHECKTIME.slice(8,10)}}:{{v.CHECKTIME.slice(10,12)}}:{{v.CHECKTIME.slice(12,14)}}通过审核</span></p> -->
                            <!-- <p v-else>境外出版物<span v-if="v.ISCHECKED==1">{{v.CHECKTIME.slice(0,4)}}-{{v.CHECKTIME.slice(4,6)}}-{{v.CHECKTIME.slice(6,8)}} {{v.CHECKTIME.slice(8,10)}}:{{v.CHECKTIME.slice(10,12)}}:{{v.CHECKTIME.slice(12,14)}}通过审核</span></p> -->
                            <p v-else>境外出版物<span v-if="v.ISCHECKED==1 && v.CHECKTIME">{{util.formatTime(v.CHECKTIME,'YYYY-MM-DD hh:mm:ss')}}通过审核</span></p>
                            <i v-if="v.ISCHECKED==0" class="right_del" @click="del(v.ID)"></i>
                        </div>
                        <ul class="bookmiddle" :style="{display:v.showmididle==true?'block':'none'}">
                            <li v-for="(item,index) in v.BOOKS" :key="index" @click="(v.ISCHECKED == '0'||v.ISCHECKED == '2') && godetails(v)">
								<div class="middle_left" :style="(item.PIC && item.PIC.length > 0 ) ? {background:'url('+item.PIC[0].URL+')',backgroundSize:'cover'} : ''"></div>
                                <div class="middle_right">
                                    <h6>{{item.BOOK.BOOKNAME}}
                                        <!-- <span>¥{{item.BOOK.TOTAL}}</span> -->
                                    </h6>
                                    <p v-if="item.BOOK.AUTHOR">作者: {{item.BOOK.AUTHOR}}</p>
                                    <p v-else>作者: --</p>
                                    <p>ISBN: {{item.BOOK.ISBN}}</p>
                                    <span>{{item.BOOK.QUANTITY}}本</span>
                                </div>
                            </li>
                            <div class="reason" v-if="v.ISCHECKED==0">
                                <span class="reasonleft">退回理由：</span>
                                <span class="reasonright">{{v.REMARK}}</span>
                            </div>
                        </ul>
                        <div class="bookbottom bookbottom1">
                            <p>{{v.CREATETIME.slice(0,4)}}-{{v.CREATETIME.slice(4,6)}}-{{v.CREATETIME.slice(6,8)}} {{v.CREATETIME.slice(8,10)}}:{{v.CREATETIME.slice(10,12)}}:{{v.CREATETIME.slice(12,14)}}<span>总金额:{{v.ALLMONEY}} 人民币</span></p>
                            <p v-if="v.ISCHECKED==1" class="downbox"><i>下载次数：{{v.downNum}}</i>
                            <span @click="downloadbook('book',v.ID)">审核单下载</span>
                            </p>
                        </div>
                    </div>
                    <div class="fixed_add" @click="bookreimbursement">新增图书报账
                        <!-- <div class="fixedadd" @click="bookreimbursement" :style="{background:'url(./static/imgs/addcheck.png)',backgroundSize:'cover'}"></div> -->
                    </div>
                </div>
                <div
                    class="books"
                    :v-if="selected == '图书'"
                    v-show="!checklistshow"
                    >
                    <div class="nodata">暂无数据</div>
                    <div class="fixed_add" @click="bookreimbursement">新增图书报账
                        <!-- <div class="fixedadd" @click="bookreimbursement" :style="{background:'url(./static/imgs/addcheck.png)',backgroundSize:'cover'}"></div> -->
                    </div>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="报刊" >
                <div
                    class="books"
                    v-infinite-scroll="loadDate2"
                    :infinite-scroll-disabled=periodicalLoading
                    infinite-scroll-distance="20"
                    :v-if="selected == '报刊'"
                    v-show="Periodicallistsshow"
                    >
                    <div class="book" v-for="(item,index) in Periodicallists" :key="index">
                        <div class="booktop">
                            <i class="left_icon" :style="{background:'url(./static/imgs/'+item.img+')',backgroundSize:'cover'}"></i><p v-if="item.ISCHINESE == 1">境内出版物<span v-if="item.ISCHECKED==1 && item.CHECKTIME">{{util.formatTime(item.CHECKTIME,'YYYY-MM-DD hh:mm:ss')}}通过审核</span></p>
                            <p v-else>境外出版物<span v-if="item.ISCHECKED==1 && item.CHECKTIME">{{util.formatTime(item.CHECKTIME,'YYYY-MM-DD hh:mm:ss')}}通过审核</span></p>
                            <i  v-if="item.ISCHECKED==0" class="right_del" @click="removePeriodical(item.ID)"></i>
                        </div>
                        <div class="periodicalmiddle" @click="(item.ISCHECKED == '0'||item.ISCHECKED == '2') && goPeriodicaldetails(item)">
                            <h6>报刊种数: {{item.KINDNUM}}</h6>
                            <!-- <p>经费号: {{item.FUNDNUMBER}}</p> -->
                            <p>发票号: {{item.INVOICENUMBER}}</p>
                            <div class="reason1" v-if="item.ISCHECKED==0">
                                <span class="reasonleft">退回理由：</span>
                                <span class="reasonright">{{item.REMARK}}</span>
                            </div>
                        </div>
                        <div class="bookbottom">
                            <p>{{item.CREATETIME.slice(0,4)}}-{{item.CREATETIME.slice(4,6)}}-{{item.CREATETIME.slice(6,8)}} {{item.CREATETIME.slice(8,10)}}:{{item.CREATETIME.slice(10,12)}}:{{item.CREATETIME.slice(12,14)}}<span>总金额:{{item.ALLMONEY}}</span></p>
                            <p v-if="item.ISCHECKED==1" class="downbox"><i>下载次数：{{item.downNum}}</i>
                            <span @click="downloadbook('periodical',item.ID)">审核单下载</span></p>
                        </div>
                    </div>
                    <div class="fixed_add" @click="periodicalreimbursement">新增报刊报账
                        <!-- <div class="fixedadd" @click="periodicalreimbursement" :style="{background:'url(./static/imgs/addcheck.png)',backgroundSize:'cover'}"></div> -->
                    </div>
                </div>
                <div
                    class="books"
                    :v-if="selected == '报刊'"
                    v-show="!Periodicallistsshow"
                    >
                    <div class="nodata">暂无数据</div>
                    <div class="fixed_add" @click="periodicalreimbursement">新增报刊报账
                        <!-- <div class="fixedadd" @click="periodicalreimbursement" :style="{background:'url(./static/imgs/addcheck.png)',backgroundSize:'cover'}"></div> -->
                    </div>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>
<script>
import Vue from "vue"
import code from '../util/code'
export default {
    data() {
        return {
            selected:this.$store.state.selected?this.$store.state.selected:'图书',
            ID:'',//个人中心的ID
            checklist:[],//图书的待审核列表
            checklistshow:'',//图书部分是否有数据
            showmididle:true,//中间的详情是否显示
            Periodicallists:[],//报刊列表
            Periodicallistsshow:'',//报刊列表是否有数据
             //初始化无限加载相关参数start
            totalNum: 0,
            pageSize: 10,
            bookpageNum: 1,
            periodicalpageNum: 1,
            bookLoading:false,
            periodicalLoading:false,
            //初始化无限加载相关参数end
        }
    },
    methods: {
        //下载
        downloadbook(type,id){
            console.log(type,id)
            this.util.getUrlByCode(code.base,code.downbook).then(res=>{
                console.log(res+'?ID='+id+'&TYPE='+type)
                // return
                window.open(res+'?ID='+id+'&TYPE='+type)
            })
        },
        tabs(index){
            this.bookpageNum = 1;
            this.periodicalpageNum = 1;
            switch (index) {
                case '图书':
                    this.bookLoading = false;
                    this.periodicalLoading = true;
                    this.checklist=[];
                    this.loadDate1();
                    break;
                case '报刊':
                    this.periodicalLoading = false;
                    this.bookLoading = true;
                    this.Periodicallists=[];
                    this.loadDate2();
                    break;
            }
        },
        loadDate1(){
            this.getUser().then(res => {
                if(!this.bookLoading){
                    this.util.postAjax({
                        code:code.base,
                        url:code.getList,
                        data:{
                            page: this.bookpageNum,
                            limit:this.pageSize,
                            filter:JSON.stringify({
                                OPERATORID:window.sessionStorage.getItem('getlistID'),
                            })
                        }
                    }).then( res => {
                        var data = res.items;
                        if(data.length < 10 || data.length === 0){
                            this.bookLoading = true;
                        }else{
                            this.bookpageNum ++;
                        }
                        for(var i =0;i < data.length;i++){
                            this.checklist.push(data[i]);
                            if(this.checklist.length>0){
                                this.checklistshow = true;
                            }else{
                                this.checklistshow = false;
                            }
                        }
                        // var result = [];
                        // var obj = {};
                        // for(var i =0; i<this.checklist.length; i++){
                        //     if(!obj[this.checklist[i].ID]){
                        //         result.push(this.checklist[i]);
                        //         obj[this.checklist[i].ID] = true;
                        //     }
                        //     this.bookpageNum ++;
                        // }
                        // this.checklist = result;
                        this.checklist.forEach((e,i) => {
                            //给显示的数组加上是否显示中间的字段
                            e.showmididle = false;
                            if(i == 0){
                                e.showmididle = true;
                            }
                            if(e.ISCHECKED == 2){//0不通过1通过2待审核
                                e.img = 'waitconfirm.png'
                            }else if(e.ISCHECKED == 1){
                                e.img = 'pass.png'
                            }else{
                                e.img = 'unpass.png'
                            }
                        });
                    })
                }
            })
        },
        loadDate2(){
            this.getUser().then(res => {
                if(!this.periodicalLoading){
                    this.util.postAjax({
                        code:code.base,
                        url:code.Periodicallist,
                        data:{
                            page: this.periodicalpageNum,
                            limit:this.pageSize,
                            filter:JSON.stringify({
                                OPERATORID:window.sessionStorage.getItem('getlistID'),
                            })
                        }
                    }).then( res => {
                        var data = res.items;
                        // console.log(data);
                        if(data.length < 10 || data.length === 0){
                            this.periodicalLoading = true;

                        }else{
                            this.periodicalpageNum ++;
                            // console.log("10tiao")
                        }
                        for(var i =0;i < data.length;i++){
                            this.Periodicallists.push(data[i]);
                                if(this.Periodicallists.length>0){
                                    this.Periodicallistsshow = true;
                                }else{
                                    this.Periodicallistsshow = false;
                                }
                            }
                            this.Periodicallists.forEach((e,i) => {
                                if(e.ISCHECKED == 2){//0不通过1通过2待审核
                                    e.img = 'waitconfirm.png'
                                }else if(e.ISCHECKED == 1){
                                    e.img = 'pass.png'
                                }else{
                                    e.img = 'unpass.png'
                                }
                            });
                    })
                }
            })
        },
        //添加图书报账
        bookreimbursement(){
            this.$store.commit('setselectimgs',[]);
            window.sessionStorage.setItem('isadd','true');
             //清空缓存中的值
            // window.sessionStorage.removeItem('mainpersonID')
            window.sessionStorage.removeItem('addlist')
            window.sessionStorage.removeItem('FPfiles')
            window.sessionStorage.removeItem('OAfiles')
            window.sessionStorage.removeItem('DOCfiles')
            window.sessionStorage.removeItem('addbook')
            window.sessionStorage.removeItem('showOA')
            window.sessionStorage.removeItem('PURCHASERESULTfiles')
            this.$router.push('bookreimbursement');
        },
        periodicalreimbursement(){
            this.$store.commit('setselectimgs',[]);
            window.sessionStorage.setItem('isperiodicaladd','true');
             //清空缓存中的值
            // window.sessionStorage.removeItem('mainpersonID')
            // window.sessionStorage.removeItem('addlist')
            window.sessionStorage.removeItem('FPfiles')
            window.sessionStorage.removeItem('OAfiles')
            window.sessionStorage.removeItem('DOCfiles')
            window.sessionStorage.removeItem('addPeriodical')
            window.sessionStorage.removeItem('showOA')
            window.sessionStorage.removeItem('PURfiles')
            this.$router.push('periodicalreimbursement');
        },
        //个人信息
        getUser(){
            return new Promise((resolve,reject)=>{
                if(sessionStorage.getItem("getlistID")){
                    resolve(sessionStorage.getItem("getlistID"))
                }else{
                    this.util.postAjax({
                        code:code.base,
                        url:code.getUser,
                    }).then( res => {
                        // this.ID= res.ID;

                        //获取列表需要的id存起来
                        window.sessionStorage.setItem('getlistID',res.ID)
                        // this.getList(res.ID)
                        resolve(res);
                    }).catch(err=>{
                        reject(err);
                    })
                }
            })
        },
        getList(id){
            //待审核列表接口
            this.util.postAjax({
                code:code.base,
                url:code.getList,
                data:{//参数暂时写死
                    ID:id
                }
            }).then( res => {
                this.checklist = res.items;
                if(res.items.length>0){
                    this.checklistshow = true;
                }else{
                    this.checklistshow = false;
                }
                this.checklist.forEach((e,i) => {
                    //给显示的数组加上是否显示中间的字段
                    e.showmididle = false;
                    if(i == 0){
                        e.showmididle = true;
                    }
                    if(e.ISCHECKED == 2){//0不通过1通过2待审核
                        e.img = 'waitconfirm.png'
                    }else if(e.ISCHECKED == 1){
                        e.img = 'pass.png'
                    }else{
                        e.img = 'unpass.png'
                    }
                });
            })
        },
        //报刊列表
        Periodicallist(id){
            this.util.postAjax({
                code:code.base,
                url:code.Periodicallist,
                data:{//参数暂时写死
                    ID:id
                }
            }).then( res => {
                this.Periodicallists = res.items;
                if(res.items.length > 0){
                    this.Periodicallistsshow = true;
                }else{
                    this.Periodicallistsshow = false;
                }
                 this.Periodicallists.forEach((e,i) => {
                    if(e.ISCHECKED == 2){//0不通过1通过2待审核
                        e.img = 'waitconfirm.png'
                    }else if(e.ISCHECKED == 1){
                        e.img = 'pass.png'
                    }else{
                        e.img = 'unpass.png'
                    }
                });
            })
        },
        //删除待审核列表
        del(id){
            this.MessageBox.confirm('确定删除吗?').then(action => {
                this.util.postAjax({
                    code:code.base,
                    url:code.deleteRecords,
                    data:{
                        data:JSON.stringify([id])
                    }
                }).then( res => {
                    this.Toast('删除成功');
                    this.getList(this.ID)
                })
            });
        },
        //删除报刊
        removePeriodical(id){
            this.MessageBox.confirm('确定删除吗?').then(action => {
                this.util.postAjax({
                    code:code.base,
                    url:code.PeriodicaldeleteRecords,
                    data:{
                        data:JSON.stringify([id])
                    }
                }).then( res => {
                    this.Toast('删除成功');
                    this.Periodicallist(this.ID)
                })
            });
        },
        //中间详情是否显示
        isshowmididle(v,i){
            v.showmididle = !v.showmididle;
            //更新tableData中的数据
            Vue.set(this.checklist,i,this.checklist[i])
        },
        //中间详情的修改
        godetails(item){
            window.sessionStorage.setItem('editID',item.ID);
            this.util.postAjax({
                code:code.base,
                url:code.bookgetOne,
                data:{//参数暂时写死
                    ID:item.ID
                }
            }).then( res => {
                window.sessionStorage.setItem('isadd','false')
                this.$router.push('bookreimbursement');
                var obj = {
                    bookstype:res.RECORD.ISCHINESE,//是否是境内
                    invoicenumber:res.RECORD.INVOICENUM,//发票号
                    invoicenvalue:res.RECORD.ALLMONEY,//发票总金额
                    mainperson:res.RECORD.CREATERNAME,
                    Fundstype:res.RECORD.FUNDTYPE,
                    Fundsnum:res.RECORD.FUNDNUMBER,
                    instructions:res.RECORD.REASON,
                    CREATERID:res.RECORD.CREATERID,
                    PHONE:res.RECORD.PHONE,
                    // URL:res.RECORD.URL
                }
                //存入负责人的缓存
                window.sessionStorage.setItem('addbook',JSON.stringify(obj))
                //将负责人id也存起来覆盖前面的防止是别的页面的添加的编辑的时候刚开始获取不到这个id
                window.sessionStorage.setItem('mainpersonID',res.RECORD.CREATERID)
                //存入购书单的缓存
                var files = [];//购书单的数组
                var FPfiles = [];//发票的数组
                var OAfiles = [{ID:''}];//发票的数组
                var DOCfiles = [{ID:''}];//发票的数组
                var PURCHASERESULTfiles = [{ID: ''}];// 采购结果数组
                res.NOTE.forEach(e=>{
                    if(e.TYPE == 0){//书单
                        files.push({
                            ID: e.URL,
                            checked: true,
                        })
                    }else if(e.TYPE == 2){//发票
                        FPfiles.push({
                            ID: e.URL,
                            checked: true,
                        })
                    }else if(e.TYPE == 3){
                        OAfiles = [];
                        OAfiles.push({
                            ID: e.URL,
                            checked: true,
                        })
                    }else if (e.TYPE == 5) {
                      PURCHASERESULTfiles = []
                      PURCHASERESULTfiles.push({
                          ID: e.URL,
                          checked: true
                      })
                    }else{
                        DOCfiles = [];
                        DOCfiles.push({
                            ID: e.URL,
                            checked: true,
                        })
                    }
                })
                var addArr = [];//书单列表
                res.items.forEach(e=>{
                    addArr.push({
                        AUTHOR: e.BOOK.AUTHOR,
                        BIDPRICE: e.BOOK.BIDPRICE,
                        BOOKNAME: e.BOOK.BOOKNAME,
                        ISBN: e.BOOK.ISBN,
                        ISCHINESE: e.BOOK.ISCHINESE,
                        PUBLISHER: e.BOOK.PUBLISHER,
                        QUANTITY: e.BOOK.QUANTITY,
                        TRADINGPRICE: e.BOOK.TRADINGPRICE,
                        TOTAL: e.BOOK.TOTAL,
                        IMGURL:e.PIC[0].URL,
                        ID:e.BOOK.ID
                    })
                })
                this.$store.commit('setselectimgs',files);
                if(OAfiles[0].ID){//存在
                    window.sessionStorage.setItem('showOA','true')
                }else{
                    window.sessionStorage.setItem('showOA','false')

                }
                window.sessionStorage.setItem('FPfiles',JSON.stringify(FPfiles))
                window.sessionStorage.setItem('OAfiles',JSON.stringify(OAfiles))
                window.sessionStorage.setItem('DOCfiles',JSON.stringify(DOCfiles))
                window.sessionStorage.setItem('PURCHASERESULTfiles',JSON.stringify(PURCHASERESULTfiles))
                window.sessionStorage.setItem('addlist',JSON.stringify(addArr))
            })
        },
        goPeriodicaldetails(item){
            window.sessionStorage.setItem('editPeriodicalID',item.ID);
            this.util.postAjax({
                code:code.base,
                url:code.Periodicalview,
                data:{//参数暂时写死
                    ID:item.ID
                }
            }).then( res => {
                // console.log(res)
                window.sessionStorage.setItem('isperiodicaladd','false');
                this.$router.push('periodicalreimbursement');
                var obj = {
                    ISChINESE:res.item.ISCHINESE,//是否是境内
                    INVOICENUMBER:res.item.INVOICENUMBER,//发票号=
                    ALLMONEY:res.item.ALLMONEY,//发票总金额=
                    CREATORNAME:res.item.CREATORNAME,//=
                    FUNDTYPE:res.item.FUNDTYPE,//经费类型=
                    FUNDNUMBER:res.item.FUNDNUMBER,//经费本编号=
                    REASON:res.item.REASON,//报账说明
                    KINDNUM:res.item.KINDNUM,//报刊种数=
                    CREATORID:window.sessionStorage.getItem('CREATORNAMEID'),//=
                    PHONE:res.item.PHONE
                }
                //存入负责人的缓存
                window.sessionStorage.setItem('addPeriodical',JSON.stringify(obj))
                //将负责人的id存起来,防止是别的页面的添加的编辑的时候刚开始获取不到这个id
                window.sessionStorage.setItem('CREATORNAMEID',res.item.CREATORID)
                //存入购书单的缓存
                var files = [];//购书单的数组+发票的数组
                var FPfiles = [];
                var OAfiles = [{ID:''}];//发票的数组
                var DOCfiles = [{ID:''}];//发票的数组
                var PURfiles = [{ID:''}];//采购结果数组
                res.list.forEach(e=>{
                    files.push({
                        TYPE:e.TYPE,
                        ID: e.URL,
                        checked: true,
                    })
                })
                this.$store.commit('setselectimgs',files);
                res.invoice.forEach(v=>{
                    FPfiles.push({
                        TYPE:v.TYPE,
                        ID: v.URL,
                    });
                })
                 res.artical.forEach(v=>{
                    DOCfiles = [];
                    DOCfiles.push({
                        TYPE:v.TYPE,
                        ID: v.URL,
                    })
                })
                res.oa.forEach(v=>{
                    OAfiles = [];
                    OAfiles.push({
                        TYPE:v.TYPE,
                        ID: v.URL,
                    })
                })
                res.purchaseresult.forEach(v=>{
                    PURfiles = []
                    PURfiles.push({
                        TYPE:v.TYPE,
                        ID: v.URL
                    })
                })
                // console.log(OAfiles[0].ID)
                if(OAfiles[0].ID){//存在
                    window.sessionStorage.setItem('showOA','true')
                }else{
                    window.sessionStorage.setItem('showOA','false')

                }
                window.sessionStorage.setItem('FPfiles',JSON.stringify(FPfiles))
                window.sessionStorage.setItem('OAfiles',JSON.stringify(OAfiles))
                window.sessionStorage.setItem('DOCfiles',JSON.stringify(DOCfiles))
                window.sessionStorage.setItem('PURfiles',JSON.stringify(PURfiles))
            })
        }
    },
    created() {
        // this.getUser().then(res => {
        //     //res
        //     this.id = res.ID;

        // });
        // this.selected = this.$store.state.selected?this.$store.state.selected:'图书';
        // this.tabs(this.selected)
        // console.log(this.selected)
        // this.periodicalLoading = false;
        // this.bookLoading = false;
        // this.$store.commit('setselectimgs',[]);
        // switch (this.selected) {//在详情页面返回的时候，判断哪个tab选中了
        //     case '图书':
        //         this.periodicalLoading = true;
        //         this.bookLoading = false;
        //         break;
        //     case '报刊':
        //         this.periodicalLoading = false;
        //         this.bookLoading = true;
        //         break;
        // }

    },
}
</script>
<style scoped>
.books{
    width: 100%;
    height: 100%;
    background:rgba(245,245,245,1);
    padding-top:1rem;
    box-sizing: border-box;
    padding-bottom: 2rem;
}
.books .book:first-of-type{
    margin: 0;
}
.downbox>span{
    display: inline-block;
    width: 3.6rem;
    height: 1.5rem;
    background: rgba(71,122,219,1);
    border-radius: 5px;
    text-align: center;
    line-height: 1.5rem;
    color: #fff;
}
.downbox>i{
    font-style: normal;
    font-style: 12px;
}
/* 默认显示第一条数据的所有 */
/* .books .book .bookmiddle{
    display: none;
}
.books .book:first-of-type .bookmiddle{
    display: block;
} */
.book{
    width: 100%;
    background: #fff;
    position: relative;
    margin: 1rem 0;
}
.fixed_add{
    width: 100%;
    height: 2.25rem;
    position: fixed;
    background:rgba(71,122,219,1);
    left: 0;
    bottom: 0rem;
    text-align: center;
    line-height: 2.25rem;
    font-size:0.65rem;
    color:rgba(255,255,255,1);
}
.fixedadd{
    width: 4rem;
    height: 4rem;
    background: url(../../static/imgs/addcheck.png) no-repeat center center;
    background-size: cover;
    margin: 0 auto;
}
.bookbottom{
    width: 100%;
    position: relative;
}
.booktop{
    width: 100%;
    height: 2rem;
    position: relative;
}
.left_icon{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: url(../../static/imgs/waitconfirm.png) no-repeat center center;
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;
}
.right_del{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin-right: 1rem;
    background: url(../../static/imgs/del.png) no-repeat center center;
    background-size: contain;
    float: right;
    margin-top: .5rem;
}
.booktop>p{
    width: calc(100% - 2rem);
    line-height: 2rem;
    text-indent: 1.5rem;
    text-align: left;
    font-size:0.7rem;
    font-weight:400;
    color:rgba(102,102,102,1);
    float: left;
}
.booktop>p>span{
    float: right;
    position: absolute;
    right: 1rem;
    font-size: .6rem;
    color: #999;
}
.periodicalmiddle>h6{
    width:100%;
    /* height:1.05rem; */
    text-align: left;
    line-height: 1.05rem;
    font-size:0.75rem;
    font-weight:550;
    color:rgba(51,51,51,1);
}
.periodicalmiddle>p{
    width:100%;
    height:1.2rem;
    text-align: left;
    font-size:0.65rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:1.2rem;
}
.bookbottom>p{
    width: 100%;
    height: 100%;
    line-height: 2rem;
    font-size:0.6rem;
    font-weight:400;
    color:rgba(102,102,102,1);
    text-align: right;
    padding-right:1rem;
    box-sizing: border-box;
}
.bookbottom>p>span{
    margin-left: 1rem;
}
.periodicalmiddle{
    background: rgba(249,249,249,1);
    padding: .5rem 1rem;
    box-sizing: border-box;
}
.reason{
    text-align: left;
    margin-left: 1rem;
    font-size: .65rem;
    color:#FF3B30;
    padding-bottom:.5rem;
    display: flex;
    justify-content: space-around;
}
.reason1{
    text-align: left;
    font-size: .65rem;
    color: #FF3B30;
     display: flex;
    justify-content: space-around;
}
.reasonleft{
    display: inline-block;
    width: 4rem;

}
.reasonright{
    display: inline-block;
    width: calc(100% - 4rem);
    text-align: justify;
}
.reason>.reasonright{
    padding-right: 1rem;
    box-sizing: border-box;
}
</style>
