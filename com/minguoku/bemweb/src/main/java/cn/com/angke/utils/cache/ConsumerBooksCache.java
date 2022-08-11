package cn.com.angke.utils.cache;

import com.somenew.cache.DataCacheOpt;
import com.somenew.config.service.ConfigOpt;

import cn.com.angke.utils.HttpClientUtil;
import cn.com.angke.utils.HttpsUtil;

public class ConsumerBooksCache {
    
    // 获取客户的书籍
    public static String getConsumerBooks (String customerId) {
    	String res = toSend("book/rest/Data/getConsumerBooks?customerId=" + customerId);
    	System.out.println("bemweb--getConsumerBooks:" + res);
    	return res;
    }
	
    // 强制更新数据
    public static void forceUpdate (String customerId) {
    	String res = toSend("book/rest/Data/forceUpdate?customerId=" + customerId);
    	System.out.println("bemweb--forceUpdate:" + res);
    }
    
    // 清除顾客缓存
    public static void clearCustomerCache (String customerId) {
    	String res = toSend("book/rest/Data/clearCache?customerId=" + customerId);
    	System.out.println("bemweb--clearCache:" + res);
    }
    
    private static String toSend (String url) {
    	String http = ConfigOpt.getConfigValue("HTTPPATH");
		if (http.startsWith("https")) {
			return HttpsUtil.send(http + url, "GET", null);
		} else {
			return HttpClientUtil.doGet(http + url);
		}
    } 
    
}
