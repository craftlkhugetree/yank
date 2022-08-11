var urls=akconfig.resturl;
var filter;//查询
var KEYWORD;//关键字
var SITESID;//网站ID


var CenterGridStore = new Ext.data.SimpleStore({
    //url:urls+'classify/list',
    fields : [{name:'ID'},{name:'ISPASS'},{name:'SCHOOLNAME'},{name:'PROVINCE'},{name:'CITY'},{name:'MOE5CSHOOLTYPE'},{name:'MOE5CSHOOLLEVEL'},{name:'MOE5CSHOOLTYPECODE'}
              ,{name:'LIBCHINESENAME'},{name:'LIBECGLISHNAME'},{name:'LIBADDRESS'},{name:'POSTCODE'},{name:'HOMEPAGE'}
              ,{name:'TEL'},{name:'FAX'},{name:'STATE'}
              ],   
    data:[['1111','1','南京农业大学','江苏','南京','农业','本科','26328971','南农图书馆','nnbook'
           ,'广州路99号','230010','http://nannong.com','15896321589','025-56984123','正常'],
          ['1112','2','南京邮电大学','江苏','南京','农业','本科','26328971','南邮图书馆']],
    //reader:CenterGridRed
});

  var checkedMatid = new Ext.data.JsonReader({                  
            fields : [{name:"ID"},{name:"APPLYORGID"},{name:"ISPASS"},{name:"CHECKTIME"},{name:"FAILREASON"}],  
            root : 'items',
            id : 'ID'  
        });  

          var checkedRecordMatidStore = new Ext.data.Store({                //审核记录
       
          url: urls+"checkRecord/list",
              reader:checkedMatid
            
         });
  eastTreeStore=new Ext.tree.TreeLoader({
      //dataUrl:urls+"publicFollow/listGroupArr"
  });
var FcRed = new Ext.data.JsonReader({  
    fields : [{name:"NAME"},{name:"url"}],  
    root : 'items',
    id : 'ID'  
});  
var FcStore = new Ext.data.Store({
//    url:urls+'commCode/getCode',
	url:'../../../web/rest/tplselect/tplselect',
    reader:FcRed
});
FcStore.load({             //加载语言
      params:{
		  SEARCH:false,start:0,limit:10},
 });
Ext.Ajax.request({
    url : '../../../web/rest/tplselect/tplselect',
    method : 'GET',
	type : 'json',
    success : function(resp) {
 var data = eval('(' + resp.responseText + ')');
      //调用json对象的属性
      var userList = data.items;
		console.log(userList[0].url)
    }
});
console.log(FcRed.jsonData)