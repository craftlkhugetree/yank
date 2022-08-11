// // 主窗口列表
// var orgGrid = new Ext.grid.GridPanel({    //机构列表
//     layout: 'fit',
//     // split:true,
//     // height: 800,
//     collapsible: false,
//     store: CenterGridStore,
//     sm: new Ext.grid.CheckboxSelectionModel({
//         singleSelect: true
//     }),
//     cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel({
//             singleSelect: true
//         }), //改为ture为多选
//         {
//             header: '机构名称',
//             dataIndex: 'NAME'
//         }, {
//             header: '上级机构',
//             dataIndex: 'PARENTNAME'
//         }, {
//             header: '性质',
//             dataIndex: 'TYPE'
//         }, {
//             header: '设置依据',
//             dataIndex: 'ACCORDINGNAME'
//         }, {
//             header: '设置时间',
//             dataIndex: 'SETDATE',
//             renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }

//         },
//         {
//             header: '废止依据',
//             dataIndex: 'ENDACCORDINGNAME'

//         },
//         {
//             header: '废止时间',
//             dataIndex: 'ENDDATE',
//             renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }

//         },
//         {
//             header: '原机构',
//             dataIndex: 'ORGSOURCENAME',

//         },
//         {
//             header: '创建人',
//             dataIndex: 'CREATENAME',

//         },

//         {
//             header: '创建日期',
//             dataIndex: 'CREATETIME',
//             renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }
//         },{
//             header: '修改人',
//             dataIndex: 'UPDATENAME',

//         },

//         {
//             header: '修改日期',
//             dataIndex: 'UPDATETIME',
//             renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }
//         }
//     ]),
//     viewConfig: {
//         forceFit: true
//     },
//     bbar: new Ext.PagingToolbar({
//         pageSize: 10,
//         // height:50,   
//         id: 'CenterGrid-MainPT',
//         cls: 'ak-pager',
//         store: CenterGridStore,
//         beforePageText: "第",
//         displayInfo: true,
//         displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
//         listeners: {
//             beforechange: function(a, param) {
//                 var start=param.start;
//                 var page=param.start/16+1;
//                 var xx={"start":start,"limit":16,"page":page,"filter":gridfilter};
//                 param.data=JSON.stringify(xx);
//             }
//         }
//     }),
//     tbar: [{
//         xtype: 'button',
//         text: '新增',
//         akfun:'add',
//         akfunID:'100401',
//         iconCls: 'ak-icon icon-add',
//         cls:'ak-btn btn-orange ak-auth',
//         listeners: {
//             click: function() {
//                 orgWindow.show();
//                 orgWindow.setTitle('机构新增');
//                 addOrgForm.getForm().getEl().dom.reset();

//             }
//         }
//     }, {
//         xtype: 'button',
//         text: '编辑',
//         iconCls: 'ak-icon icon-edit',
//         cls:'ak-btn btn-blue ak-auth',
//         akfun:'edit',
//         akfunID:'100402',
//         listeners: {
//             click: function() {

//                 if (orgGrid.getSelectionModel().getSelected() != undefined) {
//                     var mianrecord = orgGrid.getSelectionModel().getSelected();
//                     orgWindow.show();
//                     orgWindow.setTitle('机构编辑');
//                     addOrgForm.getForm().getEl().dom.reset();

//                     var SETDATE=mianrecord.data.SETDATE;
//                     var ENDDATE=mianrecord.data.ENDDATE;
//                     mianrecord.data.SETDATE=akDateChange.timechangeymd(mianrecord.data.SETDATE);
//                     mianrecord.data.ENDDATE=akDateChange.timechangeymd(mianrecord.data.ENDDATE);
                    
//                     addOrgForm.getForm().setValues(mianrecord.data);
//                     Ext.getCmp('benifitCOM').setValue(mianrecord.data.PARENTID);
//                     mianrecord.data.SETDATE=SETDATE;
//                     mianrecord.data.ENDDATE=ENDDATE;
                   
//                 }else{ Ext.Msg.alert('提示！', '请选择一条数据编辑！');}
//             }
//         }
//     }, {
//         xtype: 'button',
//         text: '删除',
//         akfun:'delete',
//         akfunID:'100403',
//         iconCls: 'ak-icon icon-del',
//         cls:'ak-btn btn-red ak-auth',
//         listeners: {
//             click: function() {
//                 akCommFunction.deleterecord(orgGrid, 'CenterGrid-MainPT', 'Org/delete');
//             }
//         }
//     },'->', {
//         xtype: 'textfield',
//         id: 'classify-text-keyword',
//         name: 'KEYWORD',
//         width: 150
//     }, {
//         xtype: 'button',
//         cls: 'ak-btn btn-green',
//         iconCls: 'ak-icon icon-search',
//         text: '查询',
//         listeners: {
//             click: function() {
//                 gridfilter = {
//                     NAME: Ext.getCmp('classify-text-keyword').getValue()
//                 };
//                 Ext.getCmp('CenterGrid-MainPT').doLoad(0);
//             }
//         }
//     }, {
//         xtype: 'button',
//         text: '重置',
//         iconCls: 'ak-icon icon-reset',
//         cls: 'ak-btn btn-green',
//         listeners: {
//             click: function() {
//                 Ext.getCmp('classify-text-keyword').setValue('');
//                 gridfilter = { NAME: '' };
//                 Ext.getCmp('CenterGrid-MainPT').doLoad(0);
//             }
//         }
//     }],
//     listeners: {
//         beforerender: function(th) {
//             Ext.getCmp('CenterGrid-MainPT').doLoad(0);
//             // akconfig.checkAuth(['10000']);
//             // th.getStore().load({
//             //     params: {
//             //         SEARCH: false,
//             //         start: 0,
//             //         limit: 10
//             //     }
//             // });
//         }
//     }


// });



var orgPositionGrid = new Ext.grid.GridPanel({    //职位机构
    //layout: 'fit',
    // split:true,
    height: 350,
    title:'职位',
    collapsible: false,
    //id: 'app_man_list',
    store: appListStore,
    sm: new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    }),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        }), //改为ture为多选
        {
            header: '职位名称',
            dataIndex: 'NAME'
        }, {
            header: '设置机构',
            dataIndex: 'ORGNAME'

        }, {
            header: '设置时间',
            dataIndex: 'SETDATE',
            renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }
        }, {
            header: '废止时间',
            dataIndex: 'ENDDATE',
            renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }
        }, {
            header: '原职位',
            dataIndex: 'SOURCENAME'
        }, 
        // {
        //     header: '排序',
        //     dataIndex: 'DORDER'
        // },
        {header: '创建人', dataIndex: 'CREATER',width:120},
        {header: '创建日期', dataIndex: 'CREATEDATE',width:140,
           renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
        {header:'修改人',dataIndex:'MODIFIER',width:120},
        {header: '修改日期', dataIndex: 'MODIFYDATE',width:140,
        renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }}
    ]),
    viewConfig: {
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({
        pageSize: 5,
        // height:50,
        id: 'orgPosition',
        cls: 'ak-pager',
        store: appListStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText: "第",
        listeners: {
            beforechange: function(a, param) {
                var start=param.start;
                var page=param.start/5+1;
                var xx={"start":start,"limit":5,"page":page,"filter":gridfilter};
                param.data=JSON.stringify(xx);
            }
        }

    }),
    listeners:{
         beforerender:function(){
             // Ext.getCmp('orgPosition').doLoad(0);
             appointOrganStore.load({              // 任命机关
                params:{
                    data:JSON.stringify({"start":0,"page":1})
                }
             });
             
         },
         rowclick:function(th,rowIndex,e){
                var r=orgPositionGrid.getSelectionModel().getSelected();
              
                if(r!=undefined){
                    stafffilter=r.data.ID;
                    gridfilter={
                        POSTID: r.data.ID
                    };
                    Ext.getCmp('appointPerson').doLoad(0);
                }else{
                    stafffilter='';
                    Fund_use_GridStore.removeAll();
                }
                
         }
    },
    tbar: [{
        text: '增加',
        xtype: 'button',
        iconCls: 'x-btn-text ak-icon icon-add',
        cls: 'ak-btn btn-orange ak-auth',
        listeners: {
            click: function() {
                if (orgfilter) {
                        orgPositionWindow.show();
                        orgPositionWindow.setTitle('职位机构新增');
                        orgPositionForm.getForm().getEl().dom.reset();
                        orgPositionForm.form.findField('ORGID').setValue(orgfilter);

                        Ext.getCmp('CREATER').setText('');
                        Ext.getCmp('CREATEDATE').setText('');
                        Ext.getCmp('MODIFIER').setText('');
                        Ext.getCmp('MODIFYDATE').setText('');
                }else{
                        Ext.Msg.alert('提示！', '请先选择一条组织架构信息！');
                }
                        
               
            }
        }
    }, {
        text: '编辑',
        xtype: 'button',
        iconCls: 'x-btn-text ak-icon icon-edit',
        cls: 'ak-btn btn-blue ak-auth',
        listeners: {
            click: function() {
                if (orgPositionGrid.getSelectionModel().getSelected() != undefined) {
                    var mianrecord = orgPositionGrid.getSelectionModel().getSelected();
                    orgPositionWindow.show();
                    orgPositionWindow.setTitle('职位机构编辑');
                    orgPositionForm.getForm().getEl().dom.reset();
                    var SETDATE=mianrecord.data.SETDATE;
                    var ENDDATE=mianrecord.data.ENDDATE;
                    mianrecord.data.SETDATE=akDateChange.timechangeymd(mianrecord.data.SETDATE);
                    mianrecord.data.ENDDATE=akDateChange.timechangeymd(mianrecord.data.ENDDATE);
                    orgPositionForm.setValues(mianrecord.data);
                    mianrecord.data.SETDATE=SETDATE;
                    mianrecord.data.ENDDATE=ENDDATE;
                    
                    Ext.getCmp('CREATER').setText(mianrecord.data.CREATER);
                    Ext.getCmp('CREATEDATE').setText(akDateChange.timechange(mianrecord.data.CREATEDATE)!=undefined?akDateChange.timechange(mianrecord.data.CREATEDATE):'');
                    Ext.getCmp('MODIFIER').setText(mianrecord.data.MODIFIER);
                    Ext.getCmp('MODIFYDATE').setText(akDateChange.timechange(mianrecord.data.MODIFYDATE)!=undefined?akDateChange.timechange(mianrecord.data.MODIFYDATE):'');

                } else {
                    Ext.Msg.alert('提示！', '请选择一条数据编辑！')
                }

            }
        }
    }, {
        text: '删除',
        xtype: 'button',
        iconCls: 'ak-icon icon-delete',
        cls: 'ak-btn btn-red ak-auth',
        listeners: {
            click: function() {
                if (orgPositionGrid.getSelectionModel().getSelected() != undefined) {
                   // var mianrecord = orgPositionGrid.getSelectionModel().getSelected();
                    //akCommFunction.deleterecord(orgPositionGrid, 'orgPosition', 'Post/delete',stafffilter);

                    if(orgPositionGrid.getSelectionModel().getSelected()!=undefined){
                        Ext.MessageBox.confirm('提示', '真的要删除吗？', callBack); 
                        function callBack(id) { 
                            if(id=='yes'){
                                var deleterecord = orgPositionGrid.getSelectionModel().getSelected();
                                var bb={"ID":[deleterecord.data.ID]};
                                Ext.Ajax.request({
                                    url:urls+'Post/delete',// 要跳转的url,此为属性必须要有
                                    method:'post',
                                    params:{data:JSON.stringify(bb)}, // 提交参数
                                    success: function(response, options){
                                      if(errbyextjs(response)){

                                         gridfilter={"ORGID":orgfilter};
                                         Ext.getCmp('orgPosition').doLoad(0);
                                         stafffilter='';
                                      }
                                    },
                                    failure:function(response, options){
                                        Ext.Msg.alert("提示",'网络出错了！')
                                    }
                                })
                            }
                        }
                    }else{Ext.Msg.alert("提示",'请选择一条记录！')}
                   
                } else {
                    Ext.Msg.alert('提示！', '请选择一名项目申请人！');
                }
            }
        }
    }]

});


var appointPersonGrid = new Ext.grid.GridPanel({        // 机构任命人
    layout: 'fit',
    title:'职员',
    // ctCls: 'funuse',
    // // split:true,
    // // collapsible: false,
    // id: 'funduse',
    store: Fund_use_GridStore,
    sm: new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    }),
    height:document.documentElement.clientHeight-350,
    viewConfig: {
        forceFit: true
    },
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        }), //改为ture为多选
        {
            header: '职位',
            width: 160,
            dataIndex: 'POSTNAME'
        }, {
            header: '姓名',
            width: 160,
            dataIndex: 'PEOPLENAME'
        }, {
            header: '任命机关',
            width: 160,
            dataIndex: 'ORGNAME'
        }, {
            header: '任职时间',
            width: 160,
            dataIndex: 'SETDATE',
            renderer:function(value){ 
			    var xx='';
                
				if(value!=''){
					if(value.substring(6,8)!=''){
						
						xx=akDateChange.timechangeymd(value);
						
					}else if(value.substring(4,6)!=''){
						
						xx+= value.substring(0,4);
						xx+="-";
						xx+=value.substring(4,6);
						
					}else{
						
						xx+= value.substring(0,4);
						
					}
					
				}
				
				return xx;

			}
        },

        {
            header: '任职性质',
            width: 160,
            dataIndex: 'SETTYPENAME'
        },
        {
            header: '去职时间',
            width: 160,
            dataIndex: 'ENDDATE',
            renderer:function(value){ 
                var xx='';
                if(value!=''){
					if(value.substring(6,8)!=''){
						
						xx=akDateChange.timechangeymd(value);
						
					}else if(value.substring(4,6)!=''){
						
						xx+= value.substring(0,4);
						xx+="-";
						xx+=value.substring(4,6);
						
					}else{
						
						xx+= value.substring(0,4);
						
					}
			    }
				return xx;

			}
        },{
            header: '去职性质',
            width: 160,
            dataIndex: 'ENDTYPENAME'
        }
    ]),
    bbar: new Ext.PagingToolbar({
        pageSize: 6,
        id: 'appointPerson',
        cls: 'ak-pager',
        store: Fund_use_GridStore,
        beforePageText: "第",
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        listeners: {
            beforechange: function(a, param) {
                var start=param.start;
                var page=param.start/6+1;
                var xx={"start":start,"limit":6,"page":page,"filter":gridfilter};
                param.data=JSON.stringify(xx);
            }
        }

    }),
    listeners:{
        beforerender:function(){
             // Ext.getCmp('appointPerson').doLoad(0);
        }
    },
    tbar: [{
        text: '增加',
        xtype: 'button',
        iconCls: 'x-btn-text ak-icon icon-add',
        cls: 'ak-btn btn-orange ak-auth',
        listeners: {
            click: function() {
              if(stafffilter){
                    orgPeopleWindow.show();
                    orgPeopleWindow.setTitle('职位任命新增');
                    orgPeopleForm.getForm().getEl().dom.reset();
                    positionStore.load({              // 原职位
                        params:{
                            data:JSON.stringify({"start":0,"page":1})
                        },
                        callback:function(){
                            orgPeopleForm.form.findField('POSTID').setValue(stafffilter);
                        }
                    });
                    
              }else{
                    Ext.Msg.alert('提示！', '请先选择一条职位信息！');
              }
                

            }
        }
    }, {
        text: '编辑',
        xtype: 'button',
        iconCls: 'x-btn-text ak-icon icon-edit',
        cls: 'ak-btn btn-blue ak-auth',
        listeners: {
            click: function() {
                if (appointPersonGrid.getSelectionModel().getSelected() != undefined) {
                    var mianrecord = appointPersonGrid.getSelectionModel().getSelected();
                    orgPeopleWindow.show();
                    orgPeopleWindow.setTitle('职位任命编辑');
                    orgPeopleForm.getForm().getEl().dom.reset();
                    var SETDATE=mianrecord.data.SETDATE;
                    var ENDDATE=mianrecord.data.ENDDATE;
                    mianrecord.data.SETDATE=akDateChange.timechangeymd(mianrecord.data.SETDATE);
                    mianrecord.data.ENDDATE=akDateChange.timechangeymd(mianrecord.data.ENDDATE);
                    orgPeopleForm.setValues(mianrecord.data);
                    mianrecord.data.SETDATE=SETDATE;
                    mianrecord.data.ENDDATE=ENDDATE;
                } else {
                    Ext.Msg.alert('提示！', '请选择一条数据编辑！');
                }

            }
        }
    }, {
        text: '删除',
        xtype: 'button',
        iconCls: 'ak-icon icon-delete',
        cls: 'ak-btn btn-red ak-auth',
        listeners: {
            click: function() {
                if (appointPersonGrid.getSelectionModel().getSelected() != undefined) {
                    // var mianrecord = appointPersonGrid.getSelectionModel().getSelected();
                    // akCommFunction.deleterecord(appointPersonGrid, 'appointPerson', 'PostPeople/delete');
                    
                    if(appointPersonGrid.getSelectionModel().getSelected()!=undefined){
                        Ext.MessageBox.confirm('提示', '真的要删除吗？', callBack); 
                        function callBack(id) { 
                            if(id=='yes'){
                                var deleterecord = appointPersonGrid.getSelectionModel().getSelected();
                                var bb={"ID":[deleterecord.data.ID]};
                                Ext.Ajax.request({
                                    url:urls+'PostPeople/delete',// 要跳转的url,此为属性必须要有
                                    method:'post',
                                    params:{data:JSON.stringify(bb)}, // 提交参数
                                    success: function(response, options){
                                      if(errbyextjs(response)){

                                         gridfilter={POSTID:stafffilter};
                                         Ext.getCmp('appointPerson').doLoad(0);
                                      }
                                    },
                                    failure:function(response, options){
                                        Ext.Msg.alert("提示",'网络出错了！')
                                    }
                                })
                            }
                        }
                    }else{Ext.Msg.alert("提示",'请选择一条记录！')}

                } else {
                    Ext.Msg.alert('提示！', '请选择一名项目申请人！');
                }
            }
        }
    }]

});
