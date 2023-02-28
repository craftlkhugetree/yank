package cn.com.angke.util;

import java.util.ResourceBundle;

public class PropertiesUtil {
	private static ResourceBundle bundle = ResourceBundle.getBundle("cfg/boot");
	
	public final static String AUTHPREFIX = bundle.getString("auth.prefix");

}
