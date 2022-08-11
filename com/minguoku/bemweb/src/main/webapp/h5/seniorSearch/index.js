
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
			  console.log(res);
			  $('#ZTTYPE').hsCheckData({
		        isShowCheckBox: false, //默认为false
		        data: res
		    });

		});
			   
  });
   
   //按钮点击事件
   $('.search .classfiysearchbutton').on('click',classifysearch); 
    $('.showContent .seniorSearchbutton').on('click',seniorsearch); 
  
  
	//点击高级搜索按钮
	function seniorsearch(){
//		var keyword={TITLE:$('#booknameid').val(),SERIES:$('#otherbooknameid').val(),PUBLISHERNAME:$('#publishnameid').val(),
//		            ADDRESS:$('#publishplaceid').val(),PUBDATE:$('#publishyearid').val(),KEYWORD:$('#themenameid').val(),
//		            ZTTYPE:$('#resourceid').val(),EDUTYPE:$('#educationid').val()};
       if($.trim($('#TITLE').val())||$.trim($('#SERIES').val())||$.trim($('#PUBLISHERNAME').val())||
          $.trim($('#ADDRESS').val())||$.trim($('#PUBDATE').val())||$.trim($('#KEYWORD').val())||
          $.trim($('#ZTTYPE').val())||$.trim($('#AUTHOR').val())){
       	
		     window.open("../search/index.html?TITLE="+$.trim($('#TITLE').val())+"&SERIES="+$.trim($('#SERIES').val())+"&PUBLISHERNAME="+$.trim($('#PUBLISHERNAME').val())+"&ADDRESS="+$.trim($('#ADDRESS').val())+"&PUBDATE="+$.trim($('#PUBDATE').val())+"&KEYWORD="+$.trim($('#KEYWORD').val())+"&ZTTYPE="+$.trim($('#ZTTYPE').attr('data-id'))+"&AUTHOR="+$.trim($('#AUTHOR').val()));
       
       }else{
       	
       }		
	}
	
	//隐藏高级搜索的提示框
	function outsearch(){ 
            $('#inputtotal').animate({top:'0'}, 500, function(){ 
                $(this).css({display:'none', top:'-100px'}); 
            }); 
    } 
