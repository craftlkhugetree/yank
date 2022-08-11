// var addOrgForm=new Ext.ux.ExFormPanel({     //机构表单
    
//     border:false,
//     labelWidth:65,
//     labelAlign:'right',
//     // width: 500,
//     // height:800,
//     // autoHeight : true,
//     //defaults: {labelWidth:65,labelAlign:'right'},
//     items:[{
//         layout:'column',
//         items:[{
//             columnWidth:0.5,
//             layout:'form',
//             items:[{
//                 xtype:'textfield',
//                 width:150,
//                 name:'NAME',
//                 allowBlank:false,
//                 vtype:'standard',
//                 blankText:'请填写机构名称',
//                 msgTarget:'qtip',
//                 fieldLabel:'机构名称'
//             },{
//                 xtype:'datefield',
//                 name:'SETDATE',
//                 width:150,
//                 readOnly:true,
//                 format:'Y-m-d',
//                 allowBlank:false,
//                 fieldLabel:'设置时间'
//             },{
//                 xtype:'textfield',
//                 name:'TYPE',
//                 width:150,
//                 vtype:'standard',
//                 fieldLabel:'性质'
//             }]
//         },{
//             columnWidth:0.5,
//             layout:'form',
//             items:[
//               {
//                    xtype: "treecombo",
//                    fieldLabel: "上级机构",
//                    id:'benifitCOM',
//                    width:150,
//                    hiddenName:'PARENTID',
//                    name:'PARENTID',
//                    displayField:'NAME',
//                    valueField:'ID',
//                    url:urls+ "Org/list"
//               },
//             {
//                 xtype:'datefield',
//                 name:'ENDDATE',
//                 width:150,
//                 readOnly:true,
//                 format:'Y-m-d',
//                 allowBlank:false,
//                 fieldLabel:'废止时间'
//             },{
//                 xtype: "treecombo",
//                 fieldLabel: "原机构",
//                 width:150,
//                 hiddenName:'SOURCEORGID',
//                 name:'SOURCEORGID',
//                 displayField:'NAME',
//                 valueField:'ID',
//                 url:urls+ "Org/list"
//             }]
//         }]

//     },
//     {
//                 xtype:'combo',
//                 name:'SETACCORDING',
//                 editable:false,
//                 width:416,
//                 store:setStore,
//                 displayField:'NAME',
//                 valueField:'ID',
//                 mode:'local',
//                 triggerAction: 'all',
//                 fieldLabel:'设置依据'
//     },
//     {
//                 xtype:'combo',
//                 name:'ENDACCORDING',
//                 width:416,
//                 editable:false,
//                 store:setStore,
//                 displayField:'NAME',
//                 valueField:'ID',
//                 mode:'local',
//                 triggerAction: 'all',
//                 fieldLabel:'废止依据'
//     },
//     {
//                 fieldLabel: 'ID',
//                 name:'ID',
//                 hideLabel:true,
//                 xtype:'textfield',
//                 hidden:true
//     }]

// });


var orgPositionForm=new Ext.ux.ExFormPanel({     //职位机构
    
    border:false,
    labelWidth:65,
    labelAlign:'right',
    // width: 500,
    // height:800,
    // autoHeight : true,
    //defaults: {labelWidth:65,labelAlign:'right'},
    items:[
         {
            layout:'column',
            items:[{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'textfield',
                        width:150,
                        name:'NAME',
                        allowBlank:false,
                        vtype:'standard',
                        blankText:'请填写职位名称',
                        msgTarget:'qtip',
                        fieldLabel:'职位名称'
                  }]
            },{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'combo',
                        name:'ORGID',
                        editable:false,
                        width:150,
                        store:appointOrganStore,
                        displayField:'NAME',
                        valueField:'ID',
                        mode:'local',
                        disabled:true,
                        triggerAction: 'all',
                        fieldLabel:'设置机构'
                   }]
            }]
         },
         {
            layout:'column',
            items:[{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'datefield',
                        name:'SETDATE',
                        width:150,
                        readOnly:true,
                        allowBlank:false,
                        format:'Y-m-d',
                        fieldLabel:'设置时间'
                  }]
            },{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'combo',
                        editable:false,
                        name:'SOURCEPOSTID',
                        width:150,
                        store:positionStore,
                        displayField:'NAME',
                        valueField:'ID',
                        mode:'local',
                        triggerAction: 'all',
                        fieldLabel:'原职位'
                   }]
            }]
         },
         {
                    xtype:'datefield',
                    name:'ENDDATE',
                    width:150,
                    readOnly:true,
                    format:'Y-m-d',
                    allowBlank:false,
                    fieldLabel:'废止时间'
         },
          
        {
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
        },

        // {
        //     layout:'column',
        //     items:[{
        //         columnWidth:0.5,
        //         layout:'form',
        //         items:[{
        //             xtype:'textfield',
        //             width:150,
        //             name:'NAME',
        //             allowBlank:false,
        //             vtype:'standard',
        //             blankText:'请填写职位名称',
        //             msgTarget:'qtip',
        //             fieldLabel:'职位名称'
        //         },{
        //             xtype:'datefield',
        //             name:'SETDATE',
        //             width:150,
        //             readOnly:true,
        //             allowBlank:false,
        //             format:'Y-m-d',
        //             fieldLabel:'设置时间'
        //         },{
        //             xtype:'datefield',
        //             name:'ENDDATE',
        //             width:150,
        //             readOnly:true,
        //             format:'Y-m-d',
        //             allowBlank:false,
        //             fieldLabel:'废止时间'
        //         }]
        //     },{
        //         columnWidth:0.5,
        //         layout:'form',
        //         items:[{
        //             xtype:'combo',
        //             name:'ORGID',
        //             editable:false,
        //             width:150,
        //             store:appointOrganStore,
        //             displayField:'NAME',
        //             valueField:'ID',
        //             mode:'local',
        //             disabled:true,
        //             triggerAction: 'all',
        //             fieldLabel:'设置机构'
        //         },{
        //             xtype:'combo',
        //             editable:false,
        //             name:'SOURCEPOSTID',
        //             width:150,
        //             store:positionStore,
        //             displayField:'NAME',
        //             valueField:'ID',
        //             mode:'local',
        //             triggerAction: 'all',
        //             fieldLabel:'原职位'
        //         }]
        //     }]

        // },
    {
                fieldLabel: 'ID',
                name:'ID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    }]

});

var orgPeopleForm=new Ext.ux.ExFormPanel({     //职位任命人
    
    border:false,
    labelWidth:65,
    labelAlign:'right',
    // width: 500,
    // height:800,
    // autoHeight : true,
    //defaults: {labelWidth:65,labelAlign:'right'},
    items:[
     
      {
            layout:'column',
            items:[{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'combo',
                        width:150,
                        name:'POSTID',
                        allowBlank:false,
                        blankText:'请填写职位名称',
                        msgTarget:'qtip',
                        editable:false,
                        store:positionStore,
                        displayField:'NAME',
                        valueField:'ID',
                        mode:'local',
                        disabled:true,
                        triggerAction:'all',
                        fieldLabel:'职位名称'
                   }]
            },{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'combo',
                        name:'PEOPLEID',
                        editable:false,
                        width:150,
                        store:nameStore,
                        displayField:'PEOPLENAME',
                        valueField:'ID',
                        mode:'local',
                        triggerAction:'all',
                        fieldLabel:'姓名'
                  }]
            }]
      },{
            layout:'column',
            items:[{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'combo',
                        name:'SETORGID',
                        width:150,
                        store:appointOrganStore,
                        displayField:'NAME',
                        valueField:'ID',
                        mode:'local',
                        triggerAction:'all',
                        editable:false,
                        format:'Y-m-d',
                        fieldLabel:'任命机关'
                   }]
            },{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'datefield',
                        readOnly:true,
                        format:'Y-m-d',
                        name:'SETDATE',
                        width:150,
                        allowBlank:false,
                        fieldLabel:'任职时间'
                   }]
            }]
      },{
            layout:'column',
            items:[{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'combo',
                        name:'SETTYPE',
                        width:150,
                        editable:false,
                        store:appointPropertyStore,
                        displayField:'NAME',
                        valueField:'NAME',
                        mode:'local',
                        triggerAction:'all',
                        fieldLabel:'任职性质'
                  }]
            },{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'datefield',
                        format:'Y-m-d',
                        readOnly:true,
                        name:'ENDDATE',
                        width:150,
                        allowBlank:false,
                        fieldLabel:'去职时间'
                  }]
            }]
      },{
                xtype:'combo',
                name:'ENDTYPE',
                width:150,
                editable:false,
                store:appointPropertyStore,
                displayField:'NAME',
                valueField:'NAME',
                mode:'local',
                triggerAction:'all',
                fieldLabel:'去职性质'
       },




    //   {
    //     layout:'column',
    //     items:[{
    //         columnWidth:0.5,
    //         layout:'form',
    //         items:[{
    //             xtype:'combo',
    //             width:150,
    //             name:'POSTID',
    //             allowBlank:false,
    //             blankText:'请填写职位名称',
    //             msgTarget:'qtip',
    //             editable:false,
    //             store:positionStore,
    //             displayField:'NAME',
    //             valueField:'ID',
    //             mode:'local',
    //             disabled:true,
    //             triggerAction:'all',
    //             fieldLabel:'职位名称'
    //         },{
    //             xtype:'combo',
    //             name:'SETORGID',
    //             width:150,
    //             store:appointOrganStore,
    //             displayField:'NAME',
    //             valueField:'ID',
    //             mode:'local',
    //             triggerAction:'all',
    //             editable:false,
    //             format:'Y-m-d',
    //             fieldLabel:'任命机关'
    //         },{
    //             xtype:'combo',
    //             name:'SETTYPE',
    //             width:150,
    //             editable:false,
    //             store:appointPropertyStore,
    //             displayField:'NAME',
    //             valueField:'ID',
    //             mode:'local',
    //             triggerAction:'all',
    //             fieldLabel:'任职性质'
    //         },{
    //             xtype:'combo',
    //             name:'ENDTYPE',
    //             width:150,
    //             editable:false,
    //             store:appointPropertyStore,
    //             displayField:'NAME',
    //             valueField:'ID',
    //             mode:'local',
    //             triggerAction:'all',
    //             fieldLabel:'去职性质'
    //         }]
    //     },{
    //         columnWidth:0.5,
    //         layout:'form',
    //         items:[{
    //             xtype:'combo',
    //             name:'PEOPLEID',
    //             editable:false,
    //             width:150,
    //             store:nameStore,
    //             displayField:'PEOPLENAME',
    //             valueField:'ID',
    //             mode:'local',
    //             triggerAction:'all',
    //             fieldLabel:'姓名'
    //         },{
    //             xtype:'datefield',
    //             readOnly:true,
    //             format:'Y-m-d',
    //             name:'SETDATE',
    //             width:150,
    //             allowBlank:false,
    //             fieldLabel:'任职时间'
    //         },{
    //             xtype:'datefield',
    //             format:'Y-m-d',
    //             readOnly:true,
    //             name:'ENDDATE',
    //             width:150,
    //             allowBlank:false,
    //             fieldLabel:'去职时间'
    //         }]
    //     }]

    // },
    {
                fieldLabel: 'ID',
                name:'ID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    }]

});