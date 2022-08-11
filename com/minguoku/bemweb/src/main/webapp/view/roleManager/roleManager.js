Ext.onReady(function(){  
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side';    //统一指定错误信息提示方式，在输入栏右侧显示一个突出的出错图标  
        if(Ext.isChrome===true){       
          var chromeDatePickerCSS = ".x-date-picker {border-color: #1b376c;background-color:#fff;position: relative;width: 185px;}";
          Ext.util.CSS.createStyleSheet(chromeDatePickerCSS,'chromeDatePickerStyle');
        }                                              //这个解决了时间控件在google浏览器上不可用的问题
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    // Ext.Ajax.on('requestcomplete', function(conn, response, options, eOpts) {
    
    //     var json = eval('(' + response.responseText + ')'); 
        
    //     if(!(json.success)){
    //         Ext.Msg.alert(json.errmsg);
           
    //       }
    // });
    
    // eastTreeStore.on('beforeload', function(loader, node) {
        
    //     if(json_datatree==undefined){
    //         json_datatree='';
    //         return false;
    //     }  
         
   
    //     this.baseParams.auth = json_data; // 通过这个传递参数，这样就可以点一个节点出来它的子节点来实现异步加载  
    //     this.baseParams.data=json_datatree;
    // }, eastTreeStore); 
    

new Ext.Viewport({ 
    layout:"border", 
    items:[{
        region:"center", //人员表格
        layout:'fit',
        // width:500,
        tbar:[new Ext.Button({
            //id:'addnewvoteforgird',
            text:"新增角色",
            iconCls: 'ak-icon icon-add',
            cls:'ak-btn btn-green ak-auth',
            akfun:'add',
            akfunID:'100021',
            listeners:{
              click:function(){
                addWindow.show();
                addRole.getForm().getEl().dom.reset();
              }
            }
        })],
        items:OrgMainGrid
      },{
        region:'east',
        layout:'form',
        width:850,
        bodyStyle :"overflow-x:hidden;overflow-y:auto",
        items:[addForm,facility],
        bbar:[new Ext.Button({
           // id:'addnewvoteforgird',
            text:"提交",
            cls:'ak-btn btn-blue',
            listeners:{
              click:function(){
                     //保存基本信息
                    var formValues=addForm2.getForm().getValues();
                    var data=JSON.stringify(formValues);
                    if(addForm2.getForm().isValid()){
                            Ext.Ajax.request({
                                url:urls+'Role/save',
                                method:'post',
                                params:{auth:json_data,data:data},
                                success:function(conn, response, options){
                                //addForm2.getForm().getEl().dom.reset();
                                Ext.getCmp('roleMainPT').doLoad(0);
                                }
                            });
                    }
                    Ext.Msg.alert('提示！','正在保存...');
                    //保存权限
                    if(ROLEID){
                               var allselect=facility.items.items[0].items.items;
                               
                              // var allselect=facility.getChecked();
                               var data=[];
                                for(var i=0;i<allselect.length;i++){
                                    var choiceAuth=allselect[i].items.items[1].items.items;
                                   // console.log(allselect[i].items.items[0].items.items[0].value);
                                    
                                    for(var j=0;j<choiceAuth.length;j++){
                                       // console.log(choiceAuth[j]);
                                        //选择权限后放在数组里
                                        if(choiceAuth[j].checked){
                                          data.push(choiceAuth[j].inputValue);

                                        }
                                    }
                                    if(anyTrue(choiceAuth)){   //每一模块只要选一个，就要把这个模块的ID传过去

                                          data.push(allselect[i].items.items[0].items.items[0].value);
                                    }
                                    
                               }
                              var datas={ROLEID:ROLEID,RESID:data};
                              if(formValues.NAME!=''){
                                Ext.Ajax.request({
                                    url:urls+'Role/saveAuth',// 要跳转的url,此为属性必须要有

                                    method:'post',

                                    params:{auth:json_data,data:JSON.stringify(datas)}, // 提交参数

                                    success: function(response, options){
                                        Ext.Msg.hide();
                                        if(errbyextjs(response)){
                                            Ext.Msg.alert('提示！','保存成功！');
                                        }
                                    }, 
                                    failure:function(response, options){
                                       Ext.Msg.alert('网络出错了！');
                                    }
                               });
                            }
                    }else{
                         Ext.Msg.alert('提示！','请先选择角色！');
                    }
                    
             }
            }
        }),'->']
      }]

    });
Ext.getCmp('roleMainPT').doLoad(0);      
});