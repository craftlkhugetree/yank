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
                xtype:'textarea',
                name:'TITLE',
                width:350,
                allowBlank:false,
                fieldLabel:'标题'
    },{
                xtype:'textfield',
                name:'AUTHOR',
                width:350,
                fieldLabel:'评论人'
    },{
                xtype:'datetimefield',
                name:'COMMENTTIME',
                format:'Y-m-d H:i:s',
                width:350,
                fieldLabel:'评论时间'
    },new Ext.form.RadioGroup({
                layout: 'column',
                fieldLabel: '是否展示',
                allowBlank:false,
                id: 'ISSHOW',
                width: 200,
                items: [new Ext.form.Radio({
                    name: 'ISSHOW',
                    boxLabel: '是',
                    inputValue: '1'
                }), new Ext.form.Radio({
                    name: 'ISSHOW',
                    boxLabel: '否',
                    inputValue: '0'
                })]
    }),{
                xtype:'textarea',
                name:'CONTENT',
                width:350,
                fieldLabel:'评论内容'
    },{
        layout:'column',
        items:[{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                style:'margin-left:23px',
                html:'创建人:'
            },{
                    xtype: "label",
                    id:"CREATER",
                    disabled:true,
                    text: ""
            }]
        },{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                html:'创建时间:'
            },{
                    xtype: "label",
                    id:"CREATEDATE",
                    disabled:true,
                    text: ""
            }]
        }]
    }]

});

        