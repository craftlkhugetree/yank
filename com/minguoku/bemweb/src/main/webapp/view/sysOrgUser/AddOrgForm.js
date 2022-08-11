var comboxWithTree = new Ext.form.ComboBox({  
    store:new Ext.data.SimpleStore({fields:[],data:[[]]}),  
    editable:false,
    fieldLabel: '所属部门',
    // labelStyle:'font-size:10px',
    name:"orgname",
    allowBlank:false,
    editable:false, 
    // labelWidth: 75,
    mode: 'local',
    anchor:'93%',  
    triggerAction:'all',  
    
    tpl: "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",  
    selectedClass:'',  
    onSelect:Ext.emptyFn  
});  
var tree = new Ext.tree.TreePanel({  
    loader: eastConBoxTreeStore,
    id:'tree-org-combo',  
    border:false,
    autoScroll: true,
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
tree.on('click',function(node){
	// console.log(node.attributes.ID);
    var selectnode=AddOrgForm.selectid;
    var flag=true;
    if(selectnode!='addorg'){
        selectnode.cascade(function(Cselectnode){
        if(selectnode.attributes.ID==node.attributes.ID){
            flag=false;
        }else{
            // console.log(Cselectnode.attributes.ID);
            if(Cselectnode.attributes.ID==node.attributes.ID){
                flag=false;
            }

        }
                // if()
        // if(node.attributes.ID==selectnode.attributes.ID||)
        });
        if(flag){
            Ext.getCmp('ORGID-hidden').setValue(node.attributes.ID);
            comboxWithTree.setValue(node.text);  
            comboxWithTree.collapse();  
        }else{
            alert('不支持互为子菜单，请重新选择！');
        }
    }else{
        Ext.getCmp('ORGID-hidden').setValue(node.attributes.ID);
        comboxWithTree.setValue(node.text);  
        comboxWithTree.collapse();  
    }
    

});  
comboxWithTree.on('expand',function(){  
    tree.render('tree');  
});  
// comboxWithTree.render('comboxWithTree');  
var AddOrgForm=new Ext.FormPanel({
    selectid:'',
    border:false,
    width:500,
    // layout:'fit',
    defaults: {labelWidth: 60,labelAlign:'right'},
    items:[{
    	fieldLabel: '部门名称',
        name: 'NAME',
        anchor:'93%',
        allowBlank:false,
        vtype:'standard',
        blankText:'请填写部门名称',
        msgTarget:'qtip',
        xtype:'textfield',
        allowBlank:false //是否为空
    },comboxWithTree,
    new Ext.form.TextArea({
        fieldLabel: '说明',
        height:50,
        anchor:'93%',
        vtype:'standard',
        name:"DES"
	}),{
    	name: 'ID',
        height:0,
        hideLabel:true,
        xtype:'textfield',
        hidden:true
	},{
    	name: 'PID',
    	id:'ORGID-hidden',
        height:0,
        hideLabel:true,
        xtype:'textfield',
        hidden:true
	}]
});