package cn.com.angke.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class NodeZT {
	/**
	 * 节点编号
	 */
	public String ID;
	public Boolean expanded;
	
	/**
	 * 节点内容
	 */
	public String NAME;
	public Boolean checked;
	public String CODE;
	public String text;
	/**
	 * 父节点编号
	 */
	public String PID;
	/**
	 * 孩子节点列表
	 */
	private ChildrenZt children = new ChildrenZt();

	// 先序遍历，拼接JSON字符串
	public String toString() {
		String result = "{" 
				+ " ID : '" + ID + "'" + ", PID : '" + PID + "'" + ", NAME : '" + NAME + "'"+", CODE : '" + CODE + "'"+", text : '" + text + "'"  ;
		if(checked != null && checked){
			result += ", checked : true";
		}else{
			result += ", checked : false";
		}
		if(expanded !=null && expanded){
			result +=", expanded : true";
		}
//		else if(expanded!=null && !expanded){
//			result +=", expanded : false";
//		}
		if (children != null && children.getSize() != 0) {
			result += " , children : " + children.toString();
		} else {
			result += " , leaf : true";
		}

		return result + "}";
	}
	
	// 先序遍历，拼接JSON字符串
	public JSONObject toJSONObject() {
		String result = "{" 
				+ " ID : '" + ID + "'" + ", PID : '" + PID + "'" + ", NAME : '" + NAME + "'"+", CODE : '" + CODE + "'"+", text : '" + text + "'" ;
		if(checked != null && checked){
			result += ", checked : true";
		}else{
			result += ", checked : false";
		}
		if (children != null && children.getSize() != 0) {
			result += ", children : " + children.toString();
		} else {
			result += ", leaf : true";
		}

		return JSONObject.parseObject(result + "}");
	}	
	
	// 先序遍历，拼接JSON字符串
	public JSONArray toJSONArray() {
		String result = "";

		if (children != null && children.getSize() != 0) {
			result += children.toString();
		}

		return JSONArray.parseArray(result);
	}

	

	// 添加孩子节点
	public void addChild(NodeZT node) {
		this.children.addChild(node);
	}
}
