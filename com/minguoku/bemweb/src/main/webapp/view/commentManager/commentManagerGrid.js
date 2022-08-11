
var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '标题', dataIndex: 'TITLE',width:120},
        {header: '评论人', dataIndex: 'AUTHOR',width:140},
        {header: '评论内容', dataIndex: 'CONTENT',width:140},
        {header: '是否展示', dataIndex: 'ISSHOW',width:140,
        renderer:function(value){
            var xx='';
            if (value=='1') {
                 xx='是';
            }else{
                 xx='否';
            }
            return xx;
        }},
        {header: '评论时间', dataIndex: 'COMMENTTIME',width:140,
    	renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
        {header: '创建人', dataIndex: 'CREATOR',width:140},
        {header: '创建时间', dataIndex: 'CREATETIME',width:140,
        renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }}

    ]),
    viewConfig:{
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:16,
        // height:50,   
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
                var xx={"start":start,"limit":16,"page":page,"filter":gridfilter};
                param.data=JSON.stringify(xx);

            },
            render:function(){
               // akconfig.checkAuth(['100110'],userid);
            }
        }
    }),
    tbar:[{
    	xtype:'button',
    	text:'新增',
        iconCls:'ak-icon icon-add',
        akfun:'add',
        akfunID:'100111',
        // id:'sxssss',
    	cls:'ak-btn btn-green ak-auth',
    	listeners:{
    		click:function(){
                addWindow.show();
                addWindow.setTitle('新增');
                addForm.getForm().getEl().dom.reset();
                addForm.form.reset();
                Ext.getCmp('CREATER').setText('');
                Ext.getCmp('CREATEDATE').setText('');
    		}
    	}
    },{
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
                    addForm.form.reset();

                    Ext.getCmp('CREATER').setText('');
                    Ext.getCmp('CREATEDATE').setText('');

                    var commmentTime=mianrecord.data.COMMENTTIME;
                    mianrecord.data.COMMENTTIME=akDateChange.timechange(mianrecord.data.COMMENTTIME);


                    addForm.setValues(mianrecord.data);
                    mianrecord.data.COMMENTTIME=commmentTime;
                    var isShowLength = Ext.getCmp('ISSHOW').items.items.length;
                    for (var i = 0; i < isShowLength; i++) {

                        Ext.getCmp('ISSHOW').items.items[i].setValue(Ext.getCmp('ISSHOW').items.items[i].inputValue == mianrecord.data.ISSHOW);
                    }

                    Ext.getCmp('CREATER').setText(mianrecord.data.CREATOR);
                    Ext.getCmp('CREATEDATE').setText(akDateChange.timechange(mianrecord.data.CREATETIME)!=undefined?akDateChange.timechange(mianrecord.data.CREATETIME):'');
                    
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！');}
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
    			akCommFunction.deleterecord(CenterGrid,'CenterGrid-MainPT','ExpertComment/delComment');
    		}
    	}
    },
    '->',new  Ext.form.TextField({
        id:'querykeyword',
        name:'KEYWORD',
        width:150
    }),new Ext.Button({
        text:"查询",
        cls:'ak-btn btn-green',
        iconCls:'ak-icon icon-search',
        listeners:{
            click:function(){
                gridfilter={"SEARCH":false,"KEYWORD":Ext.getCmp('querykeyword').getValue()};
                Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            
            }
        }
    }),new Ext.Button({
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-green',       
        text:"重置",
        listeners:{

        click:function(){
            Ext.getCmp('querykeyword').setValue("");
            gridfilter={"SEARCH":false,"KEYWORD":''};
        
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
