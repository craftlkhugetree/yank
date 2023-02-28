package cn.com.angke.lres.dto;

import java.util.List;

import cn.com.angke.lres.pojo.LresQoption;
import cn.com.angke.lres.pojo.LresQuestion;

/**   
 * @ClassName:  QresourceDto   
 * @Description:TODO(管理端问题新增数据类)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:19:05   
 *     
 */
public class QuestionDto extends LresQuestion{
	private List<LresQoption> optionList;
	public List<LresQoption> getOptionList() {
		return optionList;
	}
	public void setOptionList(List<LresQoption> optionList) {
		this.optionList = optionList;
	}
	
}
