package cn.com.angke.util;

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
	public String CODE;
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
		String result = "{'" +CODE+ "' : '" + NAME + "'" ;
		if (children != null && children.getSize() != 0) {
			result += " , children : " + children.toString();
		} 
		return result + "}";
	}
	
	// 先序遍历，拼接JSON字符串
	public JSONObject toJSONObject() {
		String result = "{'" +CODE+ "' : '" + NAME + "'" ;
		if (children != null && children.getSize() != 0) {
			result += ", children : " + children.toString();
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
