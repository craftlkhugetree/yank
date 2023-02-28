package cn.com.angke.lres.vo;

public class ResultMessage<T> {
	private Boolean success;
	private String message;
	private T item;
	public ResultMessage(){
		
	}
	public ResultMessage(Boolean success){
		this.success = success;
	}
	public ResultMessage(Boolean success,String message){
		this.success = success;
		this.message = message;
	}
	public ResultMessage(Boolean success,T item){
		this.success = success;
		this.item = item;
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
	public T getItem() {
		return item;
	}
	public void setItem(T item) {
		this.item = item;
	}
	
}
