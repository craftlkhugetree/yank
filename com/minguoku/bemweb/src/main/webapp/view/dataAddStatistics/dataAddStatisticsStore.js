var urls=akconfig.url+"rest/";
var userid=location.search.substr(1).split("=")[1];
var eastTreeStoredata;
var countforeastTreeStoreload=0;
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'LOGOID'},{name:'LOGONAME'},{name:'ID'},{name:'NAME'},{name:'ABB'},{name:'LOGO'},{name:'KEYWORD'},{name:'DES'},{name:'COPYRIGHT1'}
	,{name:'COPYRIGHT2'},{name:'TEMPLATEADD'},{name:'ISISSUE'},{name:'COPYRIGHT3'},{name:'LASTTIME'},{name:'ISRELEASE'},{name:'ADDRESS'},{name:'DOMAIN'}
  ,{name:'ISUSE'},{name:'ADDRESS_NAME'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({         
   
   	
   	url:urls+'Sites/list',
   	// url:'../../rest/website/list',
    reader:CenterGridRed
});
var eastTreeStore=new Ext.tree.TreeLoader({
	dataUrl:urls+'Column/tree'
});
