package cn.com.angke.lres.vo;

public class R<T> {
	private Boolean success;
	private String message;
	private T data;
	private Long total;
	public R(){
		
	}
	public R(Boolean success){
		this.success = success;
	}
	public R(Boolean success,String message){
		this.success = success;
		this.message = message;
	}
	public R(Boolean success,T data){
		this.success = success;
		this.data = data;
	}
	public R(Boolean success,T data,Long total){
		this.success = success;
		this.data = data;
		this.total = total;
	}
	public static <E> R<E> success(E data) {
        return new R<>(true, data);
    }
	public static <E> R<E> success(E data,Long total) {
        return new R<>(true, data,total);
    }
    public static R<Boolean> success() {
        return new R<>(true,"ok");
    }
    public static R<Boolean> fail(String msg) {
        return new R<>(false,msg);
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
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
	public Long getTotal() {
		return total;
	}
	public void setTotal(Long total) {
		this.total = total;
	}
	
}
