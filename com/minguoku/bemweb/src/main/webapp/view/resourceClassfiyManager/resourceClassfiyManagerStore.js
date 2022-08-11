var urls=akconfig.url+"rest/";
// var urls="http://160.255.0.191:8088/bemweb/rest/"; 
var userid=location.search.substr(1).split("=")[1];
var eastTreeStoredata;
var gridfilter;
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'CREATERNAME'},{name:'CREATEDATE'},{name:'ID'},{name:'NAME'}
             ,{name:'MODIFIERNAME'},{name:'MODIFYDATE'},{name:'CREATER'},{name:'MODIFIER'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({         
   
   	
   	url:urls+'ResourcePackage/list',
    reader:CenterGridRed
});
var eastTreeStore=new Ext.tree.TreeLoader({
	dataUrl:urls+'ResourcePackage/ztTree'
    // dataUrl:'officals.json' 
});
