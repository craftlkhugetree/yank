package cn.com.angke.validation;

import java.util.List;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import cn.com.angke.lres.vo.ResultMessage;

/**   
* Copyright: Copyright (c) 2019 
* 
* @ClassName: ValidationAdvice.java
* @Description: AOP实现数据验证
*
* @version: v1.0.0
* @author: xyp
* @date: 2019年3月14日 上午9:58:14 
*/
@Component
@Aspect
public class ValidationAdvice {

	@Around("@annotation(cn.com.angke.annotation.ParamValid)")
	public Object aroundMethod(ProceedingJoinPoint pjp) throws Throwable {
		Errors errors = null;
		Object[] args = pjp.getArgs();
		if (null != args && args.length != 0) {
			for (Object object : args) {
				if (object instanceof BindingResult) {
					errors = (BindingResult) object;
					break;
				}
			}
		}
		if (errors != null && errors.hasErrors()) {
			List<ObjectError> allErrors = errors.getAllErrors();
			StringBuffer sb = new StringBuffer();
			for (ObjectError objectError : allErrors) {
				sb.append(((FieldError) objectError).getField() + ":").append(objectError.getDefaultMessage())
						.append(";");
			}
			String errorMsg = sb.toString();
			return new ResultMessage<>(false, errorMsg);
		}
		return pjp.proceed();
	}

}