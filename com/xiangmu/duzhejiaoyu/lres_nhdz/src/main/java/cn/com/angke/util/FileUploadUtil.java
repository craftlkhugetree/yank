package cn.com.angke.util;

/**   
* Copyright: Copyright (c) 2019 
* 
* @ClassName: FileUploadUtil.java
* @Description: 文件上传工具类
*
* @version: v1.0.0
* @author: xyp
* @date: 2019年3月14日 上午9:56:51 
*/
public class FileUploadUtil {
	/**
     * 获取输出文件
     * @param inputFilePath
     * @return
     */
    public static String getOutputFilePath(String inputFilePath,String targetName) {  
        String outputFilePath = inputFilePath.replaceAll("." + getPostfix(inputFilePath), targetName);
        return outputFilePath;
    }
 
    /**
     * 获取inputFilePath的后缀名<br>
     *
     * @param inputFilePath
     * @return
     */
    public static String getPostfix(String inputFilePath) {
        return inputFilePath.substring(inputFilePath.lastIndexOf(".") + 1);
    }
}
