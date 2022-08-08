package cn.com.angke.util;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.imageio.ImageIO;
import javax.swing.JLabel;

public class WaterMarkUtils {

	/** 图片格式：JPG */
	private static final String PICTRUE_FORMATE_JPG = "jpg";
	// 水印透明度
	private static float alpha = 0.5f;
	// 水印左侧的偏移量
	private static Integer x = -1;
	// 水印上侧的偏移量
	private static Integer y = -1;
	// 水印图片
//	private static String iconPath = "F:/1024.png";
	// 水印文字
	private static String waterMarkContent = "南大出版社";
	
	/**
	 * 
	 * 添加图片水印
	 * 
	 * @param targetImg
	 *            目标图片路径，如：C://myPictrue//1.jpg
	 * @param iconPath
	 *            水印图片路径，如：C://myPictrue//logo.png
	 * @param x
	 *            水印图片距离目标图片左侧的偏移量，如果x<0, 则在正中间
	 * @param y
	 *            水印图片距离目标图片上侧的偏移量，如果y<0, 则在正中间
	 * @param alpha
	 *            
	 */
	public final static void pressImage(String srcImgPath, String targerPath,String iconPath) {
		System.out.println("srcImgPath"+srcImgPath);
		System.out.println("targerPath"+targerPath);
		System.out.println("iconPath"+iconPath);
		OutputStream os = null;
		try {
			File file = new File(srcImgPath);
			Image image = ImageIO.read(file);
			int width = image.getWidth(null);
			int height = image.getHeight(null);
			BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			Graphics2D g = bufferedImage.createGraphics();
			g.drawImage(image, 0, 0, width, height, null);
			Image waterImage = ImageIO.read(new File(iconPath)); // 水印文件
			int width_1 = waterImage.getWidth(null);
			int height_1 = waterImage.getHeight(null);
			g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, alpha));
			int widthDiff = width - width_1;
			int heightDiff = height - height_1;
			if (x < 0) {
				x = widthDiff / 2;
			} else if (x > widthDiff) {
				x = widthDiff;
			}
			if (y < 0) {
				y = heightDiff / 2;
			} else if (y > heightDiff) {
				y = heightDiff;
			}
			g.drawImage(waterImage, x, y, width_1, height_1, null); // 水印文件结束
			g.dispose();
			// 10、生成图片
			os = new FileOutputStream(targerPath);
			ImageIO.write(bufferedImage, PICTRUE_FORMATE_JPG, os);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	// 还需要加上文字倾斜45度
	public final static void pressImageWithText(String srcImgPath, String targerPath,String iconPath) {
		OutputStream os = null;
		try {
			File file = new File(srcImgPath);
			Image image = ImageIO.read(file);
			int width = image.getWidth(null);
			int height = image.getHeight(null);
			BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
			Graphics2D g = bufferedImage.createGraphics();
			g.drawImage(image, 0, 0, width, height, null);
			Image waterImage = ImageIO.read(new File(iconPath)); // 水印文件
			int width_1 = 100;
			int height_1 = 100;
			g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, alpha));
			x = 0;
			y = 0;
			g.drawImage(waterImage, x, y, width_1, height_1, null); // 水印文件结束
			// 水印文字
			Font font = new Font("宋体", Font.BOLD, 80);//水印字体，大小
	        Color markContentColor = Color.BLACK;//水印颜色
	        Integer degree = -45;//设置水印文字的旋转角度
	        float alpha = 0.2f;//设置水印透明度 默认为1.0  值越小颜色越浅
	        g.setColor(markContentColor); //设置水印颜色
            g.setFont(font);              //设置字体
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, alpha));//设置水印文字透明度
            if (null != degree) {
                g.rotate(Math.toRadians(degree),(double)bufferedImage.getWidth()/2,(double)bufferedImage.getHeight()/2);//设置水印旋转
            }
            JLabel label = new JLabel(waterMarkContent);
            FontMetrics metrics = label.getFontMetrics(font);
            int labelWidth = metrics.stringWidth(label.getText());//文字水印的宽
            
            g.drawString(waterMarkContent, (width-labelWidth)/2, height/2 );//画出水印,并设置水印位置
            
            g.dispose();// 释放资源
			// 10、生成图片
			os = new FileOutputStream(targerPath);
			ImageIO.write(bufferedImage, PICTRUE_FORMATE_JPG, os);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static void main(String[] args) {
		pressImageWithText("D:/fileupload/mgk/jiagong/20191206/000001中华六法二 民律上/scanpic/l/0001.png", 
				"D:/fileupload/mgk/jiagong/temp/41104c37693845dc8f8a6a38d25bb479.jpg", 
				"D:/fileupload/mgk/jiagong/1024.png");
	}
	
    /**
     * @description 
     * @param sourceImgPath 源图片路径
     * @param tarImgPath 保存的图片路径
     * @param waterMarkContent 水印内容
     * @param fileExt 图片格式
     * @return void
     */
    public void addWatermark(String sourceImgPath, String tarImgPath, String waterMarkContent,String fileExt){
        Font font = new Font("宋体", Font.BOLD, 24);//水印字体，大小
        Color markContentColor = Color.white;//水印颜色
        Integer degree = -45;//设置水印文字的旋转角度
        float alpha = 1.0f;//设置水印透明度 默认为1.0  值越小颜色越浅
        OutputStream outImgStream = null;
        try {
            File srcImgFile = new File(sourceImgPath);//得到文件
            Image srcImg = ImageIO.read(srcImgFile);//文件转化为图片
            int srcImgWidth = srcImg.getWidth(null);//获取图片的宽
            int srcImgHeight = srcImg.getHeight(null);//获取图片的高
            // 加水印
            BufferedImage bufImg = new BufferedImage(srcImgWidth, srcImgHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = bufImg.createGraphics();//得到画笔
            g.drawImage(srcImg, 0, 0, srcImgWidth, srcImgHeight, null);
            g.setColor(markContentColor); //设置水印颜色
            g.setFont(font);              //设置字体
            g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, alpha));//设置水印文字透明度
            if (null != degree) {
                g.rotate(Math.toRadians(degree),(double)bufImg.getWidth(),(double)bufImg.getHeight());//设置水印旋转
            }
            JLabel label = new JLabel(waterMarkContent);
            FontMetrics metrics = label.getFontMetrics(font);
            int width = metrics.stringWidth(label.getText());//文字水印的宽
            int rowsNumber = srcImgHeight/width+srcImgHeight%width;// 图片的高  除以  文字水印的宽  打印的行数(以文字水印的宽为间隔)
            int columnsNumber = srcImgWidth/width+srcImgWidth%width;//图片的宽 除以 文字水印的宽  每行打印的列数(以文字水印的宽为间隔)
            //防止图片太小而文字水印太长，所以至少打印一次
            if(rowsNumber < 1){
                rowsNumber = 1;
            }
            if(columnsNumber < 1){
                columnsNumber = 1;
            }
            for(int j=0;j<rowsNumber;j++){
                for(int i=0;i<columnsNumber;i++){
                    g.drawString(waterMarkContent, i*width + j*width, -i*width + j*width);//画出水印,并设置水印位置
                }
            }
            g.dispose();// 释放资源
            // 输出图片  
            outImgStream = new FileOutputStream(tarImgPath);
            ImageIO.write(bufImg, fileExt, outImgStream);
        } catch (Exception e) {
            e.printStackTrace();
            e.getMessage();
        } finally{
            try {
                if(outImgStream != null){
                    outImgStream.flush();
                    outImgStream.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
                e.getMessage();
            }
        }
    }

	
}
