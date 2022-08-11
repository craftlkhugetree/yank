/**
 * 扩展FormPanel
 */
Ext.namespace('Ext.ux');
Ext.ux.ExFormPanel = Ext.extend(Ext.form.FormPanel, {

	//defaultType : "textfield",
	//bodyStyle : 'padding:5px 5px 0',
	
	/**
	 * 保存数据到后台的url
	 */
	saveUrl:"",
	
	/**
	 * 保存成功的提示信息
	 */
	succMess:"保存成功!",
	
	/**
	 * 从面板中获取所有field的值，包括嵌套面板中的field
	 */
	getValues : function() {
		var ic=0;
		var res = {};
		var would = [ this.items ];
		var validate = true;
		while (would.length > 0) {
			var items = would.shift();
			items.each(function(item) {
				ic++;
				if (ic>1000){
					throw new error("已经从1000个输入框中获取了数据，但是仍未结束。估计是界面嵌套出现了死循环!");
				}
				if (item.isFormField) {
					if (item.getXType()=="radiogroup" || item.getXType()=="checkboxgroup"){
						would[would.length] = item.items;
					}else{
						if (item.validate()) {
							if (item.name != null) {
								if (item.getXType()=="radio"){
									 if (item.getValue()==true){
										 res[item.name]=item.inputValue;	 
									 }
								}else if (item.getXType()=="checkbox"){
									 if (item.getValue()==true){
											if (res[item.name]==null){
												res[item.name]=[];
											}
											res[item.name][(res[item.name]).length]=item.inputValue;
									 }
								}else{
									res[item.name] = item.getValue();	
								}
							}
						} else {
							validate = false;
						}
					}
				} else {
					if (item.items) {
						would[would.length] = item.items;
					}
				}
			});
		}
		if (validate) {
			return res;
		} else {
			return null;
		}

	},
	
	/**
	 * 设置面板中所有field的值，包括嵌套panel中的field
	 * @param data
	 * @returns
	 */
	setValues:function(data){
		if (data==null){
			return;
		}
		var would=[this.items];
		while(would.length>0){
			var items=would.shift();
			items.each(function(item){
				if (item.isFormField){
					if (item.getXType()=="radiogroup" || item.getXType()=="checkboxgroup"){
						would[would.length] = item.items;
					}else{
						if (item.getXType()=="radio"){
							item.setValue(data[item.name]==item.inputValue);
						}else if (item.getXType()=="checkbox"){
							item.setValue(data[item.name].indexOf(item.inputValue)>=0);
						}else{
							item.setValue(data[item.name]);
						}
					}
				}else{
					if (item.items){
						would[would.length]=item.items;
					}
				}
			});
		}
	},
	/**
	 * 保存数据到服务端
	 */
	saveToServer:function(){
		var _ths = this;
		var para=this.getValues();
		if (para!=null){
		Ext.Ajax.request({
			url : this.saveUrl,
			params : "d=" + Ext.util.JSON.encode(para),
			success : function(dt) {
				var dt = Ext.util.JSON.decode(dt.responseText);
				if (dt.success) {
					Ext.MessageBox.alert('提示', this.succMess, null);
				} else {
					//TODO:后面错误要在公共js中统一处理，这里不需要处理异常
					alert("保存失败");
				}
			}
		});
		}
	},
	setFieldVisable:function(name,visible){
          var field=this.find("name",name)[0];
          field.getEl().up('.x-form-item').setDisplayed(visible);
	}
	
});

Ext.reg('exform', Ext.ux.ExFormPanel);
//控件扩展的代码参考：http://www.cnblogs.com/iamlilinfeng/archive/2012/06/29/2569974.html