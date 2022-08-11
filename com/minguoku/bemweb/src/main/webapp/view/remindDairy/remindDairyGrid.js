var addForm=new Ext.FormPanel({
    title:'设置提醒时间与数量警戒值',
    border:false,
    labelWidth:90,
    labelAlign:'right',
    // width: 500,
    // height:800,
    autoHeight : true,
    tbar:[{
        xtype:'button',
        text:'保存',
        cls:'ak-btn btn-blue ak-auth',
        listeners:{
            click:function(){

            }
        }
    }],
    //defaults: {labelWidth:65,labelAlign:'right'},
    items:[
    {
                fieldLabel: 'ID',
                name:'ID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    },
    {
                xtype:'combo',
                name:'KEYWORD',
                width:350,
                editable:false,
                fieldLabel:'到期时间设置'
    }]

});



var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    title:'提醒日志查询',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    height:document.documentElement.clientHeight-125,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([
        {header: '客户', dataIndex: 'NAME',width:120},
        {header: '提醒时间', dataIndex: 'LASTTIME',width:140,
    	renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
        {header: '订单过期时间', dataIndex: 'LASTTIME',width:140,
        renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
        {header: '提醒到', dataIndex: 'NAME',width:120},
        {header: '客户联系人', dataIndex: 'NAME',width:120},
        {header: '客户联系电话', dataIndex: 'NAME',width:120}
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
        html:'提醒开始时间:  '
    },{
        xtype:'datefield',
        readOnly:true,
        format:'Y-m-d'
    },'&nbsp;&nbsp;&nbsp;',{
        xtype:'label',
        html:'提醒截止时间:  '
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
        text:'重置',
        iconCls: 'ak-icon icon-search',
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
