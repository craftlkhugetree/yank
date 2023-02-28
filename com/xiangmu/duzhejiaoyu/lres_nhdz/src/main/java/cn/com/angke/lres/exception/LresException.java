package cn.com.angke.lres.exception;

/**   
 * @ClassName:  LresException   
 * @Description:TODO(读者教育异常类)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:20:02   
 *     
 */  
public class LresException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	
	private String error_code;
	private String error_msg;
	
	public LresException(String error_code, String error_msg) {
		super();
		this.error_code = error_code;
		this.error_msg = error_msg;
	}

	public String getError_code() {
		return error_code;
	}

	public void setError_code(String error_code) {
		this.error_code = error_code;
	}

	public String getError_msg() {
		return error_msg;
	}

	public void setError_msg(String error_msg) {
		this.error_msg = error_msg;
	}
	
}
