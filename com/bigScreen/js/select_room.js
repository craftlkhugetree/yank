$(function(){
	var listUrl = window.location.protocol+'//'+window.location.host+'/seat/rest/RoomArea/r/screenList';
//	var listUrl = '160.255.0.63:8080/seat/rest/RoomArea/screenList';
	var selectRooms = {
		selectRoom:function(){
			$.ajax({
				type:"post",
				url:listUrl,
				success:function(data){
					//console.log(data.items);
					var innerText = doT.template($("#room_tpl").text());
					$(".box").html(innerText(data.items));
				}
			})
		}
	}
	selectRooms.selectRoom();
	
})