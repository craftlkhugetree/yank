var northRegion = new Ext.Panel({
    region:'north',
    height:30,
    cls: 'ak-header'//,
	// tbar:[	
	// 	new Ext.Toolbar.TextItem('<img src="../web/resources/images/logo.png"/>'),  
	// 	{xtype:"tbfill"},
	// 	// {pressed:false,text:'管理员',iconCls: 'tabs'},
 
	// 	new Ext.Toolbar.TextItem('<a id="login-show-user">'+'欢迎,'+username+'</a>'),
	// 	{xtype:'button',iconCls:'ak-exit',listeners:{click:function(){ 
 //                    exitnn();
 //        }}}
	// ]
});

function exitnn(){
	akCommFunction.DelCookie('userid');
	akCommFunction.DelCookie('username');
	location.href="login.html";
	// location.href="/newsrelease/03code/newsrelease/WebContent/news/newslogin/login.html"
	// location.href="/newsrelease/news/newslogin/login.html"
}