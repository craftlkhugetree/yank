var GLOBAL={
//	    URL:location.origin+location.pathname.substring(0, location.pathname.substr(1).indexOf('/') + 1)+'/rest/',
	    URL:'/bemweb/rest/',		
};


function GetQueryString(name){
	
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

var demoListView;
var fileId=[];
var fileIdArr=[];
    
var arrlength;
var arrArr;
var indexArr;

var userId;
var partyId;

var userName;
var partyName;

