var urls=akconfig.url+"rest/";
// var urls="http://160.255.0.191:8088/bemweb/rest/";        //蔡敏那边的
// var userid=location.search.substr(1).split("=")[1];
var gridfilter;   //过滤
var eastTreeStoredata;
var countforeastTreeStoreload=0;
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'SOURCENAME'},{name:'OTHERNAME'},{name:'ID'},{name:'NAME'},{name:'FWLJ'},{name:'SETYEAR'}
    ,{name:'SETDYNASTY'},{name:'GOVLOCAL'},{name:'MAREA'}
	,{name:'BACKNAME'},{name:'ENDYEAR'},{name:'ENDDYNASTY'},{name:'CREATER'},{name:'CREATEDATE'},{name:'MODIFIER'}
    ,{name:'MODIFYDATE'},{name:'SETDYNASTYNAME'},{name:'SETYEARNAME'},{name:'ENDDYNASTYNAME'}
    ,{name:'BELONG'},{name:'SETREIGNNAME'},{name:'ENDREIGNNAME'},{name:'ENDYEARNAME'}
    ,{name:'ENDREIGNTITLE'},{name:'SETREIGNTITLE'},{name:'OLDGOVLOCAL'},{name:'NEWGOVLOCAL'}
    ,{name:'TYPE'},{name:'COURRENTNAME'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  

var CenterGridStore = new Ext.data.Store({   
    method:'post',      
   	url:urls+'Geography/list',
   	// url:'../../rest/website/list',
    reader:CenterGridRed
});

var yearReader = new Ext.data.JsonReader({  
    fields : [{name:"YLYEAR"},{name:"ID"}],  
    root : 'items',
    id : 'ID'  
});  
var yearStore= new Ext.data.Store({         //加载年代
    url: urls+"common/getCode",
    reader:yearReader
 }); 
// yearStore.load({
//       params:{filter:JSON.stringify({"SEARCH":false,CODE:'YEAR'})}
// });
var dynastyReader = new Ext.data.JsonReader({  
    fields : [{name:"ID"},{name:"NAME"},{name:"PID"}],  
    root : 'items',
    id : 'ID'  
});  
var dynastyStore= new Ext.data.Store({         //加载朝代
    url: urls+"Common/getYear",
    reader:dynastyReader
 }); 



var abolishReader = new Ext.data.JsonReader({  
    fields : [{name:"ID"},{name:"NAME"},{name:"PID"}],  
    root : 'items',
    id : 'ID'  
});  
var abolishStore= new Ext.data.Store({         //废止朝代
    url: urls+"Common/getYear",
    reader:abolishReader
 }); 
// dynastyStore.load({
//       params:{filter:JSON.stringify({PID:''})}
// });
// dynastyStore.load({
//       params:{filter:JSON.stringify({"SEARCH":false,CODE:'DYNASTY'})}
// });


var propertyReader = new Ext.data.JsonReader({  
    fields : [{name:"ID"},{name:"NAME"}]
});  
var propertyStore= new Ext.data.Store({         //加载性质
    data:[{"NAME":'羁縻州',"ID":'01'},{"NAME":'侨置州',"ID":'02'}],
    reader:propertyReader
 }); 

var yearNumberReader = new Ext.data.JsonReader({  
    fields : [{name:"ID"},{name:"NAME"},{name:"PID"}],  
    root : 'items',
    id : 'ID'  
});  
var yearNumberStore= new Ext.data.Store({         //加载设置年号
    url: urls+"Common/getYear",
    reader:yearNumberReader
 }); 

var setyearReader = new Ext.data.JsonReader({  
    fields : [{name:"ID"},{name:"YEAR"},{name:"PID"}],  
    root : 'items',
    id : 'ID'  
});  
var setyearStore= new Ext.data.Store({         //加载设置年代
    url: urls+"Common/getYear",
    reader:setyearReader
 }); 


var stopyearNumberReader = new Ext.data.JsonReader({  
    fields : [{name:"ID"},{name:"NAME"},{name:"PID"}],  
    root : 'items',
    id : 'ID'  
});  
var stopyearNumberStore= new Ext.data.Store({         //加载废止年号
    url: urls+"Common/getYear",
    reader:stopyearNumberReader
 }); 

var stopyearReader = new Ext.data.JsonReader({  
    fields : [{name:"ID"},{name:"YEAR"},{name:"PID"}],  
    root : 'items',
    id : 'ID'  
});  
var stopyearStore= new Ext.data.Store({         //加载废止年代
    url: urls+"Common/getYear",
    reader:stopyearReader
 });

