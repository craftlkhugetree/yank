Ext.namespace("Fun1.Store");
Fun1.Store={
	ini:function(){
		var urls=akconfig.resturl;
		var reader = new Ext.data.JsonReader({
			fields : [{name:'NAME'},{name:'DES'},{name:'ID'},{name:'SOCURCEID'},
		            {name:'SOURCENAME'},{name:'KEYWORD'},{name:'SOURCETYPE'},
		            {name:'ATTACHID'},{name:'CREATETIME'},{name:'ATTACHID_NAME'},
		            {name:'SOURCETYPE_NAME'}],   
		    root : 'items',
		    id : 'ID',
		    totalProperty :'total'
		});
		this.store = new Ext.data.Store({
			remoteSort: true,
		   	url:urls+'Event/list',
		    method:'post',
		    reader:CenterGridRed
		});
		return this.store; 
	}
}




  var resourceReader = new Ext.data.JsonReader({  
    fields : [{name:"NAME"},
               {name:"CODE"}
                            ],  
    root : 'items',
    id : 'ID'
  });  

  var resourceStore=new Ext.data.Store({          //加载资源由来
     url: urls+"commCode/getCode",
     remoteSort:true,
     reader:resourceReader
  });
  resourceStore.load({params:{SEARCH:false,CODE:'LYLX'}});
