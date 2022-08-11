/*
 * Ext JS Library 2.0 RC 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */


// Very simple plugin for adding a close context menu to tabs

Ext.ux.TabCloseMenu = function(){
    var tabs, menu, ctxItem;
    this.init = function(tp){
        tabs = tp;
        tabs.on('contextmenu', onContextMenu);
    }

    function onContextMenu(ts, item, e){
        if(!menu){ // create context menu on first right click
            menu = new Ext.menu.Menu([{
                id: tabs.id + '-close',
                text: '关闭本页',
                handler : function(){
                    tabs.remove(ctxItem);
                }
            },{
                id: tabs.id + '-close-others',
                text: '关闭其他页',
                handler : function(){
                    tabs.items.each(function(item){
                        if(item.closable && item != ctxItem){
                            tabs.remove(item);
                        }
                    });
                }
            },"-",{
                id: tabs.id + '-help',
                text: '帮助',
                handler : function(){
                	var txobj=document.getElementById(ctxItem.getId());
					if(txobj.helpurl) {
						if(txobj.helpurl!="") {
							var x=window.open(txobj.helpurl,"","width=1014,height=700,top=0,left=0,resizable=yes,scrollbars=yes");
							if(x) {
								
							}
							else {
								alert("浏览器禁用弹出窗口，不能打开帮助。");
							}
						}
					}
                }
                ,iconCls: 'help'
            }]);
        }
        ctxItem = item;
        var items = menu.items;
        items.get(tabs.id + '-close').setDisabled(!item.closable);
        var disableOthers = true;
        tabs.items.each(function(){
            if(this != item && this.closable){
                disableOthers = false;
                return false;
            }
        });
        items.get(tabs.id + '-close-others').setDisabled(disableOthers);
        var txobj=document.getElementById(ctxItem.getId());
		if(txobj) {
			if(txobj.helpurl) {
				if(txobj.helpurl=="")
					items.get(tabs.id + '-help').setDisabled(true);
				else 
					items.get(tabs.id + '-help').setDisabled(false);
			}
			else 
				items.get(tabs.id + '-help').setDisabled(true);
		}
		else {
			items.get(tabs.id + '-help').setDisabled(true);
		}
        menu.showAt(e.getPoint());
    }
};