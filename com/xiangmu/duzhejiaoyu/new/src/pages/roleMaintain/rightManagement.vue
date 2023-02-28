<template>
    <div class="common-content">
        <!-- <div>权限管理</div> -->
        <el-breadcrumb separator="/" style="margin:10px 0 25px">
            <el-breadcrumb-item :to="{ path: '/roleMatain' }">角色维护</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="rightList" >
            <div v-for="(item,index) in rightList" :key="index">
                <div class="title"><input type="checkbox" class="my-checkbox" :checked="item.checked" @change="checkboxChange(item)">{{item.NAME}}</div>
                <div class="box" >
                    <span class="item" v-for="(i,k) in item.subItems" :key="k"><input type="checkbox" class="my-checkbox" :checked="i.checked" @change="innerCheckboxChange(i,item)">{{i.NAME}}</span>
                </div>
            </div>

            <div>
                <input type="checkbox" @change="checkAll" :checked="checkedAll" class="my-checkbox">全选
            </div>    

            <el-button type="primary" size="mini" @click="save" style="margin-top:20px">保存</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        ROLEID:String
    },

    data(){
        return{
            loading:false,
            rightList:[],  
            checkedAll:false,  

        }
    },

    methods: {
        // 全选
        checkAll(){
            this.checkedAll = !this.checkedAll;
            this.rightList.forEach(v => {

                if(this.checkedAll){
                    v.checked = true;
                    if(v.subItems){
                        v.subItems.forEach(m => {
                            m.checked = true;
                        })
                    }
                }else{
                    v.checked = false;
                    if(v.subItems){
                        v.subItems.forEach(m => {
                            m.checked = false;
                        })
                    }
                }
                
            })
        },

        // 二级选中事件
        innerCheckboxChange(i,item){
            i.checked = !i.checked;
            
            if(i.checked){
                item.checked = true;
                this.$forceUpdate();
            }

            this.isCheckAll(this.rightList);

        },

        // 一级选中事件
        checkboxChange(item){
            item.checked = !item.checked;

            if(item.checked == false && item.subItems){
                item.subItems.forEach(v => {
                    v.checked = false;
                    this.$forceUpdate();
                })
            };

            this.isCheckAll(this.rightList);
        },

        //保存
        save(){
            // console.log(this.rightList);
            let arr=[];
            this.rightList.forEach(v => {
                if(v.checked){
                    arr.push(v.ID);
                }

                if(v.subItems){
                    v.subItems.forEach(m => {
                        if(m.checked){
                            arr.push(m.ID);
                        }
                       
                    })
                }
            })

             this.util.postAjax({
                code:this.global.authCode,
                url:"/Role/selectResBatch",
                data:{
                    data:JSON.stringify({
                        ROLEID:this.ROLEID,
                        RESIDs:arr
                    })
                }
            }).then(res => {
                // console.log(res)

                if(res.success){
                    this.$message({
                        type:"success",
                        message:"保存成功"
                    });

                    this.$router.push("/roleMatain")
                }
            })

            // console.log(arr)

        },

        isCheckAll(arr){
             // 判断是否全选
                        let List=JSON.parse(JSON.stringify(arr));
                        let i=0;
                        let j=0;

                        // console.log(List);
                        List.forEach(v => {
                            i++;
                            if(v.checked){
                                j++;
                            }
                            if(v.subItems){
                                v.subItems.forEach(m => {
                                     i++;
                                    if(m.checked){
                                         j++;
                                    }
                                })
                            }
                        })

                        if(i == j){
                            this.checkedAll=true;
                        }else{
                            this.checkedAll=false;
                        }
        },

         // 获取列表
            getList(){
                this.loading=true;
                this.util.postAjax({
                    code:this.global.authCode,
                    url:"/Role/roleResTree",
                    data:{
                        ROLEID:this.ROLEID
                    }
                }).then((res) =>{
                    this.loading=false;
                    if(res.success && res.items){
                        let arr=[];
                        res.items.forEach(v => {
                            if(v.subItems){
                                v.subItems.forEach(m => {
                                    arr.push(m)
                                    // if(m.subItems){
                                        
                                    // }
                                })
                                
                            }
                        })

                        this.rightList=arr;

                        this.rightList.forEach(v=> {
                            if(!v.checked){
                                v.checked=false;
                            }
                            
                            if(v.subItems){
                                v.subItems.forEach(m => {
                                if(!m.checked){
                                    m.checked=false;
                                }
                            })
                            }
                            
                        })

                        this.isCheckAll(this.rightList);

                       
                    }
                })
            }
    },

    created() {
        // console.log(this.ROLEID);
        this.getList();
    },
}
</script>

<style scoped>
    .rightList .title{
        background:#f9f9f9;
        line-height:35px;
        padding:0 10px
    }

    .rightList input{
        margin-right:10px
    }

    .rightList .box{
        padding: 10px 40px
    }

    .rightList .box .item{
        margin-right:20px;
        margin-bottom:15px
    }
</style>