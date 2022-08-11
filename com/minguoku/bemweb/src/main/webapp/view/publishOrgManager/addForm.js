var addForm=new Ext.ux.ExFormPanel({
    
    border:false,
    labelWidth:65,
    autoHeight:true,
    labelAlign:'right',
    items:[
    {
                fieldLabel: 'ID',
                name:'ID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    },{
                xtype:'textfield',
                name:'NAME',
                width:350,
                allowBlank:false,
                fieldLabel:'对应出版社'
    }]

});

var addAddressForm=new Ext.ux.ExFormPanel({              //地址表单
    
    border:false,
    labelWidth:65,
    autoHeight:true,
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
        xtype:'datefield',
        name:'SETDATE',
        width:350,
        readOnly:true,
        format:'Y-m-d',
        allowBlank:false,
        fieldLabel:'设置时间'
    },{
        xtype:'datefield',
        name:'ENDDATE',
        readOnly:true,
        width:350,
        allowBlank:false,
        format:'Y-m-d',
        fieldLabel:'废止时间'
    },{
        xtype:'textarea',
        name:'ADDRESS',
        width:350,
        allowBlank:false,
        fieldLabel:'地址'
    },{
        fieldLabel: 'PUBLISHINGID',
        name:'PUBLISHINGID',
        hideLabel:true,
        xtype:'textfield',
        hidden:true
    }]

});

var addressForm=new Ext.ux.ExFormPanel({      //地址列表显示出版社名称
        border:false,
        labelWidth:65,
        autoHeight:true,
        labelAlign:'right',
        items:[{
            xtype:'textfield',
            name:'PUBLISHNAME',
            width:422,
            readOnly:true,
            fieldLabel:'出版社名称'
        }]
});
