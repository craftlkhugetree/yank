$(function(){
	var dao = {
        //纪年列表
        Yearlist: function(param) {
            return dkr.util.ajaxPost(GLOBAL.URL+'Year/list', param)
        }
    };
	var vm = {
		sort:'GYJN',
		dir:'asc',
		keyword:''
	};
	vm.addEventListener = function(){
		//排序的点击事件
		$('.up').click(function(){
			var ups = $('.up');
			var downs = $('.down');
			for (var i = 0;i<ups.length;i++) {
				$(ups[i]).removeClass('upact');
				$(downs[i]).removeClass('downact');
				$(this).addClass('upact')
			}
			vm.sort = $(this).data('sort');
			vm.dir="asc";
			vm.handle.YearList()
		})
		$('.down').click(function(){
			var ups = $('.up');
			var downs = $('.down');
			for (var i = 0;i<downs.length;i++) {
				$(ups[i]).removeClass('upact');
				$(downs[i]).removeClass('downact');
				$(this).addClass('downact')
			}
			vm.sort = $(this).data('sort');
			vm.dir="desc";
			vm.handle.YearList()
		})
		$('#wordinput').change(function(e){
			vm.keyword = $(this).val()
		})
		$('#wordinput').keyup(function(e){
			if(e.keyCode==13){
				vm.handle.YearList()
			}
		})
		//搜素
		$('#search').click(function(){
			vm.handle.YearList()
		})
	}
	//各种方法的函数
	vm.handle = {
		YearList(){
			dao.Yearlist({
		    	data:JSON.stringify({
		    		filter:{keyword:vm.keyword}
		    	}),
		    	sort:vm.sort,
				dir:vm.dir
		    }).done(function(res){
		    	var innerText = doT.template($("#tableline_tpl").text());
				$(".tablecontent").html(innerText(res.items));
		    })
		}
	}
	vm.init = function(){
		vm.addEventListener()
		vm.handle.YearList()
	}
	
	vm.init()
	
	
})