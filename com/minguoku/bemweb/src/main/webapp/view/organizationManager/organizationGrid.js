// 主窗口列表
var orgGrid = new Ext.grid.GridPanel({    //机构列表
    layout: 'fit',
    title:'组织机构列表',
    // split:true,
    // height: 800,
    collapsible: false,
    store: CenterGridStore,
    sm: new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    }),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        }), //改为ture为多选
        {
            header: '机构名称',
            dataIndex: 'NAME'
        }, {
            header: '上级机构',
            dataIndex: 'PARENTNAME'
        }, {
            header: '性质',
            dataIndex: 'TYPE'
        }, {
            header: '设置依据',
            dataIndex: 'ACCORDINGNAME'
        }, {
            header: '设置时间',
            dataIndex: 'SETDATE',
            renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }

        },
        {
            header: '废止依据',
            dataIndex: 'ENDACCORDINGNAME'

        },
        {
            header: '废止时间',
            dataIndex: 'ENDDATE',
            renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }

        },
        {
            header: '原机构',
            dataIndex: 'ORGSOURCENAME',

        },
        {
            header: '创建人',
            dataIndex: 'CREATER'

        },

        {
            header: '创建日期',
            dataIndex: 'CREATEDATE',
            renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }
        },{
            header: '修改人',
            dataIndex: 'MODIFIER'

        },

        {
            header: '修改日期',
            dataIndex: 'MODIFYDATE',
            renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }
        }
    ]),
    viewConfig: {
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({
        pageSize: 16,
        // height:50,   
        id: 'CenterGrid-MainPT',
        cls: 'ak-pager',
        store: CenterGridStore,
        beforePageText: "第",
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        listeners: {
            beforechange: function(a, param) {
                var start=param.start;
                var page=param.start/16+1;
                var xx={"start":start,"limit":16,"page":page,"filter":gridfilter};
                param.data=JSON.stringify(xx);
            }
        }
    }),
    tbar: [{
        xtype: 'button',
        text: '新增',
        akfun:'add',
        akfunID:'100401',
        iconCls: 'ak-icon icon-add',
        cls:'ak-btn btn-orange ak-auth',
        listeners: {
            click: function() {
                if(orgfilter){
                        orgWindow.show();
                        orgWindow.setTitle('机构新增');
                        addOrgForm.getForm().getEl().dom.reset();

                        Ext.getCmp('CREATER').setText('');
                        Ext.getCmp('CREATEDATE').setText('');
                        Ext.getCmp('MODIFIER').setText('');
                        Ext.getCmp('MODIFYDATE').setText('');
                }else{
                        Ext.Msg.alert('提示！', '先选择组织结构一条数据');
                }
                        

            }
        }
    }, {
        xtype: 'button',
        text: '编辑',
        iconCls: 'ak-icon icon-edit',
        cls:'ak-btn btn-blue ak-auth',
        akfun:'edit',
        akfunID:'100402',
        listeners: {
            click: function() {

                if (orgGrid.getSelectionModel().getSelected() != undefined) {
                    var mianrecord = orgGrid.getSelectionModel().getSelected();
                    orgWindow.show();
                    orgWindow.setTitle('机构编辑');
                    addOrgForm.getForm().getEl().dom.reset();

                    var SETDATE=mianrecord.data.SETDATE;
                    var ENDDATE=mianrecord.data.ENDDATE;
                    mianrecord.data.SETDATE=akDateChange.timechangeymd(mianrecord.data.SETDATE);
                    mianrecord.data.ENDDATE=akDateChange.timechangeymd(mianrecord.data.ENDDATE);
                    
                    addOrgForm.getForm().setValues(mianrecord.data);
                    // Ext.getCmp('benifitCOM').setValue(mianrecord.data.PARENTID);
                    mianrecord.data.SETDATE=SETDATE;
                    mianrecord.data.ENDDATE=ENDDATE;

                    Ext.getCmp('CREATER').setText(mianrecord.data.CREATER);
                    Ext.getCmp('CREATEDATE').setText(akDateChange.timechange(mianrecord.data.CREATEDATE)!=undefined?akDateChange.timechange(mianrecord.data.CREATEDATE):'');
                    Ext.getCmp('MODIFIER').setText(mianrecord.data.MODIFIER);
                    Ext.getCmp('MODIFYDATE').setText(akDateChange.timechange(mianrecord.data.MODIFYDATE)!=undefined?akDateChange.timechange(mianrecord.data.MODIFYDATE):'');
                   
                }else{ Ext.Msg.alert('提示！', '请选择一条数据编辑！');}
            }
        }
    }, {
        xtype: 'button',
        text: '删除',
        akfun:'delete',
        akfunID:'100403',
        iconCls: 'ak-icon icon-del',
        cls:'ak-btn btn-red ak-auth',
        listeners: {
            click: function() {
                //akCommFunction.deleterecord(orgGrid, 'CenterGrid-MainPT', 'Org/delete');
                    if(orgGrid.getSelectionModel().getSelected()!=undefined){
                        Ext.MessageBox.confirm('提示', '真的要删除吗？', callBack); 
                        function callBack(id) { 
                                if(id=='yes'){
                                    var deleterecord = orgGrid.getSelectionModel().getSelected();
                                                                      
                                    Ext.Ajax.request({
                                        url:urls+'Org/delete',// 要跳转的url,此为属性必须要有
                                        method:'post',
                                        params:{data:JSON.stringify({"ID":[deleterecord.data.ID]})}, // 提交参数
                                        success: function(response, options){
                                          if(errbyextjs(response)){
                                              CenterGridStore.removeAll();

                                              eastTreeStore.load(Ext.getCmp('con-tree-org-combo').getRootNode(),function(){});
                                          }
                                        },
                                        failure:function(response, options){
                                            Ext.Msg.alert("提示",'网络出错了！');
                                        }
                                    });
                                }
                        }
                    }else{Ext.Msg.alert("提示",'请选择一条记录！');}
                
            }
        }
    },'->', {
        xtype: 'textfield',
        id: 'classify-text-keyword',
        name: 'KEYWORD',
        width: 150
    }, {
        xtype: 'button',
        cls: 'ak-btn btn-green',
        iconCls: 'ak-icon icon-search',
        text: '查询',
        listeners: {
            click: function() {
                gridfilter = {
                    KEYWORD: Ext.getCmp('classify-text-keyword').getValue()
                };
                Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            }
        }
    }, {
        xtype: 'button',
        text: '重置',
        iconCls: 'ak-icon icon-reset',
        cls: 'ak-btn btn-green',
        listeners: {
            click: function() {
                Ext.getCmp('classify-text-keyword').setValue('');
                gridfilter = { KEYWORD: '' };
                Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            }
        }
    }],
    listeners: {
        beforerender: function(th) {
           // Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            // akconfig.checkAuth(['10000']);
            // th.getStore().load({
            //     params: {
            //         SEARCH: false,
            //         start: 0,
            //         limit: 10
            //     }
            // });
        }
    }


});