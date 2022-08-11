var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '文章名', dataIndex: 'name'},
        {header: '创建人人', dataIndex: 'createName'},
        {
	        header: '是否置顶', 
	        dataIndex: 'isTop',
	        renderer:function(value){
	        	var xx;
	        	switch (value){
		           	case 1:xx='是';
		           		break;
		           	case 0:xx='否';
		           		break; 
	        	}
	        	return xx;
	        }
        },
        {header: '是否首页弹框', dataIndex: 'isDialog',
        renderer:function(value){var xx;switch (value){
           case 1:xx='是';break;case 0:xx='否';break; 
        }return xx}},
        {header: '弹框截止时间', dataIndex: 'dialogEndTime',
    	renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
         {header: '是否发布', dataIndex: 'isRelease',
        renderer:function(value){var xx;switch (value){
           case 1:xx='已发布';break;case 0:xx='未发布';break; 
        }return xx}},
        {header: '发布时间', dataIndex: 'releaseTime',
    	renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }}

    ]),
    viewConfig: {
        forceFit: true
    },
    bbar: new Ext.PagingToolbar({  
        pageSize:16,
        // height:50,   
        id:'CenterGrid-MainPT',
        cls:'ak-pager',
        store:CenterGridStore,
        beforePageText : "第",
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        listeners:{
            beforechange:function(a,param){
                 var start=param.start;
                 var page=param.start/10+1;
                 var xx={"start":start,"limit":10,"page":page,"filter":filters};
                 param.data=JSON.stringify(xx);
            }
        }
    }),
    tbar:[{
    	xtype:'button',
    	text:'新增',
    	iconCls: 'ak-icon icon-add',
        cls:'ak-btn btn-green ak-auth',
        akfun:'add',
        akfunID:'100231',
    	listeners:{
    		click:function(){
                addWindow.show();
                addWindow.setTitle('新增');
                htmlEditor.html('');
                addForm.getForm().getEl().dom.reset();
                addForm.form.findField('CONTENT').setValue('');
    		}
    	}
    },{
    	xtype:'button',
    	text:'编辑',
        iconCls: 'ak-icon icon-edit',
        cls:'ak-btn btn-blue ak-auth',
        akfun:'edit',
        akfunID:'100232',
    	listeners:{
    		click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=CenterGrid.getSelectionModel().getSelected();
                    addWindow.show();
                    addWindow.setTitle('编辑');
                    addForm.getForm().getEl().dom.reset();
                    var data = mianrecord.data;
                    data.dialogEndTime = akDateChange.timechange(data.dialogEndTime);
                    addForm.form.setValues(data);
                    var isToplenght = Ext.getCmp('isTop').items.items.length;
                    for (var i = 0; i < isToplenght; i++) {

                        Ext.getCmp('isTop').items.items[i].setValue(Ext.getCmp('isTop').items.items[i].inputValue == mianrecord.data.isTop);
                    }
                    
                    var isReleaselenght = Ext.getCmp('isRelease').items.items.length;
                    for (var i = 0; i < isReleaselenght; i++) {

                        Ext.getCmp('isRelease').items.items[i].setValue(Ext.getCmp('isRelease').items.items[i].inputValue == mianrecord.data.isRelease);
                    }
                    
                    var isDialoglenght = Ext.getCmp('isDialog').items.items.length;
                    for (var i = 0; i < isDialoglenght; i++) {

                        Ext.getCmp('isDialog').items.items[i].setValue(Ext.getCmp('isDialog').items.items[i].inputValue == mianrecord.data.isDialog);
                    }
                   
                  	mianrecord.data.dialogEndTime =  data.dialogEndTime.replace(new RegExp(/(:)/g), "").replace(new RegExp(/(-)/g), "").replace(/\s+/g, "");
                    htmlEditor.html(mianrecord.json.content);
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！')}
    		}
    	}
    },{
    	xtype:'button',
    	text:'删除',
        akfun:'delete',
        akfunID:'100233',
        iconCls: 'ak-icon icon-del',
        cls:'ak-btn btn-red ak-auth',
    	listeners:{
    		click:function(){
    			if(CenterGrid.getSelectionModel().getSelected()!=undefined){
	    			var data = CenterGrid.getSelectionModel().getSelected().data;
	    			if(data.isRelease==0){
	    				Ext.Ajax.request({
			                url:urls+'wxkNotice/delete/'+data.id,
			                method:'get',
			                success:function(conn, response, options){
			                    Ext.Msg.alert('提示！','删除成功！');
			                    Ext.getCmp('CenterGrid-MainPT').doLoad(0);
			
			                }
		           		})
	    			}else{
	    				Ext.Msg.alert('提示！','处于发布状态的新闻通知不可删除！');
	    			}
	    			
	    		}else{
	    			Ext.Msg.alert('提示！','请选择一条数据！')
	    		}
    		}
    	}
    },
 {
    	xtype:'button',
    	text:'发布',
        akfun:'release',
        akfunID:'100235',
        iconCls: 'ak-icon icon-fly',
        cls:'ak-btn btn-orange ak-auth',
    	listeners:{
    		click:function(){
    			
    		}
    	 }
    }],
    listeners:{
        beforerender:function(){
            Ext.getCmp('CenterGrid-MainPT').doLoad(0);
        }
        }
    });
