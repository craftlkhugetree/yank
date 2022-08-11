var addWindow = new Ext.Window({            // 主页面的添加和修改
    border:true,
    bodyBorder :true,
    title:'新增角色',
    width    : 500,
    height   : 200,
    // autoScroll:true,
   
    modal: true,
    //border : false,
    closeAction :"hide", //重要：在同一个实体时 
    layout   : 'fit',
    items:[addRole],
    buttons:[new Ext.Button({
    text:'保存',
      listeners:{
        click:function(){
          if(addRole.getForm().isValid()){
            var formValues=addRole.getForm().getValues();
            var data=JSON.stringify(formValues);
            
            Ext.Ajax.request({
                url:urls+'Role/save',
                method:'post',
                params:{auth:json_data,data:data},
                success:function(conn, response, options){
                addRole.getForm().getEl().dom.reset();
                Ext.getCmp('roleMainPT').doLoad(0)
                addWindow.hide();
                
                }
            })
          }
        }
      }
    })]

});