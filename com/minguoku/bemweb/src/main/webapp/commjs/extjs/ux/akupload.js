/*
文件上传   还没做好
 */
Ext.ux.akupload = Ext.extend(Ext.BoxComponent, {
	typeload:"*.bmp;*.jpg;*.jpeg;*.png;*.gif;*.doc;*.docx;*.docm;*.xls;*.pdf;",//上传文件的类型 要这么传"*.jpg;*.gif;*.png;"
	
	howbig:"10MB",//文件的大小
	uploadurl:'',
 
  divid:'',
  onRender : function(ct, position,callbacks) {
   	var me=this;

    me.divid = 'divupload-' + this.id;
    var panelup= new Ext.form.Label({
      html:'<div style="height:20px;width: 56px;border-radius: 4px;border: 1px solid black;">'+'<span id="'+me.divid+'">'+'</span>'+'</div>'
    })
    this.ownerCt.add(panelup);

    me.callbacks(me);
    
     // Ext.getCmp(this.whoisyouwindow).on('beforeshow',function(a,b){
  },
  callbacks:function(me){
 
    me.ownerCt.doLayout();
    me.swf=new SWFUpload({
        upload_url: me.uploadurl,
        use_query_string:true,
        // File Upload Settings
        file_size_limit : me.howbig,// 文件大小控制
        file_types :me.uploadtype?me.uploadtype:me.typeload,
        file_types_description : "All Files",
        file_upload_limit : "0",
        // file_queue_error_handler : me.fileQueueError.bind(me),
        file_dialog_complete_handler : function(){
		      
          me.swf.startUpload();
          
        },//选择好文件后提交
        upload_success_handler :me.whensuccessed,
        upload_error_handler :  me.uploadError,
        upload_start_handler:function(){
          Ext.Msg.alert('提示！','正在上传中...');
        },
        button_placeholder_id :me.divid,
        button_width:100,
        // button_height: 30,
		button_height: 80,
		//button_style: '{background-color:#d8d8d8 }',
		button_image_url :me.buttonsimg,  //图片按钮
		button_placeholder:me.divid,
		prevent_swf_caching : true,
		debug : false,
		preserve_relative_urls:false,
		button_cursor : SWFUpload.CURSOR.ARROW,
        button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
        button_text :me.buttonstext,
        // button_text_style : '.button { font-family: Helvetica, Arial, sans-serif; font-size: 12pt;disply:none; color: #0081c2;} .buttonSmall { font-size: 10pt; display:none;color: #0081c2;}',
        button_text_bottom_padding:5,
        // button_text_left_padding: 18,
        button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
        button_cursor: SWFUpload.CURSOR.HAND,
		flash_url:'http://160.255.0.220:8080/bemweb/swfupload.swf',
        // Flash Settings
//        flash_url :"http://160.255.0.208:80/jalis/swfupload.swf",//这个自己改吧
        //flash_url :"http://paydev.angke.com.cn/jalis/swfupload.swf",//这个自己改吧
		//flash_url :"http://160.255.0.230:5050/mgsjk/03code/bemweb/src/main/webapp/commjs/extjs/ux/swfupload.swf",//这个自己改吧
        //flash_url :"http://160.255.0.220:8080/bemweb/src/main/webapp/commjs/extjs/ux/swfupload.swf",
        custom_settings : {
          upload_target : "ProgressContainer-ext-4869"+me.divid
        },
        // Debug Settings
        debug: false  //是否显示调试窗口
      });
     me.ownerCt.doLayout();
   // })


  },
  uploadError:function(file, errorCode, message){
    Ext.Msg.alert("提示！","上传失败网路出错！");
  }
	    
});
Ext.reg('akupload', Ext.ux.akupload);