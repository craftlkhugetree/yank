var passwordForm=new Ext.FormPanel({
    border:false,
    // defaults: {labelWidth: 60},
    items:[{
        fieldLabel: '新密码',
        labelWidth: 30,
        id:'loacl-new-pass-word',
        name: 'PWD',
        allowBlank:false,
        vtype:'standard',
        blankText:'请填写密码',
        inputType: 'password',
        msgTarget:'qtip',
        xtype:'textfield'
    },{
        name: 'ID',
        height:0,
        id:'loacl-new-pass-id',
        hideLabel:true,
        xtype:'textfield',
        hidden:true
    }]    
});  
