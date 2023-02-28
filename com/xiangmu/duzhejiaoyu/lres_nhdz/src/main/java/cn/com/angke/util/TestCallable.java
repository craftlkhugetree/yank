package cn.com.angke.util;

import java.util.concurrent.Callable;

public class TestCallable implements Callable<String> {
	 
    private String message;

    public TestCallable(String message) {
        this.message = message;
    }

    @Override
    public String call() throws Exception {
        Thread.sleep(300);
        System.out.println(String.format("打印消息%s", message));
        return "OK";
    }
}
