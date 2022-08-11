var dao = {
	upPici:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'App/jg', param);
	},
	getDir: function(param) {
		return dkr.util.ajaxPost(GLOBAL.URL + 'App/getDir', param);
	},
	getFull:function(param){
		return dkr.util.ajaxPost(GLOBAL.URL + 'App/getFull', param);
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
