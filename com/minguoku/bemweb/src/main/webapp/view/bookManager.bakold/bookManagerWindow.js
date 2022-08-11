var addWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width: 620,
    height: 420,
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
            var formValues=addForm.getValues();
            //delete formValues.ADDRESS_NAME;
            Ext.Ajax.request({
                url:urls+'Book/updateBook',
                method:'post',
                params:{data:JSON.stringify(formValues)},
                success:function(conn, response, options){
                    //if(errbyextjs(conn)){
                        addForm.getForm().getEl().dom.reset();
                        
                        Ext.getCmp('CenterGrid-MainPT').doLoad(0);
                        addWindow.hide();
                    //}
                
                }
            });
          }
        }
      }
    })]

});

var lookWindow=new Ext.Window({            // 查看
    border:true,
    width: 620,
    height: 400,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[lookForm]

});

var collectionWindow=new Ext.Window({            // 馆藏管理
    border:true,
    width: 600,
    title:'馆藏管理',
    height: 450,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[collectionGrid]

});

// var collectionAddWindow=new Ext.Window({            // 馆藏管理增加
//     border:true,
//     width: 400,
//     title:'增加',
//     height: 340,
//     plain:true, 
//     cls:"ak-form",
//     modal: true,
//     bodyStyle:'overflow-x:hidden;overflow-y:auto',
//     closeAction :"hide", 
//     layout   : 'fit',
//     items:[collectionAddForm],
//     buttons:[{
//         text:'保存',
//         handler:function(){
//              alert(66666);
//         }
//     }]

// });


var batchAddWindow=new Ext.Window({            // 批次管理增加
    border:true,
    width: 400,
    height: 180,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout:'fit',
    items:[batchAddForm],
    buttons:[{
        text:'保存',
        handler:function(){
            if(batchAddForm.getForm().isValid()){
                    var formValues=batchAddForm.getValues();
                                    
                    Ext.Ajax.request({
                        url:urls+'Book/saveMakeID',
                        method:'post',
                        params:{data:JSON.stringify(formValues)},
                        success:function(conn, response, options){
                            if(errbyextjs(conn)){
                                batchAddForm.getForm().getEl().dom.reset();
                                Ext.getCmp('batchid').doLoad(0);
                                batchAddWindow.hide();
                            }
                        
                        }
                    });
            }
        }
    }]

});


var batchLookWindow=new Ext.Window({            // 批次管理查看
    border:true,
    width: 400,
    height: 130,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout:'fit',
    items:[batchLookForm]

});
