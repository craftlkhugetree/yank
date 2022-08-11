function jumpweb(value){
    // console.log(value.getAttribute('datavalue'))
    window.open(value.getAttribute('datavalue'))
}
var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '月份', dataIndex: 'MONTH',width:120},
        {header: '截止时间', dataIndex: 'LASTTIME',width:140,
    	renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
        {header: '书目增加', dataIndex: 'NAMEADD',width:120}
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
                var xx={"start":start,"limit":16,"page":page};
                param.data=JSON.stringify(xx);

            },
            render:function(){
               // akconfig.checkAuth(['100110'],userid);
            }
        }
    }),
    tbar:[
    '->',{
        xtype:'label',
        html:'开始时间:  '
    },{
        xtype:'datefield',
        readOnly:true,
        format:'Y-m-d'
    },'&nbsp;&nbsp;&nbsp;',{
        xtype:'label',
        html:'截止时间:  '
    },{
        xtype:'datefield',
        readOnly:true,
        format:'Y-m-d'
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
        text:'打印报表',
        iconCls: 'ak-icon icon-fly',
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
