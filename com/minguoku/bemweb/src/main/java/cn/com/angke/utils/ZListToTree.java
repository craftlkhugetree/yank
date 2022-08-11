package cn.com.angke.utils;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;

import java.util.Set;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class ZListToTree {
	
	//中图分类树
	public static JSONArray parseArrayZt(List<JSONObject> dataList,String tableName){
		// 节点列表（散列表，用于临时存储节点对象）
		HashMap<String,NodeZT> nodeList = new HashMap<String,NodeZT>();
		// 根节点
		NodeZT root = new NodeZT();
		// 根据结果集构造节点列表（存入散列表）
		for (Iterator<JSONObject> it = dataList.iterator(); it.hasNext();) {
			JSONObject dataRecord = it.next();
			NodeZT node = new NodeZT();
			node.ID = (String) dataRecord.get("ID");
			node.NAME = (String) dataRecord.get("NAME");
			node.PID = (String) dataRecord.get("PID");
			node.CODE=(String) dataRecord.get("CODE");
			node.text=(String) dataRecord.get("NAME");
			nodeList.put(node.ID, node);
			if(StringUtils.isNotBlank((String) dataRecord.get("checked"))){
				node.checked = true;
				//选中的父级展开
				if(node.PID==null|| node.PID.equals("")){
					node.expanded=true;
				}else{
					nodeList.get(node.PID).expanded=true;
				}
			}else{
				node.checked = false;
				if(node.PID==null|| node.PID.equals("")){
					node.expanded=false;
				}
			}
		}
		// 构造无序的多叉树
		Set<Entry<String, NodeZT>> entrySet = nodeList.entrySet();
		for (Iterator<Entry<String, NodeZT>> it = entrySet.iterator(); it.hasNext();) {
			NodeZT node =  it.next().getValue();
			if (node.PID == null || node.PID.equals("")) {
				root.addChild(node);
			} else {
				((NodeZT) nodeList.get(node.PID)).addChild(node);
			}
		}
		System.out.println(root.toString());
		return root.toJSONArray();		
	}
	
	
	
}
