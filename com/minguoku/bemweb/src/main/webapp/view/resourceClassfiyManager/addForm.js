var addForm=new Ext.ux.ExFormPanel({
    
    border:false,
    labelWidth:90,
    labelAlign:'right',
    // width: 500,
    // height:800,
    autoHeight : true,
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
                xtype:'textfield',
                name:'NAME',
                width:350,
                fieldLabel:'资源分类库名称'
    },{
                fieldLabel: 'ZTTYPEID',
                name:'ZTTYPEID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    },]

});
        