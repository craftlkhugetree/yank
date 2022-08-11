var addWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width: 550,
    height: 360,
    plain:true, 
    cls:"ak-form",
    modal: true,
    closeAction :"hide", 
    layout   : 'fit',
    items:[addTwoDimeForm],
    bodyStyle :"overflow-x:hidden;overflow-y:auto",
    buttons:[new Ext.Button({
      text:'保存',
      listeners:{
        click:function(){
          if(addTwoDimeForm.getForm().isValid()){
            var formValues=addTwoDimeForm.getForm().getValues();
            var data=JSON.stringify(formValues);
            Ext.Ajax.request({
                url:urls+'Event/save',
                method:'post',
                params:{data:data},
                success:function(conn, response, options){
                        addTwoDimeForm.getForm().getEl().dom.reset();
                        Ext.getCmp('CenterGrid-MainPT').doLoad(0);
                        addWindow.hide();
                }
            })
          }
        }
      }
    })]

});