Ext.namespace("Fun1.Grid");
Fun1.Grid={
	ini:function(){
		//grid的选择方式，singleSelect为false为多选
		var sm=new Ext.grid.CheckboxSelectionModel({singleSelect:true});
		this.grid=new Ext.grid.GridPanel({
			store: CenterGridStore,//表格显示的数据
		    sm:sm,//表格单选还是多选
		    cm: new Ext.grid.ColumnModel([//声明grid显示的每一列
		        sm,//显示选择框
		        {
		        	header: '大事记名称',//列显示名称 
		        	dataIndex: 'NAME',//加载数据的属性ID
		        	id:"NAME",//列ID,主要用在下面的autoExpandColumn中
		        	width:100,//列宽
		        	sortable : true//是否可排序
		        },
		        {header: '关键字', dataIndex: 'KEYWORD',id:"KEYWORD",width:100,sortable : true},
		        {header: '具体描述', dataIndex: 'DES',id:"DES",width:100,sortable : true},
		        {header: '附件', dataIndex: 'ATTACHID_NAME',id:"ATTACHID_NAME",width:100,sortable : true},
		        {header: '来源', dataIndex: 'SOURCETYPE_NAME',id:"SOURCETYPE_NAME",width:50,sortable : true},
		        {header: '来源的原事件名称', dataIndex: 'SOURCENAME',id:"SOURCENAME",width:100,sortable : true},
		        {header: '创建时间', dataIndex: 'CREATETIME',id:"CREATETIME",width:120,sortable : true,
		        	renderer:function(value){//显示列的内容可以自己根据数据内容进行再加工
		        		var xx=akDateChange.timechange(value); return xx; 
		        	}}
		    ]),
		    autoExpandColumn : "DES",//设置DES列数据为根据显示区宽度自动显示其宽，其它列固定不变
		//    viewConfig: {//当不设置autoExpandColumn时，可以用这个配置，使得grid中的每列按比例撑满显示区
		//        forceFit: true
		//    },
		    bbar: new Ext.PagingToolbar({//在表格下面显示页号翻页toolbar
		        pageSize:16,
		        cls:'ak-pager',
		        store:CenterGridStore,
		        displayInfo: true,
		        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
		        beforePageText : "第"
		    }),
		    tbar:[{//在表格上面显示按钮
		        xtype:'button',
		        text:'新增',
		        iconCls: 'ak-icon icon-add',
		        cls:'ak-btn btn-red ak-auth',
		        akfun:'add',//按钮编码，如果按钮有该值表示本按钮要被权限控制
		        handler:function(){
	                addWindow.show();
	                addWindow.setTitle('新增');
	                addTwoDimeForm.form.reset();
	                Ext.getCmp('look-up-field').setVisible(false);
		        },
				scope : this
		    },{
		    	xtype:'button',
		    	text:'编辑',
		        iconCls: 'ak-icon icon-edit',
		    	cls:'ak-btn btn-blue ak-auth',
		        akfun:'edit',
		    	listeners:{
		    		click:function(){
		              if(CenterGrid.getSelectionModel().getSelected()!=undefined){
		                var mianrecord=CenterGrid.getSelectionModel().getSelected();
		                addWindow.show();
		                addWindow.setTitle('编辑');
		                addTwoDimeForm.setValues(mianrecord.data);
		                Ext.getCmp('look-up-field').setVisible(false);
		                if(mianrecord.data.hasOwnProperty('ATTACHID')&&mianrecord.data.ATTACHID!=''){
		                     Ext.getCmp('look-up-field').downloadurl=mianrecord.data.ATTACHID;//传的是ID
		                     Ext.getCmp('look-up-field').show();
		                }
		                
		              }else{Ext.Msg.alert('提示！','请选择一条数据编辑！')}
		    		}
		    	}
		    },{
		    	xtype:'button',
		    	text:'删除',
		        iconCls: 'ak-icon icon-del',
		    	cls:'ak-btn btn-red ak-auth',
		        akfun:'delete',
		    	listeners:{
		    		click:function(){
		    			akCommFunction.deleterecord(CenterGrid,'CenterGrid-MainPT','Event/delete');
		    		}
		    	}
		    },{
		    	xtype:'button',
		    	text:'导出EXCEL',
		        iconCls: 'ak-icon icon-search',
		    	cls:'ak-btn btn-orange ak-auth',
		        akfun:'export',
		    	listeners:{
		    		click:function(){
		                    var mianrecord=CenterGrid.getSelectionModel().getSelected();
		    			   window.open(urls+'Event/exportExcel');
		    		}
		    	}
		    },
		    // {
		    //     xtype:'button',
		    //     text:'导出WORD',
		    //     iconCls: 'ak-icon icon-fly',
		    //     cls:'ak-btn btn-orange ak-auth',
		    //     listeners:{
		    //         click:function(){
		                
		    //         }
		    //     }
		    // },
		    '->',{
		        xtype:'label',
		        html:'资源由来：'
		    },new Ext.form.ComboBox({
		                name:"ISNATIVE",
		                store:resourceStore,
		                id:'resourceId',
		                displayField:"NAME",
		                valueField:"CODE",
		                width:120,
		                editable:false,
		                triggerAction: 'all',
		                mode :'local'
		    }),'&nbsp;&nbsp;&nbsp;',{
		        xtype:'textfield',
		        id:'keywordEvent',
		        name:'KEYWORD',
		        width:150
		    },{
		        xtype:'button',
		        cls:'ak-btn btn-green',
		        iconCls:'ak-icon icon-search',
		        text:'查询',
		        listeners:{
		            click:function(){
		                CenterGridStore.load({params:{limit:16,start:0,filter:JSON.stringify({SOURCETYPE:Ext.getCmp('resourceId').getValue(),KEYWORD:Ext.getCmp('keywordEvent').getValue()})}});
		            }
		        }
		    },{
		        xtype:'button',
		        text:'重置',
		        iconCls:'ak-icon icon-reset',
		        cls:'ak-btn btn-green',
		        listeners:{
		            click:function(){
		                Ext.getCmp('resourceId').setValue('');
		                Ext.getCmp('keywordEvent').setValue('');
		                CenterGridStore.load({params:{limit:16,start:0}});
		            }
		        }
		    }],
		    listeners:{
		        render:function(th){
		            // akconfig.checkAuth(['10000']);
		            th.getStore().load({
		                params:{SEARCH:false,start:0,limit:16}
		            });
		        }
		    }
		});
		return this.grid;
	}
}


