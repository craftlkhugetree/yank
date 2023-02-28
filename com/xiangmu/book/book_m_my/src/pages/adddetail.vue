<template>
    <div>
        <div class="booktop">
            <div class="scanbox">
                <mt-field label="ISBN" class="isbn" placeholder="请输入" v-model="ISBN" @change="getisbn(ISBN)"></mt-field>
                <i class="scan" @click="scan"></i>  
            </div>
            <mt-field label="图书名称" placeholder="请输入" v-model="BOOKNAME" :readonly="isreadonly"></mt-field>
            <mt-field label="作者" placeholder="请输入" v-model="AUTHOR" class="author" :readonly="isauthreadonly"></mt-field>
            <mt-field label="出版社" placeholder="请输入" v-model="PUBLISHER" class="publisher" :readonly="ispubreadonly"></mt-field>
            <!-- <mt-field label="标价" placeholder="请输入" v-model="BIDPRICE"></mt-field> -->
            <mt-field label="册数" placeholder="请输入" v-model="QUANTITY" @change="changeQUANTITY(QUANTITY)"></mt-field>
            <!-- <mt-field label="实付总价" placeholder="请输入" v-model="TRADINGPRICE" @change="changeTRADINGPRICE(TRADINGPRICE)"></mt-field> -->
        </div>
        <div class="bookfixedbottom">
            <div class="bookfixedbottomleft" @click="goadd">继续添加</div>
            <div class="bookfixedbottommiddle" v-if="isedit != 'true'" @click="add_submit">提交审核</div>
            <div class="bookfixedbottommiddle" v-else @click="add_submit">保 存</div>
            <div class="bookfixedbottomright" @click="back">返回</div>
        </div>
        <!-- 弹窗 -->
        <div class="meng" v-show="isread">
            <p>数据读取中...</p>
        </div>
    </div>
</template>
<script>
import code from '../util/code'
// import mamp from '../assets/js/mamp.js'

export default {
    data() {
        return {
            ISBN:'',//isbn
            BOOKNAME:'',//图书名称
            AUTHOR:'',//作者
            PUBLISHER:'',//出版社
            // BIDPRICE:'',//标价
            QUANTITY:'',//册数
            TRADINGPRICE:'',//实价
            isgoadd:'',//是否是继续添加，还是提交审核
            bookArr:[],//每次新增的书信息的数组
            IMGURL:'',//书本封面
            isedit:'',//是否是新增进来的还是编辑
            ID:'',
            isread:false,//数据读取中
            isnamereadonly:false,//只读
            ispubreadonly:false,//只读
            isauthreadonly:false,//只读
        }
    },
    methods: {
        back(){
            this.$router.push('bookreimbursement')
        },
        changeQUANTITY(num){
            if(isNaN(num)){
                this.Toast('请输入数字！')
                this.QUANTITY = ''
                return 
            }
        },
        changeTRADINGPRICE(num){
            if(isNaN(num)){
                this.Toast('请输入数字！')
                this.TRADINGPRICE = ''
                return 
            }
        },
        //isbn
        getisbn(val){
            this.isread = true;
            this.BOOKNAME='',//图书名称
            this.AUTHOR='',//作者
            this.PUBLISHER='',//出版社
            // this.BIDPRICE='',//标价
            this.QUANTITY='',//册数
            this.TRADINGPRICE='',//实总价
            this.util.postAjax({
                code:code.base,
                url:code.isbnGetBookInfo,
                data:{
                    ISBN:val
                }
            }).then( res => {
                console.log(res)
                this.isread = false;
                var str = '';
                if(res.author){
                    if (res.author.length > 0) {
                        for (var i = 0; i < res.author.length; i++) {
                            str += res.author[i] + ','
                        }
                    }
                }
                this.BOOKNAME = res.title;
                // if(this.BOOKNAME){
                //     this.isnamereadonly = true
                // }else{
                //     this.isnamereadonly = false

                // }
                this.AUTHOR = str.substr(0, str.length - 1) || '--';
                // if(this.AUTHOR){
                //     this.isauthreadonly = true
                // }else{
                //     this.isauthreadonly = false
                // }
                this.PUBLISHER = res.publisher || '--';
                // if(this.PUBLISHER){
                //     this.ispubreadonly = true
                // }else{
                //     this.ispubreadonly = false
                // }
                this.IMGURL = res.IMGURL;//注意这边后期估计得加没有图片的
                // console.log('tag1', this.IMGURL)
            }).catch(err=>{
                console.log(err)
                this.IMGURL = res.data.IMGURL;//注意这边后期估计得加没有图片的
                // console.log('tag', this.IMGURL)
            })
        },
        //提交审核
        add_submit(){
            this.isgoadd = false;
            this.goon();

        },
        //审核+继续添加判断
        goon(){
            var editArr = [];
            if(!this.ISBN){
                this.Toast('请输入ISBN号！')
            }else if(!this.BOOKNAME){
                this.Toast('请输入图书名称！')
            }else if(!this.AUTHOR){
                this.Toast('请输入作者！')
            }else if(!this.PUBLISHER){
                this.Toast('请输入出版社！')
            }
            // else if(!this.BIDPRICE){
            //     this.Toast('请输入标价！')
            // }
            else if(!this.QUANTITY){
                this.Toast('请输入册数！')
            }
            // else if(!this.TRADINGPRICE){
            //     this.Toast('请输入图书实际总价！')
            // }
            else{
                var obj = {
                    ID:this.util.GenNonDuplicateID(),
                    AUTHOR: this.AUTHOR,
                    // BIDPRICE : this.BIDPRICE,
                    BOOKNAME : this.BOOKNAME,
                    ISBN : this.ISBN,
                    PUBLISHER : this.PUBLISHER,
                    QUANTITY : this.QUANTITY,
                    // TOTAL : this.TRADINGPRICE,
                    ISCHINESE : this.$store.state.Fundstype,
                    IMGURL:this.IMGURL,
                };
                this.bookArr.push(obj);
                console.log(this.bookArr)
                if(window.sessionStorage.getItem('addlist')){
                    var a = JSON.parse(window.sessionStorage.getItem('addlist'));
                    a.forEach((element,index) => {
                        if(this.ID == element.ID){
                            a.splice(index, 1);
                        }
                    });
                    a.push(obj);
                    window.sessionStorage.setItem('addlist',JSON.stringify(a));
                }else{
                    window.sessionStorage.setItem('addlist',JSON.stringify(this.bookArr));
                }
                // return false
                if(!this.isgoadd){
                    this.$router.push('bookreimbursement');
                }else{
                    this.ISBN = '';//isbn
                    this.BOOKNAME = '';//图书名称
                    this.AUTHOR = '';//作者
                    this.PUBLISHER = '';//出版社
                    // this.BIDPRICE = '';//标价
                    this.QUANTITY = '';//册数
                    this.TRADINGPRICE = '';//实价
                }
            }
        },
        //继续添加
        goadd(){
            this.isgoadd = true;
            this.goon();
        },
        //扫码
        scan(){
            this.isread = true;
            // alert(JSON.stringify(mamp))
            // alert('https://injectionmamp/cordova.js')
            // alert(JSON.stringify(mamp.qrcode))
            // mamp.initEnv = (()=>{
            mamp.qrcode.scan((ret)=>{
                this.isread = false;
                this.ISBN = ret;
                this.getisbn(this.ISBN);
                // this.BIDPRICE = '';//标价
                this.QUANTITY = '';//册数
                this.TRADINGPRICE = '';//实价
            })
            // });
        }
    },
    created() {
        this.isedit = window.sessionStorage.getItem('isedit');
        if(window.sessionStorage.getItem('singlelist')){
            var singledata = JSON.parse(window.sessionStorage.getItem('singlelist'));
            this.ISBN = singledata.ISBN;
            this.BOOKNAME = singledata.BOOKNAME;
            this.AUTHOR = singledata.AUTHOR;
            this.PUBLISHER = singledata.PUBLISHER?singledata.PUBLISHER:'--';
            // this.BIDPRICE = singledata.BIDPRICE;
            this.QUANTITY = singledata.QUANTITY;
            this.TRADINGPRICE = singledata.TOTAL;
            this.IMGURL = singledata.IMGURL;
            this.ID = singledata.ID;
            // if(this.BOOKNAME){
            //     this.isreadonly = true
            // }else{
            //     this.isreadonly = false
            // }
            // if(this.AUTHOR){
            //     this.isauthreadonly = true
            // }else{
            //     this.isauthreadonly = false
            // }
            // if(this.PUBLISHER){
            //     this.ispubreadonly = true
            // }else{
            //     this.ispubreadonly = false
            // }
        }
    },
}
</script>
<style scoped>
.booktop{
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 1rem 0;
    box-sizing: border-box;
    background: #F5F5F5;
}
.scan{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url(../../static/imgs/scan.png) no-repeat center center;
    background-size: cover;
    margin-top: .8rem;
    margin-right: .5rem;
}
.scanbox{
    width: 100%;
    height: 2.6rem;
    background: #fff;
    display: flex;
    justify-content: space-around;
}
.isbn{
    width: calc(100% - 1rem);
}
</style>
