var orgWindow = new Ext.Window({    // 机构窗口
    border: true,
    width: 550,
    height: 335,
    plain: true,
    cls: "ak-form",
    modal: true,
    closeAction: "hide",
    layout: 'fit',
    bodyStyle: "overflow-x:hidden;overflow-y:auto",
    items:[addOrgForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
               document.getElementById(this.orgWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons: [{
        text:'保存',
        handler:function(){
            if(addOrgForm.getForm().isValid()){
                    var formValues=addOrgForm.getValues();
                    formValues.SETDATE=formValues.SETDATE.format('Ymd');
                    formValues.ENDDATE=formValues.ENDDATE.format('Ymd');
                    
                    Ext.Ajax.request({
                        url:urls+'Org/save',
                        method:'post',
                        params:{data:JSON.stringify(formValues)},
                        success:function(conn, response, options){
                            if(errbyextjs(conn)){
                                addOrgForm.getForm().getEl().dom.reset();
                                
                                CenterGridStore.removeAll();

                                eastTreeStore.load(Ext.getCmp('con-tree-org-combo').getRootNode(),function(){});

                                orgWindow.hide();
                            }
                        
                        }
                    });
          }
        }
    }]
});
