var addForm=new Ext.ux.ExFormPanel({
    
    border:false,
    labelWidth:65,
    labelAlign:'right',
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
                fieldLabel:'图书馆名称'
    },{
                xtype:'textfield',
                name:'OPAC',
                width:350,
                fieldLabel:'OPAC'
    }]

});

        