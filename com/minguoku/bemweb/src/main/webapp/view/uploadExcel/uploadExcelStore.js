var urls=akconfig.url+"rest/";
var userid=location.search.substr(1).split("=")[1];
var gridfilter;
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'BOOKID'},{name:'CODE'},{name:'CONTENTNOTE'},{name:'DATE'},{name:'EDUTYPEID'},{name:'JHX'},{name:'PAID'},{name:'PUBLISHINGID'}
	         ,{name:'TITLE'},{name:'XKMCZT'},{name:'ZAUTHOR'},{name:'ZTCC'},{name:'ZTTYPEID'},{name:'BLTITLE'},{name:'OTITLE'},{name:'FTITLE'}
			,{name:'CAUTHOR'},{name:'BB'},{name:'PAGE'},{name:'SERIES'},{name:'ZAUTHOR1'},{name:'CAUTHOR1'},{name:'ZAUTHOR2'},{name:'CAUTHOR2'},{name:'COVERTITLE'},{name:'SUMMARY'},{name:'PAGECOUNT'},{name:'ZTNAME'}],
    root : 'items',
    id : 'BOOKID',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({         
   
   	url:urls+'Book/getBookCnmarc',
    reader:CenterGridRed,
	remoteSort: true,
	sorters:['BOOKID','CODE','CONTENTNOTE','DATE','EDUTYPEID','JHX','PAID','PUBLISHINGID','TITLE','XKMCZT','ZAUTHOR','PUBLISHINGID','ZTCC','ZTTYPEID',
	'BLTITLE','OTITLE','FTITLE','CAUTHOR','BB','PAGE','SERIES','ZAUTHOR1','CAUTHOR1','ZAUTHOR2','CAUTHOR2','COVERTITLE','SUMMARY','PAGECOUNT']
    
});
//中图法分类
var ztfCombo=new Ext.tree.TreeLoader({
    dataUrl:urls+'Book/zttype'
});
//学科分类
var xkfCombo=new Ext.tree.TreeLoader({
    dataUrl:urls+'Book/edutype'
});

