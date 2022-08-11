var addWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width: 550,
    height: 500,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[addForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
                document.getElementById(this.addWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons:[new Ext.Button({
    text:'保存',
    
      listeners:{
        click:function(){
          if(addForm.getForm().isValid()){
            var formValues=addForm.getValues();
            
            // if(formValues.ENDYEAR==''){

            // }else{
            //     formValues.ENDYEAR=formValues.ENDYEAR.format('Ymd');
            // }
            Ext.Ajax.request({
                url:urls+'Geography/save',
                method:'post',
                params:{data:JSON.stringify(formValues)},
                success:function(conn, response, options){
                    if(errbyextjs(conn)){
                        addForm.getForm().getEl().dom.reset();
                        
                        Ext.getCmp('CenterGrid-MainPT').doLoad(0);
                        addWindow.hide();
                    }
                
                }
            });
          }
        }
      }
    })]

});
