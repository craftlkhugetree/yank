package cn.com.angke.util;

import java.io.File;
import java.util.regex.Pattern;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.artofsolving.jodconverter.OfficeDocumentConverter;
import org.artofsolving.jodconverter.office.DefaultOfficeManagerConfiguration;
import org.artofsolving.jodconverter.office.OfficeManager;
import org.springframework.util.StringUtils;

import com.somenew.config.service.ConfigOpt;

/**   
* Copyright: Copyright (c) 2019 
* 
* @ClassName: Office2PDF.java
* @Description: word,excel,ppt转换为PDF工具类
*
* @version: v1.0.0
* @author: xyp
* @date: 2019年3月14日 上午9:57:38 
*/
public class Office2PDF {
	 
    private static final Logger LOG = LogManager.getLogger(Office2PDF.class);
 
    /**
     * @param inputFilePath
     *            源文件路径，如："e:/test.docx"
     * @return
     */
    public static File openOfficeToPDF(String inputFilePath,String outPath) {  //1
        return office2pdf(inputFilePath,outPath);
    }
 
    /**
     * 根据操作系统的名称，获取OpenOffice.org 4的安装目录<br>
     * @return OpenOffice.org 4的安装目录    */
      //这里需要你自己改，你自己的openoffice.org4 的安装目录
    public static String getOfficeHome() {
        String osName = System.getProperty("os.name");
        if (Pattern.matches("Linux.*", osName)) {
        	String openPath = ConfigOpt.getConfigValue("OFFICE_PATH", "/opt/openoffice.org4");
            return openPath;
        } else if (Pattern.matches("Windows.*", osName)) {
            return "D:/Program Files (x86)/OpenOffice 4";
        } else if (Pattern.matches("Mac.*", osName)) {
            return "/Applications/OpenOffice.org.app/Contents/";
        }
        return null;
    }
 
    /**
     * 连接OpenOffice.org 并且启动OpenOffice.org
     *
     * @return
     */
    public static OfficeManager getOfficeManager() {
        DefaultOfficeManagerConfiguration config = new DefaultOfficeManagerConfiguration();
        // 设置OpenOffice.org 4的安装目录
        config.setOfficeHome(getOfficeHome());
        // 启动OpenOffice的服务
        OfficeManager officeManager = config.buildOfficeManager();
        officeManager.start();
        return officeManager;
    }
 
    /**
     * 转换文件
     *
     * @param inputFile
     * @param outputFilePath_end
     * @param inputFilePath
     * @param
     * @param converter
     */
    public static File converterFile(File inputFile, String outputFilePath_end, String inputFilePath,
                                     OfficeDocumentConverter converter) {  //4
        File outputFile = new File(outputFilePath_end);
        // 假如目标路径不存在,则新建该路径
        if (!outputFile.getParentFile().exists()) {
            outputFile.getParentFile().mkdirs();
        }
        converter.convert(inputFile, outputFile);
        inputFile.delete(); 
        LOG.info("文件：" + inputFilePath + "转换为目标文件：" + outputFile + "成功!");
        return outputFile;
    }
 
    /**
     *目标文件路径，如："e:/test_docx.pdf"
     * @param inputFilePath
     *            源文件路径，如："e:/test.docx"
     * @param
     * @return
     */
    public static File office2pdf(String inputFilePath,String outPath) {  //2
        OfficeManager officeManager = null;
        try {
            if (StringUtils.isEmpty(inputFilePath)) {
                LOG.info("输入文件地址为空，转换终止!");
                return null;
            }
 
            File inputFile = new File(inputFilePath);
 
            if (!inputFile.exists()) {
                LOG.info("输入文件不存在，转换终止!");
                return null;
            }
 
            // 获取OpenOffice的安装路劲
            officeManager = getOfficeManager();
            // 连接OpenOffice
            OfficeDocumentConverter converter = new OfficeDocumentConverter(officeManager);
 
            return converterFile(inputFile, outPath, inputFilePath, converter);
        } catch (Exception e) {
            LOG.error("转化出错!", e);
        } finally {
            // 停止openOffice
            if (officeManager != null) {
                officeManager.stop();
            }
        }
        return null;
    }
 
 
    public static void main(String[] args) {
        Office2PDF.openOfficeToPDF("D:/a.docx","e:/a.pdf");
    }
}

