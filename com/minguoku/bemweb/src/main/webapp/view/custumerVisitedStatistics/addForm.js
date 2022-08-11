var addForm=new Ext.FormPanel({
    
    border:false,
    labelWidth:65,
    labelAlign:'right',
    // width: 500,
    // height:800,
    // autoHeight : true,
    //defaults: {labelWidth:65,labelAlign:'right'},
    items:[
    {
                fieldLabel: 'ID',
                name:'ID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    },
    {
                xtype:'textfield',
                name:'KEYWORD',
                width:350,
                vtype:'standard',
                fieldLabel:'图书馆名称'
    }]

});

// var facility=new Ext.tree.TreePanel({
//     loader: eastTreeStore,
//     // title:'部门',
//     // region:'center',
//     split:true,
//     layout:'fit',
//     collapsible:false,


//     id:'tree-web-panel',
//     autoScroll: true,
//     animate: false,
//     enableDD: true,
//     containerScroll: true,
//     rootVisible: false,
//     // width:230,
//     border:false,
//     height:'100%',
    
    
    // listeners:{ 
    //     checkchange: function(node,flag) {
    //         var checkedNodes = facility.getChecked();
    //         for(var i=0;i<checkedNodes.length;i++){     
    //             var nodes = checkedNodes[i];
    //             if(nodes.id != node.id){     
    //                  nodes.getUI().checkbox.checked = false;     
    //                  nodes.attributes.checked = false;     
    //                  facility.fireEvent('check', node, false);     
    //             }     
    //         } 
            
    //     },
    //     render:function(){
    //         root.expand();

    //     }
    // } 

// });
// var root = new Ext.tree.AsyncTreeNode({
//     text: '无',
//     draggable:false,
//     id:'sources'
// });
// facility.setRootNode(root);

// var issueForm=new Ext.FormPanel({
    
//     border:false,
//     // width: 500,
//     // height:800,
//     // autoHeight : true,
//     defaults: {labelWidth:65,labelAlign:'right'},
    
//     items:[]
// });
        