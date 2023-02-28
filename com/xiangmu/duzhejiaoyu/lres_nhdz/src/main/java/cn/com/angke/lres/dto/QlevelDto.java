package cn.com.angke.lres.dto;

import java.util.List;

import cn.com.angke.lres.pojo.LresQlevel;
import cn.com.angke.lres.pojo.LresQresitem;

/**   
 * @ClassName:  QlevelDto   
 * @Description:TODO(管理端闯关关卡传输数据类)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:18:04   
 *     
 */  
public class QlevelDto extends LresQlevel {
	private List<LresQresitem> itemList;

	public List<LresQresitem> getItemList() {
		return itemList;
	}

	public void setItemList(List<LresQresitem> itemList) {
		this.itemList = itemList;
	}

	
}
