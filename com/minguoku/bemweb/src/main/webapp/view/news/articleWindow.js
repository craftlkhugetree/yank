var addWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width    : 800,
    height   : 600,
    plain:true, 
    cls:"ak-form",
    modal: true,
    closeAction :"hide", 
    layout   : 'fit',
    items:[addForm],
    buttons:[new Ext.Button({
    text:'保存',
      listeners:{
        click:function(th){
          if(addForm.getForm().isValid()){
            var formValues=addForm.getForm().getValues();
            formValues.dialogEndTime = formValues.dialogEndTime.replace(new RegExp(/(:)/g), "").replace(new RegExp(/(-)/g), "").replace(/\s+/g, "");
            formValues.content=htmlEditor.html();
            data=JSON.stringify(formValues);
            Ext.Ajax.request({
                url:urls+'wxkNotice/save',
                method:'post',
                params:data,
                headers: { 'Content-Type': 'application/json' },
                success:function(conn, response, options){
                    if(errbyextjs(conn)){
                        addForm.getForm().getEl().dom.reset();
                        Ext.Msg.alert('提示！','保存成功！')
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
