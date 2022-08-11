
var CenterGrid= new Ext.grid.GridPanel({
	layout:'fit',
    // split:true,
    collapsible:false,
    store: CenterGridStore,
    sm:new Ext.grid.CheckboxSelectionModel({singleSelect:true}),
    cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel ({singleSelect : true}), //改为ture为多选
        {header: '原始名', dataIndex: 'SOURCENAME',width:120},
        {header: '别称/俗称', dataIndex: 'OTHERNAME',width:120},
        {header: '地名', dataIndex: 'NAME',width:120},
        {header: '现今名', dataIndex: 'COURRENTNAME',width:120},
        {header: '方位里距', dataIndex: 'FWLJ',width:120},
        {header:'设置年代',dataIndex:'SETYEAR',width:130},
        {header:'设置朝代',dataIndex:'SETDYNASTY',width:120},
        {header:'设置年号',dataIndex:'SETREIGNTITLE',width:120},
        {header: '废止年代', dataIndex: 'ENDYEAR',width:140},
        {header: '废止朝代', dataIndex: 'ENDDYNASTY',width:120},
        {header: '废止年号', dataIndex: 'ENDREIGNTITLE',width:120},
        {header: '治所古名', dataIndex: 'OLDGOVLOCAL',width:140},
        {header: '治所今名', dataIndex: 'NEWGOVLOCAL',width:140},
        {header: '辖境范围', dataIndex: 'MAREA',width:140},
        {header: '后改名', dataIndex: 'BACKNAME',width:140},
        {header: '隶属', dataIndex: 'BELONG',width:120},
        {header: '性质', dataIndex: 'TYPE',width:120,
           renderer:function(value){
               var xx;
               if(value=='01'){
                    xx='羁縻州';
               }else if(value=='02'){
                    xx='侨置州';
               }
               return xx;
           }},
        {header: '创建人', dataIndex: 'CREATER',width:120},
        {header: '创建日期', dataIndex: 'CREATEDATE',width:140,
           renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }},
        {header:'修改人',dataIndex:'MODIFIER',width:120},
        {header: '修改日期', dataIndex: 'MODIFYDATE',width:140,
    	renderer:function(value){ var xx=akDateChange.timechange(value); return xx; }}
    ]),
    // viewConfig: {
    //     forceFit: true
    // },
    bbar: new Ext.PagingToolbar({  
        pageSize:16,
        // height:50,   
        id:'CenterGrid-MainPT',
        cls:'ak-pager',
        store:CenterGridStore,
        displayInfo: true,
        displayMsg: '显示第 {0} 条到 {1} 条记录，共{2}条数据',
        beforePageText : "第",
        listeners:{
            beforechange:function(a,param){
                var start=param.start;
                var page=param.start/16+1;
                var xx={"start":start,"limit":16,"page":page,"filter":gridfilter};
                param.data=JSON.stringify(xx);

            }
        }
    }),
    tbar:[{
    	xtype:'button',
    	text:'新增',
        iconCls:'ak-icon icon-add',
        akfun:'add',
        akfunID:'100111',
        // id:'sxssss',
    	cls:'ak-btn btn-green ak-auth',
    	listeners:{
    		click:function(){
                addWindow.show();
                addWindow.setTitle('新增')
                addForm.getForm().getEl().dom.reset();
                yearNumberStore.removeAll();
                setyearStore.removeAll();
                stopyearNumberStore.removeAll();
                stopyearStore.removeAll();
                abolishStore.removeAll();
                addForm.form.reset();

                Ext.getCmp('CREATER').setText('');
                Ext.getCmp('CREATEDATE').setText('');
                Ext.getCmp('MODIFIER').setText('');
                Ext.getCmp('MODIFYDATE').setText('');
                // calendarStore.load({
                //       params:{filter:JSON.stringify({"PID":''})}
                // });
    		}
    	}
    },{
    	xtype:'button',
    	text:'编辑',
        iconCls: 'ak-icon icon-edit',
    	cls:'ak-btn btn-blue ak-auth',
        akfun:'edit',
        akfunID:'100112',
    	listeners:{
    		click:function(){
                if(CenterGrid.getSelectionModel().getSelected()!=undefined){
                    var mianrecord=CenterGrid.getSelectionModel().getSelected();
                    addWindow.show();
                    addWindow.setTitle('编辑');
                    addForm.getForm().getEl().dom.reset();

                    var ENDYEAR=mianrecord.data.ENDYEAR;
                    mianrecord.data.ENDYEAR=akDateChange.timechangeymd(mianrecord.data.ENDYEAR);
                    addForm.setValues(mianrecord.data);
                    mianrecord.data.ENDYEAR=ENDYEAR;
                    
                    yearNumberStore.removeAll();
                    setyearStore.removeAll();
                    stopyearNumberStore.removeAll();
                    stopyearStore.removeAll();

                    var setdynastyYear;
                    dynastyStore.each(function(th){
                          
                          if(th.data.NAME==mianrecord.data.SETDYNASTY){
                               
                               setdynastyYear=th.json.YEAR;
                                if(mianrecord.data.SETDYNASTY){
                                    yearNumberStore.load({        //加载设置年号
                                          params:{filter:JSON.stringify({"PID":th.id})},  //mianrecord.data.SETDYNASTY
                                          callback:function(th){
                                              
                                              for (var i = 0; i < th.length; i++) {
                                                  
                                                  if(th[i].data.NAME==mianrecord.data.SETREIGNTITLE){
                                                        setyearStore.load({                   //加载设置年代
                                                              params:{filter:JSON.stringify({"PID":th[i].id})},   //mianrecord.data.SETREIGNTITLE
                                                              callback:function(){
                                                                   addForm.form.findField('SETYEAR').setValue(mianrecord.data.SETYEAR);
                                                              }
                                                        });
                                                        return false;
                                                  }
                                              }
                                               addForm.form.findField('SETREIGNTITLE').setValue(mianrecord.data.SETREIGNTITLE);
                                          }
                                    });
                                }
                               return false;
                          }
                    });
                    
                    
                    // if(mianrecord.data.ENDDYNASTY){
                    //     stopyearNumberStore.load({                   //加载废止年号
                    //           params:{filter:JSON.stringify({"PID":mianrecord.data.ENDDYNASTY})},   //mianrecord.data.ENDDYNASTY
                    //           callback:function(){
                    //                addForm.form.findField('ENDREIGNTITLE').setValue(mianrecord.data.ENDREIGNTITLE);
                    //           }
                    //     });
                    // }
                    
                    // if(mianrecord.data.ENDREIGNTITLE){
                    //     stopyearStore.load({                   //加载废止年代
                    //           params:{filter:JSON.stringify({"PID":mianrecord.data.ENDREIGNTITLE})},    // mianrecord.data.ENDREIGNTITLE
                    //           callback:function(){
                    //                addForm.form.findField('ENDYEAR').setValue(mianrecord.data.ENDYEAR);
                    //           }
                    //     });
                    // }
                    
                    // var setdynastyYear;
                    // dynastyStore.each(function(th){
                          
                    //       if(th.id==mianrecord.data.SETDYNASTY){
                    //            setdynastyYear=th.json.YEAR;
                    //            return false;
                    //       }
                    // });

                    if(mianrecord.data.ENDDYNASTY){
        
                        abolishStore.load({                   //加载废止朝代
                              params:{filter:JSON.stringify({"YEAR":setdynastyYear})},    // mianrecord.data.ENDREIGNTITLE
                              callback:function(th){
                                   
                                   for (var i = 0; i < th.length; i++) {
                                        if(th[i].data.NAME==mianrecord.data.ENDDYNASTY){
                                            stopyearNumberStore.load({                   //加载废止年号
                                                  params:{filter:JSON.stringify({"PID":th[i].id})},   //mianrecord.data.ENDDYNASTY
                                                  callback:function(result){
                                                        addForm.form.findField('ENDREIGNTITLE').setValue(mianrecord.data.ENDREIGNTITLE);
                                                        
                                                       for (var j = 0; j < result.length; j++) {
                                                            if(result[j].data.NAME==mianrecord.data.ENDREIGNTITLE){
                                                                stopyearStore.load({                   //加载废止年代
                                                                      params:{filter:JSON.stringify({"PID":result[j].id})},    // mianrecord.data.ENDREIGNTITLE
                                                                      callback:function(){
                                                                           addForm.form.findField('ENDYEAR').setValue(mianrecord.data.ENDYEAR);
                                                                      }
                                                                });
                                                                return false;
                                                            }
                                                       }
                                                  }
                                            });
                                            return false;
                                        }
                                   }
                                   addForm.form.findField('ENDDYNASTY').setValue(mianrecord.data.ENDDYNASTY);
                              }
                        });
                    }
                    
                    Ext.getCmp('CREATER').setText(mianrecord.data.CREATER);
                    Ext.getCmp('CREATEDATE').setText(akDateChange.timechange(mianrecord.data.CREATEDATE)!=undefined?akDateChange.timechange(mianrecord.data.CREATEDATE):'');
                    Ext.getCmp('MODIFIER').setText(mianrecord.data.MODIFIER);
                    Ext.getCmp('MODIFYDATE').setText(akDateChange.timechange(mianrecord.data.MODIFYDATE)!=undefined?akDateChange.timechange(mianrecord.data.MODIFYDATE):'');
                }else{Ext.Msg.alert('提示！','请选择一条数据编辑！')}
    		}
    	}
    },{
    	xtype:'button',
    	text:'删除',
        iconCls: 'ak-icon icon-del',
    	cls:'ak-btn btn-red ak-auth',
        akfun:'delete',
        akfunID:'100113',
    	listeners:{
    		click:function(){
    			akCommFunction.deleterecord(CenterGrid,'CenterGrid-MainPT','Geography/delete');
    		}
    	}
    },
    '->',new  Ext.form.TextField({
        id:'rolequerykeyword',
        name:'KEYWORD',
        width:150
    }),new Ext.Button({
        text:"查询",
        cls:'ak-btn btn-green',
        iconCls:'ak-icon icon-search',
        listeners:{
            click:function(){
                gridfilter={"SEARCH":false,"KEYWORD":Ext.getCmp('rolequerykeyword').getValue()};
                Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            
            }
        }
    }),new Ext.Button({
        iconCls:'ak-icon icon-reset',
        cls:'ak-btn btn-green',       
        text:"重置",
        listeners:{

        click:function(){
            Ext.getCmp('rolequerykeyword').setValue("");
            gridfilter={"SEARCH":false,"KEYWORD":''};
        
            Ext.getCmp('CenterGrid-MainPT').doLoad(0);
    
            }
        }
    })
    ],
    listeners:{
        beforerender:function(th){
            Ext.getCmp('CenterGrid-MainPT').doLoad(0);
            // CenterGridStore.load({
            //     params:{data:JSON.stringify({start:0,limit:2,"page":1,"filter":''})}
            // });
        }
    }
    

});
