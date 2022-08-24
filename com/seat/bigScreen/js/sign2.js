$(function () {
	//接口地址 最近签到人
	var listUrl = window.location.protocol + '//' + window.location.host + '/seat_v2/rest/order/signTop10';
	// var listUrl = 'https://seat.dev.angke.cn/seat_v2/rest/order/signTop10';




	//页面每一秒钟刷新一次setInterval 显示北京时间
	setInterval(function () {
		//设置最外层的box跟body的一样宽高
		var bodyW = $('body').width();
		var bodyH = $('body').height();
		//	获取外层的box
		var box = $('.box')[0];
		$(box).width(bodyW);
		$(box).height(bodyH);
		//获取当前时间
		var today = new Date();
		var today_h = today.getHours();
		if (today_h < 10) {
			today_h = '0' + today_h;
		}
		var today_m = today.getMinutes();
		if (today_m < 10) {
			today_m = '0' + today_m;
		}
		var today_s = today.getSeconds();
		if (today_s < 10) {
			today_s = '0' + today_s;
		}
		//  $('.time').text(today_h + ':' + today_m + ':' + today_s)
		var today_month = today.getMonth() + 1;
		if (today_month < 10) {
			today_month = '0' + today_month;
		}
		var today_day = today.getDate();
		if (today_day < 10) {
			today_day = '0' + today_day;
		}
		var today_xq = today.getDay();
		//设置星期几的数组
		var xqArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
		$('.right_top>h3').text(today_h + ':' + today_m + ':' + today_s);
		$('.right_top>h1').text(today_month + '月' + today_day + '日' + xqArr[today_xq]);
	}, 500);

	//生成二维码
	function createQrcode() {
		$('#qrcode_only').html('');
		//时间戳+参数
		var timestamp = (new Date().getTime());
		var data = { timestamp: timestamp, signType: 'seatV2' };
		console.log('data', JSON.stringify(data))
		data = $.base64.encode(JSON.stringify(data));
		let url = `${window.location.protocol}//${window.location.host}/seat_v2/mobile/#/sign?signData=${data}`;
		// let url = `${window.location.protocol}//${window.location.host}/mseat/#/sign?signData=${data}`;
		console.log('url66', url)
		$("#qrcode_only").qrcode({
			width: 400,
			height: 400,
			text: url
		});
	};

	

	//3分钟 180000创建一次二维码
	setInterval(function () {
		createQrcode();
	}, 180000);

	//初始执行一次
	createQrcode();
	
})