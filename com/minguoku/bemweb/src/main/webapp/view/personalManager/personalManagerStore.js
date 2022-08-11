var urls=akconfig.url+"rest/";        //蔡敏那边的
// var urls="http://160.255.0.191:8088/bemweb/rest/";        //蔡敏那边的
var urls2=akconfig.url+"rest/";      //严涛涛那边的
var userid=location.search.substr(1).split("=")[1];
var eastTreeStoredata;
var countforeastTreeStoreload=0;
var maingridfilter;   //主页面过滤
var gridfilter;
var fullname;    //姓名
var fullnameId;    //姓名id
var relationname;           //关系
var relationnameid;           //关系id
var categoryContent;    //类型内容
var othernamefilter;


var CenterGridRed = new Ext.data.JsonReader({  
	fields : [{name:'LASTNAME'},{name:'FIRSTNAME'},{name:'YH'},{name:'FH'},{name:'DH'},{name:'FORIGNNAME'}
  ,{name:'SEX'},{name:'JG'},{name:'MZ'},{name:'GJ'},{name:'BIRTHDAY'},{name:'BIRTHDAY2'}
  ,{name:'DEADDAY'},{name:'DEADDAY2'},{name:'EDU'},{name:'MAINBOOK'},{name:'CREATENAME'}
  ,{name:'CREATETIME'},{name:'UPDATETIME'},{name:'ID'},{name:'JGNAME'},{name:'FATHER'},{name:'MOTHER'}
  ,{name:'PHOTOID'},{name:'CREATER'},{name:'CREATEDATE'},{name:'MODIFIER'}
  ,{name:'MODIFYDATE'}],   
    root : 'items',
    id : 'ID',
    totalProperty :'total'
});  
var CenterGridStore = new Ext.data.Store({         
   
   	
   	url:urls+'Peoples/getPeopleList',
   	// url:'../../rest/website/list',
    reader:CenterGridRed
});
var eastTreeStore=new Ext.tree.TreeLoader({
	dataUrl:urls+'Column/tree'
});



var enteranceReader=new Ext.data.JsonReader({
         fields:[{name:'NAME'},{name:'VALUE'}]

  });

  var enteranceIsmust=new Ext.data.Store({   //入学时间
    
      data:[  
       {'NAME':'1945届','VALUE':'1'},{'NAME':'1946届','VALUE':'0'},{'NAME':'1947届','VALUE':'0'}
       ,{'NAME':'1948届','VALUE':'0'},{'NAME':'1949届','VALUE':'0'},{'NAME':'1950届','VALUE':'0'}
       ,{'NAME':'1951届','VALUE':'0'},{'NAME':'1952届','VALUE':'0'},{'NAME':'1953届','VALUE':'0'}
     ],
     reader:enteranceReader
  }); 

  var sexReader=new Ext.data.JsonReader({
         fields:[{name:'NAME'},{name:'VALUE'}]

  });

  var sexIsmust=new Ext.data.Store({   //性别
    
      data:[{'NAME':'男','VALUE':'M'},{'NAME':'女','VALUE':'F'}],
      reader:sexReader
  }); 

  // var fatherReader=new Ext.data.JsonReader({
  //       fields:[{name:'PEOPLENAME'},{name:'ID'}],
  //       root : 'items',
  //       id : 'ID',
  //       totalProperty :'total'

  // });

  // var fatherIsmust=new Ext.data.Store({   //父亲
  //       url:urls+'Peoples/getFatherList',
  //       reader:fatherReader
  // }); 
  // fatherIsmust.load({
  //       params:{
  //           data:JSON.stringify({"start":0,"page":1})
  //       }
  // });


  // var motherReader=new Ext.data.JsonReader({
  //       fields:[{name:'PEOPLENAME'},{name:'ID'}],
  //       root : 'items',
  //       id : 'ID',
  //       totalProperty :'total'

  // });

  // var motherIsmust=new Ext.data.Store({   //母亲
  //       url:urls+'Peoples/getMotherList',
  //       reader:motherReader
  // }); 

  // motherIsmust.load({
  //       params:{
  //           data:JSON.stringify({"start":0,"page":1})
  //       }
  // });

  var originReader=new Ext.data.JsonReader({
        fields:[{name:'NAME'},{name:'ID'}],
        root : 'items',
        id : 'ID',
        totalProperty :'total'

  });

  var originIsmust=new Ext.data.Store({   //籍贯
        url:urls+'Peoples/getJgList',
        reader:originReader
  }); 
  
  // originIsmust.load({         //籍贯
  //       params:{
  //           data:JSON.stringify({"start":0,"page":1})
  //       }
  // });

  var peoplerelaReader=new Ext.data.JsonReader({
        fields:[{name:'PEOPLE1ID'},{name:'ID'},{name:'PEOPLE2ID'},{name:'PEOPLENAME'},{name:'RELTYPE'}
               ,{name:'SEX'},{name:'NAME'}],
        root : 'items',
        id : 'ID',
        totalProperty :'total'

  });

  var peoplerelaStore=new Ext.data.Store({   //人物关系列表
        url:urls+'PeopleRel/getList',
        reader:peoplerelaReader
  }); 

  var nothernameReader=new Ext.data.JsonReader({
        fields:[{name:'NAME'},{name:'ID'},{name:'NTYPE'},{name:'PEOPLENAME'}],
        root : 'items',
        id : 'ID',
        totalProperty :'total'

  });

  var nothernameStore=new Ext.data.Store({   //其他称呼列表
        url:urls+'OtherName/list',
        reader:nothernameReader
  }); 

  // originIsmust.load({
  //       params:{
  //           data:JSON.stringify({"start":0,"page":1})
  //       }
  // });

  // var categoryReader=new Ext.data.JsonReader({
  //       fields:[{name:'NAME'},{name:'ID'},{name:'NTYPE'},{name:'PEOPLEID'}],
  //       root : 'items',
  //       id : 'ID',
  //       totalProperty :'total'

  // });

  // var categoryIsmust=new Ext.data.Store({   //类型
  //       url:urls+'OtherName/list',
  //       reader:categoryReader
  // }); 
  
  var categoryReader=new Ext.data.JsonReader({
         fields:[{name:'NAME'},{name:'VALUE'},{name:'NTYPE'}]

  });

  var categoryIsmust=new Ext.data.Store({   //类型
    
      data:[{'NAME':'笔名','VALUE':'1','NTYPE':'1'},{'NAME':'别名','VALUE':'2','NTYPE':'2'},
            {'NAME':'字','VALUE':'3','NTYPE':'3'},{'NAME':'号','VALUE':'4','NTYPE':'4'},
            {'NAME':'谥号','VALUE':'5','NTYPE':'5'}],
      reader:categoryReader
  }); 

  // categoryIsmust.load({
  //       params:{
  //           data:JSON.stringify({"start":0,"page":1})
  //       }
  // });

   var anotherReader=new Ext.data.JsonReader({
        fields:[{name:'NAME'},{name:'ID'},{name:'NTYPE'},{name:'PEOPLEID'}],
        root : 'items',
        id : 'ID',
        totalProperty :'total'

  });

  var anotherIsmust=new Ext.data.Store({   //字号别名笔名
        url:urls+'OtherName/getList',
        reader:anotherReader
  }); 
  // anotherIsmust.load({
  //       params:{
  //           data:JSON.stringify({"start":0,"page":1})
  //       }
  // });
 var nameReader=new Ext.data.JsonReader({
        fields:[{name:'PEOPLENAME'},{name:'ID'},{name:'RELTYPE'},{name:'SEX'},{name:'PEOPLE1ID'}
                ,{name:'PEOPLE2ID'}],
        root : 'items',
        id : 'ID',
        totalProperty :'total'

  });

  var nameStore=new Ext.data.Store({   //姓名下拉框
        url:urls+'PeopleRel/lists',
        reader:nameReader
  }); 

  var peopleRelationReader=new Ext.data.JsonReader({
        fields:[{name:'PEOPLENAME'},{name:'ID'},{name:'RELTYPE'},{name:'PEOPLE1ID'},{name:'SEX'},{name:'NAME'}],
        root : 'items',
        id : 'ID',
        totalProperty :'total'

  });

  var peopleRelationStore=new Ext.data.Store({   //人物关系下拉框
        url:urls+'Relation/getRelationList',
        reader:peopleRelationReader
  }); 


function notherRelationship(n){               //增加其他关系
        var form={
                                layout:'column',
                                id:'notherRelationship'+n,
                                style:'border:1px dotted green;',
                                items:[{
                                    layout:'form',
                                    columnWidth:0.16,
                                    items:[{
                                        xtype:'button',
                                        text:'删除',
                                        ctCls:'notherRelationship'+n,
                                        listeners:{
                                            click:function(){
            
                                               Ext.getCmp(this.ctCls).setVisible(false);
                                               Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                               Ext.getCmp(this.ctCls).items.items[2].items.items[0].setDisabled(true);
                                            }
                                        }
                                    }]
                                },{
                                    layout:'form',
                                    columnWidth:0.4,
                                    items:[{
                                        xtype:'combo',
                                        name:'PEOPLE1ID',
                                        ctCls:'notherRelationship'+n,
                                        width:115,
                                        editable:false,
                                        store:nameStore,
                                        displayField:'PEOPLENAME',
                                        valueField:'PEOPLE1ID',
                                        triggerAction:'all',
                                        mode:'local',
                                        fieldLabel:'姓名',
                                        listeners:{
                                            select:function(th){
                                                var value=nameStore.getAt(this.selectedIndex).json.SEX;
                                                
                                                Ext.getCmp(this.ctCls).items.items[2].items.items[0].getStore().load({ //过滤关系
                                                    params:{
                                                        data:JSON.stringify({"filter":{"SEX":value}})
                                                    }
                                                });
                                            }
                                        }
                                    }]
                                },{
                                        layout:'form',
                                        columnWidth:0.4,
                                        items:[{
                                            xtype:'combo',
                                            name:'RELTYPE',
                                            width:115,
                                            editable:false,
                                            store:peopleRelationStore,
                                            displayField:'RELTYPE',
                                            valueField:'ID',
                                            triggerAction:'all',
                                            mode:'local',
                                            fieldLabel:'关系'
                                        }]
                                }
                                ]
        };

        return form;
}

function callname(n){               //增加称呼
        var form={
                                layout:'column',
                                id:'callname'+n,
                                style:'border:1px dotted green;',
                                items:[{
                                    layout:'form',
                                    columnWidth:0.16,
                                    items:[{
                                        xtype:'button',
                                        text:'删除',
                                        ctCls:'callname'+n,
                                        listeners:{
                                            click:function(){
            
                                               Ext.getCmp(this.ctCls).setVisible(false);
                                               Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                               Ext.getCmp(this.ctCls).items.items[2].items.items[0].setDisabled(true);
                                               Ext.getCmp(this.ctCls).items.items[3].items.items[0].setDisabled(true);
                                               Ext.getCmp(this.ctCls).items.items[4].items.items[0].setDisabled(true);
                                               Ext.getCmp(this.ctCls).items.items[5].items.items[0].setDisabled(true);
                                            }
                                        }
                                    }]
                                },{
                                    layout:'form',
                                    columnWidth:0.4,
                                    items:[{
                                        xtype:'combo',
                                        name:'NTYPE',
                                        width:115,
                                        ctCls:'callname'+n,
                                        editable:false,
                                        store:categoryIsmust,
                                        displayField:'NAME',
                                        valueField:'VALUE',
                                        triggerAction:'all',
                                        mode:'local',
                                        fieldLabel:'类型',
                                        listeners:{
                                            select:function(th){
                                                var value=categoryIsmust.getAt(this.selectedIndex).json.NTYPE;
                                                 
                                                 Ext.getCmp(this.ctCls).items.items[2].setVisible(value=='1');
                                                 Ext.getCmp(this.ctCls).items.items[2].items.items[0].setDisabled(value!='1');
                                                 Ext.getCmp(this.ctCls).items.items[3].setVisible(value=='2');
                                                 Ext.getCmp(this.ctCls).items.items[3].items.items[0].setDisabled(value!='2');
                                                 Ext.getCmp(this.ctCls).items.items[4].setVisible(value=='3');
                                                 Ext.getCmp(this.ctCls).items.items[4].items.items[0].setDisabled(value!='3');
                                                 Ext.getCmp(this.ctCls).items.items[5].setVisible(value=='4');
                                                 Ext.getCmp(this.ctCls).items.items[5].items.items[0].setDisabled(value!='4');

                                                 anotherIsmust.load({
                                                        params:{
                                                            data:JSON.stringify({"filter":{"NTYPE":value}})
                                                        }
                                                 });
                                            }
                                        }
                                    }]
                                },{
                                        layout:'form',
                                        columnWidth:0.4,
                                        hidden:true,
                                        items:[{
                                            xtype:'combo',
                                            name:'NAME',
                                            width:115,
                                            editable:false,
                                            store:anotherIsmust,
                                            displayField:'NAME',
                                            valueField:'ID',
                                            triggerAction:'all',
                                            mode:'local',
                                            fieldLabel:'笔名'
                                        }]
                                },{
                                        layout:'form',
                                        columnWidth:0.4,
                                        hidden:true,
                                        items:[{
                                            xtype:'combo',
                                            name:'NAME',
                                            width:115,
                                            editable:false,
                                            store:anotherIsmust,
                                            displayField:'NAME',
                                            valueField:'ID',
                                            triggerAction:'all',
                                            mode:'local',
                                            fieldLabel:'别名'
                                        }]
                                },{
                                        layout:'form',
                                        columnWidth:0.4,
                                        hidden:true,
                                        items:[{
                                            xtype:'combo',
                                            name:'NAME',
                                            width:115,
                                            editable:false,
                                            store:anotherIsmust,
                                            displayField:'NAME',
                                            valueField:'ID',
                                            triggerAction:'all',
                                            mode:'local',
                                            fieldLabel:'字'
                                        }]
                                },{
                                        layout:'form',
                                        columnWidth:0.4,
                                        hidden:true,
                                        items:[{
                                            xtype:'combo',
                                            name:'NAME',
                                            width:115,
                                            editable:false,
                                            store:anotherIsmust,
                                            displayField:'NAME',
                                            valueField:'ID',
                                            triggerAction:'all',
                                            mode:'local',
                                            fieldLabel:'号'
                                        }]
                                }
                                ]
        };

        return form;
}

function partner(n){              //配偶
        var form={
                                layout:'column',
                                id:'mate'+n,
                                style:'border:1px dotted green;',
                                items:[{
                                    layout:'form',
                                    columnWidth:0.16,
                                    items:[{
                                        xtype:'button',
                                        text:'删除',
                                        ctCls:'mate'+n,
                                        listeners:{
                                            click:function(){
            
                                               Ext.getCmp(this.ctCls).setVisible(false);
                                               Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                            }
                                        }
                                    }]
                                },{
                                    layout:'form',
                                    columnWidth:0.4,
                                    items:[{
                                        xtype:'combo',
                                        name:'PO',
                                        width:100,
                                        fieldLabel:'配偶'
                                    }]
                                }
                                // ,{
                                //         layout:'form',
                                //         columnWidth:0.4,
                                //         items:[{
                                //             xtype:'combo',
                                //             name:'NUMBER',
                                //             width:115,
                                //             fieldLabel:'关系'
                                //         }]
                                // }
                                ]
        };

        return form;
}

function children(n){              //子女
        var form={
                                layout:'column',
                                id:'children'+n,
                                style:'border:1px dotted green;',
                                items:[{
                                    layout:'form',
                                    columnWidth:0.16,
                                    items:[{
                                        xtype:'button',
                                        text:'删除',
                                        ctCls:'children'+n,
                                        listeners:{
                                            click:function(){
            
                                               Ext.getCmp(this.ctCls).setVisible(false);
                                               Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                            }
                                        }
                                    }]
                                },{
                                    layout:'form',
                                    columnWidth:0.8,
                                    items:[{
                                        xtype:'combo',
                                        name:'ZN',
                                        width:86,
                                        fieldLabel:'子女'
                                    }]
                                }]
        };

        return form;
}


function penname(n){              //笔名
        var form={
                                layout:'column',
                                id:'penname'+n,
                                style:'border:1px dotted green;',
                                items:[{
                                    layout:'form',
                                    columnWidth:0.16,
                                    items:[{
                                        xtype:'button',
                                        text:'删除',
                                        ctCls:'penname'+n,
                                        listeners:{
                                            click:function(){
            
                                               Ext.getCmp(this.ctCls).setVisible(false);
                                               Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                            }
                                        }
                                    }]
                                },{
                                    layout:'form',
                                    columnWidth:0.8,
                                    items:[{
                                        xtype:'textfield',
                                        name:'PENNAME',
                                        width:86,
                                        fieldLabel:'笔名'
                                    }]
                                }]
        };

        return form;
}

function nothername(n){              //别名
        var form={
                                    layout:'column',
                                    id:'anothername'+n,
                                    style:'border:1px dotted green;',
                                    items:[{
                                        layout:'form',
                                        columnWidth:0.16,
                                        items:[{
                                            xtype:'button',
                                            text:'删除',
                                            ctCls:'anothername'+n,
                                            listeners:{
                                                click:function(){
                
                                                   Ext.getCmp(this.ctCls).setVisible(false);
                                                   Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                                }
                                            }
                                        }]
                                    },{
                                        layout:'form',
                                        columnWidth:0.8,
                                        items:[{
                                            xtype:'textfield',
                                            name:'NOTHERNAME',
                                            width:86,
                                            fieldLabel:'别名'
                                        }]
                                    }]
        };

        return form;
}

function word(n){              //字
        var form={
                                    layout:'column',
                                    id:'wordname'+n,
                                    style:'border:1px dotted green;',
                                    items:[{
                                        layout:'form',
                                        columnWidth:0.16,
                                        items:[{
                                            xtype:'button',
                                            text:'删除',
                                            ctCls:'wordname'+n,
                                            listeners:{
                                                click:function(){
                
                                                   Ext.getCmp(this.ctCls).setVisible(false);
                                                   Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                                }
                                            }
                                        }]
                                    },{
                                        layout:'form',
                                        columnWidth:0.8,
                                        items:[{
                                            xtype:'textfield',
                                            name:'WORD',
                                            width:86,
                                            fieldLabel:'字'
                                        }]
                                    }]
        };

        return form;
}

function number(n){              //号
        var form={
                                    layout:'column',
                                    id:'numbername'+n,
                                    style:'border:1px dotted green;',
                                    items:[{
                                        layout:'form',
                                        columnWidth:0.16,
                                        items:[{
                                            xtype:'button',
                                            text:'删除',
                                            ctCls:'numbername'+n,
                                            listeners:{
                                                click:function(){
                
                                                   Ext.getCmp(this.ctCls).setVisible(false);
                                                   Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                                }
                                            }
                                        }]
                                    },{
                                        layout:'form',
                                        columnWidth:0.8,
                                        items:[{
                                            xtype:'textfield',
                                            name:'NUMBER',
                                            width:86,
                                            fieldLabel:'号'
                                        }]
                                    }]
        };

        return form;
}

function dynasty(n){              //朝代
        var form={
                                    layout:'column',
                                    id:'dynastyname'+n,
                                    style:'border:1px dotted green;',
                                    items:[{
                                        layout:'form',
                                        columnWidth:0.16,
                                        items:[{
                                            xtype:'button',
                                            text:'删除',
                                            ctCls:'dynastyname'+n,
                                            listeners:{
                                                click:function(){
                
                                                   Ext.getCmp(this.ctCls).setVisible(false);
                                                   Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                                }
                                            }
                                        }]
                                    },{
                                        layout:'form',
                                        columnWidth:0.8,
                                        items:[{
                                            xtype:'textfield',
                                            name:'DYNASTY',
                                            width:86,
                                            fieldLabel:'朝代'
                                        }]
                                    }]
        };

        return form;
}

function studyExperince(n){              //学习经历
        var form={
                                    layout:'column',
                                    id:'studyexperance'+n,
                                    style:'border:1px dotted green;',
                                    items:[{
                                        layout:'form',
                                        columnWidth:0.10,
                                        items:[{
                                            xtype:'button',
                                            text:'删除',
                                            ctCls:'studyexperance'+n,
                                            listeners:{
                                                click:function(){
                
                                                   Ext.getCmp(this.ctCls).setVisible(false);
                                                   Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                                }
                                            }
                                        }]
                                    },{
                                        layout:'form',
                                        columnWidth:0.8,
                                        items:[{
                                            layout:'column',
                                            items:[{
                                                layout:'form',
                                                columnWidth:0.34,
                                                items:[{
                                                    xtype:'datefield',
                                                    format:'Y-m-d',
                                                    name:'STUSTARTTIME',
                                                    readOnly:true,
                                                    width:93,
                                                    fieldLabel:'开始时间'
                                                }]
                                            },{
                                                layout:'form',
                                                columnWidth:0.34,
                                                items:[{
                                                    xtype:'datefield',
                                                    format:'Y-m-d',
                                                    name:'STUENDTIME',
                                                    readOnly:true,
                                                    width:93,
                                                    fieldLabel:'结束时间'
                                                }]
                                            },{
                                                layout:'form',
                                                columnWidth:0.32,
                                                items:[{
                                                    xtype:'textfield',
                                                    width:82,
                                                    name:'SCHOOL',
                                                    fieldLabel:'学校'
                                                }]
                                            }]
                                        }]
                                    }]
        };

        return form;
}

function teachexperance(n){              //从教经历
        var form={
                                    layout:'column',
                                    id:'teachingexperance'+n,
                                    style:'border:1px dotted green;',
                                    items:[{
                                        layout:'form',
                                        columnWidth:0.10,
                                        items:[{
                                            xtype:'button',
                                            text:'删除',
                                            ctCls:'teachingexperance'+n,
                                            listeners:{
                                                click:function(){
                
                                                   Ext.getCmp(this.ctCls).setVisible(false);
                                                   Ext.getCmp(this.ctCls).items.items[1].items.items[0].setDisabled(true);
                                                }
                                            }
                                        }]
                                    },{
                                        layout:'form',
                                        columnWidth:0.8,
                                        items:[{
                                            layout:'column',
                                            items:[{
                                                layout:'form',
                                                columnWidth:0.34,
                                                items:[{
                                                    xtype:'combo',
                                                    editable:false,
                                                    name:'ENTERTIME',
                                                    width:93,
                                                    store:enteranceIsmust,
                                                    displayField:'NAME',
                                                    valueField:'VALUE',
                                                    triggerAction:'all',
                                                    mode :'local',
                                                    fieldLabel:'入学时间'
                                                }]
                                            },{
                                                layout:'form',
                                                columnWidth:0.34,
                                                items:[{
                                                    xtype:'combo',
                                                    format:'Y-m-d',
                                                    name:'SCHOOLNAME',
                                                    editable:false,
                                                    width:93,
                                                    fieldLabel:'学校'
                                                }]
                                            },{
                                                layout:'form',
                                                columnWidth:0.32,
                                                items:[{
                                                    xtype:'combo',
                                                    editable:false,
                                                    width:82,
                                                    name:'CLASS',
                                                    fieldLabel:'班级'
                                                }]
                                            }
                                            ]
                                        }]
                                    }]
        };

        return form;
}


