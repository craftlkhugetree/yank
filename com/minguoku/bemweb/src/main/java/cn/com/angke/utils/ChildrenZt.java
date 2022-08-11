package cn.com.angke.utils;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ChildrenZt {
	private List<NodeZT> list = new ArrayList<NodeZT>();
	
	public int getSize() {
		return list.size();
	}

	public void addChild(NodeZT node) {
		list.add(node);
	}

	// 拼接孩子节点的JSON字符串
	public String toString() {
		String result = "[";
		for (Iterator<NodeZT> it = list.iterator(); it.hasNext();) {
			result += ((NodeZT) it.next()).toString();
			result += ",";
		}
		result = result.substring(0, result.length() - 1);
		result += "]";
		return result;
	}
}
