Ext.namespace("Fun1.Index");
Fun1.Index = {
	ini : function() {
		this.viewport = new Ext.Viewport({
			layout : "fit",
			items : [ Fun1.Grid.ini() ],
			listeners : {
				render : function() {
					akconfig.checkAuth([ '10000001' ]);
				}
			}
		});
	}
};
App = Fun1.Index;
