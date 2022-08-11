// var orgWindow = new Ext.Window({    // 机构窗口
//     border: true,
//     width: 550,
//     height: 280,
//     plain: true,
//     cls: "ak-form",
//     modal: true,
//     closeAction: "hide",
//     layout: 'fit',
//     bodyStyle: "overflow-x:hidden;overflow-y:auto",
//     items:[addOrgForm],
//     buttons: [{
//         text:'保存',
//         handler:function(){
//             if(addOrgForm.getForm().isValid()){
//                     var formValues=addOrgForm.getValues();
//                     formValues.SETDATE=formValues.SETDATE.format('Ymd');
//                     formValues.ENDDATE=formValues.ENDDATE.format('Ymd');
                    
//                     Ext.Ajax.request({
//                         url:urls+'Org/save',
//                         method:'post',
//                         params:{data:JSON.stringify(formValues)},
//                         success:function(conn, response, options){
//                             if(errbyextjs(conn)){
//                                 addOrgForm.getForm().getEl().dom.reset();
                                
//                                 Ext.getCmp('CenterGrid-MainPT').doLoad(0);
//                                 orgWindow.hide();
//                             }
                        
//                         }
//                     });
//           }
//         }
//     }]
// });

var orgPositionWindow = new Ext.Window({    // 职位窗口
    border: true,
    width: 550,
    height: 230,
    plain: true,
    cls: "ak-form",
    modal: true,
    closeAction: "hide",
    layout: 'fit',
    bodyStyle: "overflow-x:hidden;overflow-y:auto",
    items:[orgPositionForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
                document.getElementById(this.orgPositionWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons: [{
        text:'保存',
        handler:function(){
            if(orgPositionForm.getForm().isValid()){
                var formValues=orgPositionForm.getValues();
                formValues.SETDATE=formValues.SETDATE.format('Ymd');
                formValues.ENDDATE=formValues.ENDDATE.format('Ymd');
                Ext.Ajax.request({
                        url:urls+'Post/save',
                        method:'post',
                        params:{data:JSON.stringify(formValues)},
                        success:function(conn, response, options){
                            if(errbyextjs(conn)){
                                orgPositionForm.getForm().getEl().dom.reset();
                                gridfilter={"ORGID":orgfilter};
                                Ext.getCmp('orgPosition').doLoad(0);
                                orgPositionWindow.hide();
                            }
                        
                        }
                });
            }
        }
    }]
});

var orgPeopleWindow = new Ext.Window({    // 组织任命人
    border: true,
    width: 550,
    height: 230,
    plain: true,
    cls: "ak-form",
    modal: true,
    closeAction: "hide",
    layout: 'fit',
    bodyStyle: "overflow-x:hidden;overflow-y:auto",
    items:[orgPeopleForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
               document.getElementById(this.orgPeopleWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons: [{
        text:'保存',
        handler:function(){
            if(orgPeopleForm.getForm().isValid()){
                var formValues=orgPeopleForm.getValues();
                formValues.SETDATE=formValues.SETDATE.format('Ymd');
                formValues.ENDDATE=formValues.ENDDATE.format('Ymd');
                Ext.Ajax.request({
                        url:urls+'PostPeople/save',
                        method:'post',
                        params:{data:JSON.stringify(formValues)},
                        success:function(conn, response, options){
                            if(errbyextjs(conn)){
                                orgPeopleForm.getForm().getEl().dom.reset();
                                gridfilter={POSTID:stafffilter};
                                Ext.getCmp('appointPerson').doLoad(0);
                                orgPeopleWindow.hide();
                            }
                        
                        }
                });
            }
        }
    }]
});