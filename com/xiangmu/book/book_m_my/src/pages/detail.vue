<template>
    <div class="scan_bac">
        <div class="scan_detail">
            <div class="scan_title">基本信息</div>
            <!-- <mt-field label="经费负责人" readonly>{{bookdetail.CREATERNAME}}</mt-field> -->
            <mt-field label="经费本号" readonly>{{bookdetail.FUNDNUMBER}}</mt-field>
            <mt-field v-if="type=='book'" label="图书种类" readonly>{{bookdetail.ISCHINESE=='1'?'境内':'境外'}}</mt-field>
            <mt-field v-if="type=='periodical'" label="报刊种类" readonly>{{bookdetail.ISCHINESE=='1'?'境内':'境外'}}</mt-field>
            <mt-field v-if="type=='periodical'" label="报刊种数" readonly>{{bookdetail.KINDNUM}}</mt-field>
            <mt-field label="经费类型"  readonly >{{bookdetail.FUNDTYPE}}</mt-field>
            <mt-field label="发票总金额"  readonly>{{bookdetail.ALLMONEY}}</mt-field>
            <mt-field label="发票号" readonly>{{bookdetail.INVOICENUM}}</mt-field>
            <div class="scan_exp">
                <span class="title">用途说明</span><span class="exp">{{bookdetail.REASON}}</span>
            </div>
        </div>
        <div class="scan_img">
            <div class="scan_title">图片信息</div>
            <div class="scan_img_">
                <h3>购书单：</h3>
                <ul class="gou clearfix" v-if="QDfiles.length>0">
                    <li v-for="(v,i) in QDfiles" :key="i">
                        <img :preview='0' :src="domain+'/fileManage/get?ID='+v.ID">
                    </li>
                </ul>
                <h3>发票：</h3>
                <div v-show="FPfiles[0].ID" v-for="(v,i) in FPfiles" :key="i">
                    <img :preview='2' :src="domain+'/fileManage/get?ID='+v.ID">
                </div>
                <h3 v-show="OAfiles.length>0">OA审核文件截图：</h3>
                <div v-show="OAfiles[0].ID" v-for="(v,i) in OAfiles" :key="i">
                    <img :preview='3' :src="domain+'/fileManage/get?ID='+v.ID">
                </div>
                <h3 v-show="DOCfiles.length>0">文献资源项目采购申报表：</h3>
                <div v-show="DOCfiles[0].ID" v-for="(v,i) in DOCfiles" :key="i">
                    <img :preview='4' :src="domain+'/fileManage/get?ID='+v.ID">
                </div>
            </div>
        </div>
        <div class="scan_book" v-if="type=='book'">
            <div class="scan_title">全部图书</div>
            <ul class="scan_ul">
                <li class="clearfix" v-for="(v,i) in books" :key="i">
                    <div class="li_img">
                        <img :src="v.PIC[0].URL" alt="">
                    </div>
                    <div class="li_text">
                        <h3>{{v.BOOK.BOOKNAME}}</h3>
                        <p>作者:{{v.BOOK.AUTHOR}}</p>
                        <p>ISBN: {{v.BOOK.ISBN}}</p>
                        <p class="price">{{v.BOOK.QUANTITY}}本</p>
                    </div>
                    <div class="line"></div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import code from '../util/code'
import { global } from '../util/global'
export default {
    data() {
        return {
            type:'',
            id:'',
            bookdetail:'',
            QDfiles:[],
            FPfiles:[],
            OAfiles:[],
            DOCfiles:[],
            domain:global,
            books:[]
        }
    },
    methods: {
        //扫码图书详情
        getbookdetail(type,id){
            if(type=='book'){
                this.util.postAjax({
                    code:code.base,
                    url:code.bookgetOne,
                    data:{//参数暂时写死
                        ID:id
                    }
                }).then( res => {
                    this.bookdetail = res.RECORD;
                    res.NOTE.forEach(e => {
                        //TYPE:0 购书单 2 发票 3 OA  4 文献
                        if(e.TYPE=='0'){
                            this.QDfiles.push(e)
                        }else if(e.TYPE=='2'){
                            this.FPfiles.push(e)
                        }else if(e.TYPE=='3'){
                            this.OAfiles.push(e)
                        }else{
                            this.DOCfiles.push(e)
                        }
                    });
                    this.books = res.items;
                    console.log(this.books)
                })
            }else{
                this.util.postAjax({
                    code:code.base,
                    url:code.Periodicalview,
                    data:{//参数暂时写死
                        ID:id
                    }
                }).then( res => {
                    console.log(res)
                    this.bookdetail = res.item;
                    this.bookdetail.CREATERNAME = this.bookdetail.CREATORNAME;
                    this.bookdetail.INVOICENUM = this.bookdetail.INVOICENUMBER;
                    this.QDfiles = res.list
                    this.FPfiles = res.invoice
                    this.OAfiles = res.oa
                    this.DOCfiles = res.artical
                })
            }
            

        }
    },
    created() {
        var urlparams = window.location.href.split("detail?ID=");
        this.type = urlparams[1].split('_')[1];
        this.id = urlparams[1].split('_')[0];
        this.getbookdetail(this.type,this.id)
    },
}
</script>
<style>
.scan_ul{
    width:100%;
    height: auto;
}
.scan_ul>li{
    width: 100%;
    margin-top: 1rem;
    padding: 0 .5rem;
    box-sizing: border-box;
}
.line{
    width: 100%;
    height:0.05rem;
    background:rgba(238,238,238,1);
    margin-top: 1rem;
}
.scan_ul>li>div{
    float: left;
}
.li_img{
    width:4.5rem;
    height:5.6rem;
    background:yellow;
    border-radius:0.1rem;
}
.li_text{
    width: calc(100% - 5.3rem);
    margin-left: .53rem;
}
.li_text>h3{
    width:100%;
    /* height:1.05rem; */
    font-size:0.85rem;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    text-align: left;
}
.li_text>p{
    width:100%;
    height:0.9rem;
    font-size:0.65rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:0.9rem;
    text-align: left;
    margin-top: .5rem;
}
.li_text>p.price{
    font-size:1rem;
    font-weight:500;
    color:rgba(255,59,48,1);
    text-align: left;
}
.scan_bac{
    background:rgba(248,248,248,1);
}
.scan_exp{
    width: 100%;
    min-height: 52px;
    padding: 0 .5rem;
    background: #fff;
    box-sizing: border-box;
}
.scan_exp>.title{
    font-size: 0.85rem;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51,51,51,1);
    line-height: 52px;
    float: left;
}
.scan_exp>.exp{
    font-size: 12px;
}
.scan_detail{
    width:100%;
    height:22.7rem;
    background:rgba(255,255,255,1);
    padding-top: 1rem;
    box-sizing: border-box;
}
.scan_title{
    width:5.25rem;
    height:2rem;
    background:rgba(71,122,219,1);
    border-radius:0rem 5rem 5rem 0rem;
    text-align: center;
    line-height: 2rem;
    font-size:0.85rem;
    font-weight:500;
    color:rgba(255,255,255,1);
}
.scan_img{
    width:100%;
    background:rgba(255,255,255,1);
    margin-top: 1.2rem;
    padding-top: 1rem;
    padding-bottom: 1.5rem;
    box-sizing: border-box;
}
.scan_img_{
    width: 100%;
    height: 100%;
    padding: 0 .5rem;
    box-sizing: border-box;
}
.scan_img_>h3{
    width:100%;
    height:1.2rem;
    font-size:0.85rem;
    font-weight:400;
    color:rgba(34,38,50,1);
    line-height:1.2rem;
    text-align: left;
    margin: .7rem 0;

}
.scan_img_>h3:first-of-type{
    margin-top: 1rem;
    margin-bottom: .15rem;
}
.gou{
    width: 100%;
}
.gou>li{
    width: 32%;
    height:5.35rem;
    background:rgba(216,216,216,1);
    border-radius:0.15rem;
    float: left;
    margin-right: 1.3%;
    margin-top: .55rem;
}
.gou>li>img,.scan_img_>div>img,.li_img>img{
    width: 100%;
    height: 100%;
    background: red;
}
.scan_img_>div{
    width: 100%;
    /* height:9.55rem; */
    background:rgba(216,216,216,1);
    border-radius:0.15rem;
}

.scan_book{
    width:100%;
    height:18.25rem;
    background:rgba(255,255,255,1);
    margin-top: 1.2rem;
    padding-top: 1rem;
    padding-bottom: 1.5rem;
    box-sizing: border-box;
}
</style>