var urls=akconfig.url+"rest/";
// var urls="http://160.255.0.191:12080/bemweb/rest/";
var userid=location.search.substr(1).split("=")[1];
var gridfilter;
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'TITLE'},{name:'AUTHOR'},{name:'ID'},{name:'CONTENT'},{name:'ISSHOW'}
             ,{name:'COMMENTTIME'},{name:'CREATOR'},{name:'CREATETIME'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({         
   
   	
   	url:urls+'ExpertComment/getCommnet',
    reader:CenterGridRed
});

