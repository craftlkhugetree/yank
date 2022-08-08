package cn.com.angke.book.entity;
import lombok.Data;
import org.beetl.sql.core.annotatoin.*;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/* 
* gen date 2022-08-02
*/
@Table(name="wxk_notice")
@Data
@ApiModel("通知公告")
public class WxkNotice{
	
	@AutoID
	private Long id ;
	@ApiModelProperty("名称")
	private String name ;
	@ApiModelProperty("内容")
	private String content ;
	@ApiModelProperty("创建时间")
	private String createTime ;
	@ApiModelProperty("发布时间")
	private String releaseTime ;
	@ApiModelProperty("是否置顶")
	private Integer isTop ;
	@ApiModelProperty("是否发布")
	private Integer isRelease ;
	@ApiModelProperty("创建人id")
	private String createId ;
	@ApiModelProperty("创建人姓名")
	private String createName ;
	@ApiModelProperty("是否弹窗显示")
	private Integer isDialog ;
	@ApiModelProperty("弹框显示结束时间")
	private String dialogEndTime ;

}
