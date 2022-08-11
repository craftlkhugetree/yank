var ORGID;
var json_data=1;
var userid=location.search.substr(1).split("=")[1];
//var json_data=akCommFunction.getAuth(userid);
var bb={"filter":{"SEARCH":false},"start":0,"limit":10,"page":1};
var json_data2 = JSON.stringify(bb); 
var rolegridfilter;
var json_datatree;
var ROLEID;
var urls=akconfig.resturl;
var KEYWORD;

var facilityID;
var	OrgMainRec = new Ext.data.JsonReader({  //记录中要读取的字段
	    fields : [{name:'ORGID'},{name:'ROLEID'},{name:'ID'},{name:"NAME"},{name:"ISUSE"},{name:"DES"},{name:"ISDELETE"}
	    ,{name:"LOGINNAME"},{name:"ROLENAME"},{name:"ORGNAME"},{name:"PHONE"},{name:"EMAIL"}
	    ,{name:"SEX"},{name:"STATUS"},{name:"IDENTITYNUM"},{name:"WORKTIME"},{name:"INTOSCHOOLTIME"},{name:"NATIVEPALCE"}
	    ,{name:"TEL"},{name:"ADDRESS"},{name:"QQ"},{name:"TWITTER"},{name:"WECHAT"}
	    ,{name:"TITLE"},{name:"POSTID"},{name:"ADDPOSTID"},{name:"EB"},{name:"DERGEE"}
	    ,{name:"PHOTO"},{name:"REMARK"},{name:"LOADCOUNT"},{name:"XLNAME"}
	    ,{name:"XWNAME"},{name:"CODE"},{name:"PHOTONAME"},{name:"SEXNAME"}],   
	    root:'items',
	    id :'ID',
	    totalProperty :'total'
	}),  
	OrgMainStore = new Ext.data.Store({ 
		url: urls+'User/list',
	    reader:this.OrgMainRec
	}),
	SelectStore=new Ext.data.SimpleStore({
	data:[
			
			["1","是"],
			["0","否"]
		],
		fields:["ID","NAME"]
	}),
    eastTreeStore=new Ext.tree.TreeLoader({
    	dataUrl:urls+'Org/tree'
	}),
	eastConBoxTreeStore=new Ext.tree.TreeLoader({
    	dataUrl:urls+'Org/tree'
	});
	// OrgMainStore.load({
	// 	params:{auth:json_data,data:json_data2}
	// });
	var SelectRoleRec =new Ext.data.JsonReader({  //记录中要读取的字段
	    fields : [{name:'ID'},{name:"NAME"}],   
	    root:'items',
	    id :'ID'	
	});
	var SelectRole=new  Ext.data.Store({
		baseParams:{auth:json_data},
    	url:urls+'Role/getRoleTree',
    	reader:SelectRoleRec
	});
	SelectRole.load({params:{'auth':json_data}});
	var educationReader = new Ext.data.JsonReader({  
	    fields : [{name:"NAME"},{name:"CODE"}],  
	    root : 'items',
	    id : 'ID'  
	});  

 var  educationStore=new Ext.data.Store({          //学历
 
    url: urls+"commCode/getCode",
    //autoLoad: true,
    //method:"POST",
    remoteSort:true,
     reader:educationReader
 });
educationStore.load({params:{SEARCH:false,CODE:'XL'}});

var degreeReader = new Ext.data.JsonReader({  
	    fields : [{name:"NAME"},{name:"CODE"}],  
	    root : 'items',
	    id : 'ID'  
	});  

 var  degreeStore=new Ext.data.Store({          //学位
 
    url: urls+"commCode/getCode",
    //autoLoad: true,
    //method:"POST",
    remoteSort:true,
     reader:degreeReader
 });
degreeStore.load({params:{SEARCH:false,CODE:'XW'}});

// var sexreader=new Ext.data.JsonReader({
//   fields:[{name:'NAME'},{name:'VALUE'}]

// });

// var sexStore=new Ext.data.Store({   //是否必填 fields:['NAME','VALUE'],    性别
//     data:[  
//      {'NAME':'男','VALUE':'1'},{'NAME':'女','VALUE':'0'}
//    ],
//    reader:sexreader
// });
var sexreader = new Ext.data.JsonReader({  
        fields : [{name:"NAME"},{name:"CODE"}],  
        root : 'items',
        id : 'ID'  
    });  

 var  sexStore=new Ext.data.Store({          //性别
 
    url: urls+"commCode/getCode",
    //autoLoad: true,
    //method:"POST",
    remoteSort:true,
     reader:sexreader
 });
sexStore.load({params:{SEARCH:false,CODE:'SEX'}});

var statereader=new Ext.data.JsonReader({
  fields:[{name:'NAME'},{name:'VALUE'}]

});

var stateStore=new Ext.data.Store({   //是否必填 fields:['NAME','VALUE'],    状态
    data:[  
     {'NAME':'正常','VALUE':'1'},{'NAME':'不正常','VALUE':'0'}
   ],
   reader:statereader
});