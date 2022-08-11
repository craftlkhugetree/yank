var ztfcomboxWithTree = new Ext.form.ComboBox({  
    store:new Ext.data.SimpleStore({fields:[],data:[[]]}),  
    editable:false,
    name:"ZTNAME",
    allowBlank:true,
    editable:false, 
	fieldLabel:'中图法分类',
    mode: 'local',
    anchor:'98%',  
    triggerAction:'all',  
    
    tpl: "<tpl for='.'><div style='height:240px'><div id='ztftree'></div></div></tpl>",  
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
	ztfcomboxWithTree.setValue(node.text); 
	Ext.getCmp('ZTTYPEID').setValue(node.id);
	Ext.getCmp('ztcc-name').setValue(node.attributes.ZTTHEME);
	
	
	ztfcomboxWithTree.collapse();		
});  
ztfcomboxWithTree.on('expand',function(){  
    ztftree.render('ztftree');  
}); 

var xkfcomboxWithTree = new Ext.form.ComboBox({  
    store:new Ext.data.SimpleStore({fields:[],data:[[]]}),  
    editable:false,
    name:"XKMCZT",
    allowBlank:true,
    editable:false, 
	fieldLabel:'对应学科',
	
    mode: 'local',
    anchor:'98%',  
    triggerAction:'all',  
    
    tpl: "<tpl for='.'><div style='height:240px'><div id='xkftree'></div></div></tpl>",  
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
	xkfcomboxWithTree.setValue(node.text);
	Ext.getCmp('EDUTYPEID').setValue(node.id);
	xkfcomboxWithTree.collapse();		
});  
xkfcomboxWithTree.on('expand',function(){  
    xkftree.render('xkftree');  
});
var addForm=new Ext.ux.ExFormPanel({
    
    border:false,
    labelWidth:110,
    labelAlign:'right',
    items:[{
        layout:'column',
        items:[{
            columnWidth:0.5,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	width:240,
            	name:'CODE',
            	id:'book-code',
                allowBlank:false,
                blankText:'扫面编号',
            	fieldLabel:'扫面编号'
            },{
            	xtype:'textfield',
            	name:'BLTITLE',
            	width:240,
            	fieldLabel:'并列正题名'
            }]
        },{
            columnWidth:0.5,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	name:'TITLE',
            	width:240,
            	fieldLabel:'正题名'
            },{
                xtype:'textfield',
                name:'OTITLE',
                width:240,
                fieldLabel:'其他题名说明'
            }
			
			]
        }]

    },{
        layout:'column',
        items:[{
            columnWidth:0.85,
            layout:'form',
            items:[
				xkfcomboxWithTree,
				ztfcomboxWithTree
			]
        },{
            columnWidth:0.15,
            layout:'form',
            items:[{
            	 xtype:'button',
                text:'清空',
				style :'margin-top:8px;',
				listeners :{
					click :function(){
						xkfcomboxWithTree.setValue(''); 
						Ext.getCmp('EDUTYPEID').setValue('');
					}
				}
            },{
            	 xtype:'button',
                text:'清空',
				style :'margin-top:14px;',
				listeners :{
					click :function(){
						ztfcomboxWithTree.setValue(''); 
						Ext.getCmp('ZTTYPEID').setValue('');
					}
				}
            }]
        }]

    },
	
	{
        layout:'column',
        items:[{
            columnWidth:0.5,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	name:'ZTCC',
				id:'ztcc-name',
            	width:240,
            	fieldLabel:'主题词串'
            },{
            	xtype:'textfield',
            	name:'ZAUTHOR',
            	width:240,
            	fieldLabel:'主要责任者'
            },{
            	xtype:'textfield',
            	name:'BB',
            	width:240,
            	fieldLabel:'版本项'
            },{
            	xtype:'textfield',
            	name:'PUBLISHINGID',
            	width:240,
            	fieldLabel:'出版发行者'
            },{
            	xtype:'textfield',
            	name:'JHX',
            	width:240,
            	fieldLabel:'稽核项'
            },{
            	xtype:'textfield',
            	name:'SERIES',
            	width:240,
            	fieldLabel:'丛编题名'
            },{
            	xtype:'textfield',
            	name:'ZAUTHOR1',
            	width:240,
            	fieldLabel:'主要责任者(个人)'
            },{
            	xtype:'textfield',
            	name:'ZAUTHOR2',
            	width:240,
            	fieldLabel:'主要责任者(团体)'
            }]
        },{
            columnWidth:0.5,
            layout:'form',
            items:[{
                xtype:'textfield',
                name:'FTITLE',
                width:240,
                fieldLabel:'分辑题名'
            },{
                xtype:'textfield',
                name:'CAUTHOR',
                width:240,
                fieldLabel:'次要责任者'
            },{
            	xtype:'textfield',
            	name:'PAGECOUNT',
            	width:240,
            	fieldLabel:'页数'
            },{
            	xtype:'textfield',
            	name:'PAID',
            	width:240,
            	fieldLabel:'出版发行地'
            },{
            	xtype:'textfield',
            	name:'DATE',
            	width:240,
            	fieldLabel:'出版发行时间'
            },{
            	xtype:'textfield',
            	name:'COVERTITLE',
            	width:240,
            	fieldLabel:'封面题名'
            },{
            	xtype:'textfield',
            	name:'CAUTHOR1',
            	width:240,
            	fieldLabel:'次要责任者(个人)'
            },{
            	xtype:'textfield',
            	name:'CAUTHOR2',
            	width:240,
            	fieldLabel:'次要责任者(团体)'
            }
			
			]
        }]

    },
    {
                xtype:'textarea',
                name:'CONTENTNOTE',
                anchor:'95.5%', 
				height:40,
                fieldLabel:'一般性附注'
    },
	 {
                xtype:'textarea',
                name:'SUMMARY',
                anchor:'95.5%', 
				height:40,
                fieldLabel:'文摘提要'
    },

    {
                fieldLabel: 'BOOKID',
                name:'BOOKID',
                id:'book-bookid',
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

var uploadForm=new Ext.ux.ExFormPanel({
    
    border:false,
    labelWidth:65,
    labelAlign:'right',
    width:156,
    items:[
      {
          xtype:'akupload',
          // buttonsimg:'302884.jpg',
          buttonstext:'<span style="border:1px solid black;">上传文件</span>',
          uploadurl:urls+"FileManage/upload",
          uploadtype:'*.jpg;*.jpeg;*.png;*.gif;*.xls;*.xlsx',
          width:156,
          whensuccessed:function(file, serverData){
              Ext.Msg.hide();
              uploadWindow.hide();
              var obj = eval('(' + serverData + ')');
              
              Ext.Ajax.request({
	                url:urls+'Book/ImportExcel',
	                method:'post',
	                params:{data:JSON.stringify({FILEID:obj.FILE[0].ID})},
	                success:function(conn, response, options){
	                    if(errbyextjs(conn)){
	                        
	                        Ext.getCmp('CenterGrid-MainPT').doLoad(0);
	                        
	                    }
						var message = JSON.stringify(JSON.parse(conn.responseText).message,null, 2);
							//Ext.MessageBox.alert("提示信息",message);
							
						Ext.Msg.show({
							title:'提示信息',
							msg:'<pre style="max-height:450px;overflow: auto;">' + message+'</pre>',
							width:600,
							buttons:Ext.Msg.OK,
							fn:function(){
								this.hide();
							}
							
						});
	                }
	          });
              
          }
      }
    ]

});     