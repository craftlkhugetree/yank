
var facility=new Ext.tree.TreePanel({
    loader: eastTreeStore,
    title:'组织结构',
    // region:'center',
    split:true,
    layout:'fit',
    collapsible:false,
    width:300,

    id:'con-tree-org-combo',
    autoScroll: true,
    animate: false,
    enableDD: true,
    containerScroll: true,
    rootVisible: false,
    // width:230,
    border:false,
    height:'100%',
    tbar:[
        new Ext.Button({
            text:'刷新',
            cls:'ak-btn btn-blue',
            listeners:{
                click:function(th){
                    eastTreeStore.load(Ext.getCmp('con-tree-org-combo').getRootNode(),function(){

                     });
                     appointOrganStore.load({              // 任命机关
                        params:{
                            data:JSON.stringify({"start":0,"page":1})
                        }
                     });
                     positionStore.load({              // 原职位
                        params:{
                            data:JSON.stringify({"start":0,"page":1})
                        }
                     });
                   
                }
            }
        })
    ],
    // tbar:[new Ext.Button({
    //     text:'新增',
    //     cls:'ak-btn btn-blue',
    //     listeners:{
    //         click:function(th){
                
    //             orgWindow.show();
    //             orgWindow.setTitle('新增');
    //             AddOrgForm.getForm().getEl().dom.reset();
                
               
    //         }
    //     }
    // }),new Ext.Button({
    //     text:'编辑',
    //     cls:'ak-btn btn-purple',
    //     listeners:{
    //         click:function(){
                
    //             if(facility.getChecked().length==1){ //这里的复赋值怎么快怎么来了
                   
    //                 var dataselect=facility.getChecked();
                        
    //                 orgWindow.show();
    //                 orgWindow.setTitle('编辑');
    //                 AddOrgForm.getForm().getEl().dom.reset();
    //                 AddOrgForm.form.findField('ID').setValue(dataselect[0].attributes.ID);
    //                 AddOrgForm.form.findField('NAME').setValue(dataselect[0].attributes.NAME);
    //                 AddOrgForm.form.findField('DES').setValue(dataselect[0].attributes.DES);
                   

                    
    //             }else{Ext.Msg.alert("提示",'请选择进行编辑！')}
    //         }
    //     }
    // }),new Ext.Button({
    //     text:'删除',
    //     cls:'ak-btn btn-red',
    //     listeners:{
    //         click:function(){
    //             if(facility.getChecked().length==1){
    //                 var dataselect=facility.getChecked();
    //                 var dataselectId=dataselect[0].attributes.ID;
                   
    //                     Ext.MessageBox.confirm('提示', '真的要删除吗？', callBack);
    //                     var bb={"ID":[dataselectId]};
    //                     data=JSON.stringify(bb);
    //                     function callBack(id){
    //                         if(id=='yes'){
    //                             Ext.Ajax.request({
    //                                 url:urls+'publicFollow/deleteGroup',
    //                                 method:'post',
    //                                 params:{auth:json_data3,data:data},
    //                                 success:function(conn, response, options){
    //                                     if(errbyextjs(conn)){
    //                                         eastTreeStore.load(Ext.getCmp('con-tree-org-combo').getRootNode(),function(){

    //                                         });
                                            
    //                                     }
                                       
    //                                 }
    //                             });
    //                         }
    //                     } 
                    

                     

    //             }else{Ext.Msg.alert("提示",'请选择进行删除！')}
    //         }
    //     }

    // })
    // //  ,new Ext.Button({
    // //   text:"粉丝组管理",
    // //   cls:'ak-btn btn-blue',
    // //   listeners:{
    // //     click:function(){
    // //       if(facility.getChecked().length==1){
    // //              var dataselect=facility.getChecked();
    // //              fansgroupid=dataselect[0].attributes.ID;
    // //              rolegridfilter={"SEARCH":false,"GROUPID":dataselect[0].attributes.ID};
    // //              Ext.getCmp('con-roleMainPT').doLoad(0);
    // //       }else{Ext.Msg.alert('提示','请选择一条记录！')}
    // //     }
    // //   }
    // // })
    //  ,new Ext.Button({
    //   text:'同步粉丝',
    //   cls:'ak-btn btn-blue',
    //   listeners:{
    //     click:function(){
    //         var callBack=function(id){
    //             if(id=='yes'){
    //                     var outtime=1000*60*60*24;
    //                     var progress=0;
         
    //                     Ext.MessageBox.progress("进度", "正在同步...");
    //                     setInterval(function(){
    //                         if(progress>=1)
    //                             progress=0;
    //                         Ext.MessageBox.updateProgress(progress);
    //                         progress=progress+0.1;
    //                     },300);
          
    //                     Ext.Ajax.request({                        //同步粉丝
    //                         url:urls+"publicFollow/sync",
    //                         method:'post',
    //                         timeout:outtime,
    //                         params:{auth:json_data3,data:json_data2},
    //                         success: function(response, options){
    //                           if(errbyextjs(response)){
    //                             Ext.MessageBox.hide();
    //                             eastTreeStore.load(Ext.getCmp('con-tree-org-combo').getRootNode(),function(){

    //                             });
    //                             Ext.Msg.alert('提示！','同步成功');
    //                            }
    //                           }, 
    //                         failure:function(response, options){
    //                            Ext.Msg.alert('网络出错了！')
    //                         }
    //                     });
    //             }
    //         }
    //         Ext.MessageBox.confirm('提示', '同步粉丝根据粉丝量的大小可能需要几分钟到几十分钟不等的时间，请问是否继续?', callBack); 
            
    //     }

    //   }
    // })],
    
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
             // fansgroupid=node.attributes.ID;
             orgfilter=node.attributes.ID;
             gridfilter={"ORGID":node.attributes.ID};
             Ext.getCmp('orgPosition').doLoad(0);
             Fund_use_GridStore.removeAll();
             stafffilter='';
        }   
           
    } 
      //  }

});
var root = new Ext.tree.AsyncTreeNode({
    text: '无',
    draggable:false,
    id:'con-sources'
});
facility.setRootNode(root);


