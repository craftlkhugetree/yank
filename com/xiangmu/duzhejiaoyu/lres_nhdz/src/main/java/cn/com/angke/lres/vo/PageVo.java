package cn.com.angke.lres.vo;

import java.util.List;

public class PageVo<T> {
	private Boolean success;
	private String message;
	private List<T> items;
	private Long total = 0l;
	public PageVo(){
		
	}
	public PageVo(Boolean success){
		this.success = success;
	}
	public PageVo(Boolean success,String message){
		this.success = success;
		this.message = message;
	}
	public PageVo(Boolean success,List<T> items,Long total){
		this.success = success;
		this.items = items;
		this.total = total;
	}
	public Boolean getSuccess() {
		return success;
	}
	public void setSuccess(Boolean success) {
		this.success = success;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public List<T> getItems() {
		return items;
	}
	public void setItems(List<T> items) {
		this.items = items;
	}
	public Long getTotal() {
		return total;
	}
	public void setTotal(Long total) {
		this.total = total;
	}
	
}
