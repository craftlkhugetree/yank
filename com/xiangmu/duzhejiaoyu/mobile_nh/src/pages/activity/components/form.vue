<template>
    <div style="padding: 10px;
    box-sizing: border-box;">
        <div v-for="(v,i) in formitem" :key="i" class="labelbox">
            <div class="spanbox">
                <i :class="{'requireICON':v.checked}">{{v.checked?'*':''}}</i>
                <span class="labelname">{{v.name}}:</span>
            </div>
            <input :class="{'need':v.need}" v-if="v.eltype==='input'" :readonly="v.disabled" type="text" v-model="v.value" :placeholder="v.placeholder">
            <input :class="{'need':v.need}" v-if="v.eltype==='date'" :readonly="v.disabled" type="date" v-model="v.value" :placeholder="v.placeholder">
            <input :class="{'need':v.need}" v-if="v.eltype==='time'" :readonly="v.disabled" type="time" v-model="v.value" :placeholder="v.placeholder">
            <input :class="{'need':v.need}" v-if="v.eltype==='file'" :readonly="v.disabled" type="file" @change="upload" :placeholder="v.placeholder">
            <span v-if="v.eltype==='radio' && v.children" class="radiobox">
                <van-radio-group v-model="v.value" direction="horizontal">
                    <van-radio  v-for="e in v.children" :key="e.id" :name="e.value" readonly="v.disabled">{{e.value}}</van-radio>
                </van-radio-group>
            </span>
            <span v-if="v.eltype==='checkbox'" class="checkbox">
                <van-checkbox-group v-model="v.value" v-if="v.children" direction="horizontal">
                    <van-checkbox v-for="e in v.children"  :key="e.id" :name="e.value" readonly="v.disabled" shape="square">{{e.value}}</van-checkbox>
                </van-checkbox-group>
            </span>
            <span v-if="v.eltype==='select'" class="selectbox">
                <select v-model="v.value" placeholder="请选择" readonly="v.disabled">
                    <option
                    v-for="item in v.children"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                    </option>
                </select>
            </span>
            <p v-if="v.need">{{v.rules[0].message}}</p>
        </div>
        <div class="formbtn" v-if="isapply==0">
            <van-button class="vantspan" type="default" @click="resetForm()">取消</van-button>
            <van-button class="vantspan" type="info" @click="submitForm">提交</van-button>
        </div>
        <div class="formbtn" v-else>
        </div>
            
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
        },
        isapply:String
    },
    data() {
        return {
            formitem:this.item.formInfo,
        }
    },
    methods: {
        upload(){
            console.log('tag1111')
        },
        isPoneAvailable($poneInput) {
            var myreg=/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            if (!myreg.test($poneInput)) {
                return false;
            } else {
                return true;
            }
        },
        isemailAvailable($email){
            var myreg=/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
            if (!myreg.test($email)) {
                return false;
            } else {
                return true;
            }
        },
        isqqAvailable($QQ){
            var myreg=/^[1-9]\d{4,9}$/;
            if (!myreg.test($QQ)) {
                return false;
            } else {
                return true;
            }
        },
        isnumberAvailable($num){
            var myreg=/^\d+$/;
            if (!myreg.test($num)) {
                return false;
            } else {
                return true;
            }
        },
        changeradio(item){
            item.value = this.GetRadioValue("radio")
        },
        changecheckbox(item,obj){
            item.selected = true;
            obj.children.forEach(e=>{
                if(e.selected){
                    obj.value=obj.value+e.value+';'
                }
            })
        },
        changeselect(item,obj){
            console.log('item,obj', item,obj)
        },
        GetRadioValue(RadioName){  
            var obj;      
            obj=document.getElementsByName(RadioName);  
            if(obj!=null){  
                var i;  
                for(i=0;i<obj.length;i++){  
                    if(obj[i].checked){  
                        return obj[i].value;              
                    }  
                }  
            }  
            return null;  
        }  ,
        submitForm() {
            var flag = 0;
            this.formitem.forEach(e=>{
                e.need = false
                if((!e.value||e.value.length<1) && e.checked){
                    e.need = true;
                    flag ++
                }
                if(e.value && e.checked){
                    if(e.rules[0].pattern){
                        if(e.label=="tel"){
                            if(!this.isPoneAvailable(e.value)){
                                e.need = true;
                                flag ++;
                            }
                        }else if(e.label== "qq"){
                            if(!this.isqqAvailable(e.value)){
                                e.need = true;
                                flag ++
                            }
                        }else if(e.label== "email"){
                            if(!this.isemailAvailable(e.value)){
                                e.need = true;
                                flag++
                            }
                        }else if(e.label== "number"){
                            if(!this.isnumberAvailable(e.value)){
                                e.need = true;
                                flag ++
                            }
                        }else if(e.label== "radio"){
                            console.log('tag', this.GetRadioValue("radio"))
                            if(!this.GetRadioValue("radio")){
                                e.need = true;
                                flag ++
                            }
                        }else if(e.label== "checkbox"){
                            console.log('e', e)
                            if(!e.value){
                                e.need = true;
                                flag ++
                            }
                        }
                    }
                }
            })
            this.$forceUpdate();
            if(flag<1){
                this.$emit('submitform',this.formitem)
            }

        },
        resetForm(){
            this.formitem.forEach(e=>{
                e.value = ""
            })
        }
    },
    created () {
        console.log(this.item)
    }
}
</script>
<style scoped>
.spanbox{
    width: 100px;
    float: left;
    position: relative;
}
.formbtn{
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
    z-index: 9999;
}
.formbtn>.vantspan{
    display: inline-block;
    width: 50%;
    height: 100%;
    float: left;
}
.checkbox{
    display: inline-block;
}
.radiobox>span,.checkbox>span{
    margin-right: 24px;
}
.selectbox select,.selectbox option{
    width: 100px;
    height: 40px;
}
.labelbox>i{
    display: inline-block;
    width: 5px;
    height: 5px;
    float: left;
    margin-right: 5px;
}
.requireICON{
    display: inline-block;
    width: 5px;
    height: 5px;
    color: red;
    float: left;
    /* margin-right: 5px; */
    border-radius: 50%;
    /* line-height: 40px; */
    position: absolute;
    top: 8px;
}
.labelbox{
    width: 100%;
    min-height: 40px;
    line-height: 40px;
}
.labelbox>p{
    color: red;
    text-indent: 120px;
    font-size: 12px;
}
.labelbox>input{
    /* width: 300px; */
    height: 30px;
    text-indent: 10px;
    font-size: 14px;
    width: calc(100% - 120px);
}
.labelbox>input.need{
    border: 1px solid red;
}
.labelname{
    /* display: inline-block; */
    width: 100px;
    /* width: 28px; */
    height: 22px;
    font-size: 14px;
    /* font-family: PingFangSC-Medium, PingFang SC; */
    font-weight: 500;
    color: #333333;
    line-height: 28px;
    margin-left: 10px;
}
</style>
