/**
 * 加载jscss
 * @param js{
 * 		commjs:["extjs/core/ext-core.js","extjs/core/ext-all-debug.js"
 * 				]
 * 		appjs:[
 * 			
 * 		]
 * }
 */
/**
 * 公共js和css路径
 */
var commjsurl="http://127.0.0.1:6080/commjs/";
function include_js(js){
	var f;
	var head=document.body;
	for (var i=0;i<js.commjs.length;i++){
		f=js.commjs[i];
		if (f.indexOf(".js")>0){
			var script=document.createElement('script');
			script.src=commjsurl+f;
			script.type= 'text/javascript';
			head.appendChild(script);
		}else if (f.indexOf(".css")>0){
			var script=document.createElement('link');
			script.rel="stylesheet";
			script.type="text/css";
			script.href=commjsurl+f;
			head.appendChild(script);
		}
		
	}
	for (var i=0;i<js.appjs.length;i++){
		f=js.appjs[i];
		if (f.indexOf(".js")>0){
			var script=document.createElement('script');
			script.src=f;
			script.type= 'text/javascript';
			head.appendChild(script);
		}else if (f.indexOf(".css")>0){
			var script=document.createElement('link');
			script.rel="stylesheet";
			script.type="text/css";
			script.href=f;
			head.appendChild(script);
		}
	}
}
include_js(js);