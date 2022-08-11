var addWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width: 600,
    height: 480,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout: 'fit',
    items:[addForm,facility,{
        layout:'column',
        items:[{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                style:'margin-left:23px',
                html:'创建人:'
            },{
                    xtype: "label",
                    id:"CREATER",
                    disabled:true,
                    text: ""
            }]
        },{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                html:'创建时间:'
            },{
                    xtype: "label",
                    id:"CREATEDATE",
                    disabled:true,
                    text: ""
            }]
        }]
    },{
        layout:'column',
        items:[{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                style:'margin-left:23px',
                html:'修改人:'
            },{
                    xtype: "label",
                    id:"MODIFIER",
                    disabled:true,
                    text: ""
            }]
        },{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                html:'修改时间:'
            },{
                    xtype: "label",
                    id:"MODIFYDATE",
                    disabled:true,
                    text: ""
            }]
        }]
    }],
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
            var formValues=addForm.getValues();
            var zttypeid=[];
            var centerData=facility.getChecked();
            var i=0;
            while(i<centerData.length){
                    zttypeid.push(centerData[i].attributes.ID);
                    i++
            }
            formValues.ZTTYPEID=zttypeid;
            Ext.Ajax.request({
                url:urls+'ResourcePackage/save',
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
