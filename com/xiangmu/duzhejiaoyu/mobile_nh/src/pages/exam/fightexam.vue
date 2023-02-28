<template>
    <div class="fightexam_content">
        <div class="fightexam_auto">
            <div class="fightexam_top">
                <span class="fighteaxm_back" @click="fightexplain_back"></span>
                闯关开始
                <span class="fighteaxm_explain" @click="seefightexplain"></span>
            </div>
            <ul class="clearfix fightexam_bottom">
                <!-- <li class="fightsuccess" @click="gofightexaming">10题<br>第一关</li> -->
                <li :class="{'fightsuccess':i<=opennum}" v-for="(v,i) in fightnum" :key="i" @click="gofightexaming(i)">
                    <i v-show="i==opennum" class="now_fight"></i>
                    {{v.questList.length}}题<br>第{{i+1}}关
                </li>
            </ul>
        </div>
        <!-- 游戏解释 -->
        <div class="fightexam_explain" v-if="fightexamexplain_show">
            <div class="fightexam_explain_">
                <div class="fightexam_explain_img"></div>
                <h3>考试说明</h3>
                <p>此次考试需在{{fightDetails1.validStart}} ~ {{fightDetails1.validEnd}} 时间内完成试卷。 共 {{fightDetails1.score}} 关，闯过 {{fightDetails1.passScore}} 关即视为通过考试， 且不限考试次数。</p>
                <span @click="closefightexamexplain">我知道了</span>
            </div>
        </div>
    </div>
</template>
<script>
import code from '../../util/code'
export default {
    props:{
        fightDetails:String
    },
    data() {
        return {
            fightexamexplain_show:false,//
            fightDetails1:[],
            fightnum:[],//闯关数量
            opennum:0,//当前开放的

        }
    },
    methods: {
        seefightexplain(){
            this.fightexamexplain_show = true;
        },
        closefightexamexplain(){
            this.fightexamexplain_show = false;
        },
        fightexplain_back(){
            this.$router.push('exam');
        },
        gofightexaming(i){
            console.log(i,this.opennum)
            if(i>this.opennum){
                return
            }
            window.sessionStorage.setItem('fightobj',this.fightDetails);
            window.sessionStorage.setItem('fightexaming_detail',JSON.stringify(this.fightDetails1.levelList[i]));
            this.$router.push({
                path:'fightexaming',
                // query:{
                //     fightques:JSON.stringify(this.fightDetails1.levelList[i]),
                // }
            })
        },
        //全部考完获取考试成绩
        getfightresult(){
            this.util.postAjax({
                code:code.base,
                url:code.fightliststate,
                data:{qresId:this.fightDetails1.id}
            }).then(res => {
                if(res.item.passLevel==0||res.item.passLevel==1){
                    if(res.item.passLevel==1){//表示当前的关卡已经通过
                        this.opennum = res.item.level;
                    }else{
                        this.opennum = res.item.level-1;
                    }
                }else{
                    this.opennum = 0
                }
                console.log(this.opennum)
                
            });
        }
    },
    created () {
        // this.fightDetails1 = JSON.parse(this.fightDetails);
        this.fightDetails1 = JSON.parse(window.sessionStorage.getItem('fightexam_detail'));
        this.fightnum = this.fightDetails1.levelList;
        this.getfightresult();
    }
    
}
</script>
<style>
.fightexam_content{
    width:100%;
    height: 100%;
    position: fixed;
    background: url(../../../static/img/fightexam.png) no-repeat center center;
    background-size: cover;
}
.fightexam_auto{
    width: 90%;
    height: 100%;
    margin: 0 auto;
}
.fightexam_top{
    width: 100%;
    height: 1.65rem;
    margin-top: 1.5rem;
    text-align: center;
    font-size:0.9rem;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:1.65rem;
}
.fighteaxm_back,.fighteaxm_explain{
    display: inline-block;
    width:1.65rem;
    height:1.65rem;
    background:url(../../../static/img/fightexam_back.png) no-repeat center center;
    background-size: cover;
    border-radius: 50%;
    float: left;
}
.fighteaxm_explain{
    background:url(../../../static/img/fight_explain.png) no-repeat center center;
    background-size: cover;
    float: right;

}
.fightexamtop_title{
    display: inline-block;
}
.fightexam_bottom{
    width: 100%;
    height: calc(100% - 8.3rem);
    overflow: scroll;
    margin-top: 2.65rem;
}
.fightexam_bottom>li{
    width:3.75rem;
    height:3.75rem;
    background:url(../../../static/img/fightstartgrey.png) no-repeat center center;
    background-size: cover;
    margin: .8rem;
    border-radius: 50%;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(96,63,17,1);
    line-height:1.05rem;
    text-align: center;
    padding-top: .8rem;
    box-sizing: border-box;
    float: left;
    position: relative;
}
.now_fight{
    display: inline-block;
    width: 30%;
    height: 30%;
    background: url(../../../static/img/headphoto.png) no-repeat center center;
    background-size: cover;
    position: absolute;
    right: 0;
    top: 0;

}
.fightexam_bottom>li.fightsuccess{
    background:url(../../../static/img/fightstart.png) no-repeat center center;
    background-size: cover;
}
.fightexam_bottom>li.fightsuccess.fightsuccessing{
    background:url(../../../static/img/fightstarting.png) no-repeat center center;
    background-size: cover;
}
.fightexam_explain{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.7);
    position: fixed;
    top: 0;
}
.fightexam_explain_{
    width: 90%;
    height: 40%;
    position: absolute;
    background: #fff;
    margin: auto;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    text-align: center;
}
.fightexam_explain_>h3{
    width: 90%;
    padding: 0 .75rm;
    box-sizing: border-box;
    margin: 0 auto;
    text-align: center;
    margin-top: 2.5rem;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
}
.fightexam_explain_>p{
    width: 90%;
    padding: 0 .75rm;
    box-sizing: border-box;
    margin: 0 auto;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:1.05rem;
    margin-top: .5rem;
    text-align: justify;
}
.fightexam_explain_>span{
    display: inline-block;
    width:6rem;
    height:1.75rem;
    background:linear-gradient(180deg,rgba(83,169,255,1) 0%,rgba(11,101,227,1) 100%);
    border-radius:0.88rem;
    text-align: center;
    font-size:0.75rem;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:1.75rem;
    margin-top: 1.02rem;
}
.fightexam_explain_img{
    width:3.48rem;
    height:3.48rem;
    background:url(../../../static/img/fight_explain1.png) no-repeat center center;
    background-size: 130%;
    position: absolute;
    left: calc(50% - 1.74rem);
    top: -1.74rem;
}
</style>
