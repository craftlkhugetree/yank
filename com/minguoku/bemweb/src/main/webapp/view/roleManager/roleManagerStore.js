//var json_data=akCommFunction.getAuth(userid);
var json_data=1;
var userid=location.search.substr(1).split("=")[1];
var bb={"filter":{"SEARCH":false},"start":0,"limit":10,"page":1};
var json_data2 = JSON.stringify(bb); 
var rolegridfilter;
var json_datatree;
var ROLEID;
var urls=akconfig.resturl;
var KEYWORD;
var ORGID;
var facilityID;
var	OrgMainRec = new Ext.data.JsonReader({  //记录中要读取的字段
	    fields : [{name:'ID'},{name:"NAME"},{name:"ISUSE"},{name:"DES"},{name:"ISDELETE"}],   
	    root:'items',
	    id :'ID',
	    totalProperty :'total'
	}),  
	OrgMainStore = new Ext.data.Store({ 
		url: urls+'Role/list',
	    reader:this.OrgMainRec
	}),
	SelectStore=new Ext.data.SimpleStore({
	data:[
			
			["1","是"],
			["0","否"]
		],
		fields:["ID","NAME"]
	}),
 //    eastTreeStore=new Ext.tree.TreeLoader({
 //    	dataUrl:urls+'Role/getRoleResArr'
	// });

	 roleTreeStore=new Ext.data.Store({
    	url:'../../Role/getRoleRes/rest/falseData/falseData',
    	scope: roleTreeStore
	});
// OrgMainStore.load({
// 	params:{auth:json_data,data:json_data2},
// })

function authRegisity(th){                     //权限管理
	   Ext.Ajax.request({
                url:urls+'Role/getRole',
                method:'post',
                params:{auth:json_data,filter:th},
               // params:{auth:json_data,filter:th},
                success:function(conn, response, options){
                        var roleform = Ext.getCmp('container');
                        var json = eval('(' + conn.responseText + ')'); 
                        var items = [];
                        roleform.removeAll();
                        for (var i = 0; i < json.data.length; i++) { 
                                 var subitems = [];
                                 var data = json.data[i];
                            
                                 for (var j=0;j<data.items.length;j++){
                                  
                                     subitems[j]={
                                            xtype:'checkbox',
                                            boxLabel:'<span style="font-size:12px;">'+data.items[j].NAME+'</span>',
                                            name: 'RESIDs',
                                            ctCls:'rowChildId'+i,
                                            checked : data.items[j].checked,
                                            inputValue: data.items[j].RESID
                                            // ,
                                            // listeners:{
                                            //     check:function(obj,ischecked){

                                            //           if(ischecked){
                                            //                 Ext.getCmp(this.ctCls).setValue(ischecked);
                                            //           }else{
                                            //             //console.log(obj.checked);
                                            //                 if(obj.checked){
                                            //                     Ext.getCmp(this.ctCls).setValue(obj.checked);
                                            //                 }
                                            //             //console.log(obj.length);
                                            //           }
                                                      
                                            //     }
                                            // }
                                      }
                                 }
                                 // items[i]={xtype:'checkboxgroup',name:'checkboxgroup',   
                                 //        id: 'checkboxgroup', fieldLabel: 'Two Columns',columnWidth:0.7,   
                                 //        items: [  
                                 //            { boxLabel: 'Item 1', name: 'cb', inputValue: '1' },  
                                 //            { boxLabel: 'Item 2', name: 'cb', inputValue: '2' },  
                                 //            { boxLabel: 'Item 3', name: 'cb', inputValue: '3' },  
                                 //            { boxLabel: 'Item 4', name: 'cb', inputValue: '4' },  
                                 //            { boxLabel: 'Item 5', name: 'cb', inputValue: '5' },  
                                 //            { boxLabel: 'Item 6', name: 'cb', inputValue: '6' }  
                                 //        ]
                                 //  } 
                                 items[i] = {
                                         layout: 'column',
                                         cls:'height-auth',
                                         id:'rowId'+i,
                                         //ctCls:'rowId'+i,
                                         //xtype:'container',
                                         //cls: 'ak-role-block',
                                         items:[{
                                             layout : 'anchor',
                                             columnWidth:'0.2',
                                            // cls: 'ak-role',
                                             padding: '10 0 0 0',
                                             // items:{
                                             //        xtype:'checkbox',
                                             //        ctCls:'rowId'+i,
                                             //        id:'rowChildId'+i,
                                             //        boxLabel  :'<span style="font-size:14px;">'+json.data[i].NAME+'</span>',
                                             //        name: 'RESIDs',
                                             //        //checked : true,
                                             //        inputValue: json.data[i].RESID
                                             //        // ,
                                             //        // listeners:{
                                             //        //     check:function(obj,ischecked){
                                             //        //         //全选
                                             //        //         var authContent=Ext.getCmp(this.ctCls).items.items[1].items.items;
                                             //        //         if(ischecked){
                                                                 
                                             //        //             for(var i = 0; i < authContent.length; i++){
                                                                    
                                             //        //                 //console.log(authContent[i].checked);
                                             //        //                 if(authContent[i].checked){
                                             //        //                    authContent[i].setValue(ischecked);
                                             //        //                 }else{
                                             //        //                     authContent[i].setValue(ischecked);
                                             //        //                 }
                                                                    
                                             //        //             }
                                             //        //         }else{

                                             //        //             for(var k = 0; k < authContent.length; k++){
                                                                    
                                             //        //                 if(authContent[k].checked){
                                             //        //                     authContent[k].setValue(ischecked);
                                             //        //                 }
                                             //        //                 else{
                                             //        //                     authContent[k].setValue(ischecked);
                                             //        //                 }
                                                                   
                                             //        //                 // console.log(authContent[k].checked);
                                             //        //                 // authContent[k].setValue(ischecked);
                                             //        //             }
                                             //        //         }
                                                            
                                             //        //     }
                                             //        // }
                                             //  }
                                             items:{
                                                 xtype:'label',
                                                 algin:'right',
                                                 name:'title',
                                                 id:'rowChildId'+i,
                                                 value:json.data[i].RESID,
                                                 html:'<span style="font-size:13px;">'+json.data[i].NAME+'</span>'      
                                             }
                                         },{
                                             //xtype:'container',
                                             columnWidth:'0.8',
                                             layout: 'column',
                                             //reference : 'roleoption',
                                             defaults: {
                                                 xtype : 'container',
                                                 columnWidth:0.25
                                             },
                                             //items:[subitems]
                                             items:subitems
                                         }]
                                 }
                               
                        }
                         var additems ={
                                    margin: '0 0 0 10',
                                    xtype: 'fieldset',
                                    title:'权限',
                                    autoHeight:true,
                                    //height:609,
                                    layout: 'anchor',
                                    items: items
                          };
                                 roleform.add(additems);
                                 roleform.doLayout();
                }
            });
}

function anyTrue(array){
    var flag=false;
    for(var k = 0; k < array.length; k++){
                                                                    
        if(array[k].checked){
           flag=true;
           break;
        }

    }
    return flag;
    
}
function deleteRole(mygrid,Toolbar,urlss,PostData){

        if(mygrid.getSelectionModel().getSelected()!=undefined){
            Ext.MessageBox.confirm('提示', '真的要删除吗？', callBack); 
            function callBack(id) { 
            if(id=='yes'){
                var deleterecord = mygrid.getSelectionModel().getSelected();
                var bb={"ID":[deleterecord.data.ID]};
                data=JSON.stringify(bb);
                Ext.Ajax.request({
                    url:urls+urlss,// 要跳转的url,此为属性必须要有
                    method:'post',
                    params:{data:data}, // 提交参数
                    success: function(response, options){
                      if(errbyextjs(response)){
                       Ext.getCmp(Toolbar).doLoad(0);
                        addForm2.getForm().getEl().dom.reset();
                        authRegisity();
                      }
                    },
                    failure:function(response, options){
                        Ext.Msg.alert("提示",'网络出错了！')
                    }
                })
            }}
        }else{Ext.Msg.alert("提示",'请选择一条记录！')}
    }