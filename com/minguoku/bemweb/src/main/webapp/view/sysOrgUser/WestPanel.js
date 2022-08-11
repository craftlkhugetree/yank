var pernode=0;
var facility=new Ext.tree.TreePanel({
    loader: eastTreeStore,
    title:'统一认证用户',
    // region:'center',
    split:true,
    layout:'fit',
    collapsible:false,


    id:'sys-user-org-tree',
    autoScroll: true,
    animate: false,
    enableDD: true,
    containerScroll: true,
    rootVisible: false,
    // width:230,
    border:false,
    height:'100%',
    tbar:[
     // new Ext.Button({
     //    text:'新增',
     //    cls:'ak-btn btn-blue',
     //    listeners:{
     //        click:function(th){
     //            orgWindow.show();
     //            orgWindow.setTitle('新增部门');
     //            AddOrgForm.getForm().getEl().dom.reset();
     //            AddOrgForm.selectid='addorg';
     //            eastConBoxTreeStore.load(Ext.getCmp('tree-org-combo').getRootNode(),function(){});
               
     //        }
     //    }
     // }),
     new Ext.Button({
        text:'编辑',
        iconCls: 'ak-icon icon-edit',
        cls:'ak-btn btn-blue',
        hidden:true,
        //cls:'ak-btn btn-purple',
        listeners:{
            click:function(){
                
                if(facility.getChecked().length==1){ //这里的复赋值怎么快怎么来了
                   
                    var dataselect=facility.getChecked();
                    var pidName=facility.getNodeById(dataselect[0].id).parentNode.text;
                    var orgname=facility.getChecked()[0].text;
                    var checkednode=facility.getNodeById(dataselect[0].id); //获取选中的节点
                    var dataselectId=dataselect[0].attributes.ID;
                    
                    var datas={"filter":{"ID":dataselectId}};
                    var data=JSON.stringify(datas);
                    // Ext.Ajax.request({
                    //     url:urls+'Org/view',
                    //     method:'post',
                    //     params:{auth:json_data,data:data},
                    //     success:function(conn, response, options){

                    //         var json = eval('(' + conn.responseText + ')'); 
                    //         // console.log(json.item);
                            
                    //         // AddOrgForm.getForm().getEl().dom.reset();
                    //         orgWindow.show();
                    //         orgWindow.setTitle('编辑部门');
                    //         AddOrgForm.getForm().getEl().dom.reset();
                    //         AddOrgForm.selectid=checkednode;
                    //         AddOrgForm.form.findField('orgname').setValue(pidName);
                    //         for(var key in json.item){
                    //           try{    
                    //             var adddata=json.item[key];
                    //             AddOrgForm.form.findField(key).setValue(adddata); 
                    //           }catch(e){}
                    //         }
                    //         eastConBoxTreeStore.load(Ext.getCmp('tree-org-combo').getRootNode(),function(){});
                            
                    //     }
                    // })
                    
                }else{Ext.Msg.alert("提示",'请勾选进行编辑！');}
            }
        }
    }),new Ext.Button({
        text:'删除',
        iconCls: 'ak-icon icon-del',
        cls:'ak-btn btn-red',
        //cls:'ak-btn btn-red',
        listeners:{
            click:function(){
                if(facility.getChecked().length==1){
                    var dataselect=facility.getChecked();
                    var dataselectId=dataselect[0].attributes.ID;
                    var checkednode=facility.getNodeById(dataselect[0].id);
                    if(checkednode.hasChildNodes()){
                        Ext.Msg.alert('提示！',"请先删除其子节点！")
                    }else{
                        Ext.MessageBox.confirm('提示', '真的要删除吗？', callBack);
                        var bb={"ID":[dataselectId]};
                        data=JSON.stringify(bb);
                        function callBack(id){
                            if(id=='yes'){
                                Ext.Ajax.request({
                                    url:urls+'Org/delete',
                                    method:'post',
                                    params:{auth:json_data,data:data},
                                    success:function(conn, response, options){
                                        if(errbyextjs(conn)){
                                            eastTreeStore.load(Ext.getCmp('sys-user-org-tree').getRootNode(),function(){});
                                            rolegridfilter={"SEARCH":false};
                                            Ext.getCmp('sys-roleMainPT').doLoad(0);
                                        }
                                       
                                    }
                                });
                            }
                        } 
                    }

                     

                }else{Ext.Msg.alert("提示",'请勾选部门进行删除！')}
            }
        }

    })],
    
    listeners:{ 
        checkchange: function(node,flag) {
            var checkedNodes = facility.getChecked();
            for(var i=0;i<checkedNodes.length;i++){     
                var nodes = checkedNodes[i];
                if(nodes.id != node.id){     
                     nodes.getUI().checkbox.checked = false;     
                     nodes.attributes.checked = false;     
                     facility.fireEvent('check', node, false);     
                }     
            } 
            
        },
        render:function(){
            root.expand();

        },
        click:function(node){
            
            ORGID=node.attributes.ID;
            rolegridfilter={"SEARCH":false,"ORGID":ORGID};
            // var datas={"filter":{"ORGID":node.attributes.ID},"start":0,"limit":10,"page":1};
            // var data=JSON.stringify(datas);
             Ext.getCmp('sys-roleMainPT').doLoad(0);
        }        
    } 

});
var root = new Ext.tree.AsyncTreeNode({
    text: '无',
    draggable:false,
    id:'sources'
});
facility.setRootNode(root);


