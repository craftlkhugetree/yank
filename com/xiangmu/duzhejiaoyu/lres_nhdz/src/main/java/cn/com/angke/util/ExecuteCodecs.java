package cn.com.angke.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.somenew.config.service.ConfigOpt;
public class ExecuteCodecs {
	//private static final Logger LOG = LogManager.getLogger(ExecuteCodecs.class);
	public static String getFFMPEGExecutablePath() {
		String osName = System.getProperty("os.name");
        if (Pattern.matches("Linux.*", osName)) {
        	String openPath = ConfigOpt.getConfigValue("FFMPEG_PATH", "/opt/ffmpeg-4.1.1/bin/ffmpeg");
            return openPath;
        } else if (Pattern.matches("Windows.*", osName)) {
            return "E:/ffmpeg-4.1.1/bin/ffmpeg.exe";
        } else if (Pattern.matches("Mac.*", osName)) {
            return "/Applications/OpenOffice.org.app/Contents/";
        }else {
        	return null;
        }
		
	}
	/** 
     * 视频转码 (PC端MP4)
     * @param ffmpegPath    转码工具的存放路径
     * @param upFilePath    用于指定要转换格式的文件,要截图的视频源文件
     * @param codcFilePath    格式转换后的的文件保存路径
     * @return 
     * @throws Exception 
     */  
    public static void exchangeToMp4(String upFilePath,String outPath) throws Exception {  
    	File source = new File(upFilePath);
    	File target = new File(outPath);
    	File fileParent = target.getParentFile();
		if(!fileParent.exists()){  
		    fileParent.mkdirs();  
		}  
        String ffmpegPath = getFFMPEGExecutablePath();
    	// 创建List集合来保存转换视频文件为flv格式的命令 
        List<String> convert = new ArrayList<String>();  
        convert.add(ffmpegPath); // 添加转换工具路径  
        convert.add("-y"); // 该参数指定将覆盖已存在的文件  
        convert.add("-i");
        convert.add(upFilePath);
        convert.add("-c:v");
        convert.add("libx264");
        convert.add("-c:a");
        convert.add("aac");
        convert.add("-strict");
        convert.add("-2");
        convert.add("-pix_fmt");
        convert.add("yuv420p");
        convert.add("-movflags");
        convert.add("faststart");
        //convert.add("-vf");   // 添加水印
        //convert.add("movie=watermark.gif[wm];[in][wm]overlay=20:20[out]");
        convert.add(outPath); 
        ProcessBuilder builder = new ProcessBuilder();
        builder.command(convert);
        Process process = builder.start();
        
        InputStream errorStream = process.getErrorStream();
        InputStreamReader inputStreamReader = new InputStreamReader(errorStream);
        BufferedReader br = new BufferedReader(inputStreamReader);

		@SuppressWarnings("unused")
		String line = "";
        while ((line = br.readLine()) != null) {
        	//System.out.println(line);
        }
        if (br != null) {
            br.close();
        }
        if (inputStreamReader != null) {
            inputStreamReader.close();
        }
        if (errorStream != null) {
            errorStream.close();
        }
        source.delete();
    } 
    
    public static void main(String[] args) {
    	try {
			ExecuteCodecs.exchangeToMp4("e:/source.mkv","e:/source.mp4");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
