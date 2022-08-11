var addForm=new Ext.ux.ExFormPanel({
    
    border:false,
    labelWidth:65,
    labelAlign:'right',
    // width: 500,
    // height:800,
    // autoHeight : true,
    //defaults: {labelWidth:65,labelAlign:'right'},
    items:[{
          xtype:'label',
          disabled:true,
          style:'margin-left:20px;',
          html:'温馨提示:红色*和蓝色*意思是联动'
       },{
        layout:'column',
        items:[{
            columnWidth:0.5,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	width:150,
            	name:'SOURCENAME',
                allowBlank:false,
                vtype:'standard',
                tabIndex:1,
                blankText:'请填写原始名',
                msgTarget:'qtip',
            	fieldLabel:'原始名'
            },{
            	xtype:'textfield',
            	name:'NAME',
            	width:150,
                tabIndex:3,
                vtype:'standard',
            	fieldLabel:'地名'
            },{
                xtype:'textfield',
                name:'BELONG',
                width:150,
                tabIndex:5,
                fieldLabel:'隶属'
            },
            {
                xtype:'combo',
                name:'SETDYNASTY',
                width:150,
                store:dynastyStore,
                displayField:'NAME',
                valueField:'NAME',
                mode:'local',
                triggerAction: 'all',
                editable:false,
                fieldLabel:'设置朝代<span style="color:red;">*</span>',
                tabIndex:7,
                listeners:{
                    select:function(th){
                        addForm.form.findField('SETREIGNTITLE').setValue('');
                        addForm.form.findField('SETYEAR').setValue('');
                        var valueId=dynastyStore.getAt(this.selectedIndex).json.ID;
                        yearNumberStore.load({
                              params:{filter:JSON.stringify({"PID":valueId})}
                        });
                        setyearStore.removeAll();
                        
                        var value=dynastyStore.getAt(this.selectedIndex).json.YEAR;

                        abolishStore.load({
                            params:{filter:JSON.stringify({"YEAR":value})}
                        });
                    }
                }
            },
            {
                xtype:'combo',
                name:'SETYEAR',
                width:150,
                store:setyearStore,
                displayField:'YEAR',
                valueField:'YEAR',
                mode:'local',
                triggerAction: 'all',
                editable:false,
                tabIndex:9,
                fieldLabel:'设置年代<span style="color:red;">*</span>'
            },

            {
                xtype:'combo',
                name:'ENDDYNASTY',
                width:150,
                store:abolishStore,
                displayField:'NAME',
                valueField:'NAME',
                mode:'local',
                triggerAction: 'all',
                editable:false,
                fieldLabel:'废止朝代<span style="color:blue;">*</span>',
                tabIndex:10,
                listeners:{
                    select:function(th){
                        addForm.form.findField('ENDREIGNTITLE').setValue('');
                        addForm.form.findField('ENDYEAR').setValue('');
                        var valueId=abolishStore.getAt(this.selectedIndex).json.ID;
                        stopyearNumberStore.load({
                              params:{filter:JSON.stringify({"PID":valueId})}
                        });
                        stopyearStore.removeAll();
                    }
                }
            },
            {
                xtype:'combo',
                store:stopyearStore,
                displayField:'YEAR',
                valueField:'YEAR',
                mode:'local',
                triggerAction: 'all',
                editable:false,
                name:'ENDYEAR',
                width:150, 
                tabIndex:12,
                fieldLabel:'废止年代<span style="color:blue;">*</span>'
            },
            // {
            //     xtype:'combo',
            //     name:'ENDREIGNTITLE',
            //     width:150,
            //     store:stopyearNumberStore,
            //     displayField:'NAME',
            //     valueField:'ID',
            //     mode:'local',
            //     triggerAction: 'all',
            //     editable:false,
            //     fieldLabel:'废止年号<span style="color:blue;">*</span>',
            //     tabIndex:11,
            //     listeners:{
            //         select:function(th){
            //             addForm.form.findField('ENDYEAR').setValue('');
            //             stopyearStore.load({
            //                   params:{filter:JSON.stringify({"PID":th.value})}
            //             });
            //         }
            //     }
            // },
            // {
            //     xtype:'textfield',
            //     name:'OLDGOVLOCAL',
            //     width:150,
            //     tabIndex:13,
            //     fieldLabel:'治所古名'
            // },
            {
                xtype:'textfield',
                name:'BACKNAME',
                width:150,
                tabIndex:15,
                fieldLabel:'后改名'
            }
            ]
        },{
            columnWidth:0.5,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	name:'OTHERNAME',
            	width:150,
                tabIndex:2,
            	fieldLabel:'别称/俗称'
            },{
                xtype:'textfield',
                name:'COURRENTNAME',
                width:150,
                tabIndex:4,
                fieldLabel:'现今名'
            },{
                xtype:'textfield',
                name:'FWLJ',
                width:150,
                tabIndex:4,
                fieldLabel:'方位里距'
            },
            {
                xtype:'combo',
                name:'SETREIGNTITLE',
                width:150,
                store:yearNumberStore,
                displayField:'NAME',
                valueField:'NAME',
                mode:'local',
                triggerAction: 'all',
                editable:false,
                fieldLabel:'设置年号<span style="color:red;">*</span>',
                tabIndex:8,
                listeners:{
                    select:function(th){
                        addForm.form.findField('SETYEAR').setValue('');
                        var valueId=yearNumberStore.getAt(this.selectedIndex).json.ID;
                        setyearStore.load({
                              params:{filter:JSON.stringify({"PID":valueId})}
                        });
                    }
                }
            },
            {
                xtype:'combo',
                name:'TYPE',
                width:150,
                store:propertyStore,
                displayField:'NAME',
                valueField:'ID',
                mode:'local',
                triggerAction: 'all',
                editable:false,
                tabIndex:6,
                fieldLabel:'性质'
            },
            {
                xtype:'combo',
                name:'ENDREIGNTITLE',
                width:150,
                store:stopyearNumberStore,
                displayField:'NAME',
                valueField:'NAME',
                mode:'local',
                triggerAction: 'all',
                editable:false,
                fieldLabel:'废止年号<span style="color:blue;">*</span>',
                tabIndex:11,
                listeners:{
                    select:function(th){
                        addForm.form.findField('ENDYEAR').setValue('');
                        var valueId=stopyearNumberStore.getAt(this.selectedIndex).json.ID;
                        stopyearStore.load({
                              params:{filter:JSON.stringify({"PID":valueId})}
                        });
                    }
                }
            },
            {
                xtype:'textfield',
                name:'OLDGOVLOCAL',
                width:150,
                tabIndex:13,
                fieldLabel:'治所古名'
            },
            // {
            //             xtype:'label',
            //             disabled:true,
            //             html:'废止时间输入格式为xxxx-xx-xx,如：1840-01-01'
            // },
            // {
            //     xtype:'combo',
            //     name:'ENDREIGNTITLE',
            //     width:150,
            //     store:setyearStore,
            //     displayField:'NAME',
            //     valueField:'ID',
            //     mode:'local',
            //     triggerAction: 'all',
            //     editable:false,
            //     fieldLabel:'废止年号'
            // },
            {
                xtype:'textfield',
                name:'NEWGOVLOCAL',
                width:150,
                tabIndex:14,
                fieldLabel:'治所今名'
            }]
        }]

    },
    // {
    //             xtype:'textarea',
    //             name:'GOVLOCAL',
    //             width:416,
    //             fieldLabel:'治所古名'
    // },
    // {
    //             xtype:'textarea',
    //             name:'GOVLOCAL',
    //             width:416,
    //             fieldLabel:'治所今名'
    // },
    {
                xtype:'textarea',
                name:'MAREA',
                width:416,
                tabIndex:15,
                fieldLabel:'辖境范围'
    },
    {
        layout:'column',
        items:[{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                style:'margin-left:23px',
                html:'创建人:'
            },{
                    xtype: "label",
                    id:"CREATER",
                    disabled:true,
                    text: ""
            }]
        },{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                html:'创建时间:'
            },{
                    xtype: "label",
                    id:"CREATEDATE",
                    disabled:true,
                    text: ""
            }]
        }]
    },{
        layout:'column',
        items:[{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                style:'margin-left:23px',
                html:'修改人:'
            },{
                    xtype: "label",
                    id:"MODIFIER",
                    disabled:true,
                    text: ""
            }]
        },{
            columnWidth:0.5,
            items:[{
                xtype:'label',
                disabled:true,
                html:'修改时间:'
            },{
                    xtype: "label",
                    id:"MODIFYDATE",
                    disabled:true,
                    text: ""
            }]
        }]
    },
    {
                fieldLabel: 'ID',
                name:'ID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
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
        