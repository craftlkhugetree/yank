
var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([
        {header: '书名', dataIndex: 'NAME',width:120},
        {header: '出版社', dataIndex: 'LASTTIME',width:140},
        {header: '出版社地址', dataIndex: 'LASTTIME',width:140},
        {header: '专利', dataIndex: 'NAME',width:120},
        {header: '出版日期', dataIndex: 'NAME',width:120},
        {header: '上线日期', dataIndex: 'NAME',width:120},
        {header: '压缩文件数', dataIndex: 'NAME',width:120},
        {header: '2017年', dataIndex: 'NAME',width:120},
        {header: '2016年', dataIndex: 'NAME',width:120},
        {header: '2015年', dataIndex: 'NAME',width:120},
        {header: '上线日期', dataIndex: 'NAME',width:120}
    ]),
    viewConfig:{
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:16,
        // height:50,   
        id:'remindMainPT',
        cls:'ak-pager',
        store:CenterGridStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/16+1;
                var xx={"start":start,"limit":16,"page":page};
                param.data=JSON.stringify(xx);
            },
            render:function(){
               // akconfig.checkAuth(['100110'],userid);
            }
        }
    }),
    tbar:[{
        xtype:'label',
        html:'到期开始时间:  '
    },{
        xtype:'datefield',
        readOnly:true,
        format:'Y'
    },'&nbsp;&nbsp;&nbsp;',{
        xtype:'label',
        html:'到期截止时间:  '
    },{
        xtype:'datefield',
        readOnly:true,
        format:'Y'
    },{
        xtype:'button',
        text:'查询',
        iconCls: 'ak-icon icon-search',
        cls:'ak-btn btn-blue ak-auth',
        listeners:{
            click:function(){

            }
        }
    },{
        xtype:'button',
        text:'重置',
        iconCls: 'ak-icon icon-reset',
        cls:'ak-btn btn-blue ak-auth',
        listeners:{
            click:function(){

            }
        }
    }
    ],
    listeners:{
        beforerender:function(th){
            
            // th.getStore().load({
            //     params:{SEARCH:false,start:0,limit:16}
            // });
        }
    }
    

});
