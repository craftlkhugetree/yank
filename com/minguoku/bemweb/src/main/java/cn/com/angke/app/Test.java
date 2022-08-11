package cn.com.angke.app;

public class Test {
	public static void main(String[] args) {
		String a = "000101南洋旅行漫记";
		String b = a.replaceAll("[^0-9]*", "");
		System.out.println(b);
	}
}
