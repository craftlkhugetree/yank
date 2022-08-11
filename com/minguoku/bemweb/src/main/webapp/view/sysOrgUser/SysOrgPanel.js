var comboxWithTrees = new Ext.form.ComboBox({  
    store:new Ext.data.SimpleStore({fields:[],data:[[]]}),  
    editable:false,
    fieldLabel: '所属部门',
    layout   : 'fit',
    name:"ORGNAME",
    editable:false, 
    mode: 'local',
     allowBlank:false,

    triggerAction:'all',  
    width:150, 
    tpl: "<tpl for='.'><div style='height:200px'><div id='treeforadd'></div></div></tpl>",  
    selectedClass:'',  
    onSelect:Ext.emptyFn  
});  
var trees = new Ext.tree.TreePanel({  
    loader: eastConBoxTreeStore,
    id:'tree-org-combos',  
    border:false,
    autoScroll: true,
    layout   : 'fit',
    animate: false,
    enableDD: true,
    containerScroll: true,
    rootVisible: false,  
    root:new Ext.tree.AsyncTreeNode({
        text: '无',
        draggable:false,
        id:'sources'
    })
  });  
trees.on('click',function(node){
    // console.log(node);
    Ext.getCmp('ORGID-hidden-user').setValue(node.attributes.ID);
    comboxWithTrees.setValue(node.text);  
    comboxWithTrees.collapse();  
});  
comboxWithTrees.on('expand',function(){  
    trees.render('treeforadd');  
});
//编辑的
var comboxWithTreesedit = new Ext.form.ComboBox({  
    store:new Ext.data.SimpleStore({fields:[],data:[[]]}),  
    editable:false,
    fieldLabel: '所属部门',
     allowBlank:false,
    layout   : 'fit',
    name:"ORGNAME",
    editable:false, 
    mode: 'local',

    triggerAction:'all',  
    width:150,
    tpl: "<tpl for='.'><div style='height:200px'><div id='treeforedit'></div></div></tpl>",  
    selectedClass:'',  
    onSelect:Ext.emptyFn  
});  
var treesedit = new Ext.tree.TreePanel({  
    loader: eastConBoxTreeStore,
    id:'tree-org-combos-edit',  
    border:false,
    autoScroll: true,
    animate: false,
    enableDD: true,
    containerScroll: true,
    layout   : 'fit',
    rootVisible: false,  
    root:new Ext.tree.AsyncTreeNode({
        text: '无',
        draggable:false,
        id:'sources-edit'
    })
  });  
treesedit.on('click',function(node){
    // console.log(node);
    Ext.getCmp('ORGID-hidden-user-edit').setValue(node.attributes.ID);
    comboxWithTreesedit.setValue(node.text);  
    comboxWithTreesedit.collapse();  
});  
comboxWithTreesedit.on('expand',function(){  
    treesedit.render('treeforedit');  
});    
var addForm=new Ext.FormPanel({
    
    border:false,
    width: 400,
    defaults: {labelWidth :85,labelAlign:'right'},
    autoHeight : true,
     items:[{
        layout:'column',
        items:[{
            columnWidth:0.5,
            layout:'form',
            items:[{
                fieldLabel: '编号',
                name: 'CODE',
                width:150,
                allowBlank:false,
                vtype:'standard',
                blankText:'请填写编号',
                msgTarget:'qtip',
                xtype:'textfield'
            },{
                fieldLabel: '登录名',
                name: 'LOGINNAME',
                width:150,
                allowBlank:false,
                vtype:'standard',
                blankText:'请填写用户名',
                msgTarget:'qtip',
                xtype:'textfield'
            },comboxWithTrees,{
                fieldLabel: '姓名',
                width:150,
                name: 'NAME',
                xtype:'textfield'
            },{
                fieldLabel: 'EMAIL',
                name: 'EMAIL',
                vtype:'email',
                width:150,
                xtype:'textfield'
            },
            {
                fieldLabel: '身份证号码',
                name: 'IDENTITYNUM',
                width:150,
                xtype:'textfield'
            },
            {
                fieldLabel: '工作时间(年)',
                name: 'WORKTIME',
                width:150,
                xtype:'textfield'
            },
            {
                fieldLabel: 'QQ',
                name: 'QQ',
                width:150,
                xtype:'textfield'
            },
            {
                fieldLabel: '微博',
                name: 'TWITTER',
                width:150,
                xtype:'textfield'
            },
            {
                fieldLabel: '微信',
                name: 'WECHAT',
                width:150,
                xtype:'textfield'
            },
            {
                fieldLabel: '职称',
                name: 'TITLE',
                width:150,
                xtype:'textfield'
            },

             new Ext.form.ComboBox({
                fieldLabel: '状态',
                editable:false,
                hiddenName:"STATUS",
                store:stateStore,
                displayField:'NAME',
                valueField:'VALUE',
                width:150,
                triggerAction: 'all',
                mode :'local'
            })
            ]
        },{
            columnWidth:0.5,
            layout:'form',
            items:[
            // {
            //     fieldLabel: '密码',
            //     name: 'PWD',
            //     width:150,
            //     inputType: 'password',
            //     xtype:'textfield'
            // },
            new Ext.form.ComboBox({
                fieldLabel: '角色',

                editable:false,
                hiddenName:"ROLEID",
                id:'select-role-combo',
                store:SelectRole,
                displayField:"NAME",
                valueField:"ID",
                
                width:150,
                triggerAction: 'all',
                mode :'local',
                listeners:{
                    beforerender:function(th){
                        th.getStore().load({params:{'auth':json_data},
                        callback:function(){
                            th.setValue(th.getValue());
                        }});
                    }
                }


            }),new Ext.form.NumberField({
                fieldLabel: '手机号',
                width:150,
                vtype:'phone',
                name: 'PHONE'
            }),
             new Ext.form.ComboBox({
                fieldLabel: '性别',
                editable:false,
                hiddenName:"SEX",
                store:sexStore,
                displayField:'NAME',
                valueField:'CODE',
                width:150,
                triggerAction: 'all',
                mode :'local'


            }),

            {
                fieldLabel: '进校时间',
                name: 'INTOSCHOOLTIME',
                width:150,
                readOnly:true,
                format:'Y-m-d',
                xtype:'datefield'
            },{
                fieldLabel: '籍贯',
                name: 'NATIVEPALCE',
                width:150,
                xtype:'textfield'
            },
            {
                fieldLabel: '地址',
                name: 'ADDRESS',
                width:150,
                xtype:'textfield'
            },
            {
                fieldLabel: '联系电话',
                name: 'TEL',
                width:150,
                xtype:'textfield'
            },
            {
                fieldLabel: '职务',
                name: 'POSTID',
                disabled:true,
                width:150,
                xtype:'textfield'
            },
            {
                fieldLabel: '兼任职务',
                name: 'ADDPOSTID',
                width:150,
                disabled:true,
                xtype:'textfield'
            },
            new Ext.form.ComboBox({
                fieldLabel: '学历',
                editable:false,
                hiddenName:"EB",
                store:educationStore,
                displayField:"NAME",
                valueField:"CODE",
                width:150,
                triggerAction: 'all',
                mode :'local'
            }),
            new Ext.form.ComboBox({
                fieldLabel: '学位',
                editable:false,
                hiddenName:"DERGEE",
                store:degreeStore,
                displayField:"NAME",
                valueField:"CODE",
                width:150,
                triggerAction: 'all',
                mode :'local'
            }),

            {
                name: 'ID',
                height:0,
                hideLabel:true,
                xtype:'textfield',
                hidden:true
            },{
                name: 'ORGID',
                id:'ORGID-hidden-user',
                height:0,
                hideLabel:true,
                xtype:'textfield',
                hidden:true
            },{
                fieldLabel: 'LOGO',
                name:'PHOTO',
                id:'LOGO-ID-hide',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
            }]
        }]
    }, { //行7 
                layout : 'column', // 从左往右的布局
                //hidden:true,
                items : [{
                            columnWidth:.5,
                            
                            layout:'form',
                            items:[{
                                xtype:'textfield',
                                fieldLabel:'个人照片',
                                width:150,
                                disabled:true,
                                name:'PHOTONAME',
                                disabled:true,
                                id:'RECORD-LOGONAME' 
                            }]
                        },{
                            columnWidth:.1,
                            layout : 'form',
                            width:150,
                            items:[{
                                xtype:'akupload',
                                buttonstext:'<span style="background:blue">上传</span>',
                                uploadurl:urls+'fileManage/upload',
                                uploadtype:'*.jpg;*.jpeg;*.png;*.docx;',
                                whensuccessed:function(file, serverData){
                                    Ext.Msg.hide();
                                    var obj = eval('(' + serverData + ')');
                                    
                                    var name=obj.FILE[0].TITLE;
                                    var id=obj.FILE[0].ID;
                                    Ext.getCmp('RECORD-LOGONAME').setValue(name);
                                    Ext.getCmp('LOGO-ID-hide').setValue(id);
                                    Ext.getCmp('look-up-field').downloadurl=id;//传的是ID
                                    Ext.getCmp('look-up-field').show();



                                }
                            }]
                        },{
                            columnWidth:.4,
                            layout:'form',
                            items:[{
                                xtype:'button',
                                id:'look-up-field',
                                hidden:true,
                                text:'查看文件',
                                listeners:{
                                    click:function(th){
                                        console.log(urls+'fileManage/get?ID='+th.downloadurl);
                                        window.open(urls+'fileManage/get?ID='+th.downloadurl);
                                    }
                                }
                            }]
    }]},{ //行7 
                layout : 'column', // 从左往右的布局
                items : [{
                            columnWidth:10,
                            layout:'form',
                            items:[{
                                fieldLabel: '备注',
                                name: 'REMARK',
                                width:440,
                                xtype:'textarea' 
                            }]
                }]
    }
    ]
});
var addEditForm=new Ext.FormPanel({
    
    border:false,
    width: 400,
    defaults: {labelWidth :55,labelAlign:'right'},
    
     items:[{
        layout:'column',
        items:[{
            columnWidth:0.5,
            layout:'form',
            items:[{
                fieldLabel: '登录名',
                name: 'LOGINNAME',
                allowBlank:false,
                width:150,
                vtype:'standard',
                blankText:'请填写用户名',
                msgTarget:'qtip',
                xtype:'textfield'
            },comboxWithTreesedit,{
                fieldLabel: '姓名',
                name: 'NAME',
                width:150,
                xtype:'textfield'
            },{
                fieldLabel: 'EMAIL',
                name: 'EMAIL',
                vtype:'email',
                width:150,
                xtype:'textfield'
            }]
        },{
            columnWidth:0.5,
            layout:'form',
            items:[new Ext.form.ComboBox({
                fieldLabel: '角色',

                editable:false,
                hiddenName:"ROLEID",
                id:'select-role-combo-edit',
                store:SelectRole,
                displayField:"NAME",
                valueField:"ID",
                
                width:150,
                triggerAction: 'all',
                mode :'local',
                listeners:{
                    beforerender:function(th){
                        th.getStore().load({params:{'auth':json_data},
                        callback:function(){
                            th.setValue(th.getValue());
                        }});
                    }
                }


            }),new Ext.form.NumberField({
                fieldLabel: '手机号',
                vtype:'phone',
                width:150,
                name: 'PHONE'
            }),{
                xtype:'combo',
                fieldLabel:'性别',
                editable:false,
                width:150,
                hiddenName:'SEX',  //后台返回的JSON格式，直接赋值；
                store:new Ext.data.SimpleStore({
                    fields:['NAME','VALUE'],
                    data:[
                        ['男','0'],
                        ['女','1']
                       ]
                }),
                displayField:'NAME',
                valueField:'VALUE',
                mode:'local',
                readOnly:false
            },{
                xtype:'combo',
                fieldLabel:'状态',
                editable:false,
                hiddenName:'STATUS',  //后台返回的JSON格式，直接赋值；
                store:new Ext.data.SimpleStore({
                    fields:['NAME','VALUE'],
                    data:[
                        ['正常','1'],
                        ['不正常','0']
                       ]
                }),
                width:150,
                displayField:'NAME',
                valueField:'VALUE',
                mode:'local',
                readOnly:false
            },{
                name: 'ID',
                height:0,
                hideLabel:true,
                xtype:'textfield',
                hidden:true
            },{
                name: 'ORGID',
                id:'ORGID-hidden-user-edit',
                height:0,
                hideLabel:true,
                xtype:'textfield',
                hidden:true
            }]
        }]
    }]
});

