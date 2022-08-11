/**
 * 
 */
Ext.namespace('app');

app.edit={
		_ele : null,// 缓存的界面元素
		/**
		 * 初始化界面
		 */
		_ini : function() {
			var _ths=this;
			this._ele = new Ext.Window({
				layout : 'fit',
				title : "操作系统配置编辑",
				width : 650,
				height : 600,
				modal:true,
				closeAction : 'hide',
				items : [ new Ext.ux.ExFormPanel({
					labelWidth : 90,
//					defaults:{
//						width:200
//					},
//					defaultType : "textfield",
					succMess:"保存成功!",
					saveUrl:app.cfg.appRoot+'/rest/Geography/save',
			        items:[{
			            layout:'column',
			            border:false,
			            items:[{
			                columnWidth:.5,
			                layout: 'form',
			                border:false,
			                defaultType : "textfield",
							defaults:{
								width:180
							},
			                items: [{
		            	xtype: 'hidden',name : 'ID'},{	
			        	fieldLabel : '原始名称',	name : 'SOURCENAME'}, {
						fieldLabel : '别称俗称',	name : 'OTHERNAME',xtype:"textarea"},{
						fieldLabel : '现今名',	name : 'NAME'},{
						fieldLabel : '后改名',	name : 'BACKNAME'},{							
						fieldLabel : '方位里距',	name : 'FWLJ'},{
						fieldLabel : '设置年代',	name : 'SETYEAR'}
						
						]},{
			                columnWidth:.5,
			                layout: 'form',
			                border:false,
			                defaultType : "textfield",
							defaults:{
								width:180
							},
			                items: [{
						fieldLabel : '设置朝代',	name : 'SETDYNASTY'},{
						fieldLabel : '废止时间',	name : 'ENDYEAR'},{
						fieldLabel : '废止朝代',	name : 'ENDDYNASTY'},{						
						fieldLabel : '治所',	name : 'GOVLOCAL',xtype:"textarea"},{
						fieldLabel : '辖境范围',	name : 'MAREA',xtype:"textarea"}					
					]}]
		            }]
				})
				],
				buttons : [ {
					text : '提交',
					handler : function(b) {
						var _ths = this;
						_ths._ele.items.get(0).saveToServer({
							succFun:_ths._data.callback
						});
						_ths._ele.hide();
					},
					scope: this
				}, {
					text : '关闭',
					handler : function(b) {
						var _ths = this;
						_ths._ele.hide();
					},
					scope: this
				} ]
			});
		},

		
		show : function(data) {
			this._data = data;
			if (this._ele == null) {// 初始化界面元素
				this._ini();
			}
			// 初始化数据
			this._ele.items.get(0).setValues(this._data.data);
			this._ele.show();
		}

	}
