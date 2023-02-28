<template>
    <div class="person_content">
        <div class="person_top">
            <div class="exit" > <span @click="exit">退出登录</span><i @click="exit"></i></div>
            <div class="person_img"></div>
            <div class="bigthing" @click="gobigthing">大事记</div>
            <h3>{{personinfo.name}}</h3>
            <p v-if="readerFlag_show">图书馆借书证已激活</p>
            <p v-if="ispass_show">已通过入馆测试，入校后借书证自动激活</p>
            <p v-if="exam_show">图书馆借书证未激活</p>
        </div>
        <h1 class="person_title">个人信息</h1>
        <div class="person_detail">
            <div class="clearfix"><h3>证件</h3><p>{{personinfo.readerId}}</p></div>
            <div class="clearfix"><h3>条码</h3><p>{{personinfo.barcode}}</p></div>
            <div class="clearfix"><h3>校区</h3><p>{{personinfo.campusName}}</p></div>
            <div class="clearfix"><h3>班级</h3><p>{{personinfo.dept}}</p></div>
            <div class="clearfix"><h3>年级</h3><p>{{personinfo.grade}}</p></div>
        </div>
        <div v-if="activity" class="activity">
            <p>我的活动<span @click="gomyactivity">查看详情<van-icon name="arrow" /></span></p>
        </div>
    </div>
</template>
<script>
import code from '../../util/code'
export default {
    data () {
        return {
            personinfo:'',
            readerFlag_show:false,
            ispass_show:false,
            exam_show:false,
            activity:window.base.activity,
            exitURL:window.base.loginToUrl,
            nuist:window.base.nuist
        }
    },
    methods: {
        exit(){
            window.sessionStorage.removeItem('isfirstlogin');
            if(this.nuist){
                location.href =
                location.protocol +
                "//" +
                location.host +
                "/idsweb/rest/Idsclient/reqLogout?reqUrl=" +
                window.location.href;

            }else{
                location.href =
                location.protocol +
                "//" +
                location.host +
                "/idsweb/rest/Idsclient/reqLogout?reqUrl=" +
                this.exitURL
            }
        },
        gomyactivity(){
            this.$router.push('myactivity')
        },
        //获取个人信息接口
        getuserinfo(){
            this.util.postAjax({
                code:code.base,
                url:code.campuslist,
            }).then(data=>{
                this.util.postAjax({
                    code:code.base,
                    url:code.userInfo,
                    isRep:true,
                    data:{}
                }).then(res => {
                    if(res.success){
                        this.personinfo = res.item;
                        data.items.forEach(e=>{
                            if(e.id==this.personinfo.campusId){
                                this.personinfo.campusName = e.name
                            }
                        })
                        if(this.personinfo.readerFlag==1){//表示老生或者新生
                            this.readerFlag_show = true;
                        }else{
                            if(this.personinfo.ispass==1){
                                this.ispass_show = true;
                            }else{
                                this.exam_show = true;
                            }

                        }

                    }
                });
            })
        },
        gobigthing(){
            this.$router.push('bigthing')
        }
    },
    created() {
        this.getuserinfo()
    },

}

</script>
<style>

.person_top>.exit{
    position: absolute;
    font-size: .75rem;
    top: -1.5rem;
    right: 0;
    color: #F42631;
}
.person_top>.exit>span{
    float: right;
}
.person_top>.exit>i{
    display: inline-block;
    width: .8rem;
    height: .8rem;
    background: url(../../../static/img/exit.png) no-repeat center center;
    background-size: contain;
    margin-right: .3rem;
    float: right;
    margin-top: .1rem;

}
.activity{
    width: calc(100% - 40px);
    height: 51px;
    background: linear-gradient(135deg, #4CB6F7 0%, #116EF2 100%);
    box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.14);
    border-radius: 3px;
    margin: 22px auto;
    padding: 0 15px;
    box-sizing: border-box;
}
.activity>p{
    width: 100%;
    height: 100%;
    font-size: 15px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 51px;
}
.activity>p>span{
    float: right;
}
.activity>p>span>i{
    display: inline-block;
    width: 6px;
    height: 11px;
    margin-left: 5px;
    float: right;
    margin-top: 17px;

}
.person_content{
    padding-bottom: 3rem;
    box-sizing: border-box;
}
.person_top{
    width:90%;
    height:9rem;
    background:url(../../../static/img/person_card.png) no-repeat center center;
    border-radius:0.25rem;
    margin: 0 auto;
    margin-top: 3.5rem;
    background-size: cover;
    position: relative;
    padding-top: 3.5rem;
    box-sizing: border-box;
}
.person_img{
    width: 5rem;
    height: 5rem;
    background: url(../../../static/img/headphoto.png) no-repeat center center;
    background-size: cover;
    border-radius: 50%;
    position: absolute;
    left: 1rem;
    top: -2.5rem;
}
.bigthing{
    width:3rem;
    height:1.25rem;
    background:rgba(255,255,255,1);
    border-radius:0.63rem;
    font-size:0.6rem;
    font-weight:400;
    color:rgba(0,120,241,1);
    line-height:1.25rem;
    text-align: center;
    position: absolute;
    right: .5rem;
    top: .5rem;
}
.person_top>h3{
    width:100%;
    height:1.25rem;
    font-size:0.9rem;
    font-weight:600;
    color:rgba(255,255,255,1);
    line-height:1.25rem;
    padding: 0 1rem;
    box-sizing: border-box;
}
.person_top>p{
    width:100%;
    height:1.05rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:1.05rem;
    padding: 0 1rem;
    box-sizing: border-box;
    margin-top: .5rem;
}
.person_title{
    width:100%;
    height:1.25rem;
    font-size:0.9rem;
    font-weight:600;
    color:rgba(51,51,51,1);
    line-height:1.25rem;
    padding: 0 1rem;
    box-sizing: border-box;
    margin-top: 1rem;
    margin-bottom: 0.23rem;
}
.person_detail>div{
    width: 90%;
    margin: 0 auto;
    height: 2.03rem;
    line-height: 2.03rem;
    box-sizing: border-box;
    border-bottom: 1px solid #DBDBDB;
}
.person_detail>div>h3{
    width: 30%;
    float: left;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:2.03rem;
}
.person_detail>div>p{
    width: 70%;
    float: right;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:2.03rem;
    text-align: right;
}
</style>
