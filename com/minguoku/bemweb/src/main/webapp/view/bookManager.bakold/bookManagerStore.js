var urls=akconfig.url+"rest/";
// var urls="http://160.255.0.191:8088/bemweb/rest/";  
var userid=location.search.substr(1).split("=")[1];
var eastTreeStoredata;
var countforeastTreeStoreload=0;

var batchFilter;              //批次号过滤书本
var librayManagerFilter;     //图书过滤馆藏
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'TITLE'},{name:'PAID'},{name:'ID'},{name:'BATID'},{name:'BOOKID'},{name:'NAME'},{name:'PUBLISHINGID'},{name:'DATE'}
  ,{name:'PAGECOUNT'},{name:'WIDTH'},{name:'HEIGHT'},{name:'BOOKNAME'},{name:'ZTTYPEID'},{name:'ZTNAME'}
  ,{name:'TEXTNOTE'},{name:'BOOKDIR'},{name:'SERIALNAME'},{name:'EDUTYPEID'},{name:'AUTHOR'}
  ,{name:'TAGS'},{name:'SERIES'},{name:'PUBLISHINGNAME'},{name:'ADDRESS'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({         
   
   	url:urls+'Book/getBook',
    reader:CenterGridRed,
	remoteSort: true,
	sorters:['TITLE']
});
var eastTreeStore=new Ext.tree.TreeLoader({
	dataUrl:urls+'Column/tree'
});


var collectionGridRed = new Ext.data.JsonReader({  
    fields : [{name:'NAME'},{name:'OPAC'},{name:'ID'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var collectionGridStore = new Ext.data.Store({           //馆藏管理
   
    
    url:urls+'Book/getLibraryCollection',
    reader:collectionGridRed
});


var batchGridRed = new Ext.data.JsonReader({  
    fields : [{name:'BATID'},{name:'MAKER'},{name:'ID'},{name:'BEGINID'},{name:'ENDID'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var batchGridStore = new Ext.data.Store({           //批次列表
   
    
   url:urls+'Book/getMakeID',
    // url:'../../rest/website/list',
    reader:batchGridRed
});