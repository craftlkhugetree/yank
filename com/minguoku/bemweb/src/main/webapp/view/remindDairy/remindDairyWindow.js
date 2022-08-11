var addWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width: 480,
    height: 120,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[addForm],
    buttons:[new Ext.Button({
    text:'保存',
    
      listeners:{
        click:function(){
          if(addForm.getForm().isValid()){
            var formValues=addForm.getForm().getValues();
            delete formValues.ADDRESS_NAME;
      
            Ext.Ajax.request({
                url:urls+'Sites/save',
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
