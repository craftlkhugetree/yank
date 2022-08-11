/*
*2016-9-21 表单验证~
* standard--标准验证 都要加上防止非法字符
* phone--手机号码验证
 */
Ext.apply(Ext.form.VTypes, {
	checkParam:{max:10,min:1,unsafeChar:'!@#$%^&*=^'},
	standard:function(val,field){ 
	 
        //使用字符串做比较  
        var fibdn,ret;  
        if(this.checkParam && this.checkParam.unsafeChar){  
            fibdn = this.checkParam.unsafeChar;  
        }else if(this.checkParam && !this.checkParam.unsafe) {  
            fibdn = " '\\\"`$&<>#+%@|~!=^?;";  
        }else{  
            return true;  
        }  
        for ( var i=0; i<val.length; i++ ){  
            ret = fibdn.indexOf( val.charAt(i) );  
            if( ret!=-1 ){  
                field.vtypeText = '有特殊字符，请重新输入';  
                return false;  
            }  
        }  
        return true;  
  },
  phone:function(value){
    	return this.phoneRe.test(value);
    },
  phoneRe:/^((\d{3,4}-)*\d{7,8}(-\d{3,4})*|1\d{10})$/,
  phoneText : '手机号码必须由11位的数字组成,如1382111111'    
  
});