var addWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width: 800,
    height: 600,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle :"overflow-x:hidden;overflow-y:auto",
    closeAction :"hide", 
    layout:'form',
    items:[tabPanel,{
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
            
            if(formValues.BIRTHDAY){
                formValues.BIRTHDAY=formValues.BIRTHDAY.format('Ymd');
            }
            if(formValues.DEADDAY){
                formValues.DEADDAY=formValues.DEADDAY.format('Ymd');
            }

            var peoplerelation=[];  //人物关系数组
            var othername=[];      //其他称呼数组
            peoplerelaStore.each(function(record){        //人物关系
                   console.log(record);
                   peoplerelation.push({PEOPLE2ID:record.data.PEOPLE2ID,RELTYPE:record.data.RELTYPE});
            });

            nothernameStore.each(function(record2){              //其他称呼
                  othername.push({NTYPE:record2.data.NTYPE,NAME:record2.data.NAME});
            });
            Ext.Ajax.request({
                url:urls+'Peoples/saveRes',
                method:'post',
                params:{
                     data:JSON.stringify(formValues),
                     array:JSON.stringify(peoplerelation),
                     arr:JSON.stringify(othername)
                },
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


var peoplerelationWindow=new Ext.Window({            // 人物关系的添加和修改
    border:true,
    width: 260,
    height: 150,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle :"overflow-x:hidden;overflow-y:auto",
    closeAction :"hide", 
    layout:'fit',
    items:[peoplerelationForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
                document.getElementById(this.peoplerelationWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons:[new Ext.Button({
      text:'保存',
      listeners:{
        click:function(){
          if(peoplerelationForm.getForm().isValid()){
                var formValues=peoplerelationForm.getValues();
                  // console.log(formValues);
                var ItemRecord = Ext.data.Record.create([
                        {name:'NAME'},
                        {name:'PEOPLE2ID'},
                        {name:'RELTYPE'},
                        {name:'PEOPLENAME'}
                ]);    

                var p =new ItemRecord({
                        
                        PEOPLE2ID:formValues.PEOPLE2ID,
                        RELTYPE:formValues.RELTYPE
                });
                peoplerelaStore.insert(0, p); //新建一行
                peopleRelationGrid.getView().refresh(); 

                peoplerelationWindow.hide();

          }
        }
      }
    })]

});



var nothernameWindow=new Ext.Window({            // 其他称呼的添加和修改
    border:true,
    width: 270,
    height: 150,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle :"overflow-x:hidden;overflow-y:auto",
    closeAction :"hide", 
    layout:'fit',
    items:[nothernameForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
                document.getElementById(this.nothernameWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons:[new Ext.Button({
      text:'保存',
      listeners:{
        click:function(){
          if(nothernameForm.getForm().isValid()){
                var formValues=nothernameForm.getValues();
                 
                var ItemRecord = Ext.data.Record.create([
                        {name:'NTYPE'},
                        {name:'NAME'}
                ]);    

                var p =new ItemRecord({
                        NTYPE:formValues.NTYPE,
                        NAME:formValues.NAME
                });
                nothernameStore.insert(0, p); //新建一行
                otherNameGrid.getView().refresh(); 

                nothernameWindow.hide();

          }
        }
      }
    })]

});

// var issueWindow=new Ext.Window({            // 发布选择
//     border:true,
//     title:'选择首页',
//     width    : 400,
//     height   : 300,
//     plain:true, 
//     cls:"ak-form",
//     modal: true,
//     closeAction :"hide", 
//     layout   : 'fit',
//     //items:[facility],
//     buttons:[new Ext.Button({
//         text:'确定',
//         listeners:{
//             click:function(){
//                 // console.log(facility.getChecked()[0].attributes.TEMPLATEADD);
//                 var webID=facility.getChecked()[0].attributes.ID;
//                 var webUrl=facility.getChecked()[0].attributes.TEMPLATEADD;
//                 var odata={'ID':issueWindow.webid,'ADDRESS':webID};
//                 console.log(odata)
//                 var data=JSON.stringify(odata);
//                 Ext.Ajax.request({
//                     url:urls+'Sites/issue',
//                     method:'post',
//                     params:{data:data},
//                     success:function(conn, response, options){
//                         // Ext.Msg.alert('提示！','发布成功！')
//                         Ext.getCmp('CenterGrid-MainPT').doLoad(0);
//                         issueWindow.hide();
//                         window.open(webUrl)

                        
                        
                    
//                     }
//                 })

//             }
//           }
//     })]

// });