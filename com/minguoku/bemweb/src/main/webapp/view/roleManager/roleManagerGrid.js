var OrgMainGrid = new Ext.grid.GridPanel({
    title:'角色列表',
    region:'center',
    split:true,
    layout:'fit',
    collapsible:false,
    store: OrgMainStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选

        {header: '角色名称', width: '70%', dataIndex: 'NAME', sortable: true},
        {header: '操作',/* width: 90,*/ dataIndex: 'ISUSE', sortable: true,hidden:true,
        renderer:function(value){var xx;switch (value){
            case '':xx='<img src="../../resources/images/delete.jpg" style="width:20px;height:20px;" alt="删除"/>';break;
        }return xx}},
        {header: '描述', width: 200, dataIndex: 'DES', sortable: true,hidden:true}


    ]),
    listeners:{
        rowclick:function(th,rowIndex,e){
           // Ext.getCmp('role-tree-savebutton').disabled=false;
            var r=OrgMainGrid.getSelectionModel().getSelected();
            if(r!=null){
                    ROLEID=r.id;
                    var data={"ROLEID":r.id};
                    var datatree=JSON.stringify(data);
                    authRegisity(datatree);
                    addForm2.form.findField("ID").setValue(r.id);
                    addForm2.form.findField("NAME").setValue(r.json.NAME);
                    addForm2.form.findField("DES").setValue(r.json.DES);
            }else{
                        addForm2.getForm().getEl().dom.reset();
                        authRegisity();
                        ROLEID='';
            }
            
        },
        render:function(){
                  akconfig.checkAuth(['100020'],userid);
        }
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:16,  
        id:'roleMainPT',
        cls:'ak-pager',
        store:OrgMainStore,
         beforePageText : "第",
         displayInfo: true,
         displayMsg: '共{2}条',
        listeners:{
            beforechange:function(a,param){
                // var start=param.start;
                // var page=param.start/10+1;
                // var xx={"start":start,"limit":10,"page":page};
                // param.data=JSON.stringify(xx);
                param.filter=JSON.stringify(rolegridfilter);
               // param.data=JSON.stringify(xx);
            }
        }
    }),
    tbar:[
    //  new Ext.Button({
    //     id:'addnewvoteforgird',
    //     text:"新增",
    //     iconCls: 'ak-icon icon-add',
    //     cls:'ak-btn btn-green',
    //     listeners:{
    //       click:function(){
    //         addWindow.show();
    //         addWindow.setTitle('新增');
    //         addForm.getForm().getEl().dom.reset();
          
    //         }
    //     }
    // }),
    // new Ext.Button({
    //     id:'addnewvoteforgird',
    //     text:"编辑",
    //     iconCls: 'ak-icon icon-edit',
    //     cls:'ak-btn btn-blue',
    //     listeners:{
    //         click:function(){
    //             if(OrgMainGrid.getSelectionModel().getSelected()!=undefined){
    //                 addWindow.show();
    //                 addWindow.setTitle('编辑');
    //                 addForm.getForm().getEl().dom.reset();
    //                 var mianrecord = OrgMainGrid.getSelectionModel().getSelected();
    //                 for(var key in mianrecord.data){
    //                     try{    
    //                         var adddata=mianrecord.data[key];
                           
    //                         addForm.form.findField(key).setValue(adddata); 
    //                     }catch(e){}
    //                 }
    //             }else{Ext.Msg.alert("提示",'请选择一条数据进行编辑！')}
          
    //         }
    //     }
    // }),
    new Ext.Button({
        id:'addnewvoteforgird',
        text:"删除",
        iconCls: 'ak-icon icon-del',
        cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100022',
        listeners:{
          click:function(){
            deleteRole(OrgMainGrid,"roleMainPT","Role/delete",json_data);
           

            }
        }
    })
    // ,
    // '->',new  Ext.form.TextField({
    //     id:'rolequerykeyword',
    //     name:'KEYWORD',
    //     width:150
    // }),new Ext.Button({
    //     text:"查询",
    //     cls:'ak-btn btn-green',
    //     iconCls:'ak-icon icon-search',
    //     listeners:{
    //         click:function(){
    //             rolegridfilter={"SEARCH":false,"NAME":Ext.getCmp('rolequerykeyword').getValue()};
    //             Ext.getCmp('roleMainPT').doLoad(0);
            
    //         }
    //     }
    // }),new Ext.Button({
    //     iconCls:'ak-icon icon-reset',
    //     cls:'ak-btn btn-green',       
    //     text:"重置",
    //     listeners:{

    //     click:function(){
    //         Ext.getCmp('rolequerykeyword').setValue("");
    //         rolegridfilter={"SEARCH":false,"KEYWORD":''};
        
    //         Ext.getCmp('roleMainPT').doLoad(0);
    
    //         }
    //     }
    // })
    ]
    

});
