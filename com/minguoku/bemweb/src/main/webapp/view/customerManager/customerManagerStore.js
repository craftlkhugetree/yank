var urls=akconfig.url+"rest/";
// var urls="http://160.255.0.191:8088/bemweb/rest/";
var userid=location.search.substr(1).split("=")[1];
var eastTreeStoredata;
var gridfilter;
var receiveMoneyfilter;          //收款管理过滤
var custumerId;          //客户id
var orderId;     //订单id
var countforeastTreeStoreload=0;
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'NICKNAME'},{name:'ADDR'},{name:'ID'},{name:'NAME'},{name:'PRINCIPAL'},{name:'PRINCIPALMOBILE'}
  ,{name:'PRINCIPALEMAIL'},{name:'PRINCIPALQQ'},{name:'CONTACT'}
	,{name:'CONTACTMOBILE'},{name:'CONTACTEMAIL'},{name:'CONTACTQQ'},{name:'PHONE'},{name:'FAX'},{name:'UNITTYPE'}
  ,{name:'ISVALID'},{name:'OPENBANK'},{name:'OPENNUM'},{name:'TAXNUM'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({         //主页面接口
     	url:urls+'Customer/list',
      reader:CenterGridRed
});

var propertyReader=new Ext.data.JsonReader({
         fields:[{name:'NAME'},{name:'VALUE'}]

  });

  var propertyIsmust=new Ext.data.Store({   //单位性质
    
      data:[{'NAME':'有效','VALUE':'1'},{'NAME':'无效','VALUE':'0'}],
      reader:propertyReader
  }); 

var ipGridRed = new Ext.data.JsonReader({  
    fields : [{name:'NAME'},{name:'BEGINIP'},{name:'ENDIP'},{name:'ID'},{name:'CTMID'}],   
    root: 'items',
    id : 'ID',
    totalProperty :'total'
});  
var ipGridStore = new Ext.data.Store({           //IP管理
   
      url:urls+'Customer/IPlist',
      reader:ipGridRed
});


var downLoadGridRed = new Ext.data.JsonReader({  
    fields : [{name:'TITLE'},{name:'PAGENUM'},{name:'ID'},{name:'USERIP'},{name:'BOOKID'},{name:'CTMID'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var downLoadGridStore = new Ext.data.Store({           //下载记录查看
   
    
    url:urls+'Customer/Downlist',
    reader:downLoadGridRed
});

var custumerOrderRed = new Ext.data.JsonReader({  
    fields : [{name:'BEGINDATE'},{name:'ENDDATE'},{name:'ID'},{name:'NAME'},{name:'ZJE'},{name:'YF'}
    ,{name:'CTID'},{name:'RESOURCEID'},{name:'ORDERNAME'},{name:'OPERATER'},{name:'OPERATETIME'}
    ,{name:'YE'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var custumerOrderStore = new Ext.data.Store({           //订单管理
   
    url:urls+'Customer/Ordlist',
    reader:custumerOrderRed
});

var resourceRed = new Ext.data.JsonReader({  
    fields : [{name:'ID'},{name:'NAME'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var resourceStore = new Ext.data.Store({           //可用资源库
   
    url:urls+'ResourcePackage/list',
    reader:resourceRed
});



var receiveGridRed = new Ext.data.JsonReader({  
    fields : [{name:'PAY'},{name:'PAYDATE'},{name:'ID'},{name:'ORDERID'}
     ,{name:'INVOICENUM'},{name:'INVOICEPAY'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var receiveGridStore = new Ext.data.Store({           //收款管理
   
    url:urls+'Customer/Paylist',
    reader:receiveGridRed
});