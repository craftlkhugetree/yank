var selectpanel = new Ext.Panel({
                        region: 'center',
                        id:'addPictureNAME',
                        split: true,
                        layout:'fit',
//                        html:'<iframe src="../../tpl/index1.html" style="border:1px solid blue;width:100%;height:100%;"></iframe>',
                        collapsible : false,
                        margins     : '3 0 3 3',
                        cmargins    : '3 3 3 3',
						listeners   : {
							selected:function(){
							html:'<iframe src="../../tpl/index1.html" style="border:1px solid blue;width:100%;height:100%;"></iframe>'
            }
        }
                    })

                //width:600,
                //height:276,
                region: 'center',
               // id:'addPictureNAME',
                split: true,
                layout:'fit',
                collapsible : false,
                margins     : '3 0 3 3',
                cmargins    : '3 3 3 3',
                tbar        :[{
						xtype:'combo',
						fieldLabel:'模版预览选择',
						editable:false,
						store:FcStore,
						hiddenName:"url",
						displayField:"NAME",
						valueField:"NAME",
						width:140,
						triggerAction: 'all',
						mode :'local'
					 }],
				items:[selectpanel]
                
                
});

