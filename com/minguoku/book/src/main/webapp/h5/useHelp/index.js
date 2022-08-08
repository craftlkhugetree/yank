var label=GLOBAL.GETQUERYSTRING('LABEL');


$('.labelname').text(label=='7'?'首页':(label=='8'?'检索':(label=='9'?'分类检索':(label=='10'?'详情页':(label=='11'?'高级检索':'')))));


$('.labelname').on('click',function(){
//	localStorage.getItem("keywords")     ?KEYWORDS=
	window.open($(this).text()=="首页"?'../index':($(this).text()=="检索"?'../search':($(this).text()=="分类检索"?'../classifyBrowse':($(this).text()=="详情页"?'../detail':($(this).text()=="高级检索"?'../seniorSearch':''))))+'/index.html'
	+($(this).text()=="检索"?'?KEYWORDS='+localStorage.getItem("keywords"):''));
	
});


// 导航点击事件
$('.usenav').on('click',function() {
    $('.usenav').removeClass('act');
    $(this).addClass('act');

    var index = $(this).index();
    $('.mainitem').addClass('hide');
    $('.mainitem').eq(index).removeClass('hide');

    $('.mainright').animate({
        scrollTop: 0
    }, 500)
})

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