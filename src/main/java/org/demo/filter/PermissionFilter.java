package org.demo.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Created by jzchen on 2015/3/21 0021.
 */
public class PermissionFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        HttpServletResponse response = (HttpServletResponse)servletResponse;
        String requestURI = request.getRequestURI().substring(request.getRequestURI().indexOf("/",1), request.getRequestURI().length());
        List<String> urlList = (List<String>)request.getSession().getAttribute("urlList");

        Boolean flag = false;
        for( String url : urlList ) {
            if ( url.equals(requestURI) ) {
                flag = true;
            }
        }
        if( !flag ) {
            response.sendRedirect(request.getContextPath() + "/login/loginInput");
            return;
        }
    }

    @Override
    public void destroy() {

    }
}
