var dao = {
	getWorkInfo:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'Img/getWorkInfo', param);	
	},
	work:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'Img/work', param);	
	},
	preWork:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'Img/preWork', param);	
	},
	piciList:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'Img/piciList', param);	
	},
	getYuanshiList:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'App/getYuanshiList', param);		
	},
	updatePICI:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'Img/updatePICI', param);
	},
	upPici:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'App/jg', param);
	},
	getDir: function(param) {
		return dkr.util.ajaxPost(GLOBAL.URL + 'App/getDir', param);
	},
	getFull:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'App/getFull', param);
	},
	createIndexPage:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'Img/createIndexPage', param);
	},
	upload:function(param){
			var result = {};
			$.ajax({
			        url: GLOBAL.URL+'FileManage/upload' ,
			        type: 'POST',
			        data: param,
			        async: false,
			        cache: false,
			        contentType: false,
			        processData: false,
			        success: function(res){
			        	console.log(res);
						result = res;			        	
			        },
			        error: function (res) {
			            alert("Connection error");
			        }
    		});
    		return result;
	}
}
