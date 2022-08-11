var addOrgForm=new Ext.ux.ExFormPanel({     //机构表单
    
    border:false,
    labelWidth:65,
    labelAlign:'right',
    // width: 500,
    // height:800,
    // autoHeight : true,
    //defaults: {labelWidth:65,labelAlign:'right'},
    items:[
     {
            xtype:'label',
            disabled:true,
            style:'text-align: left;disabled:true',
            html:'温馨提示:1.下拉框只能输入下拉列表里的数据，否则会保存失败<br/>2.时间输入格式为xxxx-xx-xx,否则会保存失败'
     },
     {
            layout:'column',
            items:[{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'textfield',
                        width:150,
                        name:'NAME',
                        allowBlank:false,
                        vtype:'standard',
                        blankText:'请填写机构名称',
                        msgTarget:'qtip',
                        fieldLabel:'机构名称'
                  }]
            },{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{    
                    xtype:'combo',
                    name:'PARENTID',
                    //editable:false,
                    width:150,
                    store:appointOrganStore,
                    displayField:'NAME',
                    valueField:'ID',
                    mode:'local',
                    triggerAction: 'all',
                    fieldLabel:'上级机构'
                  }]
            }]
     },{
            layout:'column',
            items:[{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'datefield',
                        name:'SETDATE',
                        width:150,
                       // readOnly:true,
                        format:'Y-m-d',
                        allowBlank:false,
                        inputFormat:'Y-m-d',
                        fieldLabel:'设置时间'
                   }]
            },{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'datefield',
                        name:'ENDDATE',
                        width:150,
                        //readOnly:true,
                        format:'Y-m-d',
                        allowBlank:false,
                        inputFormat:'Y-m-d',
                        fieldLabel:'废止时间'
                  }]
            }]
     },{
            layout:'column',
            items:[{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'textfield',
                        name:'TYPE',
                        width:150,
                        vtype:'standard',
                        fieldLabel:'性质'
                   }]
            },{
                  columnWidth:0.5,
                  layout:'form',
                  items:[{
                        xtype:'combo',
                        name:'SOURCEORGID',
                        //editable:false,
                        width:150,
                        store:appointOrganStore,
                        displayField:'NAME',
                        valueField:'ID',
                        mode:'local',
                        triggerAction: 'all',
                        fieldLabel:'原机构'
                  }]
            }]
     },

    {
                xtype:'combo',
                name:'SETACCORDING',
                //editable:false,
                width:411,
                store:setStore,
                displayField:'NAME',
                valueField:'ID',
                mode:'local',
                triggerAction: 'all',
                fieldLabel:'设置依据'
    },
    {
                xtype:'combo',
                name:'ENDACCORDING',
                width:411,
                //editable:false,
                store:setStore,
                displayField:'NAME',
                valueField:'ID',
                mode:'local',
                triggerAction: 'all',
                fieldLabel:'废止依据'
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
    },{
        layout:'column',
        items:[{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                style:'margin-left:23px',
                html:'修改人:'
            },{
                    xtype: "label",
                    id:"MODIFIER",
                    disabled:true,
                    text: ""
            }]
        },{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                html:'修改时间:'
            },{
                    xtype: "label",
                    id:"MODIFYDATE",
                    disabled:true,
                    text: ""
            }]
        }]
    },
    {
                fieldLabel: 'ID',
                name:'ID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    }]

});