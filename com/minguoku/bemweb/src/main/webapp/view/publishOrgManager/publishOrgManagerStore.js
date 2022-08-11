var urls=akconfig.url+"rest/";
var userid=location.search.substr(1).split("=")[1];
var gridfilter;
var publishid;   //新增地址时所要加的参数
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'ID'},{name:'NAME'},{name:'CREATER'},{name:'ADDRESS'},{name:'CREATEDATE'}
           ,{name:'MODIFIER'},{name:'MODIFYDATE'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({          //出版社列表
   
   	url:urls+'PublishOrg/getOrgList',
    reader:CenterGridRed
});

var addressRed = new Ext.data.JsonReader({  
  fields : [{name:'ENDDATE'},{name:'SETDATE'},{name:'ID'},{name:'ADDRESS'},{name:'PUBLISHINGID'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var addressStore = new Ext.data.Store({           //地址列表
   
    url:urls+'PublishOrg/getPublishOrgList',
    reader:addressRed
});
