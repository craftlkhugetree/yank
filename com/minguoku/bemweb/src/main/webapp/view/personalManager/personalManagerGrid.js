
var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '姓', dataIndex: 'LASTNAME',width:120},
        {header: '名', dataIndex: 'FIRSTNAME',width:120},
        {header: '法号', dataIndex: 'FH',width:120},
        {header:'道号',dataIndex:'DH',width:130},
        {header:'外文名',dataIndex:'FORIGNNAME',width:120},
        {header: '性别', dataIndex: 'SEX',width:140,
           renderer:function(value){ 
               return value=='M'?'男':(value=='F'?'女':'');
           }
        },
        {header: '籍贯', dataIndex: 'JG',width:140},
        {header: '民族', dataIndex: 'MZ',width:140},
        {header: '国籍', dataIndex: 'GJ',width:140},
        {header: '生年阳历', dataIndex: 'BIRTHDAY',width:120,
           renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }},
        {header: '生年阴历', dataIndex: 'BIRTHDAY2',width:120},
        {header: '卒年阳历', dataIndex: 'DEADDAY',width:120,
           renderer:function(value){ var xx=akDateChange.timechangeymd(value); return xx; }},
        {header: '卒年阴历', dataIndex: 'DEADDAY2',width:120},
        {header: '学历', dataIndex: 'EDU',width:120},
        {header: '主要著述', dataIndex: 'MAINBOOK',width:120},
        {header: '创建人', dataIndex: 'CREATER',width:120},
        {header: '创建日期', dataIndex: 'CREATEDATE',width:140,
           renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
        {header:'修改人',dataIndex:'MODIFIER',width:120},
        {header: '修改日期', dataIndex: 'MODIFYDATE',width:140,
           renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
        {header: '状态代码', dataIndex: '',width:120},
        {header: '状态更新者', dataIndex: '',width:120}
    ]),
    // viewConfig: {
    //     forceFit: true
    // },
    bbar: new Ext.PagingToolbar({  
        pageSize:16, 
        id:'CenterGrid-MainPT',
        cls:'ak-pager',
        store:CenterGridStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/16+1;
                var xx={"start":start,"limit":16,"page":page,"filter":maingridfilter};
                param.data=JSON.stringify(xx);

            }
        }
    }),
    tbar:[
	/* {
    	xtype:'button',
    	text:'新增',
        iconCls:'ak-icon icon-add',
        akfun:'add',
        akfunID:'100111',
    	cls:'ak-btn btn-green ak-auth',
    	listeners:{
    		click:function(){
                addWindow.show();
                addWindow.setTitle('新增');
                addForm.getForm().getEl().dom.reset();
                addForm.form.findField('BIRTHDAY').setValue('1550-01-01');
                addForm.form.findField('DEADDAY').setValue('1650-01-01');
                gridfilter={'PEOPLE1ID':''};
                othernamefilter={'PEOPLEID':''};
                Ext.getCmp('otherNameMainPT').doLoad(0);
                Ext.getCmp('peopleRelationMainPT').doLoad(0);
                
                nothernameStore.removeAll();
                peoplerelaStore.removeAll();
                Ext.fly('peoplePhoto').dom.innerHTML='';
                Ext.getCmp('peoplePhoto').doLayout();

                Ext.getCmp('CREATER').setText('');
                Ext.getCmp('CREATEDATE').setText('');
                Ext.getCmp('MODIFIER').setText('');
                Ext.getCmp('MODIFYDATE').setText('');
    		}
    	}
    },
    {
    	xtype:'button',
    	text:'编辑',
        iconCls: 'ak-icon icon-edit',
    	cls:'ak-btn btn-blue ak-auth',
        akfun:'edit',
        akfunID:'100112',
    	listeners:{
    		click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=CenterGrid.getSelectionModel().getSelected();
                    
                    addWindow.show();
                    addWindow.setTitle('编辑');
                    addForm.getForm().getEl().dom.reset();
                    var birthday=mianrecord.data.BIRTHDAY;
                    var deadday=mianrecord.data.DEADDAY;
                    mianrecord.data.BIRTHDAY=akDateChange.timechangeymd(mianrecord.data.BIRTHDAY);
                    mianrecord.data.DEADDAY=akDateChange.timechangeymd(mianrecord.data.DEADDAY);
                    addForm.setValues(mianrecord.data);
                    mianrecord.data.BIRTHDAY=birthday;
                    mianrecord.data.DEADDAY=deadday;

                    gridfilter={'PEOPLE1ID':mianrecord.data.ID};
                    othernamefilter={'PEOPLEID':mianrecord.data.ID};
                    Ext.getCmp('otherNameMainPT').doLoad(0);
                    Ext.getCmp('peopleRelationMainPT').doLoad(0);

                    Ext.fly('peoplePhoto').dom.innerHTML='<img height="100" width:"100" style="border-radius:50%;margin-left: 24px;" src="'+urls+'FileManage/get?ID='+mianrecord.data.PHOTOID+'"/>';
                    Ext.getCmp('peoplePhoto').doLayout();


                    Ext.getCmp('CREATER').setText(mianrecord.data.CREATER);
                    Ext.getCmp('CREATEDATE').setText(akDateChange.timechange(mianrecord.data.CREATEDATE)!=undefined?akDateChange.timechange(mianrecord.data.CREATEDATE):'');
                    Ext.getCmp('MODIFIER').setText(mianrecord.data.MODIFIER);
                    Ext.getCmp('MODIFYDATE').setText(akDateChange.timechange(mianrecord.data.MODIFYDATE)!=undefined?akDateChange.timechange(mianrecord.data.MODIFYDATE):'');
                    
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！')}
    		}
    	}
    },{
    	xtype:'button',
    	text:'删除',
        iconCls: 'ak-icon icon-del',
    	cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
    	listeners:{
    		click:function(){
    			akCommFunction.deleterecord(CenterGrid,'CenterGrid-MainPT','Peoples/deleteRes');
    		}
    	}
    }, */
    '->',new  Ext.form.TextField({
        id:'rolequerykeyword',
        name:'KEYWORD',
        width:150
    }),new Ext.Button({
        text:"查询",
        cls:'ak-btn btn-green',
        iconCls:'ak-icon icon-search',
        listeners:{
            click:function(){
                maingridfilter={"KEYWORD":Ext.getCmp('rolequerykeyword').getValue()};
                Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            
            }
        }
    }),new Ext.Button({
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-green',       
        text:"重置",
        listeners:{
            click:function(){
                Ext.getCmp('rolequerykeyword').setValue("");
                maingridfilter={"KEYWORD":''};
            
                Ext.getCmp('CenterGrid-MainPT').doLoad(0);
        
            }
        }
    })
    ],
    listeners:{
        beforerender:function(th){
            Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            
        }
    }
    

});



var otherNameGrid=new Ext.grid.GridPanel({            //其他称呼
    layout:'fit',
    title:'其他称呼',
    id:'peopleintro',
    collapsible:false,
    store: nothernameStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([
        {header: '称呼', dataIndex: 'NAME',width:120},
        {header: '类型', dataIndex: 'NTYPE',width:120},
        {header: '类型内容id', dataIndex: 'NAMEID',width:120,hidden:true}
    ]),
    viewConfig:{
        forceFit: true
    },
    height:331,
    bbar: new Ext.PagingToolbar({  
        pageSize:6,
        // height:50,   
        id:'otherNameMainPT',
        cls:'ak-pager',
        store:nothernameStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/6+1;
                var xx={"start":start,"limit":6,"page":page,"filter":othernamefilter};
                param.data=JSON.stringify(xx);

            }
        }
    }),
    tbar:[{
        xtype:'button',
        text:'新增',
        iconCls:'ak-icon icon-add',
        akfun:'add',
        akfunID:'100111',
        cls:'ak-btn btn-green ak-auth',
        listeners:{
            click:function(){
                nothernameWindow.show();
                nothernameWindow.setTitle('新增');
                nothernameForm.getForm().getEl().dom.reset();
            }
        }
    },
    {
        xtype:'button',
        text:'删除',
        iconCls: 'ak-icon icon-del',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                if(otherNameGrid.getSelectionModel().getSelected()!=undefined){
                        Ext.Msg.confirm('提示', '确定要删除？', function(btn){
                            if (btn == 'yes') {
                                var cell = otherNameGrid.getSelectionModel().getSelected();
        
                                nothernameStore.remove(cell); //删除一行
                                otherNameGrid.getView().refresh(); 
                            }
                        });
                        //akCommFunction.deleterecord(addressGrid,'addressMainPT','PublishOrg/delete');
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！');}
            }
        }
    }]
});

var peopleRelationGrid=new Ext.grid.GridPanel({            //人物关系
    layout:'fit',
    title:'人物关系',
    id:'peoplerelation',
    // split:true,
    collapsible:false,
    store: peoplerelaStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([
        {header: '姓名', dataIndex: 'PEOPLE2ID',width:120},
        {header: '关系', dataIndex: 'RELTYPE',width:120}//,
        // {header: '姓名id', dataIndex: 'PEOPLE2ID',width:120,hidden:true},
        // {header: '关系id', dataIndex: 'RELTYPE',width:120,hidden:true}
    ]),
    viewConfig:{
        forceFit: true
    },
    height:331,
    bbar: new Ext.PagingToolbar({  
        pageSize:6,
        // height:50,   
        id:'peopleRelationMainPT',
        cls:'ak-pager',
        store:peoplerelaStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/6+1;
                var xx={"start":start,"limit":6,"page":page,"filter":gridfilter};
                param.data=JSON.stringify(xx);

            }
        }
    }),
    tbar:[{
        xtype:'button',
        text:'新增',
        iconCls:'ak-icon icon-add',
        akfun:'add',
        akfunID:'100111',
        cls:'ak-btn btn-green ak-auth',
        listeners:{
            click:function(){
                
                // CenterGridStore.each(function(record){
                //     console.log(record);
                // })
                peoplerelationWindow.show();
                peoplerelationWindow.setTitle('新增');
                peoplerelationForm.getForm().getEl().dom.reset();
                
                // addAddressForm.form.findField('PUBLISHINGID').setValue(publishid);
            }
        }
    },
    {
        xtype:'button',
        text:'删除',
        iconCls: 'ak-icon icon-del',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
        listeners:{
            click:function(){
                if(peopleRelationGrid.getSelectionModel().getSelected()!=undefined){
                        Ext.Msg.confirm('提示', '确定要删除？', function(btn){
                            if (btn == 'yes') {
                                var cell = peopleRelationGrid.getSelectionModel().getSelected();
        
                                peoplerelaStore.remove(cell); //删除一行
                                peopleRelationGrid.getView().refresh(); 
                            }
                        });
                        //akCommFunction.deleterecord(addressGrid,'addressMainPT','PublishOrg/delete');
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！');}
            }
        }
    }]
});


// var peoplerelation=new Ext.grid.EditorGridPanel({
//         title:'人物关系',
//         // id : 'peoplerelation',
//         renderTo : 'peoplerelation',
//         store : fatherIsmust,
//         enableHdMenu : false,
//         loadMask : true,
//         stripeRows : true,
//         width:770,
//         height : 180,
//         viewConfig: {
//         forceFit : true
//         },
//         sm : new Ext.grid.RowSelectionModel({singleSelect:true}),
//         columns: [
//         // {header : '药物类别',dataIndex : 'medType', editor:svcMedTypeCombo,renderer:function(value, cellmeta, record){
//         // var index = svcMedTypeStore.find(svcMedTypeCombo.valueField,value);
//         // var ehrRecord = svcMedTypeStore.getAt(index);
//         // var returnvalue = "";
//         // if (ehrRecord) {
//         // returnvalue = ehrRecord.get('name');
//         // }
//         // return returnvalue;
//         // }
//         // },
//         {header : '药品名称',dataIndex : 'ID', editor: {xtype:'textfield'}},
//         {header : '用法用量',dataIndex : 'PEOPLENAME', editor: {xtype:'textfield'}},
//         {header : '备注',dataIndex : 'remark', editor: {xtype:'textfield'}},
//         // {header : '',dataIndex : 'operation', iconCls : 'del',
//         // renderer : function(){
//         // return "<span style='cursor:pointer;'><img src='"+baseUrl+"/static/styles/images/icons/del.png'onclick='deleteMental()'/></span>";
//         // }
//         // }
//         ]
// });
