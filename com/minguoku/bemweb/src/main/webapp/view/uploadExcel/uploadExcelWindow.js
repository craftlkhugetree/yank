var addWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width: 800,
    height: 550,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'anchor',
    items:[addForm],
    buttons:[new Ext.Button({
    text:'保存',
    
      listeners:{
        click:function(){
          if(addForm.getForm().isValid()){
            var bookid = Ext.getCmp('book-bookid').getValue();
            if(bookid==''){
            	Ext.getCmp('book-bookid').setValue(Ext.getCmp('book-code').getValue());
            }
            var formValues=addForm.getValues();
            Ext.Ajax.request({
                url:urls+'Book/saveBookCnmarc',
                method:'post',
                params:{data:JSON.stringify(formValues)},
                success:function(conn, response, options){
                        addForm.getForm().getEl().dom.reset();
                        Ext.getCmp('CenterGrid-MainPT').doLoad(0);
                        addWindow.hide();
                }
            });
          }
        }
      }
    })]
});


var uploadWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width: 250,
    height: 90,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[uploadForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
                document.getElementById(this.uploadWindow.buttons[0].id).click();
          },
          scope:this
    }]

});
