package cn.com.angke.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

/**
 * 防止xss攻击 过滤器（顺便过滤了 sql攻击）
 * 
 * @date 上午9:58:58
 * @author DuChaoWei
 * @descripte
 */
public class XSSFilter implements Filter {

	@Override
	public void init(FilterConfig arg0) throws ServletException {

	}

	@Override
	public void destroy() {

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {

		chain.doFilter(new XSSRequestWrapper((HttpServletRequest) request), response);

	}

}