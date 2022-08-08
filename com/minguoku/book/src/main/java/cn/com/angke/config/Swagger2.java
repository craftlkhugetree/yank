package cn.com.angke.config;

import static com.google.common.base.Strings.isNullOrEmpty;

import javax.servlet.ServletContext;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.paths.AbstractPathProvider;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**   
 * @ClassName:  Swagger2   
 * @Description:TODO(swagger2 数据接口生成，方便自己调试)   
 * @author: xyp 
 * @date:   2019年3月14日 上午10:12:10   
 *     
 */  
@Configuration
@EnableWebMvc
@EnableSwagger2
public class Swagger2 extends WebMvcConfigurationSupport {
	public class ProjectPath extends AbstractPathProvider{

	  public static final String ROOT = "/rest";
	  private final ServletContext servletContext;

	  public ProjectPath(ServletContext servletContext) {
	    super();
	    this.servletContext = servletContext;
	  }

	  @Override
	  protected String applicationPath() {
	    return isNullOrEmpty(servletContext.getContextPath()) ? ROOT : servletContext.getContextPath()+"/rest";
	  }

	  @Override
	  protected String getDocumentationPath() {
	    return ROOT;
	  }
		
	}

	@Bean
	public Docket createRestApi() {
		return new Docket(DocumentationType.SWAGGER_2).apiInfo(apiInfo()).pathProvider(new ProjectPath(this.getServletContext())).select()
				.apis(RequestHandlerSelectors.basePackage("cn.com.angke.book.controller")).paths(PathSelectors.any()).build();
	}

	private ApiInfo apiInfo() {
		return new ApiInfoBuilder().title("民国库 APIs").description("")
//				.termsOfServiceUrl("http://localhost:8080/rest/")
				.version("1.0").build();
	}


}
