var ztfcomboxWithTree = new Ext.form.ComboBox({  
    store:new Ext.data.SimpleStore({fields:[],data:[[]]}),  
    editable:false,
    name:"ZTNAME",
    allowBlank:true,
    editable:false, 
	fieldLabel:'中图法分类',
    mode: 'local',
    anchor:'95.5%',  
    triggerAction:'all',  
    
    tpl: "<tpl for='.'><div style='height:200px'><div id='ztftree'></div></div></tpl>",  
    selectedClass:'',  
    onSelect:Ext.emptyFn  
});  
var ztftree = new Ext.tree.TreePanel({  
    loader:ztfCombo,
    id:'ztftree-org-combo',  
    border:false,
    autoScroll: true,
    animate: false,
    enableDD: true,
    containerScroll: true,
	onlyLeafCheckable : false,
    rootVisible: false,  
    root:new Ext.tree.AsyncTreeNode({
        text: '无',
        draggable:false,
        id:'sources'
    })
  });  
ztftree.on('click',function(node){
    // if(node.parentNode.id!='sources'){
        ztfcomboxWithTree.setValue(node.text); 
		 Ext.getCmp('ZTTYPEID').setValue(node.id);
		ztfcomboxWithTree.collapse();		
    // }
});  
ztfcomboxWithTree.on('expand',function(){  
    ztftree.render('ztftree');  
}); 

var xkfcomboxWithTree = new Ext.form.ComboBox({  
    store:new Ext.data.SimpleStore({fields:[],data:[[]]}),  
    editable:false,
    name:"EDUNAME",
    allowBlank:true,
    editable:false, 
	fieldLabel:'对应学科',
	
    mode: 'local',
    anchor:'91%',  
    triggerAction:'all',  
    
    tpl: "<tpl for='.'><div style='height:200px'><div id='xkftree'></div></div></tpl>",  
    selectedClass:'',  
    onSelect:Ext.emptyFn  
});  
var xkftree = new Ext.tree.TreePanel({  
    loader:xkfCombo,
    id:'xkftree-org-combo',  
    border:false,
    autoScroll: true,
    animate: false,
    enableDD: true,
    containerScroll: true,
	onlyLeafCheckable : false,
    rootVisible: false,  
    root:new Ext.tree.AsyncTreeNode({
        text: '无',
        draggable:false,
        id:'sources'
    })
  });  
xkftree.on('click',function(node){
    // if(node.parentNode.id!='sources'){
        xkfcomboxWithTree.setValue(node.text);
		 Ext.getCmp('EDUTYPEID').setValue(node.id);
		xkfcomboxWithTree.collapse();		
    // }
});  
xkfcomboxWithTree.on('expand',function(){  
    xkftree.render('xkftree');  
});
var addForm=new Ext.ux.ExFormPanel({
    
    border:false,
    labelWidth:110,
    labelAlign:'right',
    // width: 500,
    // height:800,
    // autoHeight : true,
    //defaults: {labelWidth:65,labelAlign:'right'},
    items:[{
                xtype:'textfield',
                name:'BOOKDIR',
                width:450,
                fieldLabel:'内容对应扫描目录',
                enableKeyEvents:true,
				disabled:true,
                listeners:{  
                    blur:function(nf, newv, oldv) {
                        
                        setTimeout(function(){
                            Ext.Ajax.request({
                                url:urls+'Book/getBookInfo',
                                method:'post',
                                params:{data:JSON.stringify({"dir":addForm.form.findField('BOOKDIR').getValue(),"BATID":batchFilter.BATID})},
                                success:function(conn, response, options){
                                    // console.log(conn.responseText);
                                    var result=eval('('+conn.responseText+')');
                                    addForm.setValues(result);
                                
                                }
                            });

                        },500);
                    }               
                      // keyup:function(){        
                      //     console.log(txtBeginFld.getValue());
                      // }               
                }
      },{
        layout:'column',
        items:[{
            columnWidth:0.5,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	width:168,
            	name:'TITLE',
                allowBlank:false,
                blankText:'请填写题名',
                msgTarget:'qtip',
                disabled:true,
            	fieldLabel:'题名'
            },{
            	xtype:'textfield',
            	name:'ADDRESS',
            	width:168,
                // disabled:true,
            	fieldLabel:'出版地'
            },{
                xtype:'textfield',
                name:'DATE',
                width:168,
                // disabled:true,
                fieldLabel:'出版年'
            },{
                xtype:'numberfield',
                name:'WIDTH',
                width:168,
                disabled:true,
                fieldLabel:'宽度'
            },{
                xtype:'textfield',
                name:'TAGS',
                width:168,
                // disabled:true,
                fieldLabel:'主题词'
            },{
                xtype:'textfield',
                name:'SERIES',
                width:168,
                // disabled:true,
                fieldLabel:'丛书名'
            }]
        },{
            columnWidth:0.5,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	name:'AUTHOR',
            	width:154,
                // disabled:true,
            	fieldLabel:'作者'
            },{
                xtype:'textfield',
                name:'PUBLISHINGNAME',
                width:154,
                // disabled:true,
                fieldLabel:'出版社'
            },{
                xtype:'textfield',
                name:'PAGECOUNT',
                width:154,
                disabled:true,
                fieldLabel:'页数'
            },{
                xtype:'textfield',
                name:'HEIGHT',
                width:154,
                disabled:true,
                fieldLabel:'高度'
            }
			// {
                // xtype:'textfield',
                // name:'ZTTYPEID',
                // width:154,
                // disabled:true,
                // fieldLabel:'中图法分类'
            // }
			,xkfcomboxWithTree
			// {
                // xtype:'textfield',
                // readOnly:true,
                // name:'EDUTYPEID',
                // width:154,
                // disabled:true,
                // fieldLabel:'对应学科'
            // }
			]
        }]

    },ztfcomboxWithTree,
    {
                xtype:'textarea',
                name:'CONTENTNOTE',
                width:450,
                // disabled:true,
                fieldLabel:'附注说明'
    },
    {
                fieldLabel: 'BATID',
                name:'BATID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    },
    {
                fieldLabel: 'ID',
                name:'ID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    },
    {
                fieldLabel: 'ZTTYPEID',
                name:'ZTTYPEID',
				id:'ZTTYPEID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    },
    {
                fieldLabel: 'EDUTYPEID',
				id:'EDUTYPEID',
                name:'EDUTYPEID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    }]

});

var lookForm=new Ext.ux.ExFormPanel({                 //查看页面
    
    border:false,
    labelWidth:110,
    labelAlign:'right',
    // width: 500,
    // height:800,
    // autoHeight : true,
    //defaults: {labelWidth:65,labelAlign:'right'},
    items:[{
        layout:'column',
        items:[{
            columnWidth:0.5,
            layout:'form',
            items:[{
                xtype:'textfield',
                width:168,
                name:'TITLE',
                allowBlank:false,
                blankText:'请填写提名',
                msgTarget:'qtip',
                disabled:true,
                fieldLabel:'题名'
            },{
                xtype:'textfield',
                name:'ADDRESS',
                width:168,
                disabled:true,
                fieldLabel:'出版地'
            },{
                xtype:'textfield',
                name:'DATE',
                width:168,
                disabled:true,
                fieldLabel:'出版年'
            },{
                xtype:'numberfield',
                name:'WIDTH',
                width:168,
                disabled:true,
                fieldLabel:'宽度'
            },{
                xtype:'textfield',
                name:'TAGS',
                width:168,
                disabled:true,
                fieldLabel:'主题词'
            },{
                xtype:'textfield',
                name:'SERIES',
                width:168,
                disabled:true,
                fieldLabel:'丛书名'
            }]
        },{
            columnWidth:0.5,
            layout:'form',
            items:[{
                xtype:'textfield',
                name:'AUTHOR',
                width:154,
                disabled:true,
                fieldLabel:'作者'
            },{
                xtype:'textfield',
                name:'PUBLISHINGNAME',
                width:154,
                disabled:true,
                fieldLabel:'出版社'
            },{
                xtype:'textfield',
                name:'PAGECOUNT',
                width:154,
                disabled:true,
                fieldLabel:'页数'
            },{
                xtype:'textfield',
                name:'HEIGHT',
                width:154,
                disabled:true,
                fieldLabel:'高度'
            },{
                xtype:'textfield',
                name:'ZTTYPEID',
                width:154,
                disabled:true,
                fieldLabel:'中图法分类'
            },{
                xtype:'textfield',
                readOnly:true,
                name:'EDUTYPEID',
                width:154,
                disabled:true,
                fieldLabel:'对应学科'
            }]
        }]

    },
    {
                xtype:'textarea',
                name:'CONTENTNOTE',
                width:450,
                disabled:true,
                fieldLabel:'附注说明'
    },
    {
                xtype:'textfield',
                name:'BOOKDIR',
                width:450,
                disabled:true,
                fieldLabel:'内容对应扫描目录'
    },
    {
                fieldLabel: 'BATID',
                name:'BATID',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
    }]

});



// var collectionAddForm=new Ext.ux.ExFormPanel({
//         border:false,
//         labelWidth:65,
//         labelAlign:'right',
//         items:[{
//             xtype:'textfield',
//             fieldLabel:'ID',
//             name:'ID',
//             hidden:true,
//             hideLabel:true
//         },{
//             xtype:'combo',
//             name:'LIBRARYNAME',
//             width:256,
//             fieldLabel:'图书馆名称'
//         },{
//             xtype:'textfield',
//             fieldLabel:'OPAC',
//             width:256,
//             name:'OPAC'
//         },{
//             xtype:'textfield',
//             fieldLabel:'对应图书',
//             width:256,
//             name:''
//         },{
//             xtype:'textfield',
//             fieldLabel:'作者',
//             width:256,
//             name:''
//         },{
//             xtype:'textfield',
//             fieldLabel:'出版社',
//             width:256,
//             name:'PUBLISHINGID'
//         },{
//             xtype:'textfield',
//             fieldLabel:'页数',
//             width:256,
//             name:'PAGECOUNT'
//         }]
// });
       

var batchAddForm=new Ext.ux.ExFormPanel({
        border:false,
        labelWidth:65,
        labelAlign:'right',
        items:[{
            xtype:'textfield',
            fieldLabel:'ID',
            name:'ID',
            hidden:true,
            hideLabel:true
        },{
            xtype:'textfield',
            name:'BATID',
            width:256,
            fieldLabel:'批次号'
        },{
            xtype:'textfield',
            name:'MAKER',
            width:256,
            fieldLabel:'制作公司'
        }
        // ,{
        //     xtype:'textfield',
        //     name:'BEGINID',
        //     width:256,
        //     fieldLabel:'起始流水号'
        // },{
        //     xtype:'textfield',
        //     name:'ENDID',
        //     width:256,
        //     fieldLabel:'终止流水号'
        // }
        ]
}); 


var batchLookForm=new Ext.ux.ExFormPanel({       //批次号查看
        border:false,
        labelWidth:65,
        labelAlign:'right',
        items:[{
            xtype:'textfield',
            name:'BATID',
            width:256,
            disabled:true,
            fieldLabel:'批次号'
        },{
            xtype:'textfield',
            name:'MAKER',
            width:256,
            disabled:true,
            fieldLabel:'制作公司'
        }
        ]
}); 