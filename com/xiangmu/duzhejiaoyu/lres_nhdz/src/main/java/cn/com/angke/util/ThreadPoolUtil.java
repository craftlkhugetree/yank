package cn.com.angke.util;

import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**   
* Copyright: Copyright (c) 2019 
* 
* @ClassName: ThreadPoolUtil.java
* @Description: 线程池工具类
*
* @version: v1.0.0
* @author: xyp
* @date: 2019年3月14日 上午9:57:54 
*/
public class ThreadPoolUtil {
	private static ThreadPoolExecutor threadPool;
	
	private ThreadPoolUtil() {
		
	}
	 
    /**
     * 无返回值直接执行
     * @param runnable
    */
    public  static void execute(Runnable runnable){
        getThreadPool().execute(runnable);
    }
 
    /**
     * 返回值直接执行
     * @param callable
     */
    public  static <T> Future<T> submit(Callable<T> callable){
      return   getThreadPool().submit(callable);
    }
 
 
    /**
     * dcs获取线程池
     * @return 线程池对象
     */
    public static ThreadPoolExecutor getThreadPool() {
        if (threadPool != null) {
            return threadPool;
        } else {
            synchronized (ThreadPoolUtil.class) {
                if (threadPool == null) {
                    threadPool = new ThreadPoolExecutor(8, 16, 60, TimeUnit.SECONDS,
                            new LinkedBlockingQueue<>(32), new ThreadPoolExecutor.CallerRunsPolicy());
                }
                return threadPool;
            }
        }
    }

}
