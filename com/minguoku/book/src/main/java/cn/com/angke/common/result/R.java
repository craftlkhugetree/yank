package cn.com.angke.common.result;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
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
    public static R success() {
        return new R<>(true,"ok");
    }
    public static R fail(String msg) {
        return new R<>(false,msg);
    }
	
}
