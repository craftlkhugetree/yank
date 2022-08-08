
  $(function(){
  	
  	
  	var dao={
  		////中图法分类下拉框接口
  		chineseGraph:function(param){
  			return dkr.util.ajaxPost(GLOBAL.URL+'Book/ztTree', param)
  		}
  	}
//	dao.bookInfo=function(param){
//  	  return dkr.util.ajaxPost(GLOBAL.URL+'ResourcePackage/ztTree', param)
//  }
  	
  	$('.seniorSearchbutton').on('click',function(){
		
		if($.trim($('#TITLE').val())||$.trim($('#SERIES').val())||$.trim($('#PUBLISHERNAME').val())||
          $.trim($('#ADDRESS').val())||$.trim($('#PUBDATE').val())||$.trim($('#KEYWORD').val())||
          $.trim($('#ZTTYPE').val())||$.trim($('#AUTHOR').val())){
			
		}else{
			if(!$('#inputtotal').is(':visible')){ 
                $('#inputtotal').css({display:'block', top:'-100px',position:'fixed'}).animate({top: '+100'}, 500, function(){ 
                    setTimeout(outsearch, 1000); 
                }); 
            }
		}
		
            
    }); 
    
    dao.chineseGraph({
				  	data:JSON.stringify({"RESOURCEPACKAGEID":''})
		}).done(function(res){
			  
			  for(var i=0;i<res.length;i++){
			  
			    $('#ZTTYPE').append('<option value="'+res[i].CODE+'">'+res[i].NAME+'</option>');
			      
			  }
//			  $('#ZTTYPE').hsCheckData({
//		        isShowCheckBox: false, //默认为false
//		        data: res
//		    });

		});
		
		//屏蔽键盘事件
    document.onkeydown = function (){
         var e = window.event || arguments[0];
         //F12
         if(e.keyCode == 123){
             return false;
         //Ctrl+Shift+I
         }
    };
    
    //屏蔽鼠标右键
    document.oncontextmenu = function (){
       return true;
    }
		
			   
  });
   
   //按钮点击事件
   $('.search .classfiysearchbutton').on('click',classifysearch); 
    $('.showContent .seniorSearchbutton').on('click',seniorsearch); 
    
    $('.navlabel').on('click',function(){
    	    location.href="../index/index.html";
    });
  
  
	//点击高级搜索按钮
	function seniorsearch(){
//		var keyword={TITLE:$('#booknameid').val(),SERIES:$('#otherbooknameid').val(),PUBLISHERNAME:$('#publishnameid').val(),
//		            ADDRESS:$('#publishplaceid').val(),PUBDATE:$('#publishyearid').val(),KEYWORD:$('#themenameid').val(),
//		            ZTTYPE:$('#resourceid').val(),EDUTYPE:$('#educationid').val()};
       if($.trim($('#TITLE').val())||$.trim($('#SERIES').val())||$.trim($('#PUBLISHERNAME').val())||
          $.trim($('#ADDRESS').val())||$.trim($('#PUBDATE').val())||$.trim($('#KEYWORD').val())||
          $.trim($('#ZTTYPE').val())||$.trim($('#AUTHOR').val())){
       	
		     location.href="../search/index.html?TITLE="+$.trim($('#TITLE').val())+"&SERIES="+$.trim($('#SERIES').val())+"&PUBLISHERNAME="+$.trim($('#PUBLISHERNAME').val())+"&ADDRESS="+$.trim($('#ADDRESS').val())+"&PUBDATE="+$.trim($('#PUBDATE').val())+"&KEYWORD="+$.trim($('#KEYWORD').val())+"&ZTTYPE="+$.trim($('#ZTTYPE').val())+"&AUTHOR="+$.trim($('#AUTHOR').val());
       
       }else{
       	
       }		
	}
	
	//隐藏高级搜索的提示框
	function outsearch(){ 
            $('#inputtotal').animate({top:'0'}, 500, function(){ 
                $(this).css({display:'none', top:'-100px'}); 
            }); 
    } 

	$('.toSearch').on('click', function () {
		location.href="../search/index.html?KEYWORDS="+encodeURI($.trim($('#inputkeyword').val()));
	})
