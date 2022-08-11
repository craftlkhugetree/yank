Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'side'; //统一指定错误信息提示方式，在输入栏右侧显示一个突出的出错图标
    if (Ext.isChrome === true) {
        var chromeDatePickerCSS = ".x-date-picker {border-color: #1b376c;background-color:#fff;position: relative;width: 185px;}";
        Ext.util.CSS.createStyleSheet(chromeDatePickerCSS, 'chromeDatePickerStyle');
    } //这个解决了时间控件在google浏览器上不可用的问题
    
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    eastTreeStore.on('beforeload', function(loader, node) {  
       
        // if(json_data3==undefined)
        //    return false;
        // this.baseParams.auth = json_data3; // 通过这个传递参数，这样就可以点一个节点出来它的子节点来实现异步加载  
         this.baseParams.data=JSON.stringify({"filter":{"SEARCH":false},"start":0,"limit":15,"page":1});
    }, eastTreeStore);


    new Ext.Viewport({
        layout: "border",
        items: [{
            layout:'fit',
            region:'west',
             width:300,
            items:facility
        },{
            layout:'form',
            region:'center',
            bodyStyle: "overflow-x:hidden;overflow-y:auto",
            items:[orgPositionGrid,appointPersonGrid]
            // items:[{
            //     xtype:'tabpanel',
            //     activeTab:'orgname',
            //     items:[new Ext.Panel({
            //         title:'机构',
            //         id:'orgname',
            //         layout:'fit',
            //         items:[orgGrid]
            //     }),new Ext.Panel({
            //         title:'职位',
            //         layout:'form',
            //         bodyStyle:'overflow-x:hidden;overflow-y:auto;',
            //         items:[orgPositionGrid,appointPersonGrid]
            //     })]
            // }]
        }
        
        ]

    });

    setStore.load({
        params:{
            data:JSON.stringify({"start":0,"page":1})
        }
    });

    appointPropertyStore.load({
        params:{
            data:JSON.stringify({"start":0,"page":1})
        }
    });

    nameStore.load({
        params:{
            data:JSON.stringify({"start":0,"page":1})
        }
    });

    positionStore.load({              // 原职位
        params:{
            data:JSON.stringify({"start":0,"page":1})
        }
    });


});
