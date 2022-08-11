var OrgMainGrid = new Ext.grid.GridPanel({
    title:'用户列表',
    region:'center',
    split:true,
    layout:'fit',
    collapsible:false,
    store: OrgMainStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '编号', width: 120, dataIndex: 'CODE', sortable: true},
        {header: '登录名', width: 150, dataIndex: 'LOGINNAME', sortable: true},
        {header: '用户名', width: 150, dataIndex: 'NAME', sortable: true},
        {header: '所属角色', width: 150, dataIndex: 'ROLENAME', sortable: true},
        {header: '所属部门', width: 150, dataIndex: 'ORGNAME', sortable: true},
        {header: '手机号', width: 120, dataIndex: 'PHONE', sortable: true},
        {header: 'EMAIL', width: 120, dataIndex: 'EMAIL', sortable: true},
        {header: '性别', width: 50, dataIndex: 'SEXNAME', sortable: true},
        {header: '身份证号码', width: 120, dataIndex: 'IDENTITYNUM', sortable: true,
             renderer:function(value){var xx;

                return value.substring(0,9)+'XXXX'+value.substring(9,value.length-1)}},
        {header: '工作时间', width: 120, dataIndex: 'WORKTIME', sortable: true},
        {header: '进校时间', width: 120, dataIndex: 'INTOSCHOOLTIME', sortable: true},
        {header: '籍贯', width: 120, dataIndex: 'NATIVEPALCE', sortable: true},
        {header: '联系电话', width: 120, dataIndex: 'TEL', sortable: true},
        {header: '地址', width: 120, dataIndex: 'ADDRESS', sortable: true},
        {header: 'QQ', width: 120, dataIndex: 'QQ', sortable: true},
        {header: '微博', width: 120, dataIndex: 'TWITTER', sortable: true},
        {header: '微信', width: 120, dataIndex: 'WECHAT', sortable: true},
        {header: '职称', width: 120, dataIndex: 'TITLE', sortable: true},
        {header: '职务', width: 120, dataIndex: 'POSTID', sortable: true},
        {header: '兼任职务', width: 120, dataIndex: 'ADDPOSTID', sortable: true},
        {header: '学历', width: 120, dataIndex: 'XLNAME', sortable: true},
        {header: '学位', width: 120, dataIndex: 'XWNAME', sortable: true},
        {header: '个人照片', width: 120, dataIndex: 'PHOTO', sortable: true,hidden:true},
        {header: '备注', width: 120, dataIndex: 'REMARK', sortable: true},
        {header: '登陆次数', width: 120, dataIndex: 'LOADCOUNT', sortable: true},
        
        {header: '状态', width: 50, dataIndex: 'STATUS', sortable: true,
         renderer:function(value){var xx;switch (value){
            case '1':xx='正常';break;case '0':xx='不正常';break; 
        }return xx}}


    ]),
    bbar: new Ext.AkPagingToolbar({  
        pageSize:16,  
        id:'sys-roleMainPT',
        cls:'ak-pager',
        store:OrgMainStore,
         beforePageText : "第",
         displayInfo: true,
         displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        listeners:{
            beforechange:function(a,param){
                // var start=param.start;
                // var page=param.start/16+1;
                param.filter=JSON.stringify(rolegridfilter);
                // var xx={"filter":rolegridfilter,"start":start,"limit":10,"page":page};
                // param.data=JSON.stringify(xx);
            }
        }
    }),
    tbar:[
    // new Ext.Button({
    //     id:'addnewvoteforgird',
    //     text:"新增用户",
    //     cls:'ak-btn btn-blue',
    //     listeners:{
    //       click:function(){
    //         if(ORGID){
    //             addWindow.show();
    //             addWindow.setTitle('新增人员');
    //             addForm.getForm().getEl().dom.reset();
    //             Ext.getCmp('look-up-field').hide();
    //             // SelectRole.load();
    //             // eastConBoxTreeStore.load(Ext.getCmp('tree-org-combos').getRootNode(),function(){});
          
    //         }else{
    //             Ext.Msg.alert("提示",'请先选择统一认证用户！');
    //         }
            
    //       }
    //     }
    // }),
    new Ext.Button({
        //id:'addnewvoteforgird',
        text:"编辑用户",
        iconCls: 'ak-icon icon-edit',
        cls:'ak-btn btn-blue ak-auth',
        akfun:'edit',
        akfunID:'100011',
        //cls:'ak-btn btn-purple',
        listeners:{
            click:function(){
                if(ORGID){
                        if(OrgMainGrid.getSelectionModel().getSelected()!=undefined){
                            // addEditWindow.show();
                            // addEditForm.getForm().getEl().dom.reset();
                            addWindow.show();
                            addWindow.setTitle('编辑人员');
                            addForm.getForm().getEl().dom.reset();
                            Ext.getCmp('look-up-field').hide();
                            SelectRole.load({params:{'auth':json_data},callback:function(){
                                
                                Ext.getCmp('select-role-combo-edit').setValue(Ext.getCmp('select-role-combo-edit').getValue());
                            }});
                            eastConBoxTreeStore.load(Ext.getCmp('tree-org-combos-edit').getRootNode(),function(){});
                            var mianrecord = OrgMainGrid.getSelectionModel().getSelected();
                            var INTIME=mianrecord.data.INTOSCHOOLTIME;
                            if (mianrecord.data.PHOTO) {
                                Ext.getCmp('look-up-field').show();
                                Ext.getCmp('look-up-field').downloadurl=mianrecord.data.PHOTO;//传的是ID
                                
                            }else{

                            }
                            mianrecord.data.INTOSCHOOLTIME=akDateChange.timechangeymd(INTIME);
                            for(var key in mianrecord.data){
                               
                                try{    
                                    var adddata=mianrecord.data[key];
                                   
                                    addForm.form.findField(key).setValue(adddata); 
                                }catch(e){}
                            }
                            mianrecord.data.INTOSCHOOLTIME=INTIME;
                        }else{Ext.Msg.alert("提示",'请选择一条数据进行编辑！')}
                }else{
                    Ext.Msg.alert("提示",'请先选择统一认证用户！');
                }
               
          
            }
        }
    }),
    new Ext.Button({
        //id:'addnewvoteforgird',
        text:"删除用户",
        iconCls: 'ak-icon icon-del',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100012',
        //cls:'ak-btn btn-red',
        listeners:{
          click:function(){
            if(ORGID){
               akCommFunction.deleterecord(OrgMainGrid,"sys-roleMainPT","User/delete",json_data);
            }else{
                    Ext.Msg.alert("提示",'请先选择统一认证用户！');
            }
          }
        }
    }),{
        xtype:'button',
        text:'重置密码',
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-orange ak-auth',
        akfun:'reset',
        akfunID:'100013',
        //cls:'ak-btn btn-green',
        listeners:{
            click:function(){
                if(ORGID){
                        if(OrgMainGrid.getSelectionModel().getSelected()!=undefined){
                            password.show();
                            password.setTitle('修改密码');
                            passwordForm.getForm().getEl().dom.reset();
                            var mianrecord = OrgMainGrid.getSelectionModel().getSelected();
                            
                            Ext.getCmp('loacl-new-pass-id').setValue(mianrecord.id);

                        }else{Ext.Msg.alert("提示",'请选择一条数据进行修改！')}
                }else{
                    Ext.Msg.alert("提示",'请先选择统一认证用户！');
                }
            }
        }

    },
    '->',new  Ext.form.TextField({
        id:'sys-rolequerykeyword',
        name:'KEYWORD',
        width:150
    }),new Ext.Button({
        text:"查询",
        cls:'ak-btn btn-green',
        iconCls:'ak-icon icon-search',
        listeners:{
            click:function(){
                rolegridfilter={"SEARCH":false,"ORGID":ORGID,"KEYWORD":Ext.getCmp('sys-rolequerykeyword').getValue()};
                Ext.getCmp('sys-roleMainPT').doLoad(0);
            
            }
        }
    }),new Ext.Button({
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-green',       
        text:"重置",
        listeners:{
            click:function(){
                Ext.getCmp('sys-rolequerykeyword').setValue("");
                rolegridfilter={"SEARCH":false,"KEYWORD":'',"ORGID":ORGID};
            
                Ext.getCmp('sys-roleMainPT').doLoad(0);
        
            }
        }
    })],
    listeners:{
        render:function(){
            akconfig.checkAuth(['100010'],userid);
        }
    }
    

});
