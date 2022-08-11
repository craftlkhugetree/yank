var pernode=0;
var facility=new Ext.Panel({
    id:'container',
    listeners:{
        render:function(){

           authRegisity();
        
        }
    }
    
});
// var facility=new Ext.tree.TreePanel({
//     loader: eastTreeStore,
//     title:'权限',
//     region:'center',
//     split:true,
//     layout:'fit',
//     cls:'ak-power-tree',
//     collapsible:false,


//     id:'facility-tree',
//     autoScroll: true,
//     animate: false,
//     enableDD: true,
//     containerScroll: true,
//     rootVisible: false,
//     width:230,
//     border:false,
//     // height:'100%',
//     bbar:[new Ext.Button({
//         text:'保存',
//         disabled:true,
//         id:'role-tree-savebutton',
//         cls:'ak-btn btn-blue',
//         listeners:{
//             click:function(th){
            
//                 var allselect=facility.getChecked();
                
//                 var data=[];
//                 for(var i=0;i<allselect.length;i++){
                   
//                     data.push(allselect[i].attributes.ID);
//                     // if(!(allselect[i].leaf)){
//                     //     // console.log(allselect[i].attributes.children.length);
//                     //     for(var j=0;j<allselect[i].attributes.children.length;j++){
                            
//                     //         data.push(allselect[i].attributes.children[j].ID);
//                     //     }
//                     // }
                    
//                 }
                
//                 datas={ROLEID:ROLEID,RESID:data};
//                 savedata=JSON.stringify(datas);
                
//                 Ext.Ajax.request({
//                     url:urls+'Role/saveAuth',// 要跳转的url,此为属性必须要有

//                     method:'post',

//                     params:{auth:json_data,data:savedata}, // 提交参数

//                     success: function(response, options){
//                         if(errbyextjs(response)){
//                             Ext.Msg.alert('提示！','保存成功！');
//                         }
//                     }, 
//                     failure:function(response, options){
//                        Ext.Msg.alert('网络出错了！');
//                     }
//                })
//             }
//         }

//     })],
//     listeners:{ 
//         checkchange: function(node,flag) {  //较好的解决了父子联动的问题 4级以上还没测试过
//             var havechild=false;
//             if(node.hasChildNodes()){//有孩子 选取所有的孩子

//                 node.cascade(function(node){  
//                     node.attributes.checked=flag;  
//                     node.ui.checkbox.checked=flag;  
//                     return true;  
//                 });  
  
//                 var pNode = node.parentNode;  
//                 for(;pNode.id!='sources';pNode=pNode.parentNode){  
//                     if(flag|| facility.getChecked(id,node.parentNode)==""){  
//                             pNode.ui.checkbox.checked=flag;  
//                             pNode.attributes.checked=false;  
//                     }  
//                 }  
//             }else{  //没孩子的node
                
//                 for(var i=0;i<node.parentNode.childNodes.length;i++){
//                     var xx1=node.parentNode.childNodes[i].attributes.checked;
//                     havechild=xx1||havechild;

//                 }
//                 if(flag&&node.parentNode.id!='sources'){  //这里代表点击后该节点是否会被选中
//                     node.parentNode.ui.checkbox.checked=flag;  
//                     node.parentNode.attributes.checked=true;  
//                 }else if(!havechild){
//                     node.ui.checkbox.checked=flag;  
//                     node.attributes.checked=flag;
//                     node.parentNode.ui.checkbox.checked=false; 
//                     node.parentNode.attributes.checked=false;  
//                 }else{  
//                     node.ui.checkbox.checked=flag;  
//                     node.attributes.checked=flag;  
//                 }  
//             }    
        
//         },
//         render:function(){
//             root.expand();

//         } 
//     } 

// });
// var root = new Ext.tree.AsyncTreeNode({
//     text: 'TopParent',
//     draggable:false,
//     id:'sources'
// });
// facility.setRootNode(root);


// var eastPanel=new Ext.Panel({
// 	title:'权限',
//     region:'center',
    
//     split:true,
//     layout:'fit',
//     collapsible:false,
//     margins:'3 0 3 3',
//     cmargins:'3 3 3 3',
//     items:[facility],
    
    
// });