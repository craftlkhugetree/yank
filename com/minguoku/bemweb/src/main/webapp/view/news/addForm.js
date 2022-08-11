var addForm=new Ext.FormPanel({
    
    border:false,

    defaults: {labelWidth:80,labelAlign:'right'},
    items:[{
        layout:'column',
        items:[{
            columnWidth:1,
            layout:'form',
            items:[{
            	xtype:'textfield',
            	 anchor:'97%',
            	name:'name',
            	fieldLabel:'标题'
            }]
        }]

    },{
        layout:'column',
        items:[{
            columnWidth:1.1,
            layout:'form',
            items:[
            new Ext.form.TextArea( {
            fieldLabel:'内容',
            name:'content',
                anchor:'93%',
                height:360,
            id:'content',
            emptyText:'无',
        
            listeners:{
              "render": function (f) {
                   K = KindEditor;
                   htmlEditor = K.create('#content', {                       
                        uploadJson: './kindeditor/upload_json.jsp',
                        fileManagerJson : './kindeditor/file_manager_json.jsp',
                        height: 360,
                        width: '90%',
                        resizeType : 1,
                        allowPreviewEmoticons : false,
                        allowImageUpload : true
                    });
                }
            }
        }),{
                fieldLabel: 'ID',
                name:'id',
                hideLabel:true,
                xtype:'textfield',
                hidden:true
            }]
        }]
    },{
    	layout:'column',
        items:[{
            columnWidth:0.5,
            layout:'form',
            items:[{
            	id:'isTop',
				xtype: 'radiogroup',
				fieldLabel: '是否置顶',
				items: [{
					boxLabel: '是',
					name: 'isTop',
					width:10,
					inputValue: 1
				}, {
					boxLabel: '否',
					name: 'isTop',
					width:10,
					inputValue: 0
				}]	
			},{
				xtype: 'radiogroup',
				id:'isDialog',
				fieldLabel: '是否首页弹框',
				items: [{
					boxLabel: '是',
					name: 'isDialog',
					width:10,
					inputValue: 1
				}, {
					boxLabel: '否',
					name: 'isDialog',
					width:10,
					inputValue: 0
				}]
			}]
        },{
            columnWidth:0.5,
            layout:'form',
            items:[{
				xtype: 'radiogroup',
				id:'isRelease',
				fieldLabel: '是否发布',
				items: [{
					boxLabel: '是',
					width:10,
					name: 'isRelease',
					inputValue: 1
				}, {
					boxLabel: '否',
					width:10,
					name: 'isRelease',
					inputValue: 0
				}]
			},{
                xtype: 'datetimefield',
                name: 'dialogEndTime',
                format: 'Y-m-d H:i:s',
                id:'dialogEndTime',
                width: 200,
                fieldLabel: '弹框截止日期',
               
            }]
        }]
    }]

});