/**
*解决ExtJS TreePanel 在IE9、IE10下报错：无法获取未定义或 null 引用的属性ui
*/
Ext.Element.prototype.getAttributeNS=(Ext.isIE && !(/msie 9/.test(navigator.userAgent.toLowerCase()) && document.documentMode === 9)
    && !(/msie 10/.test(navigator.userAgent.toLowerCase()) && document.documentMode === 10)) ? function(ns, name){
        var d = this.dom;
        var type = typeof d[ns+":"+name];
        if(type != 'undefined' && type != 'unknown'){
            return d[ns+":"+name];
        }
        return d[name];
    } : function(ns, name){
        var d = this.dom;
        return d.getAttributeNS(ns, name) || d.getAttribute(ns+":"+name) || d.getAttribute(name) || d[name];
    };
