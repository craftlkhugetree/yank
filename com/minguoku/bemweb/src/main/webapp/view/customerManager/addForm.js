var addForm=new Ext.ux.ExFormPanel({
    
    border:false,
    labelWidth:120,
    labelAlign:'right',
    items:[{
          layout:'column',
          items:[{
                columnWidth:0.5,
                layout:'form',
                items:[{
                    xtype:'textfield',
                    name:'NAME',
                    width:158,
                    tabIndex: 1,
                    allowBlank:false,
                    fieldLabel:'客户名称'
                }]
          },{
                columnWidth:0.5,
                layout:'form',
                items:[{
                    xtype:'textfield',
                    name:'NICKNAME',
                    width:150,
                    tabIndex: 2,
                    fieldLabel:'客户简称'
                }]
          }]
    },
    {
                xtype:'textfield',
                name:'ADDR',
                width:446,
                tabIndex: 3,
                fieldLabel:'通讯地址'
    },{
        layout:'column',
        items:[{
            columnWidth:0.5,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	width:158,
            	name:'PRINCIPAL',
                tabIndex: 4,
            	fieldLabel:'客户负责人'
            },{
            	xtype:'textfield',
            	name:'PRINCIPALEMAIL',
            	width:158,
                tabIndex: 6,
            	fieldLabel:'客户负责人邮箱'
            },{
                xtype:'textfield',
                name:'CONTACT',
                width:158,
                tabIndex: 8,
                fieldLabel:'客户联系人'
            },{
                xtype:'textfield',
                name:'CONTACTEMAIL',
                width:158,
                tabIndex: 10,
                fieldLabel:'客户联系人邮箱'
            },{
                xtype:'textfield',
                name:'PHONE',
                width:158,
                tabIndex: 12,
                fieldLabel:'电话'
            },{
                xtype:'combo',
                name:'UNITTYPE',
                width:158,
                editable:false,
                tabIndex: 14,
                fieldLabel:'单位性质'
            },{
                xtype:'textfield',
                name:'OPENBANK',
                width:158,
                tabIndex: 12,
                fieldLabel:'开户行'
            }]
        },{
            columnWidth:0.5,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	name:'PRINCIPALMOBILE',
            	width:150,
                tabIndex: 5,
            	fieldLabel:'客户负责人电话'
            },{
                xtype:'textfield',
                name:'PRINCIPALQQ',
                width:150,
                tabIndex: 7,
                fieldLabel:'客户负责人QQ'
            },{
                xtype:'textfield',
                name:'CONTACTMOBILE',
                width:150,
                tabIndex: 9,
                fieldLabel:'客户联系人手机'
            },{
                xtype:'textfield',
                name:'CONTACTQQ',
                width:150,
                tabIndex: 11,
                fieldLabel:'客户联系人QQ'
            },{
                xtype:'textfield',
                name:'FAX',
                width:150,
                tabIndex: 13,
                fieldLabel:'传真'
            },{
                xtype:'combo',
                name:'ISVALID',
                width:150,
                tabIndex: 15,
                editable:false,
                store:propertyIsmust,
                displayField:'NAME',
                valueField:'VALUE',
                mode:'local',
                triggerAction:'all',
                fieldLabel:'是否有效'
            },{
                xtype:'numberfield',
                name:'OPENNUM',
                width:150,
                tabIndex: 13,
                fieldLabel:'开户卡号'
            }]
        }]

    },
    {
                xtype:'textfield',
                name:'TAXNUM',
                width:446,
                tabIndex: 12,
                fieldLabel:'税号'
    },
    {
                fieldLabel: 'ID',
                name:'ID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    }]

});

var custumerAddForm=new Ext.ux.ExFormPanel({     //客户订单表单
        border:false,
        labelWidth:80,
        labelAlign:'right',
        items:[{
            xtype:'textfield',
            fieldLabel:'ID',
            name:'ID',
            hidden:true,
            hideLabel:true
        },
        // {
        //     xtype:'textfield',
        //     name:'',
        //     width:256,
        //     fieldLabel:'对应订单号'
        // },
        {
            xtype:'datefield',
            format:'Y-m-d',
            readOnly:true,
            fieldLabel:'开始时间',
            width:256,
            name:'BEGINDATE'
        },{
            xtype:'datefield',
            format:'Y-m-d',
            readOnly:true,
            fieldLabel:'结束时间',
            width:256,
            name:'ENDDATE'
        },{
            xtype:'numberfield',
            fieldLabel:'总金额(元)',
            width:256,
            name:'ZJE'
        },{
            xtype:'combo',
            fieldLabel:'可用资源列表',
            width:256,
            editable:false,
            store:resourceStore,
            displayField:'NAME',
            valueField:'ID',
            mode:'local',
            triggerAction:'all',
            name:'RESOURCEID'
        },{
            xtype:'textfield',
            fieldLabel:'CTID',
            name:'CTID',
            hidden:true,
            hideLabel:true
        }]
});


var custumerTryAddForm=new Ext.ux.ExFormPanel({     //增加试用表单
        border:false,
        labelWidth:65,
        labelAlign:'right',
        items:[{
            xtype:'textfield',
            fieldLabel:'ID',
            name:'ID',
            hidden:true,
            hideLabel:true
        },{
            xtype:'label',
            disabled:true,
            html:'温馨提示:<br/>只有少量人能新增试用订单，同一个单位只能试用一次，试用期限固定从当前日期开始3个月'
        },
        // {
        //     xtype:'textfield',
        //     name:'',
        //     width:256,
        //     fieldLabel:'对应客户'
        // },
        {
            xtype:'datefield',
            format:'Y-m-d',
            readOnly:true,
            fieldLabel:'开始时间',
            width:256,
            name:'BEGINDATE',
            listeners:{
                select:function(th){
                    custumerTryAddForm.form.findField('ENDDATE').setMinValue(th.value);
                }
            }
        },{
            xtype:'datefield',
            format:'Y-m-d',
            readOnly:true,
            fieldLabel:'结束时间',
            width:256,
            name:'ENDDATE'
        },{
            xtype:'combo',
            fieldLabel:'可用资源库',
            width:256,
            editable:false,
            store:resourceStore,
            displayField:'NAME',
            valueField:'ID',
            mode:'local',
            triggerAction:'all',
            name:'RESOURCEID'
        },{
            xtype:'textfield',
            fieldLabel:'CTID',
            name:'CTID',
            hidden:true,
            hideLabel:true
        }]
});

var ipAddForm=new Ext.ux.ExFormPanel({    //ip表单
        border:false,
        labelWidth:65,
        labelAlign:'right',
        items:[{
            xtype:'textfield',
            fieldLabel:'ID',
            name:'ID',
            hidden:true,
            hideLabel:true
        },{
            xtype:'textfield',
            name:'BEGINIP',
            width:256,
            fieldLabel:'开始IP'
        },{
            xtype:'textfield',
            fieldLabel:'结束IP',
            width:256,
            name:'ENDIP'
        },{
            xtype:'textfield',
            fieldLabel:'CTMID',
            name:'CTMID',
            hidden:true,
            hideLabel:true
        }]
});

var receiveAddForm=new Ext.ux.ExFormPanel({    //收款表单
        border:false,
        labelWidth:80,
        labelAlign:'right',
        items:[{
            xtype:'textfield',
            fieldLabel:'ID',
            name:'ID',
            hidden:true,
            hideLabel:true
        },
        // {
        //     xtype:'combo',
        //     name:'',
        //     width:256,
        //     fieldLabel:'对应订单'
        // },
        {
            xtype:'numberfield',
            name:'PAY',
            width:256,
            allowBlank:false,
            fieldLabel:'金额(元)'
        },
        {
            xtype:'datefield',
            format:'Y-m-d',
            readOnly:true,
            fieldLabel:'收款时间',
            allowBlank:false,
            width:256,
            name:'PAYDATE'
        },{
            xtype:'textfield',
            name:'INVOICENUM',
            width:256,
            fieldLabel:'发票号'
        },{
            xtype:'numberfield',
            name:'INVOICEPAY',
            width:256,
            fieldLabel:'发票金额(元)'
        },{
            xtype:'textfield',
            fieldLabel:'ORDERID',
            name:'ORDERID',
            hidden:true,
            hideLabel:true
        }]
});
var userForm =new Ext.ux.ExFormPanel({
		labelWidth : 60,
		defaults:{
			width:200
		},
		defaultType : "textfield",
		succMess:"保存成功!",
		saveUrl:akconfig.authurl+'rest/User/simpleSave',
            items:[
            {
				xtype: 'hidden',name : 'ID'
			},
			{
				xtype:'hidden',name :'USERTYPE',value:'2'
			},{
				xtype: 'hidden',name : 'TID',id:'usertid'
			},{	
				fieldLabel : '客户名称',	name : 'NAME', readOnly:true,id:'username'},{
	        	fieldLabel : '登录名',	name : 'LOGINNAME',id:'loginname',allowBlank:false}, {
				fieldLabel : '密码',	name : 'PWD',id:"upwd",inputType: 'password',itemCls :'x-pwd',allowBlank:false},
			]
	});
        