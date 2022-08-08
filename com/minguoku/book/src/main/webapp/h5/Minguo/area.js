$(function(){
	var dao = {
        //地区列表
        Locationlist: function(param) {
            return dkr.util.ajaxPost(GLOBAL.URL+'ProvinceLocation/list', param)
        }
    };
	var vm = {
		sort:'GYJN',
		dir:'asc',
		PID:'',
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
			vm.dir="asc";
			vm.handle.Locationdetail()
		})
		$('.down').click(function(){
			var ups = $('.up');
			var downs = $('.down');
			for (var i = 0;i<downs.length;i++) {
				$(ups[i]).removeClass('upact');
				$(downs[i]).removeClass('downact');
				$(this).addClass('downact')
			}
			vm.dir="desc";
			vm.handle.Locationdetail()
		})
		//左边省份的点击事件
		$(document).on('click','.mainleft>p',function(){
			var ps = $('.mainleft>p');
			for (var i = 0; i < ps.length; i++) {
				$(ps[i]).removeClass('act');
			}
			$(this).addClass('act')
			vm.PID = $(this).data('id');
			$('#wordinput').val('');
			vm.keyword = '';
			vm.handle.Locationdetail();
		})
		//
		$('#wordinput').change(function(e){
			vm.keyword = $(this).val()
		})
		$('#wordinput').keyup(function(e){
			if(e.keyCode==13){
				vm.handle.Locationdetail(true)
			}
		})
		//搜素
		$('#search').click(function(){
			vm.handle.Locationdetail(true);
		})
	}
	//各种方法的函数
	vm.handle = {
		//获取省份
		Locationlist(){
			dao.Locationlist({
		    	data:JSON.stringify({
		    		filter:{PID:'null', keyword:''}
		    	}),
		    }).done(function(res){
		    	var innerText = doT.template($("#mainleft_tpl").text());
				$(".mainleft").html(innerText(res.items));
				var ps = $('.mainleft>p');
				$(ps[0]).addClass('act')
				vm.PID = $(ps[0]).data('id');
				vm.handle.Locationdetail();
		    })
		},
		//获取省份下面的详情
		Locationdetail(flag){
		    var data = {};
		    if(flag){
		    	var ps = $('.mainleft>p');
				for (var i = 0; i < ps.length; i++) {
					$(ps[i]).removeClass('act');
				}
		    	data = {keyword:vm.keyword};
		    }else{
		    	data = {PID:vm.PID, keyword:vm.keyword};
		    }
			dao.Locationlist({
		    	data:JSON.stringify({
		    		filter:data
		    	}),
		    	sort:'ID',
				dir:vm.dir
		    }).done(function(res){
		    	var innerText = doT.template($("#tablemain_tpl").text());
				$(".tablemain").html(innerText(res.items));
		    })
		}
	}
	vm.init = function(){
		vm.addEventListener()
		vm.handle.Locationlist()
	}
	
	vm.init()
	
	
})