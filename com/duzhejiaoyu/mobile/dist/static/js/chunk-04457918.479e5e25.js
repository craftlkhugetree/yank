(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-04457918"],{a278:function(t,n,e){t.exports=e.p+"static/img/result-bg.b62b0b13.png"},ab27:function(t,n,e){"use strict";e("b42c")},b42c:function(t,n,e){},b617:function(t,n,e){},c463:function(t,n,e){"use strict";e.r(n);var o=function(){var t=this,n=t.$createElement,o=t._self._c||n;return o("van-dialog",{staticClass:"result-dialog",attrs:{width:"100%",confirmButtonText:t.confirmText,cancelButtonText:t.cancelText,showConfirmButton:t.showButton,showCancelButton:t.showButton,confirmButtonColor:"#3A78FC"},on:{confirm:function(n){return t.$emit("doConfirm")},cancel:function(n){t.visible=!1,t.$emit("doCancel")}},model:{value:t.visible,callback:function(n){t.visible=n},expression:"visible"}},[o("div",{staticClass:"confirm"},[o("img",{attrs:{src:"success"==t.type?e("a278"):e("f801"),alt:""}}),o("div",{staticClass:"content"},[o("h3",[t._v(t._s("success"==t.type?"恭喜通过考试！":"遗憾未通过考试！"))]),o("p",[t._v(" 本次成绩为："),o("span",{staticClass:"score"},[t._v(t._s(t.score)+"分")])])])]),o("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("van-button",{on:{click:function(n){t.visible=!1,t.$emit("doCancel")}}},[t._v(t._s(t.cancelText))]),o("van-button",{attrs:{type:"primary"},on:{click:function(n){return t.$emit("doConfirm")}}},[t._v(t._s(t.confirmText))])],1)])},c=[],s=(e("a9e3"),{name:"resultDialog",props:{score:Number,cancelText:String,confirmText:String,type:{type:String,default:"success"},showButton:{type:Boolean,default:!0}},data:function(){return{visible:!1}}}),i=s,a=(e("ab27"),e("c8cb"),e("2877")),r=Object(a["a"])(i,o,c,!1,null,"b44e477e",null);n["default"]=r.exports},c8cb:function(t,n,e){"use strict";e("b617")},f801:function(t,n,e){t.exports=e.p+"static/img/result-fail-bg.9c8561ea.png"}}]);