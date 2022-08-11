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
    cm: new Ext.grid.ColumnModel([
        {header: '是否统计', dataIndex: 'NAME',width:120,
          renderer:function(value){
                return '<input type="checkbox">';
          }},
        {header: '日志类型', dataIndex: 'rzlx',width:140}
    ]),
    tbar:[{
        xtype:'button',
        text:'保存',
        iconCls: 'ak-icon icon-add',
        cls:'ak-btn btn-orange ak-auth',
        listeners:{
            click:function(){

            }
        }
    }],
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
    listeners:{
        beforerender:function(th){
            
            th.getStore().load({
                params:{SEARCH:false,start:0,limit:16}
            });
        }
    }
    

});
