<template>
    <div class="allactivity myactivity_box">
        <div class="allTOP clearfix">
            <van-dropdown-menu class="allTOP_select" >
                <van-dropdown-item v-model="actState" :options="option" @change="changemenu(actState)"/>
            </van-dropdown-menu>
            <van-search class="allTOP_input"
                v-model="searchname"
                @search="onSearch"
                shape="round"
                background="#fff"
                placeholder="请输入搜索关键词"
            />
        </div>
        <van-tabs @click="onClick">
            <van-tab v-for="v in activityType" :key="v.id" :title="v.typeName" >
            </van-tab>
        </van-tabs>
        <van-list
            class="vantlist"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="activityActivitylist"
            >
            <div v-for="(v,i) in activityLists" :key="i" @click="godetail(v.id)">
                <div class="liIMG"  :style="'background:url('+viewIMG+v.actPostImg+') no-repeat center center;background-size:contain;'">
                    <i>{{v.actTypeName}}</i>
                </div>
                <div class="liTEXT">
                    <!-- actState   0未开始报名1报名中2活动进行中3活动结束 -->
                    <h3><span>{{v.actName}}</span></h3>
                    <p>{{v.actLocation}}</p>
                    <p>{{util.formatTime(v.gmtStart,'YYYY-MM-DD hh:mm')}} ~ {{util.formatTime(v.gmtEnd,'YYYY-MM-DD hh:mm')}}</p>
                </div>
            </div>
        </van-list>
    </div>
</template>
<script>
import '../css/activity.css'
import code from '../js/code'
import util from '../js/util'
export default {
    data() {
        return {
            actState: '',
            option: [
                {value: '',text: '全部'},{value: '1',text: '报名中'}, {value: '2',text: '活动进行中'}, {value: '3',text: '活动结束'}
            ],
            activityType: [],
            activityLists:[],
            loading:false,
            finished:false,
            page:1,
            limit:10,
            actState: '', 
            actTypeId: '',
            searchname: '',
            viewIMG:code.imgURL,
        };
    },
    methods: {
        //活动类型
        activityTypelist() {
            util.postAjax({
                code: code.code,
                url: code.activityTypelist,
                data: {
                    typeName: this.searchname,
                }
            }).then(res => {
                if (res.success) {
                    var obj = {
                        id: '',
                        typeName: "全部",
                        checked: true
                    }
                    res.items.unshift(obj);
                    res.items.forEach((e, i) => {
                        if (i == 0) {
                            e.checked = true;
                            this.actTypeId = e.id;
                        } else {
                            e.checked = false;
                        }
                    })
                    this.activityType = res.items;
                }
            })
        },
        //活动列表
        activityActivitylist(){
            this.loading=true;
            util.postAjax({
                code: code.code,
                url: code.activityActivitylist,
                data: {
                    page:this.page,
                    limit:this.limit,
                    actState: this.actState, 
                    actTypeId: this.actTypeId,
                    keyword: this.searchname
                }
            }).then(res => {
                if (res.success && res.items) {
                    this.total = res.total;
                    if(res.items.length < this.limit || res.items.length ==0){
                        this.loading = false;
                        this.finished = true;
                    }else {
                        this.loading = false;
                        this.page++;
                        this.finished = false;
                    }
                    for (var i =0; i< res.items.length;i++){
                        this.activityLists.push( res.items[i]);
                    }
                }else{
                    this.loading=false;
                    this.finished=true;
                    this.activityLists=[];
                    // this.Toast('获取列表失败');
                }
            })
        },
        onClick(name, title){
            this.page = 1;
            this.activityLists=[];
            if(name==0){
                this.actTypeId = '';
            }else{
                this.actTypeId = this.activityType[name].id;
            }
            this.activityActivitylist();
        },
        changemenu(val){
            this.page = 1;
            this.activityLists=[];
            this.actState = val;
            this.activityActivitylist();
        },
        onSearch(val){
            this.searchname = val;
            this.activityLists=[];
            this.activityActivitylist();
        },
        godetail(id){
            this.$router.push({
                path:'activitydetail',
                query:{
                    ID:id
                }
            })
        }
    },
    created () {
        this.activityTypelist();
        this.activityActivitylist();
    }
}
</script>