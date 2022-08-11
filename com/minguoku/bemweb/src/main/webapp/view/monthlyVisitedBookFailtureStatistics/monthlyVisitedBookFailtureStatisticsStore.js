var urls=akconfig.resturl;
var userid=location.search.substr(1).split("=")[1];
var eastTreeStoredata;
var countforeastTreeStoreload=0;
var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'LOGOID'},{name:'LOGONAME'},{name:'ID'},{name:'NAME'},{name:'ABB'},{name:'LOGO'},{name:'KEYWORD'},{name:'DES'},{name:'COPYRIGHT1'}
	,{name:'COPYRIGHT2'},{name:'TEMPLATEADD'},{name:'ISISSUE'},{name:'COPYRIGHT3'},{name:'LASTTIME'},{name:'ISRELEASE'},{name:'ADDRESS'},{name:'DOMAIN'}
  ,{name:'ISUSE'},{name:'ADDRESS_NAME'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({         
   
   	
   	url:urls+'Sites/list',
   	// url:'../../rest/website/list',
    reader:CenterGridRed
});
var eastTreeStore=new Ext.tree.TreeLoader({
	dataUrl:urls+'Column/tree'
});

var attendObject=new Ext.form.ComboBox({  
            store:new Ext.data.SimpleStore({fields:[],data:[[]]}),  
            editable:false,
            fieldLabel:'对应栏目',
            // labelStyle:'font-size:10px',
            name:'ADDRESS_NAME',
            mode: 'local',
            width:420,  
            triggerAction:'all',  
            tpl: "<tpl for='.'><div style='height:200px'><div id='attendObjectTree'></div></div></tpl>",  
            selectedClass:'',  
            onSelect:Ext.emptyFn  
});

var attendObjectTree=new Ext.tree.TreePanel({             //发布到
            loader:eastTreeStore,
            id:'tree-web-panel',  
            border:false,
            autoScroll: true,
            animate: false,
            enableDD: true,
            containerScroll: true,
            rootVisible: false,  
            // buttons:[{
            //     xtype:'button',
            //     text:'确定',
            //     listeners:{
            //         click:function(){
            //             //console.log(attendObjectTree.getChecked());
            //             var dataValue=attendObjectTree.getChecked();
            //             attendObject.setValue(dataValue[0].attributes.text);
            //             Ext.getCmp('LOGO-ADDRESS-hide').setValue(dataValue[0].attributes.ID);
                       
            //             attendObject.collapse();
            //         }
            //     }
            // }], 
            root:new Ext.tree.AsyncTreeNode({
                text: '无',
                draggable:false,
                id:'addformsources'
            }),
            listeners:{ 
                checkchange: function(node,flag) {
                    var checkedNodes = attendObjectTree.getChecked();
                    for(var i=0;i<checkedNodes.length;i++){     
                        var nodes = checkedNodes[i];
                        if(nodes.id != node.id){     
                             nodes.getUI().checkbox.checked = false;     
                             nodes.attributes.checked = false;     
                             attendObjectTree.fireEvent('check', node, false);     
                        }     
                    } 
                    
                },
                click:function(node){
                       // var dataValue=attendObjectTree.getChecked();
                        attendObject.setValue(node.attributes.text);
                        Ext.getCmp('LOGO-ADDRESS-hide').setValue(node.attributes.ID);
                       
                        attendObject.collapse();
                }
            } 
}); 

attendObject.on('expand',function(){  
    attendObjectTree.render('attendObjectTree');  
});