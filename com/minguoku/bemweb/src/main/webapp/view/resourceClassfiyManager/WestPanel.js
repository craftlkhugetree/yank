
var facility=new Ext.tree.TreePanel({
    loader: eastTreeStore,
    title:'中图分类',
    // region:'center',
    split:true,
    layout:'fit',
    collapsible:false,
    //width:300,
    // bodyStyle:'overflow-x:hidden;overflow-y:auto',
    id:'con-tree-org-combo',
    autoScroll: true,
    animate: false,
    enableDD: true,
    containerScroll: true,
    rootVisible: false,
    // width:230,
    border:false,
    height:310,
    listeners:{ 
        beforeexpandnode:function(node, deep, animal) {     
            

        },
        checkchange: function(node,flag) {
            
             var havechild=false;
            if(node.hasChildNodes()){//有孩子 选取所有的孩子
                node.expand();
                node.cascade(function(node){  
                    node.attributes.checked=flag;  
                    node.ui.checkbox.checked=flag;  
                    return true;  
                });  
  
                var pNode = node.parentNode;  
                for(;pNode.id!='con-sources';pNode=pNode.parentNode){  
                    if(flag|| facility.getChecked(id,node.parentNode)==""){  
                            pNode.ui.checkbox.checked=flag;  
                            pNode.attributes.checked=false;  
                    }  
                }  
            }else{  //没孩子的node
                
                for(var i=0;i<node.parentNode.childNodes.length;i++){
                    var xx1=node.parentNode.childNodes[i].attributes.checked;
                    havechild=xx1||havechild;

                }
                if(flag&&node.parentNode.id!='con-sources'){  
                    node.parentNode.ui.checkbox.checked=flag;  
                    node.parentNode.attributes.checked=true;  
                }
                else{  
                    node.ui.checkbox.checked=flag;  
                    node.attributes.checked=flag;  
                }  
            }    
            
           
            
        },
        render:function(){
            root.expand();

        }
           
    } 
      //  }

});
var root = new Ext.tree.AsyncTreeNode({
    text: 'TopParent',
    draggable:false,
    id:'con-sources'
});
facility.setRootNode(root);


