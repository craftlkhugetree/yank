var urls=akconfig.url+"rest/";
var userid=location.search.substr(1).split("=")[1];
var gridfilter;
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'OPAC'},{name:'LASTTIME'},{name:'ID'},{name:'NAME'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({         
   
   	
   	url:urls+'Library/list',
    reader:CenterGridRed
});

