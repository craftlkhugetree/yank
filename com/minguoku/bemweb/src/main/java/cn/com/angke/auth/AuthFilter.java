package cn.com.angke.auth;

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
//		res.addHeader("Access-Control-Allow-Origin", "*");
/*		StringBuffer reqURL = req.getRequestURL();
		System.out.println("reqURL:" + reqURL);
		String reqURI = req.getRequestURI();
		System.out.println("reqURI:" + reqURI);
		if (this.UNCHECKURI_PATTERN.matcher(reqURI).matches()) {
		      chain.doFilter(req, res);
		      return;
		}
		String[] uris = reqURI.split("rest/");
		if(uris.length!=2){
			ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1010").toJSONString());
			return;
		}
		String interfaceUrl = uris[1];
		System.out.println("interfaceUrl:" + interfaceUrl);
		
		String data = req.getParameter("auth");
		if(StringUtils.isBlank(data)){
			ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1011").toJSONString());
			return;
		}
		System.out.println("auth:"+data);
		JSONObject param = JSONObject.parseObject(data);
		String product = param.getString("product");
		if(StringUtils.isBlank(product)){
			ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1002").toJSONString());
			return;
		}
		JSONObject businessSystem = businessSystemDao.viewById(product).getJSONObject("item");
		if(businessSystem == null
				|| businessSystem.getString("ISDELETE").equals("1")
				|| !businessSystem.getString("ISUSE").equals("1")){
			ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1002").toJSONString());
			return;
		}
		
		String authType = businessSystem.getString("AUTHTYPE");
		String authKey = businessSystem.getString("AUTHKEY");
		String authIp = businessSystem.getString("AUTHIP");
		if(StringUtils.isBlank(authType)
				|| (authType.equals("TK") && StringUtils.isBlank(authKey))
				|| (authType.equals("IP") && StringUtils.isBlank(authIp))){
			ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1003").toJSONString());
			return;
		}
		
		if(authType.equals("TK")){
			String timestamp = param.getString("timestamp");
			String tokenYou = param.getString("token");
			System.out.println("product:" + product);
			System.out.println("timestamp:" + timestamp);
			if(StringUtils.isBlank(timestamp) 
					|| StringUtils.isBlank(tokenYou)){
				ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1005").toJSONString());
				return;
			}
			System.out.println("authKey:" + authKey);
			System.out.println("tokenYou:" + tokenYou);
			String tokenMe = "";
			try {
				tokenMe = MD5Util.MD5Encode(authKey+product+timestamp);
			} catch (NoSuchAlgorithmException e) {
				ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1006").toJSONString());
				return;
			}
			System.out.println("tokenMe:" + tokenMe);
			if(!tokenYou.equals(tokenMe)){
				ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1006").toJSONString());
				return;
			}
			if(!businessSystemDao.checkSystemPermitInterface(product, interfaceUrl)){
				ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1007").toJSONString());
				return;
			}
			String publicid = param.getString("publicid");
			System.out.println("publicid:" + publicid);
			String userid = param.getString("userid");
			System.out.println("userid:" + userid);
			if(StringUtils.isNotBlank(publicid)){
				if(!businessSystemDao.checkSystemPermitPublic(product, publicid)){
					ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1008").toJSONString());
					return;
				}
			}
			long now = System.currentTimeMillis()/1000;
			System.out.println("now:"+now);
			if(now-Long.parseLong(timestamp) > 5 * 60 * 1000){
				ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1009").toJSONString());
				return;
			}
		}else if(authType.equals("IP")){
			String ipAddress = getIpAddr(req);
			if(!ipAddress.contains(authIp)){
				ActionHelp.returnResponse(req, res, ResponseUtil.convertErrMsg("1004").toJSONString());
				return;
			}
		}*/

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
        
        this.UNCHECKURI_PATTERN = Pattern.compile(context.getInitParameter("UNCHECKURI").trim());
	}

}
