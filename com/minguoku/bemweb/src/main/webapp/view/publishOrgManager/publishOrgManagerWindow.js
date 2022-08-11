var addWindow=new Ext.Window({            // 出版社的添加和修改
    border:true,
    width:480,
    height:135,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout:'fit',
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
            var formValues=addForm.getForm().getValues();
      
            Ext.Ajax.request({
                url:urls+'PublishOrg/save',
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

var addressListWindow=new Ext.Window({            //地址列表窗口
        border:true,
        width: 550,
        height: 420,
        plain:true, 
        title:'地址管理',
        cls:"ak-form",
        modal: true,
        bodyStyle:'overflow-x:hidden;overflow-y:auto',
        closeAction :"hide", 
        layout:'fit',
        items:[addressForm,addressGrid]
});

var addressWindow=new Ext.Window({            //增加或编辑地址窗口
        border:true,
        width: 480,
        height: 250,
        plain:true, 
        cls:"ak-form",
        modal: true,
        bodyStyle:'overflow-x:hidden;overflow-y:auto',
        closeAction :"hide", 
        layout:'fit',
        items:[addAddressForm],
        keys:[{
              key:13,  //13代表回车
              fn:function(){
                    document.getElementById(this.addressWindow.buttons[0].id).click();
              },
              scope:this
        }],
        buttons:[{
            text:'保存',
            handler:function(){
                if(addAddressForm.getForm().isValid()){
                    var formValues=addAddressForm.getValues();
                    formValues.SETDATE=formValues.SETDATE.format('Ymd');
                    formValues.ENDDATE=formValues.ENDDATE.format('Ymd');
              
                    Ext.Ajax.request({
                        url:urls+'PublishOrg/saveRes',
                        method:'post',
                        params:{data:JSON.stringify(formValues)},
                        success:function(conn, response, options){
                            if(errbyextjs(conn)){
                                addAddressForm.getForm().getEl().dom.reset();
                                
                                gridfilter={"SEARCH":false,"PUBLISHINGID":publishid};
                                Ext.getCmp('addressMainPT').doLoad(0);
                                addressWindow.hide();
                            }
                        
                        }
                    });
                }
            }
        }]
});
