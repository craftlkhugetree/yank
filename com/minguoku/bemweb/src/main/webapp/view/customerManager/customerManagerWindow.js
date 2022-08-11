var addWindow=new Ext.Window({            // 主页面的添加和修改
    border:true,
    width: 620,
    height: 450,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[addForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
                document.getElementById(this.addWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons:[new Ext.Button({
    text:'保存',
    
      listeners:{
        click:function(){
          if(addForm.getForm().isValid()){
            var formValues=addForm.getValues();
      
            Ext.Ajax.request({
                url:urls+'Customer/save',
                method:'post',
                params:{data:JSON.stringify(formValues)},
                success:function(conn, response, options){
                    if(errbyextjs(conn)){
                        addForm.getForm().getEl().dom.reset();
                        
                        Ext.getCmp('CenterGrid-MainPT').doLoad(0);
                        addWindow.hide();
                    }
                
                }
            });
          }
        }
      }
    })]

});

var IPWindow=new Ext.Window({            // IP管理
    border:true,
    width: 600,
    title:'IP管理',
    height: 450,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[IPGrid]

});

var ipAddWindow=new Ext.Window({            // IP增加
    border:true,
    width: 400,
    title:'增加',
    height: 180,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[ipAddForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
                document.getElementById(this.ipAddWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons:[{
        text:'保存',
        handler:function(){
             if(ipAddForm.getForm().isValid()){
                var formValues=ipAddForm.getValues();
          
                Ext.Ajax.request({
                    url:urls+'Customer/saveIP',
                    method:'post',
                    params:{data:JSON.stringify(formValues)},
                    success:function(conn, response, options){
                        if(errbyextjs(conn)){
                            ipAddForm.getForm().getEl().dom.reset();
                            gridfilter={'CTMID':custumerId};
                            Ext.getCmp('IPMainPT').doLoad(0);
                            ipAddWindow.hide();
                        }
                    
                    }
                });
              }
        }
    }]

});

var custumerOrderWindow=new Ext.Window({            // 客户订单管理
    border:true,
    width: 800,
    title:'客户订单管理',
    height: 450,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[custumerOrderGrid]

});

var custumerAddWindow=new Ext.Window({            // 客户订单增加
    border:true,
    width: 400,
    title:'增加',
    height: 260,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[custumerAddForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
                document.getElementById(this.custumerAddWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons:[{
        text:'保存',
        handler:function(){
            if(custumerAddForm.getForm().isValid()){
              var formValues=custumerAddForm.getValues();
                formValues.BEGINDATE=formValues.BEGINDATE.format('Ymd');
                formValues.ENDDATE=formValues.ENDDATE.format('Ymd');
                Ext.Ajax.request({
                    url:urls+'Customer/saveOrd',
                    method:'post',
                    params:{data:JSON.stringify(formValues)},
                    success:function(conn, response, options){
                        if(errbyextjs(conn)){
                            custumerAddForm.getForm().getEl().dom.reset();
                            gridfilter={'CTMID':custumerId};
                            Ext.getCmp('custumerOrderMainPT').doLoad(0);
                            custumerAddWindow.hide();
                        }
                    
                    }
                });
            }
        }
    }]

});

var downLoadWindow=new Ext.Window({            // 下载记录查看
    border:true,
    width: 650,
    title:'下载记录查看',
    height: 450,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout: 'fit',
    items:[downLoadGrid]

});

var IPSearchWindow=new Ext.Window({            // IP查询
    border:true,
    width: 650,
    title:'IP地址查询',
    height: 450,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout: 'fit',
    items:[IPSearchGrid]

});

downLoadWindow.on('hide',function(){
    Ext.getCmp('downLoadkeyword').setValue("");
    gridfilter={"KEYWORD":''};
});


var receiveWindow=new Ext.Window({            // 收款管理
    border:true,
    width: 650,
    title:'收款管理',
    height: 450,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout: 'fit',
    items:[receiveGrid]

});

var receiveAddWindow=new Ext.Window({            // 收款增加
    border:true,
    width: 400,
    title:'增加',
    height: 250,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
    items:[receiveAddForm],
    keys:[{
          key:13,  //13代表回车
          fn:function(){
                document.getElementById(this.receiveAddWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons:[{
        text:'保存',
        handler:function(){
                if(receiveAddForm.getForm().isValid()){
                  var formValues=receiveAddForm.getValues();

                  if(formValues.INVOICEPAY==''){
                      delete formValues.INVOICEPAY;
                  }

                  var mianrecord=custumerOrderGrid.getSelectionModel().getSelected();

                    formValues.PAYDATE=formValues.PAYDATE.format('Ymd');
                    if(formValues.PAY<=Number(mianrecord.data.YE)){
                           Ext.Ajax.request({
                                url:urls+'Customer/savePay',
                                method:'post',
                                params:{data:JSON.stringify(formValues)},
                                success:function(conn, response, options){
                                    if(errbyextjs(conn)){
                                        receiveAddForm.getForm().getEl().dom.reset();

                                        receiveMoneyfilter={"ORDERID":orderId};
                                        Ext.getCmp('receiveMainPT').doLoad(0);

                                        gridfilter={'CTMID':custumerId};
                                        Ext.getCmp('custumerOrderMainPT').doLoad(0);

                                        receiveAddWindow.hide();
                                    }
                                
                                }
                            });
                    }else{
                        Ext.Msg.alert('提示！','输入金额大于余额，请重新输入');
                    }
                            
                }
        }
    }]

});

var custumerTryAddWindow=new Ext.Window({            // 增加试用订单
    border:true,
    width: 400,
    title:'增加',
    height: 330,
    plain:true, 
    cls:"ak-form",
    modal: true,
    bodyStyle:'overflow-x:hidden;overflow-y:auto',
    closeAction :"hide", 
    layout   : 'fit',
   items:[custumerTryAddForm],
   keys:[{
          key:13,  //13代表回车
          fn:function(){
                document.getElementById(this.custumerTryAddWindow.buttons[0].id).click();
          },
          scope:this
    }],
    buttons:[{
        text:'保存',
        handler:function(){
            if(custumerTryAddForm.getForm().isValid()){
                  var formValues=custumerTryAddForm.getValues();
                    formValues.BEGINDATE=formValues.BEGINDATE.format('Ymd');
                    formValues.ENDDATE=formValues.ENDDATE.format('Ymd');
                    
                    Ext.Ajax.request({
                        url:urls+'Customer/saveOrd',
                        method:'post',
                        params:{data:JSON.stringify(formValues)},
                        success:function(conn, response, options){
                            if(errbyextjs(conn)){
                                custumerTryAddForm.getForm().getEl().dom.reset();
                                Ext.getCmp('custumerOrderMainPT').doLoad(0);
                                custumerTryAddWindow.hide();
                            }
                        
                        }
                    });
            }
        }
    }]

});
var addUserWindow = new Ext.Window({
	layout : 'fit',
	title : "会员账号信息",
	width : 350,
	height : 200,
	modal:true,
	closeAction : 'hide',
	items : [ userForm],
	buttons : [ {
		text : '提交',
		handler : function() {
		 if(userForm.getForm().isValid()){
		  var formValues=userForm.getValues();
		 	Ext.Ajax.request({
				url : '/authweb/rest/User/simpleSave',
				params : "d=" + Ext.util.JSON.encode(formValues),
				success : function(dt) {
					var dt = Ext.util.JSON.decode(dt.responseText);
					if (dt.success) {
						addUserWindow.hide();
					} 
				}
			});
		 }
			
		},
		scope: this
	}, {
		text : '关闭',
		handler : function() {
			addUserWindow.hide();
		},
		scope: this
	} ]
});


