package cn.com.angke.util.cache;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.apache.commons.lang3.StringUtils;

import com.somenew.cache.DataCacheOpt;
import com.somenew.spring.SpringContextUtil;

import cn.com.angke.book.service.BookService;

public class ConsumerBooksCache {
	
	// key是顾客id, value是锁
    private static Map<String, Lock> lockMap = new HashMap<>();
    
    // 获取顾客锁
    private static Lock getLock (String customerId) {
    	Lock lock = lockMap.get(customerId);
    	if (lock == null) {
    		synchronized (lockMap) {
    			lock = lockMap.get(customerId);
    			if (lock == null) {
    				lock = new ReentrantLock();
    				lockMap.put(customerId, lock);
    			}
    		}
    	}
    	return lock;
    }
    
    // 获取客户key
    private static String getKey (String customerId) {
    	return customerId + "_books";
    }
    
    // 获取客户的书籍
    public static String getConsumerBooks (String customerId) {
    	String key = getKey(customerId);
    	String res = DataCacheOpt.get(key);
    	if (StringUtils.isBlank(res)) {
    		// 开始更新数据
    		Lock lock = getLock(customerId);
    		lock.lock();
    		try {
    			// 再获取下资源
    			res = DataCacheOpt.get(key);
    			if (StringUtils.isBlank(res)) {
    				res = forceUpdate(customerId);
    			}
    		} catch (Exception e) {
    			e.printStackTrace();
    		} finally {
				lock.unlock();
			}
    	}
    	return res;
    }
	
    // 强制更新数据
    public static String forceUpdate (String customerId) {
    	String key = getKey(customerId);
    	System.out.println(customerId + "正在更新数据。。。。");
    	// 更新数据,缓存12小时
		BookService bean = (BookService)SpringContextUtil.getBean("bookServiceImpl");
		String customerBooks = bean.getCustomerBooks(customerId);
		DataCacheOpt.setex(key, 4 * 3600, customerBooks);
		return customerBooks;
    }
    
    // 强制清除缓存
    public static String clearCache (String customerId) {
    	String key = getKey(customerId);
    	DataCacheOpt.del(key);
    	return "ok";
    }
    
}
