/*
*该插件为EXT提供了echart的柱状图和折线图功能
*echarts.js这个文件必需先被引用
*阉割版 想使用强大功能待续
*2017-1-16 by戴宸宇
*/
Ext.ux.echartBarorLine = Ext.extend(Ext.BoxComponent, {
	initComponent : function(){
		
		require.config({
            paths: {
                echarts:this.paths
            }
        });
        require(
        	[
	        	"echarts",
	        	"echarts/chart/line",
	        	"echarts/chart/bar"
            ]
            
        );
        
        Ext.ux.echartBarorLine.superclass.initComponent.call(this);
    },
	onRender : function(ct, position) {
		// console.log(this)
		var me=this;
		var echartid = 'echartBardiv-' + this.id;
		if (this.wiframeid) {
			echartid = this.wiframeid;
		}
		this.el = ct.createChild({
			// tag : 'div',
			id : echartid,
			style:this.echartStyle,
			name : echartid
		});
		
		
		var myChart =  require('echarts').init(document.getElementById(echartid));
		Ext.Ajax.request({
            url:this.chartUrl,
            method:'post',
            
            success: function(response, options){
            	var json = eval('(' + response.responseText + ')').items[0];
            	
            	var xAxis=json.xaxis;
			    var legend = json.name;
			    var dds=[];
			    var i=0;
			    // var bardata = [];
			    for(var k in json){
			    	if(k!='name'&&k!='xaxis'){
			    		dds.push({
			    			name:json.name[i],
			    			type:me.chartType,
			    			data:json[k],
			    			markPoint : me.echartmarkPoint,
				            markLine : me.echartmarkLine
			    		});
			    		i++;
			    	}
			    	
			    }
			    var option = {
				    title : {
				        text: me.chartTitle
				       
				    },
				    tooltip : {
				        trigger: me.trigger?me.trigger:'item',//触发类型 item axis
				        // formatter:'{a}{b}{c}'这里数据已经封装好了
				    },
				    legend: {
				        data:legend
				    },

				    xAxis : [
				        {
				            type : 'category',
				            data : xAxis
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value'
				        }
				    ],
				    series :dds
				};
		        myChart.setOption(option);
              
            }, 
            failure:function(response, options){
               Ext.Msg.alert('网络出错了！')
            }
        });
        

	}

	
});
Ext.reg('akechartBarorLIne', Ext.ux.echartBarorLine);