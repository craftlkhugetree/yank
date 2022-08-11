var facility=new Ext.tree.TreePanel({
    loader: eastTreeStore,
    title:'模版选择',
    // region:'center',
    split:true,
    layout:'fit',
    collapsible:false,


    id:'con-tree-org-combo',
    autoScroll: true,
    animate: false,
    enableDD: true,
    containerScroll: true,
    rootVisible: false,
    // width:230,
    border:false,
    height:'100%',
    tbar:[new Ext.Button({
        text:'',
        cls:'ak-btn btn-blue',
        listeners:{
            click:function(th){
                
                orgWindow.show();
                orgWindow.setTitle('新增');
                AddOrgForm.getForm().getEl().dom.reset();
                
               
            }
        }
    })],
    
      //  }

});
var root = new Ext.tree.AsyncTreeNode({
    text: '无',
    draggable:false,
    id:'con-sources'
});
facility.setRootNode(root);


