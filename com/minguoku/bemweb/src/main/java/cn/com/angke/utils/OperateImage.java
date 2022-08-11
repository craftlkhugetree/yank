package cn.com.angke.utils;

import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.imageio.ImageIO;
import javax.media.jai.JAI;
import javax.media.jai.PlanarImage;

import org.apache.commons.io.FileUtils;
import org.dom4j.DocumentException;

import com.alibaba.fastjson.JSONArray;
import com.sun.media.jai.codec.FileSeekableStream;
import com.sun.media.jai.codec.ImageCodec;
import com.sun.media.jai.codec.ImageEncoder;
import com.sun.media.jai.codec.JPEGEncodeParam;

/**
 * @author YiT
 * @date 2017年12月18日
 * 
 */
public class OperateImage {

	public static void create(String srcPath, String toPath, String type) throws IOException {
		File file = new File(srcPath);
		File[] fileList = file.listFiles();
		String doc = toPath + "/docbook";
		String epub = toPath + "/epub";
		File docFile = new File(doc);
		if (!docFile.exists()) {
			docFile.mkdir();
		}
		File epubFile = new File(epub);
		if (!epubFile.exists()) {
			epubFile.mkdir();
		}
		if (type.equals("m")) {
			String newPath = toPath + "/scanpic/m/";
			File newFile = new File(newPath);
			if (!newFile.exists()) {
				newFile.mkdir();
			}
			for (int i = 0; i < fileList.length; i++) {
				String path = srcPath + File.separator + fileList[i].getName();
				String pic = newPath + File.separator + fileList[i].getName();
				reduceImg(path, pic, 600, "png");
			}
		}
		if (type.equals("l")) {
			String newPath = toPath + "/scanpic/l/";
			File newFile = new File(newPath);
			if (!newFile.exists()) {
				newFile.mkdir();
			}
			for (int i = 0; i < fileList.length; i++) {
				String path = srcPath + File.separator + fileList[i].getName();
				String pic = newPath + File.separator + fileList[i].getName();
				reduceImg(path, pic, 1024, "png");
			}
		}
		if (type.equals("s")) {
			String newPath = toPath + "/scanpic/s/";
			File newFile = new File(newPath);
			if (!newFile.exists()) {
				newFile.mkdir();
			}
			for (int i = 0; i < fileList.length; i++) {
				String path = srcPath + File.separator + fileList[i].getName();
				String pic = newPath + File.separator + fileList[i].getName();
				reduceImg(path, pic, 120, "png");
			}
		}
		if (type.equals("all")) {
			String sPath = toPath + "/scanpic/s/";
			String lPath = toPath + "/scanpic/l/";
			String mPath = toPath + "/scanpic/m/";
			File sFile = new File(sPath);
			File lFile = new File(lPath);
			File mFile = new File(mPath);
			if (!mFile.exists()) {
				mFile.mkdir();
			}
			if (!lFile.exists()) {
				lFile.mkdir();
			}
			if (!sFile.exists()) {
				sFile.mkdir();
			}
			for (int i = 0; i < fileList.length; i++) {
				String path = srcPath + File.separator + fileList[i].getName();
				String m = mPath + fileList[i].getName();
				String l = lPath + fileList[i].getName();
				String s = sPath + fileList[i].getName();
				reduceImg(path, l, 1024, "png");
				reduceImg(path, m, 600, "png");
				reduceImg(path, s, 120, "png");
			}
		}
	}

	public static void SubindexBuilder(File subPath, String toPath, String type) throws IOException, DocumentException {
		File[] filelist = subPath.listFiles();
		List<String> srcList = new ArrayList<>();
		List<String> toList = new ArrayList<>();
		String filepath = null;
		String fileName = null;
		String to = null;
		for (int i = 0; i < filelist.length; i++) {
			File file = filelist[i];
			if (file.isDirectory()) {
				SubindexBuilder(file, toPath, type);
			} else if (isImage(file.getName())) {
				filepath = file.getParentFile().getPath();
				srcList.add(filepath);
				fileName = file.getParentFile().getName();
				to = toPath.concat("/") + fileName;
				toList.add(to);
			}
		}
		HashSet<String> h = new HashSet<>(srcList);      
		srcList.clear();      
		srcList.addAll(h); 
		HashSet<String> t = new HashSet<>(toList);      
		toList.clear();      
		toList.addAll(t);  
		if(srcList.size()==toList.size()){
			for (int i = 0; i < srcList.size(); i++) {
				create(srcList.get(i).toString(), toList.get(i).toString(), type);
			}
		}
	}

	/***
	 * 判断文件类型是否是图片
	 * 
	 * @param fileName
	 * @return
	 */
	public static boolean isImage(String fileName) {
		JSONArray fileTypes = JSONArray.parseArray("[\"bmp\",\"jpg\",\"jpeg\", \"png\",\"tif\"]");
		int splitIndex = fileName.lastIndexOf(".");
		String fileType = fileName.substring(splitIndex + 1);
		if (fileTypes.contains(fileType)) {
			return true;
		} else {
			return false;
		}

	}

	/**
	 * 设置指定图片宽高
	 * 
	 * @param srcImageFile
	 *            图片源路径
	 * @param result
	 *            输出路径
	 * @param width
	 *            设置宽度
	 * @param height
	 *            设置高度
	 * @param formatName
	 *            输出文件格式
	 */
	public final static void reduceImg(String srcImageFile, String result, int height, String formatName) {
		try {
			// 如果目标路径不存在, 则新建该路径
			File outputFile = new File(result);
			if (!outputFile.getParentFile().exists()) {
				outputFile.getParentFile().mkdirs();
			}
			BufferedImage src = ImageIO.read(new File(srcImageFile)); // 读入文件
			int w = src.getWidth();
			int h = src.getHeight();
			double rate = w * 1.0 / h;// 计算图片比列
			int width = (int) (rate * height);
			Image image = src.getScaledInstance(width, height, Image.SCALE_DEFAULT);
			BufferedImage tag = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			Graphics g = tag.getGraphics();
			g.drawImage(image, 0, 0, null); // 绘制设置后的图

			g.dispose();
			ImageIO.write(tag, formatName, new File(result));// 输出到文件流
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static void createPng(String input, String output) throws IOException {
		FileSeekableStream stream = new FileSeekableStream(input);
		PlanarImage in = JAI.create("stream", stream);
		OutputStream os = null;
		os = new FileOutputStream(output);
		JPEGEncodeParam param = new JPEGEncodeParam();
		ImageEncoder enc = ImageCodec.createImageEncoder("JPEG", os, param);
		try {
			enc.encode(in);
			os.flush();
			os.close();
			stream.close();
		} catch (IOException e) {
			System.out.println("JPEG error" + e.toString());
		}
		// 删除源文件
		FileUtils.forceDelete(new File(input));
		// 将新生成的文件名字改为原始文件名
//		File sFile = new File(input);
		// if (!sFile.exists()) {
		// File fDest = new File(output);
		// fDest.renameTo(new File(input));
		// }
	}

	public static void main(String[] args) throws IOException, DocumentException {
		String input="C:\\Users\\YiT\\Desktop\\0003.tif";
		String output="C:\\Users\\YiT\\Desktop\\0003.png";
		createPng(input, output);
	}

}
