// var centerPanel=new Ext.Panel({
//   title:'角色列表',
//     region:'center',
//     split:true,
//     layout:'fit',
//     collapsible:false,
//     margins:'3 0 3 3',
//     cmargins:'3 3 3 3',
//     items:[OrgMainGrid],
    
// });
var addForm2=new Ext.FormPanel({
        labelWidth: 75, // label settings here cascade unless overridden
        border:false,
        width: 400,
        defaults: {width: 500},
        labelWidth :100,
        items:[{
            fieldLabel: '角色名称',
            name: 'NAME',
            allowBlank:false,
            vtype:'standard',
            blankText:'请填写角色名称',
            msgTarget:'qtip',
            xtype:'textfield'
           
        },new Ext.form.TextArea({
            fieldLabel: '描述',
            vtype:'standard',
            name:"DES"
        }),{
            name: 'ID',
            hideLabel:true,
            xtype:'textfield',
            hidden:true
        }]

    });


var addForm={
        margin: '0 0 0 10',
        xtype: 'fieldset',
        title:'基本信息',
        height:150,
        layout: 'fit',
        // labelWidth: 75, // label settings here cascade unless overridden
        // border:false,
        // width: 400,
        defaults: {width: 300},
        labelWidth :100,
        items:[addForm2]

    };

var addRole=new Ext.FormPanel({               //增加角色
        labelWidth: 75, // label settings here cascade unless overridden
        border:false,
        width: 400,
        defaults: {width: 300},
        labelWidth :100,
        items:[{
            fieldLabel: '角色名称',
            name: 'NAME',
            allowBlank:false,
            vtype:'standard',
            blankText:'请填写角色名称',
            msgTarget:'qtip',
            xtype:'textfield'
           
        },new Ext.form.TextArea({
            fieldLabel: '描述',
            vtype:'standard',
            name:"DES"
        }),{
            name: 'ID',
            hideLabel:true,
            xtype:'textfield',
            hidden:true
        }]

    });