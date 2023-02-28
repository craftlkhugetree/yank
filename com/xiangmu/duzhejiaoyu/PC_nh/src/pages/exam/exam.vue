<template>
    <div>
        <div class="exam_content_" v-if="!readerFlag_show&&!ispass_show">
            <!-- <p class="exam_end" v-if="readerFlag_show==1">恭喜完成考试，图书馆借书证已被激活！</p> -->
            <div class="exam_content_img"></div>
            <div class="exam_condition" v-if="(islearnnum&&!((studytime>=needtime)&&isStudyed))||(!islearnnum&&!(studytime>=needtime))">
                <p>考试条件：</p>
                <div>
                    <p>1.需在线学习{{needtime}}分钟； <i v-if="studytime>=needtime"></i></p>
                    <p v-if="islearnnum">2.按顺序学习完所有文档。 <i v-if="isStudyed"></i></p>
                </div>
            </div>
            <div class="pt_exam" v-if="exam_pt.length>0"><i></i>{{exam_pt[0].testType=='1'?'普通考试':'闯关考试'}}</div>
            <div class="pt_exam_ clearfix" ref="pt_exam_1" v-for="(v,i) in exam_pt" :key="v.id" @mouseover="in_exam(i)" @mouseout="out_exam(i)">
                <div class="pt_eaxm_left">
                    <h3>{{v.name}}</h3>
                    <p class="pt_exam_time"><i></i>考试时间：{{v.validStart}} ～ {{v.validEnd}}</p>
                    <p v-if="exam_pt[0].testType=='1'"><span>总分：{{v.score}}分</span><span>题数：{{v.questionList.length}}题</span><span>答题时间：{{v.needTime}}分钟</span><span>合格分数线：{{v.passScore}}分</span></p>
                    <p v-else><span>共 {{v.score}} 关</span><span>超过 {{v.passScore}} 关即视为通过考试， 且不限考试次数。</span></p>
                </div>
                <div class="pt_eaxm_right" v-if="v.testType=='1'">
                    <span @click="goexam(v)" :class="{'noinip':!inip&&examadd}" v-if="(islearnnum&&(studytime>=needtime)&&isStudyed)||(!islearnnum&&(studytime>=needtime))">{{v.testType=='1'?'开始考试':'开始闯关'}}</span>
                    <span @click="goexam1(v)" :class="{'noinip':!inip&&examadd}" v-else>{{v.testType=='1'?'开始考试':'开始闯关'}}</span>
                    <p v-if="!inip&&examadd">请到{{examadd}}考试</p>
                </div>
                <div class="pt_eaxm_right" v-if="v.testType=='3'">
                    <span @click="gofight(v)" :class="{'noinip':!inip&&examadd}" v-if="(islearnnum&&(studytime>=needtime)&&isStudyed)||(!islearnnum&&(studytime>=needtime))">{{v.testType=='1'?'开始考试':'开始闯关'}}</span>
                    <span @click="goexam1(v)" :class="{'noinip':!inip&&examadd}" v-else>{{v.testType=='1'?'开始考试':'开始闯关'}}</span>
                    <p v-if="!inip&&examadd">请到{{examadd}}考试</p>
                </div>
            </div>
            <div class="line" v-if="exam_pt.length>0"></div>
            <div class="moni_exam" v-if="exam_mn.length>0"><i></i>模拟考试</div>
            <div class="pt_exam_ clearfix" ref="pt_exam_2" v-for="(v,i) in exam_mn" :key="v.id" @mouseover="in_exam2(i)" @mouseout="out_exam2(i)">
                <div class="pt_eaxm_left">
                    <h3>{{v.name}}</h3>
                    <p class="pt_exam_time"><i></i>考试时间：{{v.validStart}} ～ {{v.validEnd}}</p>
                    <p><span>总分：{{v.score}}分</span><span>题数：{{v.questionList.length}}</span><span>答题时间：{{v.needTime}}分钟</span><span>合格分数线：{{v.passScore}}分</span></p>
                </div>
                <div class="pt_eaxm_right" >
                    <span @click="goexam_mn(v)">开始考试</span>
                </div>
            </div>
            <div class="noexamlist" v-if="exam_pt.length<1 && exam_mn.length<1">
                <div v-if="personinfo.readerFlag==2 && nh" style="color:rgba(0,176,155,1);font-size:18px;">
                    你的校园卡图书馆权限处于挂失状态，请到图书馆证籍处处理。
                </div>
                <div v-else>
                    暂无可用试卷
                </div>
            </div>
            <!-- <div class="noexamlist" v-if="exam_mn.length<1">
                暂无可用试卷
            </div> -->
        </div>
        <div class="exam_content_" v-else>
            <div class="exam_content_img"></div>
            <p class="exam_end" v-if="readerFlag_show">你已通过入馆考试，借书证已激活</p>
            <p class="exam_end" v-if="ispass_show">你已通过入馆测试，入校后借书证自动激活</p>
            <div class="moni_exam" v-if="exam_mn.length>0"><i></i>模拟考试</div>
            <div class="pt_exam_ clearfix" ref="pt_exam_2" v-for="(v,i) in exam_mn" :key="v.id" @mouseover="in_exam2(i)" @mouseout="out_exam2(i)">
                <div class="pt_eaxm_left">
                    <h3>{{v.name}}</h3>
                    <p class="pt_exam_time"><i></i>考试时间：{{v.validStart}} ～ {{v.validEnd}}</p>
                    <p><span>总分：{{v.score}}分</span><span>题数：{{v.questionList.length}}</span><span>答题时间：{{v.needTime}}分钟</span><span>合格分数线：{{v.passScore}}分</span></p>
                </div>
                <div class="pt_eaxm_right" >
                    <span @click="goexam(v)">开始考试</span>
                </div>
            </div>
            <div class="noexamlist" v-if="exam_mn.length<1">
                暂无可用试卷
            </div>
        </div>
         <!-- 南航第一次登录进来的弹窗 -->
        <div class="first_meng" v-if="firstmeng">
            <div>
                <i @click="closeFirst_"></i>
                <h3></h3>
                <div class="first_content">
                    <p>第一条  校内读者凭本人校园卡入馆；校外读者凭本人身份证件到证籍管理处办理临时阅览证入馆；来访者凭介绍信或本人有效证件与办公室联系。严禁使用他人证件入馆。</p>
                    <p>第二条  注意仪容仪表，勿穿着背心、拖鞋、溜冰鞋入馆；勿在馆内有不雅举止。</p>
                    <p>第三条  图书馆是重点防火单位，严禁携带易燃易爆物品入馆，严禁在馆内任何地方吸烟、使用明火。读者须增强安全防范意识，本人贵重物品请妥善保管，严防丢失或被窃。</p>
                    <p>第四条  遵守馆内秩序，保持室内安静；勿大声喧哗、朗读、追逐和打闹；随身电子设备须保持静音，接打手机须到室外，以免影响他人学习。</p>
                    <p>第五条  爱护环境卫生、严禁携带食品、饮料入馆，馆内不随地吐痰，不乱扔纸屑杂物，不在公共物品或设施上乱涂乱画。</p>
                    <p>第六条  爱护文献资源和公共设施，不污损建筑设施、不毁坏书刊资料，未经允许不得擅自携带本馆书刊出馆。</p>
                    <p>第七条  注意文明阅读，讲究互谦互让。勿用私人物品占用座位和公共空间；读者离开座位半小时以上一律视为自动放弃，工作人员有权将座位上及其他公共空间的私人物品清理。</p>
                    <p>第八条  读者须从规定通道离馆，如遇监测器报警，应配合接受工作人员检查，不应有不文明、不礼貌的言行。</p>
                    <p>第九条  随身携带的包、文件夹（袋）等可存放于存包柜，并于当天取走。个人证件、钱款等贵重物品勿存入，如有遗失，责任自负。</p>
                    <p>第十条  自觉遵守图书馆有关规章制度，配合工作人员管理</p>
                </div>
                <div class="first_bottom">
                    <p @click="isreaded"><i :class="{'selected':readed}"></i>我已阅读，并承诺遵守</p>
                    <button :class="{'selected':readed}" @click="sure_exam">确 认</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import code from '../../util/code'
export default {
    data() {
        return {
            exam_pt:[],
            exam_mn:[],
            exam_cg:[],
            personinfo:'',
            studytime:0,
            needtime:0,//需要的事件
            isStudyed:false,
            showbtn:false,
            readerFlag_show:false,
            ispass_show:false,
            islearnnum:false,
            isipoepn:false,
            iprange:'',
            localip:'',
            inip:false,
            examadd:'',
            nh:window.base.nh,
            readed:false,
            isfirstlogin:'',//是不是第一次登录
            firstmeng:false,//南航第一次登录的蒙层
            examitem:'',
            ismnExam:'',//是不是模拟开始
        }
    },
    methods: {
        isreaded(){
            this.readed = !this.readed;
        },
        closeFirst_(){
            this.firstmeng = false;
        },
        sure_exam(){
            if(this.readed){
                this.isfirstlogin = '0';
                this.firstmeng = false;
                if(this.ismnExam =='pt'){
                    this.goexam(this.examitem)
                }else if(this.ismnExam =='mn'){
                    this.goexam_mn(this.examitem)
                }else{
                    this.gofight(this.examitem)
                    
                }
            }
        },
        haslearnnum(){
            this.util.postAjax({
                code:code.base,
                url:code.ruleslist,
                data:{
                    code:'ISLEARNNUMOPEN'//是否顺序阅读

                }
            }).then(res=>{
                if(res.item.rval=='1'){
                    this.islearnnum = true;
                }else{
                    this.islearnnum = false;
                }
            })
        },
        isipopen(){
            this.util.postAjax({
                code:code.base,
                url:code.ruleslistall,
            }).then(res=>{
                res.items.forEach(e=>{
                    if(e.rcode=='ISIPOPEN'){
                        this.isipoepn = e.rval
                    }
                    if(e.rcode=='IPSCOPE'){
                        this.iprange = e.rval
                    }
                    if(e.rcode=='KAOSHIADDR'){
                        this.examadd = e.rval
                    }
                })
                if(this.isipoepn=='1'){//开启了ip限制
                    var iparr = this.iprange.split('-');
                    var min = this.ipToNumber(iparr[0]);
                    var max = this.ipToNumber(iparr[1]);
                    var mynum = this.ipToNumber(this.localip);
                    if(mynum<=max && mynum>=min){//在ip范围内
                        this.inip = true
                    }
                }
            })
        },
        //学完的列表
        endlists(){
            this.studyed = [];
            this.util.postAjax({
                code: code.base,
                url: code.userStudyed,
            }).then(res => {
                res.items.forEach(e=>{
                    var obj = {id:e.lsourceid};
                    this.studyed.push(obj);
                    var obj = {};
                    this.studyed = this.studyed.reduce((cur,next) => {
                        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                        return cur;
                    },[]) //设置cur默认类型为数组，并且初始值为空的数组
                })
            })
        },
         //获取在线学习不分页列表
        studylistAll(campusId){
            this.studyed = [];
            this.util.postAjax({
                code: code.base,
                url: code.userStudyed,
            }).then(res => {
                res.items.forEach(e=>{
                    var obj = {id:e.lsourceid};
                    this.studyed.push(obj);
                    var obj = {};
                    this.studyed = this.studyed.reduce((cur,next) => {
                        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                        return cur;
                    },[]) //设置cur默认类型为数组，并且初始值为空的数组
                })
                this.util.postAjax({
                    code:code.base,
                    url:code.listAll,
                    data:{
                        readerType:this.personinfo.readerType,
                        campusId:campusId
                    }//campusId 校区ID 
                }).then(res => {
                    this.studylist = res.items;
                    var listall = [];
                    if(this.studylist.length>0){
                        this.studylist.forEach(e=>{
                            if(window.base.needstudy){
                                if(e.isNeedstudy == 0){
                                    this.studyed.push({id:e.id})
                                    return
                                }
                            }
                            // this.studyed.forEach(ee=>{
                            //     if(e.isNeedstudy==0 && window.base.needstudy){
                            //         if(ee.id != e.id){
                            //             this.studyed.push({id:e.id})
                            //             return
                            //         }
                            //     }
                            // })
                            var obj = {
                                id:e.id
                            }
                            listall.push(obj)
                        })
                    }
                    var obj = {};
                    this.studyed = this.studyed.reduce((cur,next) => {
                        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
                        return cur;
                    },[]) //设置cur默认类型为数组，并且初始值为空的数组
                    var flag = 0;
                    listall.forEach(e=>{
                        this.studyed.forEach(ee=>{
                            if(e.id == ee.id){
                                flag ++
                            }
                        })
                    })
                    if(listall.length==flag){
                        this.isStudyed = true;
                    }else{
                        this.isStudyed = false;
                    }
                    // if(this.studyed.length >= this.studylist.length){//表示已经学完了
                    //     this.isStudyed = true;
                    // }else{
                    //     this.isStudyed = false;
                    // }
                });
            })
        },
        // 试卷列表
        examLists(){
            this.util.postAjax({
                code:code.base,
                url:code.userInfo,
                isRep:true,
                data:{}
            }).then(res=>{
                this.personinfo = res.item;
                if(this.personinfo.readerFlag==2 && this.nh){
                    return
                }
                if(this.personinfo.readerFlag==1){//表示老生或者新生
                    this.readerFlag_show = true;
                }else{
                    if(this.personinfo.ispass==1){
                        this.ispass_show = true;
                    }
                }
                this.util.postAjax({
                    code:code.base,
                    url:code.ruleslist,
                    data:{
                        code:'ISLEARNNUMOPEN'//是否顺序阅读
                    }
                }).then(res1=>{
                    if(res1.item.rval=='1'){
                        this.islearnnum = true;
                        this.studylistAll(res.item.campusId)
                    }else{
                        this.islearnnum = false;
                    }
                })
                //获取在线学习列表
                // this.studylistAll(res.item.campusId)
                //获取考试的试题的套数
                this.util.postAjax({
                    code:code.base,
                    url:code.getExam,
                    data:{campusId:res.item.campusId,userType:res.item.readerType}//campusId 校区ID ,userType 读者类型
                }).then(res => {
                    if(res.success){
                        if(res.items){
                            this.exam_pt = [];
                            this.exam_mn = [];
                            //根据试卷的类型，改变背景色
                            res.items.forEach(element => {
                                if(element.testType == 2){//testType 1.普通考试 2.模拟考试 3.闯关考试  4.开卷考试
                                    this.exam_mn.push(element)
                                }else{
                                    this.needtime = element.needstudytime;
                                    this.exam_pt.push(element)
                                }
                            });
                        }
                    }
                });

            })
        },
        //鼠标事件
        in_exam(i){
            this.$refs.pt_exam_1[i].setAttribute('class','pt_exam_ exam_bac')
        },
        out_exam(i){
            this.$refs.pt_exam_1[i].setAttribute('class','pt_exam_')
        },
        in_exam2(i){
            this.$refs.pt_exam_2[i].setAttribute('class','pt_exam_ exam_bac')
        },
        out_exam2(i){
            this.$refs.pt_exam_2[i].setAttribute('class','pt_exam_')
        },
        in_exam3(i){
            this.$refs.pt_exam_3[i].setAttribute('class','pt_exam_ exam_bac')
        },
        out_exam3(i){
            this.$refs.pt_exam_3[i].setAttribute('class','pt_exam_')
        },
        //获取本地ip
        getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
            //compatibility for firefox and chrome
            var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            var pc = new myPeerConnection({
                iceServers: []
            }),
            noop = function() {},
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key;
        
            function iterateIP(ip) {
                if (!localIPs[ip]) onNewIP(ip);
                localIPs[ip] = true;
            }
        
            //create a bogus data channel
            pc.createDataChannel("");
        
            // create offer and set local description
            pc.createOffer().then(function(sdp) {
                sdp.sdp.split('\n').forEach(function(line) {
                    if (line.indexOf('candidate') < 0) return;
                    line.match(ipRegex).forEach(iterateIP);
                });
                
                pc.setLocalDescription(sdp, noop, noop);
            }).catch(function(reason) {
                // An error occurred, so handle the failure to connect
            });
            //sten for candidate events
            pc.onicecandidate = function(ice) {
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
                ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
            };
        },
        ipToNumber(ip) {  
            var numbers = ip.split(".");  
            return parseInt(numbers[0])*256*256*256 +   
            parseInt(numbers[1])*256*256 +   
            parseInt(numbers[2])*256 +   
            parseInt(numbers[3]);  
        }  ,
        //去考试
        goexam(obj){
            if(this.isfirstlogin=='1'){//表示是第一次登录
                this.ismnExam = 'pt';
                this.firstmeng = true;
                this.examitem = obj;
                return;
            }
            if(window.base.nh && this.personinfo.readerFlag=='2'){
                this.$message.error('你的校园卡图书馆权限处于挂失状态，请到图书馆证籍处处理。');
                return;
            }
            if(this.isipoepn=='1'){
                var iparr = this.iprange.split('-');
                var min = this.ipToNumber(iparr[0]);
                var max = this.ipToNumber(iparr[1]);
                var mynum = this.ipToNumber(this.localip);
                if(mynum<=max && mynum>=min){//在ip范围内
                    if(obj.needstudytime){
                        if(obj.needstudytime>this.studytime){
                            this.$message({
                                message: '请先学习后再考试',
                                type: 'warning'
                            });
                            return
                        }
                    }
                    var endtime = obj.validEnd.replace(/-/g,'/');
                    if(new Date(obj.validStart.replace(/-/g,'/')).getTime()>new Date().getTime()){
                        this.$message({
                            message: '未到考试开始时间',
                            type: 'warning'
                        });
                        return;
                    }else if((new Date(endtime).getTime()+24*60*60*1000)< new Date().getTime()){
                        this.$message({
                            message: '考试已经结束',
                            type: 'warning'
                        });
                        return;
                    }else{
                        //two:2 有错题回顾   3 一题一题分析
                        //testType  考试形式：1.普通考试 2.模拟考试   3.闯关考试  4.开卷考试
                        if(obj.testType==1){
                            if(obj.resultType==1){
                                obj.two = '1';
                            }else{//一直到最后才会有分析
                                obj.two = '2'
                            }
                        }else if(obj.testType==2){
                            if(obj.resultType==1){
                                obj.two = '1'
                            }else if(obj.resultType==2){
                                obj.two = '2'
                            }else{
                                obj.two = '3'
                            }
                        }
                    }
                    obj.questionList.sort((a,b)=>{
                        if (a.quesType =='1') {
                            return -1;
                        } else if (a.quesType =='2') {
                            return 0;
                        } else {
                            return 1;
                        }
                    })
                    window.sessionStorage.setItem('examdetail',JSON.stringify(obj));
                    this.$router.push('examing')
                }
                // else{
                //     this.$message({
                //         message: '请到'+this.examadd+'考试',
                //         type: 'warning'
                //     });
                //     return
                // }
            }else{
                if(obj.needstudytime){
                    if(obj.needstudytime>this.studytime){
                        this.$message({
                            message: '请先学习后再考试',
                            type: 'warning'
                        });
                        return
                    }
                }
                var endtime = obj.validEnd.replace(/-/g,'/');
                if(new Date(obj.validStart.replace(/-/g,'/')).getTime()>new Date().getTime()){
                    this.$message({
                        message: '未到考试开始时间',
                        type: 'warning'
                    });
                    return;
                }else if((new Date(endtime).getTime()+24*60*60*1000)< new Date().getTime()){
                    this.$message({
                        message: '考试已经结束',
                        type: 'warning'
                    });
                    return;
                }else{
                    //two:2 有错题回顾   3 一题一题分析
                    //testType  考试形式：1.普通考试 2.模拟考试   3.闯关考试  4.开卷考试
                    if(obj.testType==1){
                        if(obj.resultType==1){
                            obj.two = '1';
                        }else{//一直到最后才会有分析
                            obj.two = '2'
                        }
                    }else if(obj.testType==2){
                        if(obj.resultType==1){
                            obj.two = '1'
                        }else if(obj.resultType==2){
                            obj.two = '2'
                        }else{
                            obj.two = '3'
                        }
                    }
                }
                obj.questionList.sort((a,b)=>{
                    if (a.quesType =='1') {
                        return -1;
                    } else if (a.quesType =='2') {
                        return 0;
                    } else {
                        return 1;
                    }
                })

                
                
                window.sessionStorage.setItem('examdetail',JSON.stringify(obj));
                this.$router.push('examing')
            }
        },
        goexam1(){
            this.$message({
                message: '请先学习后再考试',
                type: 'warning'
            });
            return
        },
        goexam_mn(obj){
            if(this.isfirstlogin=='1'){//表示是第一次登录
                this.ismnExam = 'mn';
                this.firstmeng = true;
                this.examitem = obj;
                return;
            }
            if(window.base.nh && this.personinfo.readerFlag=='2'){
                this.$message.error('你的校园卡图书馆权限处于挂失状态，请到图书馆证籍处处理。');
                return;
            }
            if(obj.needstudytime){
                if(obj.needstudytime>this.studytime){
                    this.$message({
                        message: '请先学习后再考试',
                        type: 'warning'
                    });
                    return
                }
            }
            var endtime = obj.validEnd.replace(/-/g,'/');
            if(new Date(obj.validStart.replace(/-/g,'/')).getTime()>new Date().getTime()){
                this.$message({
                    message: '未到考试开始时间',
                    type: 'warning'
                });
                return;
            }else if((new Date(endtime).getTime()+24*60*60*1000)< new Date().getTime()){
                this.$message({
                    message: '考试已经结束',
                    type: 'warning'
                });
                return;
            }else{
                //two:2 有错题回顾   3 一题一题分析
                //testType  考试形式：1.普通考试 2.模拟考试   3.闯关考试  4.开卷考试
                if(obj.testType==1){
                    if(obj.resultType==1){
                        obj.two = '1';
                    }else{//一直到最后才会有分析
                        obj.two = '2'
                    }
                }else if(obj.testType==2){
                    if(obj.resultType==1){
                        obj.two = '1'
                    }else if(obj.resultType==2){
                        obj.two = '2'
                    }else{
                        obj.two = '3'
                    }
                }
            }
            obj.questionList.sort((a,b)=>{
                if (a.quesType =='1') {
                    return -1;
                } else if (a.quesType =='2') {
                    return 0;
                } else {
                    return 1;
                }
            })
            window.sessionStorage.setItem('examdetail',JSON.stringify(obj));
            this.$router.push('examing')
        },
        gofight(obj){
            if(this.isfirstlogin=='1'){//表示是第一次登录
                this.ismnExam = 'cg';
                this.firstmeng = true;
                this.examitem = obj;
                return;
            }
            if(window.base.nh && this.personinfo.readerFlag=='2'){
                this.$message.error('你的校园卡图书馆权限处于挂失状态，请到图书馆证籍处处理。');
                return;
            }
            if(this.isipoepn=='1'){
                var iparr = this.iprange.split('-');
                var min = this.ipToNumber(iparr[0]);
                var max = this.ipToNumber(iparr[1]);
                var mynum = this.ipToNumber(this.localip);
                if(mynum<=max && mynum>=min){//在ip范围内
                    if(obj.needstudytime){
                        if(obj.needstudytime>this.studytime){
                            this.Toast('请先学习后再考试');
                            return
                        }
                    }
                    var endtime = obj.validEnd.replace(/-/g,'/');
                    if(new Date(obj.validStart.replace(/-/g,'/')).getTime()>new Date().getTime()){
                        this.$message({
                            message: '未到考试开始时间',
                            type: 'warning'
                        });
                        return;
                    }else if((new Date(endtime).getTime()+24*60*60*1000)< new Date().getTime()){
                        this.$message({
                            message: '考试已经结束',
                            type: 'warning'
                        });
                        return;
                    }else{
                        window.sessionStorage.setItem('fightdetail',JSON.stringify(obj));
                        this.$router.push('fightexaming')
                    }
                }else{
                    this.$message({
                        message: '请到'+this.examadd+'考试',
                        type: 'warning'
                    });
                    return
                }
            }else{
                if(obj.needstudytime){
                    if(obj.needstudytime>this.studytime){
                        this.Toast('请先学习后再考试');
                        return
                    }
                }
                var endtime = obj.validEnd.replace(/-/g,'/');
                if(new Date(obj.validStart.replace(/-/g,'/')).getTime()>new Date().getTime()){
                    this.$message({
                        message: '未到考试开始时间',
                        type: 'warning'
                    });
                    return;
                }else if((new Date(endtime).getTime()+24*60*60*1000)< new Date().getTime()){
                    this.$message({
                        message: '考试已经结束',
                        type: 'warning'
                    });
                    return;
                }else{
                    window.sessionStorage.setItem('fightdetail',JSON.stringify(obj));
                    this.$router.push('fightexaming')
                }
            }
        },
        //考试时间查询
        lrecordqueryUserRecord(){
            this.util.postAjax({
                code:code.base,
                url:code.lrecordqueryUserRecord,
            }).then(res => {
                this.studytime = res.studytime
            });
        }
    },
    beforeMount(){
        this.getUserIP((ip)=>{
            this.localip = ip;
            this.isipopen();
        });
    },
    created () {
        this.isfirstlogin = window.sessionStorage.getItem('isfirstlogin');
        this.lrecordqueryUserRecord();
        this.examLists();
    }
}
</script>
<style scoped>
.first_meng{
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.6);
  position: fixed;
  top: 0;
  left: 0;
}
.first_meng>div{
  width: 648px;
  height: 704px;
  background: #FFFFFF;
  border-radius: 10px;
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 40px;
  padding-bottom: 24px;
  box-sizing: border-box;
}
 .first_meng>div>h3{
  width: 396px;
  height: 22px;
  background: url(../../../static/img/title_.png) no-repeat center center;
  background-size: contain;
  margin: 0 auto 40px;
}
.first_meng>div>i{
  display: inline-block;
  width: 16px;
  height: 16px;
  background: #878787;
  opacity: 0.69;
  position: absolute;
  right: 40px;
  top: 43px;
  background: url(../../../static/img/close.png) no-repeat center center;
  background-size: contain;
}
.first_content{
  width: 100%;
  height: calc(100% - 178px);
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  overflow: auto;
}
.first_content>p{
  margin-bottom: 10px;
}

.first_bottom{
  width: 100%;
  height: 116px;
  position: absolute;
  bottom: 0;
  left: 0;
  padding:0 40px;
  box-sizing: border-box;
}
.first_bottom>p{
  width: 100%;
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}
.first_bottom>p>i{
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url(../../../static/img/noselect.png) no-repeat center center;
  background-size: contain;
  float: left;
  margin-top: 2.5px;
  margin-right: 6px;

}
.first_bottom>p>i.selected{
  background: url(../../../static/img/selected.png) no-repeat center center;
  background-size: contain;
}


.first_bottom>button{
  width: 180px;
  height: 36px;
  background: #EEEEEE;
  font-size: 16px;
  font-weight: 500;
  color: #CCCCCC;
  line-height: 36px;
  border: none;
  outline: none;
  border-radius: 36px;
  margin-top: 24px;
  margin-left: calc(50% - 90px);
}
.first_bottom>button.selected{
  background: linear-gradient(90deg, #2DABFF 0%, #1472FF 100%);
  color: #fff;
} 
.noexamlist{
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin-top: 20px;
}
.exam_condition{
    width: 100%;
    margin: 20px 0;
    font-size:14px;
    font-weight:400;
    color:rgba(254,62,97,1);
    line-height:20px;
}
.exam_condition i{
    display: inline-block;
    width:18px;
    height:18px;
    background: url(../../../static/img/complete.png) no-repeat center center;
    background-size: cover;
}
.line{
    border: .5px solid #D5D6D6;
    margin-top: 30px;
}
.exam_end{
    width:100%;
    height:25px;
    font-size:18px;
    font-weight:500;
    color:rgba(0,176,155,1);
    line-height:25px;
    letter-spacing:1px;
    margin: 40px 0 20px 0;
}
.exam_end_img{
    width: 100%;
    height: calc(100% - 340px);
    background: url(../../../static/img/exam_endback.png) no-repeat center center;
    background-size: cover;
    position: relative;
}
.loading{
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    color: #000;
}
.exam_end_img_{
    width:509px;
    height:263px;
    position: absolute;
    margin: auto;
    background: url(../../../static/img/exam_card.png) no-repeat center center;
    background-size: cover;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 50px;
    box-sizing: border-box;
}
.exam_end_img_>h3{
    width:100%;
    height:40px;
    font-size:28px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:40px;
}
.exam_end_img_>p{
    width:100%;
    height:33px;
    font-size:24px;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:33px;
    letter-spacing:1px;
    margin-top: 30px;
}
.exam_content_{
    width: 1100px;
    height: 100%;
    background: #fff;
    margin: 0 auto;
    padding: 20px;
    padding-bottom: 40px;
    box-sizing: border-box;
    /* overflow: auto; */
}
.exam_content_img{
    width: 100%;
    height:232px;
    background:url(../../../static/img/exam.png) no-repeat center center;
    background-size: cover;
}
.pt_exam,.moni_exam,.cg_exam{
    width:100%;
    height:22px;
    font-size:16px;
    font-weight:500;
    color:rgba(19,20,21,1);
    line-height:22px;
    margin-top: 40px;
}
.pt_exam>i,.moni_exam>i,.cg_exam>i{
    display: inline-block;
    width:22px;
    height:22px;
    background:url(../../../static/img/putong.png) no-repeat center center;
    background-size: cover;
    float: left;
    margin-right: 10px;
}
.moni_exam>i{
    background:url(../../../static/img/moni.png) no-repeat center center;
    background-size: cover;
}
.cg_exam>i{
    background:url(../../../static/img/fight.png) no-repeat center center;
    background-size: cover;
}
.pt_exam_{
    width:100%;
    height:130px;
    background:rgba(255,255,255,1);
    border-radius:5px;
    border:1px solid rgba(216,218,219,1);
    margin-top: 20px;
}
.pt_exam_.exam_bac{
    background:rgba(205,225,255,0.4);
    box-shadow:0px 0px 10px 0px rgba(221,231,240,1);
    border:1px solid rgba(26,119,255,1);
}
.pt_exam_>div{
    float: left;
}
.pt_eaxm_left{
    width: calc(100% - 213px);
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
}
.pt_eaxm_left>h3{
    width:100%;
    /* height:25px; */
    font-size:18px;
    font-weight:500;
    color:rgba(31,35,47,1);
    line-height:25px;
    letter-spacing:1px;
}
.pt_eaxm_left>p{
    width:100%;
    height:20px;
    font-size:14px;
    font-weight:400;
    color:rgba(98,101,109,1);
    line-height:20px;
    letter-spacing:1px;
}
.pt_eaxm_left>p>span{
    margin: 0 30px;
}
.pt_eaxm_left>p>span:first-of-type{
    margin: 0;
}
.pt_eaxm_left>p.pt_exam_time{
    width:100%;
    height:20px;
    font-size:14px;
    font-weight:400;
    color:rgba(31,35,47,1);
    line-height:20px;
    letter-spacing:1px;
    margin: 10px 0;
}
.pt_exam_time>i{
    display: inline-block;
    width:20px;
    height:20px;
    background:url(../../../static/img/exam_time.png) no-repeat center center;
    background-size: cover;
    float: left;
    margin-right: 12px;
}
.pt_eaxm_right{
    width: 213px;
    height: 100%;
    position: relative;
    /* padding: calc(25% - 20px) 0;
    box-sizing: border-box;
    text-align: center; */
}
.pt_eaxm_right>span{
    display: inline-block;
    width:133px;
    height:40px;
    background:rgba(20,114,255,1);
    border-radius:5px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    cursor: pointer;
}
.pt_eaxm_right>span.noinip{
    background:rgba(216,218,219,1);
    border-radius:5px;
    color:rgba(184,187,190,1);
}
.pt_eaxm_right>.noexam{
    padding: calc(25% - 20px) 0;
    box-sizing: border-box;
    text-align: center;
}
.pt_eaxm_right>p{
    width:100%;
    height:20px;
    font-size:14px;
    font-weight:400;
    color:rgba(254,62,97,1);
    line-height:20px;
    margin-top: calc(50% - 20px);
    text-align: center;
}
.pt_eaxm_right>.noexam>span{
    background:rgba(216,218,219,1);
    border-radius:5px;
    color:rgba(184,187,190,1);
    display: inline-block;
    width:133px;
    height:40px;
    text-align: center;
    line-height: 40px;
    background:rgba(216,218,219,1);
    border-radius:5px;
    color:rgba(184,187,190,1);
    /* opacity:0.3; */

}
</style>