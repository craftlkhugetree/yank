Ext.onReady(function(){  
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';    //统一指定错误信息提示方式，在输入栏右侧显示一个突出的出错图标  
	if(Ext.isChrome===true){       
		var chromeDatePickerCSS = ".x-date-picker {border-color: #1b376c;background-color:#fff;position: relative;width: 185px;}";
		Ext.util.CSS.createStyleSheet(chromeDatePickerCSS,'chromeDatePickerStyle');
	}                                              //这个解决了时间控件在google浏览器上不可用的问题
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	new Ext.Viewport({ 
		layout:"fit", 
		items:[CenterGrid]

	});
});

eastTreeStore.on('beforeload', function(loader, node) {  

    this.baseParams.filter = eastTreeStoredata; // 通过这个传递参数，这样就可以点一个节点出来它的子节点来实现异步加载  
    // this.baseParams.data=json_datatree;
    
}, eastTreeStore);