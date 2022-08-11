var orgWindow = new Ext.Window({            // 主页面的添加和修改
    border:true,
   
    width    : 500,
    height   : 300,
    plain:true, 
    cls:"ak-form",
    // autoScroll:true,
   
    modal: true,
    //border : false,
    closeAction :"hide", //重要：在同一个实体时 
    layout   : 'fit',
    items:[AddOrgForm],
    buttons:[new Ext.Button({
    text:'保存',
      listeners:{
        click:function(){
          if(AddOrgForm.getForm().isValid()){
            var formValues=AddOrgForm.getForm().getValues();
            delete formValues.orgname;
            var data=JSON.stringify(formValues);
            Ext.Ajax.request({
                url:urls+'Org/save',
                method:'post',
                params:{auth:json_data,data:data},
                success:function(conn, response, options){
                    AddOrgForm.getForm().getEl().dom.reset();
                    eastTreeStore.load(Ext.getCmp('sys-user-org-tree').getRootNode(),function(){

                    });
                   
                    orgWindow.hide();
                
                }
            })
          }
        }
      }
    })]

});
var addWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width: 600,
    height: 500,
    layout: 'fit',
    bodyStyle :"overflow-x:hidden;overflow-y:auto",
    plain:true, 
    cls:"ak-form",
    //autoScroll:true,
    modal: true,
    //border : false,
    closeAction :"hide", //重要：在同一个实体时 
    items:[addForm],
    buttons:[new Ext.Button({
    text:'保存',
      listeners:{
        click:function(){
          if(addForm.getForm().isValid()){
            var formValues=addForm.getForm().getValues();
            formValues.INTOSCHOOLTIME=formValues.INTOSCHOOLTIME.replace(new RegExp(/(:)/g),"").replace(new RegExp(/(-)/g),"").replace(/\s+/g,"");;
            delete formValues.ORGNAME;
            var data=JSON.stringify(formValues);
            Ext.Ajax.request({
                url:urls+'User/save',
                method:'post',
                params:{auth:json_data,data:data},
                success:function(conn, response, options){
                    addForm.getForm().getEl().dom.reset();
                    // eastTreeStore.load(Ext.getCmp('sys-user-org-tree').getRootNode(),function(){

                    // });
                    Ext.getCmp('sys-roleMainPT').doLoad(0);
                    addWindow.hide();
                
                }
            })
          }
        }
      }
    })]

});

var password=new Ext.Window({            // 主页面的添加和修改
    border:true,
   
    width    : 300,
    height   : 120,
    plain:true, 
    cls:"ak-form",
    // autoScroll:true,
   
    modal: true,
    //border : false,
    closeAction :"hide", //重要：在同一个实体时 
    layout   : 'fit',
    items:[passwordForm],
    buttons:[new Ext.Button({
    text:'保存',
      listeners:{
        click:function(){
          if(passwordForm.getForm().isValid()){
            var formValues=passwordForm.getForm().getValues();
            
            var data=JSON.stringify(formValues);
            Ext.Ajax.request({
                url:urls+'User/saveUserPwd',
                method:'post',
                params:{auth:json_data,data:data},
                success:function(conn, response, options){
                    passwordForm.getForm().getEl().dom.reset();
                    // eastTreeStore.load(Ext.getCmp('sys-user-org-tree').getRootNode(),function(){

                    // });
                    Ext.getCmp('sys-roleMainPT').doLoad(0);
                    password.hide();
                
                }
            })
          }
        }
      }
    })]

});
//编辑的表单
var addEditWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
   
    width    : 500,
    height   : 350,
    plain:true, 
    cls:"ak-form",
    // autoScroll:true,
    title:'编辑人员',
    modal: true,
    //border : false,
    closeAction :"hide", //重要：在同一个实体时 
    layout   : 'fit',
    items:[addEditForm],
    buttons:[new Ext.Button({
    text:'保存',
      listeners:{
        click:function(){
          if(addEditForm.getForm().isValid()){
            var formValues=addEditForm.getForm().getValues();
            delete formValues.ORGNAME;
            var data=JSON.stringify(formValues);
            Ext.Ajax.request({
                url:urls+'User/save',
                method:'post',
                params:{auth:json_data,data:data},
                success:function(conn, response, options){
                    addEditForm.getForm().getEl().dom.reset();
                    // eastTreeStore.load(Ext.getCmp('sys-user-org-tree').getRootNode(),function(){

                    // });
                    Ext.getCmp('sys-roleMainPT').doLoad(0);
                    addEditWindow.hide();
                
                }
            })
          }
        }
      }
    })]

});