/**
 * 
 */
Ext.namespace('app');
app.MainPanel = Ext.extend(Ext.grid.GridPanel, {
	border:false,
	region : 'center',
	sm : new Ext.grid.RowSelectionModel({
		singleSelect : true
	}),
//	title:"服务器列表",
	columns : [{
		header : "原始名称",width : 220,sortable : true,dataIndex : 'SOURCENAME',id : 'SOURCENAME'}, {
		header : "别称俗称",	width : 100,sortable : true,dataIndex : 'OTHERNAME',id : 'OTHERNAME'},{
		header : "现今名",width : 220,sortable : true,dataIndex : 'NAME',id : 'NAME'}, {
		header : "方位里距",width : 220,sortable : true,dataIndex : 'FWLJ',id : 'FWLJ'}, {
		header : "设置年代",width : 220,sortable : true,dataIndex : 'SETYEAR',id : 'SETYEAR'}, {
		header : "设置朝代",width : 220,sortable : true,dataIndex : 'SETDYNASTY',id : 'SETDYNASTY'}, {
		header : "治所",width : 220,sortable : true,dataIndex : 'GOVLOCAL',id : 'GOVLOCAL'}, {
		header : "辖境范围",width : 220,sortable : true,dataIndex : 'MAREA',id : 'MAREA'}, {
		header : "后改名",width : 220,sortable : true,dataIndex : 'BACKNAME',id : 'BACKNAME'}, {	
		header : "废止时间",width : 220,sortable : true,dataIndex : 'ENDYEAR',id : 'ENDYEAR'}, {
		header : "废止朝代",width : 220,sortable : true,dataIndex : 'ENDDYNASTY',id : 'ENDDYNASTY'}
	],
	autoExpandColumn : "NAME",
	initComponent : function() {
		var _ths=this;
		this.tbar=[ {
			text : "新增",
			handler :function(){
				var _ths=this;
				app.edit.show({
					data:{PTYPE:"1",SLOT:0,SUBSLOT:0,BORTNUM:0},
					callback:function(){
						_ths.store.reload();
//						Ext.Msg.alert('提示', '保存成功!');
					}
				});
			},
			scope: this
		}, {
			text : "修改",
			handler : function() {
				var _ths=this;
				var sel = this.getSelectionModel().getSelected();
				if (sel != null) {
					app.edit.show({
						data:sel.data,
						callback:function(){
							_ths.store.reload();
//							Ext.Msg.alert('提示', '保存成功!');
						}
					});
				} else {
					Ext.Msg.alert('提示', '请先选择一个服务器再点击编辑!');
				}
			},
			scope : this
		},{
			text : "删除",
			handler :function(){
				var _ths=this;
				var sel = this.getSelectionModel().getSelected();
				var doDel = function(btn) {
					if (btn == 'yes') {
						Ext.Ajax.request({
							url : app.cfg.appRoot+'/rest/Geography/delete',
							params : "d=" + sel.data.ID,
							success : function(dt) {
								dt = Ext.util.JSON.decode(dt.responseText);
								if (dt.success) {
									_ths.store.reload();
									FrameWork.comm.MessOnly.show('提示', '删除成功!', null);
								}
							}
						});
					}
				}
				if (sel != null) {
					Ext.Msg.show({
						title : '提示',
						msg : '确认删除当前选择的交换机吗?',
						buttons : Ext.Msg.YESNO,
						fn : doDel,
						icon : Ext.MessageBox.QUESTION
					});
				} else {
					Ext.Msg.alert('提示', '请先选择一个服务器!');
				}
			},
			scope: this
		}];
		
		var reader = new Ext.data.JsonReader({  //记录中要读取的字段
		    fields : ["ID","SOURCENAME","OTHERNAME","NAME","FWLJ","SETYEAR","SETDYNASTY","GOVLOCAL","MAREA","BACKNAME","ENDYEAR","ENDDYNASTY"],
		    root:'items',
		    id :'ID',
		    totalProperty :'total'
		});
		this.store = new Ext.data.Store({
	        proxy: new Ext.data.HttpProxy({
	            url: app.cfg.appRoot+'/rest/Geography/list',
	            method:"POST"
	        }),
		    reader:reader
		});
		
//		this.store = new Ext.data.JsonStore({
//			url : adsweb.oscfg.cfg.appRoot+'/rest/Geography/list',
//			root : 'data',
//			id : "ID",
//			totalProperty : "results",
//			fields : ["ID","NAME","LOGINNAME","STATUS"]
//		});

		app.MainPanel.superclass.initComponent.call(this,arguments); // 调用父类的initComponent
	},
	ini:function(){
		this.store.reload();
	}

});
