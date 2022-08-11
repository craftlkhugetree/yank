package cn.com.angke.app;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import com.sun.media.jai.codec.ImageCodec;
import com.sun.media.jai.codec.ImageDecoder;
import com.sun.media.jai.codec.ImageEncoder;

public class MGKImage {
	private String source;
	private String target;
	public static final String TYPE_JPG = "jpg";
	public static final String TYPE_GIF = "gif";
	public static final String TYPE_PNG = "png";
	public static final String TYPE_BMP = "bmp";
	public static final String TYPE_UNKNOWN = "unknown";
	public static final String FILE_SEPARATOR = File.separator;
	public int allBook = 0;
	public int successBook = 0;
	public int errorBook = 0;
	public List<Object> errorMsg = new ArrayList<Object>();
	
	public String getSource() {
		return this.source;
	}

	public void setSource(String source) {
		this.source = source;
		System.out.println(this.source);
	}

	public String getTarget() {
		return this.target;
	}

	public void setTarget(String target) {
		this.target = target;
		System.out.println(this.target);
	}

	public void procImg() {
		if (this.source.equals("")) {
			System.out.println("请输入原始地址");
			return;
		}
		File root = new File(this.source);
		File[] dir = root.listFiles(new FileFilter() {
			public boolean accept(File pathname) {
				return pathname.isDirectory();
			}
		});
		System.out.println("待加工目录:"+ root.getName() + "  书目数量:" + dir.length );
		allBook = dir.length;
		for (int i = 0; i < dir.length; i++) {
			if (mkDir(this.target, dir[i].getName())) {
				File[] file = dir[i].listFiles(new FileFilter() {
					public boolean accept(File pathname) {
						return pathname.isFile();
					}
				});
				System.out.println(getTime() + "  处理书目进度" + (i+1) + "/" + dir.length + "数目名称: " + dir[i].getName()
						+ "  书目文件数量:" + file.length );
				List<Object> errorInfoArr = new ArrayList<>();
				boolean allSuccess = true;
				for (int j = 0; j < file.length; j++) {
					System.out.println(getTime()+"  处理文件中:"+file[j].getName());
					String fileName = file[j].getName().replaceAll("[.][^.]+$", "");
					
					try {
						String tmpName = file[j].getName().toLowerCase();
						tmpName = tmpName.substring(tmpName.lastIndexOf(".") + 1, tmpName.length());
						File tmpfile = null;
						if (tmpName.equals("jpg")) {
							tmpfile = jpg2png(file[j], dir[i]);
						}
						if (tmpName.equals("tif")) {
							tmpfile = tif2png(file[j], dir[i]);
						}
						Image img = ImageIO.read(tmpfile);
						int width = img.getWidth(null);
						int height = img.getHeight(null);

						resize(img, 1024 * width / height, 1024,
								this.target + FILE_SEPARATOR + dir[i].getName().trim() + FILE_SEPARATOR + "scanpic"
										+ FILE_SEPARATOR + "l" + FILE_SEPARATOR + fileName + ".png");
						File file1 = new File(this.target + FILE_SEPARATOR + dir[i].getName().trim() + FILE_SEPARATOR
								+ "scanpic" + FILE_SEPARATOR + "l" + FILE_SEPARATOR + fileName + ".png");
						Image img1 = ImageIO.read(file1);
						resize(img1, 600 * width / height, 600,
								this.target + FILE_SEPARATOR + dir[i].getName().trim() + FILE_SEPARATOR + "scanpic"
										+ FILE_SEPARATOR + "m" + FILE_SEPARATOR + fileName + ".png");
						File file2 = new File(this.target + FILE_SEPARATOR + dir[i].getName().trim() + FILE_SEPARATOR
								+ "scanpic" + FILE_SEPARATOR + "m" + FILE_SEPARATOR + fileName + ".png");
						Image img2 = ImageIO.read(file2);
						resize(img2, 120 * width / height, 120,
								this.target + FILE_SEPARATOR + dir[i].getName().trim() + FILE_SEPARATOR + "scanpic"
										+ FILE_SEPARATOR + "s" + FILE_SEPARATOR + fileName + ".png");

						tmpfile.delete();
						System.out.println(getTime() + "  文件处理完成 :" + fileName );
					} catch (Exception e) {
						System.out.println("出错啦! 出错书目:"+dir[i].getName()+" 错误文件:"+fileName);
						allSuccess = false;
						errorInfoArr.add(fileName);
					} 
					
				}
				if(allSuccess){
					successBook+=1;
					System.out.println(getTime() + "  " + dir[i].getName() +"已全部处理完成");
				}else{
					errorBook +=1;
					Map<String, Object> oneError = new HashMap<String, Object>();
					oneError.put("错误书目", dir[i].getName());
					oneError.put("错误文件", errorInfoArr);
					errorMsg.add(oneError);
					System.out.println(getTime() + "  " + dir[i].getName() +"已处理完成,错误文件:"+errorInfoArr);
				}
			}
		}
		System.out.println("++++++++处理结果+++++++++");
		System.out.println("共处理书目:"+allBook);
		System.out.println("成功书目:"+successBook);
		if(errorMsg.size()>0){
			System.out.println("错误条数:"+errorBook);
			System.out.println("错误信息:"+errorMsg);
		}
	}

	private void resize(Image sourceImage, int w, int h, String target) throws IOException {
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

	private File tif2png(File file, File dir) {
		String fileName = file.getName().replaceAll("[.][^.]+$", "");
		String toFile = this.target + FILE_SEPARATOR + dir.getName().trim() + FILE_SEPARATOR + fileName + ".png";
		try {
			FileOutputStream out = new FileOutputStream(toFile);
			ImageDecoder decoder = ImageCodec.createImageDecoder("tiff", file, null);
			ImageEncoder encoder = ImageCodec.createImageEncoder("png", out, null);
			encoder.encode(decoder.decodeAsRenderedImage());
			out.close();
		} catch (FileNotFoundException localFileNotFoundException) {
		} catch (IOException localIOException) {
		}
		return new File(toFile);
	}

	private File jpg2png(File file, File dir) {
		String fileName = file.getName().replaceAll("[.][^.]+$", "");
		String toFile = this.target + FILE_SEPARATOR + dir.getName().trim() + FILE_SEPARATOR + fileName + ".png";
		try {
			FileOutputStream out = new FileOutputStream(toFile);
			ImageDecoder decoder = ImageCodec.createImageDecoder("jpeg", file, null);
			ImageEncoder encoder = ImageCodec.createImageEncoder("png", out, null);
			encoder.encode(decoder.decodeAsRenderedImage());
			out.close();
		} catch (FileNotFoundException localFileNotFoundException) {
		} catch (IOException localIOException) {
		}
		return new File(toFile);
	}

	private String getTime() {
		Date d = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.format(d);
	}

	private boolean mkDir(String targetDir, String bookDir) {
		String path = targetDir + FILE_SEPARATOR + bookDir;

		File file = new File(path);
		if ((!file.exists()) && (!file.mkdirs())) {
			return false;
		}
		file = new File(path + FILE_SEPARATOR + "dockbook" + FILE_SEPARATOR + "img");
		if ((!file.exists()) && (!file.mkdirs())) {
			return false;
		}
		file = new File(path + FILE_SEPARATOR + "epub" + FILE_SEPARATOR + "EPUB" + FILE_SEPARATOR + "img");
		if ((!file.exists()) && (!file.mkdirs())) {
			return false;
		}
		file = new File(path + FILE_SEPARATOR + "epub" + FILE_SEPARATOR + "EPUBS" + FILE_SEPARATOR + "img");
		if ((!file.exists()) && (!file.mkdirs())) {
			return false;
		}
		file = new File(path + FILE_SEPARATOR + "epub" + FILE_SEPARATOR + "META-INF");
		if ((!file.exists()) && (!file.mkdirs())) {
			return false;
		}
		file = new File(path + FILE_SEPARATOR + "scanpic" + FILE_SEPARATOR + "l");
		if ((!file.exists()) && (!file.mkdirs())) {
			return false;
		}
		file = new File(path + FILE_SEPARATOR + "scanpic" + FILE_SEPARATOR + "m");
		if ((!file.exists()) && (!file.mkdirs())) {
			return false;
		}
		file = new File(path + FILE_SEPARATOR + "scanpic" + FILE_SEPARATOR + "s");

		return (file.exists()) || (file.mkdirs());
	}

	public static String bytesToHexString(byte[] src) {
		StringBuilder stringBuilder = new StringBuilder();
		if ((src == null) || (src.length <= 0)) {
			return null;
		}
		for (int i = 0; i < src.length; i++) {
			int v = src[i] & 0xFF;
			String hv = Integer.toHexString(v);
			if (hv.length() < 2) {
				stringBuilder.append(0);
			}
			stringBuilder.append(hv);
		}
		return stringBuilder.toString();
	}

	public static String getPicType(File file) {
		byte[] b = new byte[4];
		FileInputStream fis = null;
		try {
			fis = new FileInputStream(file);
			fis.read(b, 0, b.length);
			String type = bytesToHexString(b).toUpperCase();
			if (type.contains("FFD8FF")) {
				return "jpg";
			}
			if (type.contains("89504E47")) {
				return "png";
			}
			if (type.contains("47494638")) {
				return "gif";
			}
			if (type.contains("424D")) {
				return "bmp";
			}
			return "unknown";
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fis != null) {
				try {
					fis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return null;
	}

	public static void main(String[] args) {
		MGKImage img = new MGKImage();
		img.setSource(System.getProperty("Source"));
		img.setTarget(System.getProperty("Target"));
//		img.setSource("D:\\fileuploadmgk\\yuanshi\\C002_00_20181024\\");
//		img.setTarget("D:\\fileuploadmgk\\jiagong\\C002_00_20181024\\");
		img.procImg();
	}
}
