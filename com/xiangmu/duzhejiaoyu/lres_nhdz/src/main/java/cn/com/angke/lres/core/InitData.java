package cn.com.angke.lres.core;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import cn.com.angke.lres.pojo.LresUser;

public class InitData {
	public static BlockingQueue<LresUser> OPACQUEUE = new LinkedBlockingQueue<LresUser>();
}
