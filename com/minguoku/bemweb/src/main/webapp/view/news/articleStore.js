var urls=akconfig.url+"rest/";
var userid=location.search.substr(1).split("=")[1];
var filters;
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'id'},{name:'content'},{name:'createId'},{name:'createName'},{name:'createTime'},{name:'dialogEndTime'},{name:'isDialog'},{name:'isRelease'}
	,{name:'isTop'},{name:'name'},{name:'releaseTime'}],   
    root : 'data',
    id : 'id',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({         
   	url:urls+'wxkNotice/pageQuery',
    reader:CenterGridRed,
    remoteSort: true
});

