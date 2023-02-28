package cn.com.angke.annotation;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;


/**   
 * @ClassName:  ParamValid   
 * @Description:TODO(后台数据校验)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:11:43   
 *     
 */  
@Documented
@Retention(RUNTIME)
@Target(METHOD)
public @interface ParamValid {

}
