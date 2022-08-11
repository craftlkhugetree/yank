package cn.com.angke.app.util;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sun.media.jai.codec.ImageCodec;
import com.sun.media.jai.codec.ImageDecoder;
import com.sun.media.jai.codec.ImageEncoder;

public class FileUtil {
	
	public static boolean ifExist(String dir){
		File file = new File(dir);
		return file.exists();
	}
	
	public static void updateJiagongDir(String jiagongBook){
		File file_dockbook = new File(jiagongBook+File.separator+"dockbook"+File.separator+"img");
		if(!file_dockbook.exists()){
			file_dockbook.mkdirs();
		}
		File file_epub = new File(jiagongBook+File.separator+"epub"+File.separator+"EPUB"+File.separator+"img");
		if(!file_epub.exists()){
			file_epub.mkdirs();
		}
		File file_epubs = new File(jiagongBook+File.separator+"epub"+File.separator+"EPUBS"+File.separator+"img");
		if(!file_epubs.exists()){
			file_epubs.mkdirs();
		}
		File file_metainf = new File(jiagongBook+File.separator+"epub"+File.separator+"META-INF");
		if(!file_metainf.exists()){
			file_metainf.mkdirs();
		}
		File file_l = new File(jiagongBook+File.separator+"scanpic"+File.separator+"l");
		if(!file_l.exists()){
			file_l.mkdirs();
		}
		File file_m = new File(jiagongBook+File.separator+"scanpic"+File.separator+"m");
		if(!file_m.exists()){
			file_m.mkdirs();
		}
		File file_s = new File(jiagongBook+File.separator+"scanpic"+File.separator+"s");
		if(!file_s.exists()){
			file_s.mkdirs();
		}
	}
	
	public static JSONObject getFileAddDel(File[] oldFiles,String oldTypeName,File[] newFiles,String newTypeName){
		JSONObject obj = new JSONObject();
		JSONArray add = new JSONArray();
		JSONArray del = new JSONArray();
		JSONArray mix = new JSONArray();
		JSONArray oldNames = FileUtil.getFileListNames(oldFiles,oldTypeName);
		JSONArray newNames = FileUtil.getFileListNames(newFiles,newTypeName);
		for(int i=0;i<newNames.size();i++){
			if(oldNames.contains(newNames.get(i))){
				mix.add(newNames.get(i));
			}else{
				add.add(newNames.get(i));
			}	
		}
		for(int i=0;i<oldNames.size();i++){
			if(!newNames.contains(oldNames.get(i))){
				del.add(oldNames.get(i));
			}
		}
		obj.put("add", add);
		obj.put("del", del);
		obj.put("mix", mix);
		obj.put("old", oldNames);
		obj.put("new", newNames);
		return obj;
	}
	
	public static JSONArray getFileListNames(File[] file,String typeName){
		JSONArray arr = new JSONArray();
		for(int i=0;i<file.length;i++){
			File oneFile = file[i];
			if(oneFile.isFile() && oneFile.getName().endsWith(typeName)){
				arr.add(oneFile.getName().subSequence(0, oneFile.getName().lastIndexOf(".")));
			}
		}
		return arr;
	}
	
	public static String getProcess(int now,int all){
		return "("+now+"/"+all+")";
	}
	
	public static File tif2png(File file, String tempFile) {
		//String fileName = file.getName().replaceAll("[.][^.]+$", "");
		//String toFile = this.target + FILE_SEPARATOR + dir.getName().trim() + FILE_SEPARATOR + fileName + ".png";
		try {
			FileOutputStream out = new FileOutputStream(tempFile);
			ImageDecoder decoder = ImageCodec.createImageDecoder("tiff", file, null);
			ImageEncoder encoder = ImageCodec.createImageEncoder("png", out, null);
			encoder.encode(decoder.decodeAsRenderedImage());
			out.close();
		} catch (FileNotFoundException localFileNotFoundException) {
		} catch (IOException localIOException) {
		}
		return new File(tempFile);
	}
	
	public static void resize(Image sourceImage, int w, int h, String target) throws IOException {
		BufferedImage to = new BufferedImage(w, h, 6);
		Graphics2D g2d = to.createGraphics();
		to = g2d.getDeviceConfiguration().createCompatibleImage(w, h, 3);
		g2d.dispose();
		g2d = to.createGraphics();
		Image from = sourceImage.getScaledInstance(w, h, 16);
		g2d.drawImage(from, 0, 0, null);
		g2d.dispose();
		ImageIO.write(to, "png", new File(target));
	}
	
	public static void producePng(File tempFile,String fileName,String target) throws Exception{
		Image img = ImageIO.read(tempFile);
		int width = img.getWidth(null);
		int height = img.getHeight(null);
		resize(img, 1024 * width / height, 1024,target+File.separator+"l"+File.separator+fileName+".png");
		File file1 = new File(target+File.separator+"l"+File.separator+fileName+".png");
		Image img1 = ImageIO.read(file1);
		resize(img1, 600 * width / height, 600,target+File.separator+"m"+File.separator+fileName+".png");
		File file2 = new File(target+File.separator+"m"+File.separator+fileName+".png");
		Image img2 = ImageIO.read(file2);
		resize(img2, 120 * width / height, 120,target+File.separator+"s"+File.separator+fileName+".png");
		tempFile.delete();
	}
	
	public static void main(String[] args) {
		FileUtil.tif2png(new File("D:\\fileuploadmgk\\yuanshi\\C002_00_20170825\\000006交通史总目\\0002.tif"), "D:\\fileuploadmgk\\jiagong\\C002_00_20170825\\000006交通史总目\\scanpic\\0002.png");
	}
}
