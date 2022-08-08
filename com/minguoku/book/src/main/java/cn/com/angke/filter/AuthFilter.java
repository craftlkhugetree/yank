package cn.com.angke.filter;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * Servlet Filter implementation class AuthFilter
 */
public class AuthFilter implements Filter {
	static Log logger = LogFactory.getLog(AuthFilter.class);

	private Pattern UNCHECKURI_PATTERN;
	
	/**
	 * Default constructor.
	 */
	public AuthFilter() {
		this.UNCHECKURI_PATTERN=UNCHECKURI_PATTERN;
	}

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
	}

	public static void setCross(ServletResponse response){
		HttpServletResponse res=(HttpServletResponse)response;
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type,xcu");// X-E4M-With");
	}
	
	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		setCross(res);
		chain.doFilter(req, res);
	}
	
	private String getIpAddr(HttpServletRequest req) {
	     String ipAddress = null;
	     //ipAddress = this.getRequest().getRemoteAddr();
	     ipAddress = req.getHeader("x-forwarded-for");
	     if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
	      ipAddress = req.getHeader("Proxy-Client-IP");
	     }
	     if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
	         ipAddress = req.getHeader("WL-Proxy-Client-IP");
	     }
	     if(ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
	      ipAddress = req.getRemoteAddr();
	      if(ipAddress.equals("127.0.0.1")){
	       //根据网卡取本机配置的IP
	       InetAddress inet=null;
	    try {
	     inet = InetAddress.getLocalHost();
	    } catch (UnknownHostException e) {
	     e.printStackTrace();
	    }
	    ipAddress= inet.getHostAddress();
	      }
	         
	     }

	     //对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
	     if(ipAddress!=null && ipAddress.length()>15){ //"***.***.***.***".length() = 15
	         if(ipAddress.indexOf(",")>0){
	             ipAddress = ipAddress.substring(0,ipAddress.indexOf(","));
	         }
	     }
	     return ipAddress; 
	  }

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig filterConfig) throws ServletException {
		ServletContext context = filterConfig.getServletContext();  
        ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(context);  
        
        UNCHECKURI_PATTERN = Pattern.compile(context.getInitParameter("UNCHECKURI").trim());
	}

}
