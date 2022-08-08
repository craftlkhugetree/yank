package cn.com.angke.util;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class ListToTree {
	//简易的arr转换成树形结构
	/*
	 * arr:JSONObject的数组
	 * ID：主键
	 * PID：父级键
	 * children:希望用什么字段组装子数据
	 * */
	public static JSONArray SimpleToList(JSONArray arr,String ID,String PID,String children){
		//创建返回的数组
		JSONArray treeArr = new JSONArray();
		//创建用于处理数据的对象
		JSONObject handleObj = new JSONObject();
		//把主键作为key,赋值给处理数据的对象
		for(int i=0;i<arr.size();i++){
			handleObj.put(arr.getJSONObject(i).getString(ID), arr.getJSONObject(i));
		}
		//遍历传入的数组，将顶级对象传入返回数组，将子对象加入到父亲节点，都是引用
		for(int i=0;i<arr.size();i++){
			//某个具体对象
			JSONObject oneObj = arr.getJSONObject(i);
			String pid = oneObj.getString(PID);
			//如果pid为空，为顶级，把处理obj对应的对象直接加入返回数组
			if(StringUtils.isBlank(pid)){
				treeArr.add(handleObj.getJSONObject(oneObj.getString(ID)));
			}else{
				JSONObject fatherObj = handleObj.getJSONObject(pid);
				//如果没有父亲，把处理obj对应的对象直接加入返回数组
				if(fatherObj == null){
					treeArr.add(handleObj.getJSONObject(oneObj.getString(ID)));
				}else{
					//有父亲，加入父亲的子节点中
					JSONArray sonArr = fatherObj.getJSONArray(children);
					if(sonArr ==null){
						sonArr = new JSONArray();
					}
					sonArr.add(handleObj.getJSONObject(oneObj.getString(ID)));
					fatherObj.put(children, sonArr);
				}
			}
		}
		return treeArr;
	}
}
