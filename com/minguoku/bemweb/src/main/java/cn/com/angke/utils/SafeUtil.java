package cn.com.angke.utils;

import java.text.CharacterIterator;
import java.text.StringCharacterIterator;

public class SafeUtil {
	
	public static String HTMLEncode(String aText){
	     final StringBuilder result = new StringBuilder();
	     final StringCharacterIterator iterator = new StringCharacterIterator(aText);
	     char character =  iterator.current();
	     while (character != CharacterIterator.DONE ){
	       if (character == '<') {
	         result.append("&lt;");
	       }
	       else if (character == '>') {
	         result.append("&gt;");
	       }
	       else if (character == '&') {
	         result.append("&amp;");
	      }
//	       else if (character == '\"') {
//	         result.append("&quot;");
//	       }
	       else {
	         result.append(character);
	       }
	       character = iterator.next();
	     }
	     return result.toString();
	  }
	
	public static void main(String[] args) {
		System.out.println(HTMLEncode("<input>"));
	}
	
}
