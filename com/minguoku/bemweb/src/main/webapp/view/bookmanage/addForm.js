var addTwoDimeForm=new Ext.ux.ExFormPanel({                      // 编辑大事记页面
      border:false,
      labelWidth:80,
      labelAlign:'right',
      // defaults: {labelWidth:80,labelAlign:'right'},
      items:[
        {
          name: 'ID',
          xtype:'textfield',
          hideLabel:true,
          hidden:true
        },{
            columnWidth:.9,
            layout:'form',
            items:[
                {
                    fieldLabel: '大事记名称',
                    xtype:'textfield',
                    allowBlank:false,
                    width:367,
                    name: 'NAME'
                }
            ]
          },{
            columnWidth:.9,
            layout:'form',
            items:[
                {
                    fieldLabel: '关键字',
                    xtype:'textfield',
                    width:367,
                    name: 'KEYWORD'
                }
            ]
          },{
            columnWidth:.9,
            layout:'form',
            items:[
                {
                    fieldLabel: '具体描述',
                    xtype:'textarea',
                    width:367,
                    height:150,
                    name:'DES'
                }
            ]
          },
          // {
          //   columnWidth:.9,
          //   layout:'form',
          //   items:[
          //       {
          //           fieldLabel: '来源',
          //           xtype:'combo',
          //           editable:false,
          //           name:'SOCURCEID'
          //       }
          //   ]
          // },
          {
              layout:'column',
              items:[{
                  columnWidth:.6,
                  layout:'form',
                  items:[{
                      xtype:'textfield',
                      fieldLabel:'事记资料上传',
                      width:130,
                      disabled:true,
                      name:'ATTACHID_NAME',
                      id:'RECORD-LOGONAME' 
                  }]
              },{
                  columnWidth:.1,
                  layout : 'form',
                  items:[{
                      xtype:'akupload',
                      buttonstext:'<span>上传</span>',
                      uploadurl:urls+'fileManage/upload?FSOURCE=1',
                      uploadtype:'*.jpg;*.jpeg;*.png;*.txt;*.xml;*.pdf;*.doc;*.docx;*.xlsx;*.xls;',
                      whensuccessed:function(file, serverData){
                          Ext.Msg.hide();
                          var obj = eval('(' + serverData + ')');
                          console.log(obj);
                          var name=obj.FILE[0].TITLE;
                          var id=obj.FILE[0].ID;
                          Ext.getCmp('RECORD-LOGONAME').setValue(name);
                          Ext.getCmp('LOGO-ID-hide').setValue(id);
                          Ext.getCmp('look-up-field').downloadurl=id;//传的是ID
                          Ext.getCmp('look-up-field').show();

                      }
                  }]
              },{
                  columnWidth:.3,
                  layout:'form',
                  items:[{
                      xtype:'button',
                      id:'look-up-field',
                      hidden:true,
                      text:'查看文件',
                      listeners:{
                          click:function(th){
                              window.open(urls+'fileManage/get?ID='+th.downloadurl);
                          }
                      }
                  }]
              }]
          },{
               fieldLabel: '事记资料上传ID',
               name:'ATTACHID',
               id:'LOGO-ID-hide',
               hideLabel:true,
               xtype:'textfield',
               hidden:true
          }
      ]
});
