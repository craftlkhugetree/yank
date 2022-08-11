var n=0;
// 基本信息
var addForm=new Ext.ux.ExFormPanel({
    title:'基本信息',
    border:false,
    labelWidth:80,
    id:'basicInfo',
    labelAlign:'right',
    // width: 500,
    // height:800,                                                                                                                                                                                                                                                                     
    autoHeight : true,
    items:[{
        layout:'column',
        items:[{
            columnWidth:0.26,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	width:102,
            	name:'LASTNAME',
                allowBlank:false,
                vtype:'standard',
                blankText:'请填写姓',
                msgTarget:'qtip',
                tabIndex: 1,
            	fieldLabel:'姓'
            },{
                xtype:'combo',
                name:'SEX',
                width:102,
                editable:false,
                store:sexIsmust,
                displayField:'NAME',
                valueField:'VALUE',
                triggerAction:'all',
                mode:'local',
                tabIndex: 4,
                fieldLabel:'性别'
            },{
                xtype:'datefield',
                name:'BIRTHDAY',
                format:'Y-m-d',
                width:102,
                tabIndex: 7,
                fieldLabel:'生年阳历',
                listeners:{
                    select:function(th){

                        Ext.Ajax.request({
                            url:urls2+'Common/getTGDZ',
                            method:'post',
                            params:{
                                data:JSON.stringify({"YEAR":th.value.substring(0,4)})
                            },
                            success:function(conn, response, options){
                                if(errbyextjs(conn)){
                                    var result=eval('('+conn.responseText+')');
                                    addForm.form.findField('BIRTHDAY2').setValue(result.items.TDGZ);
                                }
                            
                            }
                        });
                        // birthYearStore.load({
                        //     params:{
                        //         data:JSON.stringify({"YEAR":th.value.substring(0,4)})
                        //     }
                        // });

                    },
                    blur:function(th){
                        Ext.Ajax.request({
                            url:urls2+'Common/getTGDZ',
                            method:'post',
                            params:{
                                data:JSON.stringify({"YEAR":th.value.substring(0,4)})
                            },
                            success:function(conn, response, options){
                                if(errbyextjs(conn)){
                                    var result=eval('('+conn.responseText+')');
                                    addForm.form.findField('BIRTHDAY2').setValue(result.items.TDGZ);
                                }
                            
                            }
                        });
                    }
                }
            },{
                xtype:'textfield',
                name:'BIRTHDAY2',
                readOnly:true,
                width:102,
                tabIndex: 10,
                fieldLabel:'生年干支记年'
            },{
                xtype:'textfield',
                name:'FH',
                width:102,
                tabIndex:13,
                fieldLabel:'法号'
            }//,
            // {
            //     xtype:'combo',
            //     name:'FATHER',
            //     width:93,
            //     height:800,
            //     editable:false,
            //     store:fatherIsmust,
            //     displayField:'PEOPLENAME',
            //     valueField:'ID',
            //     triggerAction:'all',
            //     mode:'local',
            //     fieldLabel:'父亲'
            // }
            
            ]
        },{
            columnWidth:0.26,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	name:'FIRSTNAME',
            	width:102,
                tabIndex: 2,
            	fieldLabel:'名'
            },{
                xtype:'textfield',
                name:'JG',
                width:102,
                editable:false,
                store:originIsmust,
                displayField:'NAME',
                valueField:'ID',
                triggerAction:'all',
                mode:'local',
                tabIndex: 5,
                fieldLabel:'籍贯'
            },{
                xtype:'datefield',
                name:'DEADDAY',
                width:102,
                format:'Y-m-d',
                fieldLabel:'卒年阳历',
                tabIndex:8,
                listeners:{
                    select:function(th){

                        Ext.Ajax.request({
                            url:urls2+'Common/getTGDZ',
                            method:'post',
                            params:{
                                data:JSON.stringify({"YEAR":th.value.substring(0,4)})
                            },
                            success:function(conn, response, options){
                                if(errbyextjs(conn)){
                                    var result=eval('('+conn.responseText+')');
                                    addForm.form.findField('DEADDAY2').setValue(result.items.TDGZ);
                                }
                            
                            }
                        });
                

                    },
                    blur:function(th){
                        Ext.Ajax.request({
                            url:urls2+'Common/getTGDZ',
                            method:'post',
                            params:{
                                data:JSON.stringify({"YEAR":th.value.substring(0,4)})
                            },
                            success:function(conn, response, options){
                                if(errbyextjs(conn)){
                                    var result=eval('('+conn.responseText+')');
                                    addForm.form.findField('DEADDAY2').setValue(result.items.TDGZ);
                                }
                            
                            }
                        });
                    }
                }
            },{
                xtype:'textfield',
                name:'DEADDAY2',
                width:102,
                readOnly:true,
                tabIndex:11,
                fieldLabel:'卒年干支记年'
            },{
                xtype:'textfield',
                name:'DH',
                width:102,
                tabIndex:14,
                fieldLabel:'道号'
            }
            // ,{
            //     xtype:'combo',
            //     name:'MOTHER',
            //     width:93,
            //     editable:false,
            //     store:motherIsmust,
            //     displayField:'PEOPLENAME',
            //     valueField:'ID',
            //     triggerAction:'all',
            //     mode:'local',
            //     fieldLabel:'母亲'
            // }
            // {
            //     xtype:'textfield',
            //     name:'DES',
            //     width:115,
            //     fieldLabel:'子女'
            // }
            ]
        },{
            columnWidth:0.24,
            layout:'form',
            items:[
            // {
            //     xtype:'textfield',
            //     name:'YH',
            //     width:88,
            //     tabIndex: 3,
            //     fieldLabel:'谥号'
            // },
            {
                xtype:'textfield',
                name:'FORIGNNAME',
                width:86,
                tabIndex: 6,
                fieldLabel:'外文名'
            },{
                xtype:'textfield',
                name:'MZ',
                width:86,
                editable:false,
                tabIndex: 9,
                fieldLabel:'民族'
            },{
                xtype:'textfield',
                name:'GJ',
                width:86,
                tabIndex: 12,
                fieldLabel:'国籍'
            },{
                xtype:'textfield',
                name:'EDU',
                width:86,
                tabIndex:15,
                fieldLabel:'学历'
            }]
        },{
            columnWidth:0.24,
            layout:'form',
            style:'text-align:center;margin-left: 20px;',
            items:[
                new Ext.Panel({
                  id:"peoplePhoto",
                  height:80,
                  width:80
                }),
                {
                      xtype:'akupload',
                      // buttonsimg:'302884.jpg',
                      buttonstext:'<span style="border:1px solid black">上传小照</span>',
                      uploadurl:urls+"FileManage/upload",
                      uploadtype:'*.jpg;*.jpeg;*.png;*.gif;',
                      whensuccessed:function(file, serverData){
                          Ext.Msg.hide();
                          
                          var obj = eval('(' + serverData + ')');
                          
                          Ext.fly('peoplePhoto').dom.innerHTML='<img  height="100" width:"100" style="border-radius:50%;margin-left: 24px;" src="'+urls+'FileManage/get?ID='+obj.FILE[0].ID+'"/>';
                          Ext.getCmp('peoplePhoto').doLayout();
                          addForm.form.findField('PHOTOID').setValue(obj.FILE[0].ID);
                      }
                }
            // {
            //     xtype:'textfield',
            //     name:'FH',
            //     width:78,
            //     fieldLabel:'法号'
            // },
            // {
            //     xtype:'textfield',
            //     name:'DH',
            //     width:78,
            //     fieldLabel:'道号'
            // },
            // {
            //     xtype:'textfield',
            //     name:'EDU',
            //     width:78,
            //     fieldLabel:'学历'
            // }
            ]
        }]

    },
    {
         layout:'column',
         items:[
             // {
             //      layout:'form',
             //      columnWidth:0.15,
             //      items:[{
             //          xtype:'textfield',
             //          hidden:true,
             //          readOnly:true,
             //          fieldLabel:'人物小照'
             //      }]
             // },
         {
              layout:'form',
              columnWidth:0.25,
              items:[
                   // {
                   //    xtype:'akupload',
                   //    // buttonsimg:'302884.jpg',
                   //    buttonstext:'<span style="border:1px solid black">上传小照</span>',
                   //    uploadurl:urls+"FileManage/upload",
                   //    uploadtype:'*.jpg;*.jpeg;*.png;*.gif;',
                   //    whensuccessed:function(file, serverData){
                   //        Ext.Msg.hide();
                          
                   //        var obj = eval('(' + serverData + ')');
                          
                   //        Ext.fly('peoplePhoto').dom.innerHTML='<img  height="100" width:"100" style="border-radius:50%;margin-left: 24px;" src="'+urls+'FileManage/get?ID='+obj.FILE[0].ID+'"/>';
                   //        Ext.getCmp('peoplePhoto').doLayout();
                   //        addForm.form.findField('PHOTOID').setValue(obj.FILE[0].ID);
                   //    }
                   //  },
                    {
                      xtype:'textfield',
                      fieldLabel:'人物小照id',
                      name:'PHOTOID',
                      hidden:true,
                      hideLabel:true
                    }
              ]
         },
         {
              layout:'form',
              columnWidth:0.4,
              items:[
                  // new Ext.Panel({
                  //     id:"peoplePhoto",
                  //     height:100,
                  //     width:200
                  // })
              ]
         }]
    },
    {
        layout:'column',
        items:[{
            layout:'form',
            columnWidth:1,
            items:[{
                xtype:'textarea',
                name:'MAINBOOK',
                width:672,
                height:238,
                tabIndex:16,
                fieldLabel:'主要著述'
            }]
        }]
    },
    {
                fieldLabel: 'ID',
                name:'ID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    }]

});


var peoplerelationForm=new Ext.ux.ExFormPanel({            //人物关系
    border:false,
    labelWidth:50,
    labelAlign:'right',                                                                                                                                                                                                                                                            
    autoHeight : true,
    items:[{
                xtype:'textfield',
                name:'PEOPLE2ID',
                width:130,
                fieldLabel:'姓名'//,
                // listeners:{
                //     select:function(th){
                //         var value=nameStore.getAt(this.selectedIndex).json.SEX;
                //         fullname=nameStore.getAt(this.selectedIndex).json.PEOPLENAME;
                //         //fullnameId=nameStore.getAt(this.selectedIndex).json.PEOPLENAME
                //         peoplerelationForm.form.findField('RELTYPE').setValue('');
                //         peopleRelationStore.load({ //过滤关系
                //             params:{
                //                 data:JSON.stringify({"filter":{"SEX":value}})
                //             }
                //         });
                //     }
                // }
    },{
                xtype:'textfield',
                name:'RELTYPE',
                width:130,
                fieldLabel:'关系'//,
                // listeners:{
                //     select:function(th){
                //         relationname=peopleRelationStore.getAt(this.selectedIndex).json.NAME;
                        
                //     }
                // }
    }
    // ,{
    //             fieldLabel: 'PEOPLE1ID',
    //             name:'PEOPLE1ID',
    //             hideLabel:true,
    //             xtype:'textfield',
    //             hidden:true
    // }
    ]

});


var nothernameForm=new Ext.ux.ExFormPanel({            //其他称呼
    border:false,
    labelWidth:60,
    labelAlign:'right',                                                                                                                                                                                                                                                            
    autoHeight : true,
    items:[{
                xtype:'textfield',
                name:'NTYPE',
                width:130,
                ctCls:'callname'+n,
                // editable:false,
                // store:categoryIsmust,
                // displayField:'NAME',
                // valueField:'NAME',
                // triggerAction:'all',
                // mode:'local',
                fieldLabel:'类型'//,
                // listeners:{
                //     select:function(th){
                //         var value=categoryIsmust.getAt(this.selectedIndex).json.NTYPE;
                //         nothernameForm.form.findField('NAME').setValue('');
                //          anotherIsmust.load({
                //                 params:{
                //                     data:JSON.stringify({"filter":{"NTYPE":value}})
                //                 }
                //          });
                //     }
                // }
    },{
                xtype:'textfield',
                name:'NAME',
                width:130,
                fieldLabel:'类型内容'
    }
    ]

});


var tabPanel=new Ext.TabPanel({
        // xtype:'tabpanel',
        activeTab:'basicInfo',
        height:495,
        //items:[addForm,peopleRelationshipForm,peopleIntroduceForm],otherNameGrid
        items:[addForm,peopleRelationGrid,otherNameGrid],
        listeners:{
            tabchange:function(th){
                  if(th.activeTab.id=='basicInfo'){
                        addForm.doLayout();
                        

                        // motherIsmust.load({       //母亲
                        //       params:{
                        //           data:JSON.stringify({"start":0,"page":1})
                        //       }
                        // });

                        // fatherIsmust.load({    //父亲
                        //       params:{
                        //           data:JSON.stringify({"start":0,"page":1})
                        //       }
                        // });



                  }
                    

            }
        }
});
        