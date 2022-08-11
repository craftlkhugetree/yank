var addColumnWindow=new Ext.Window({            // 栏目添加和修改
    border:true,
    width    : 400,
    height   : 350,
    plain:true, 
    cls:"ak-form",
    modal: true,
    closeAction :"hide", 
    layout   : 'fit',
    items:[tplView],
    buttons:[new Ext.Button({
    text:'保存',
      listeners:{
        click:function(){
          if(tplView.getForm().isValid()){
            var formValues=tplView.getForm().getValues();
            console.log(formValues);
            var data=JSON.stringify(formValues);
        
            Ext.Ajax.request({
                url:urls+'classify/save',
                method:'post',
                params:{data:data},
                success:function(conn, response, options){
                    if(errbyextjs(conn)){
                        tplView.getForm().getEl().dom.reset();
                        
                        Ext.getCmp('CenterGrid-MainPT').doLoad(0);
                        addWindow.hide();
                    }
                
                }
            })
          }
        }
      }
    })]

});