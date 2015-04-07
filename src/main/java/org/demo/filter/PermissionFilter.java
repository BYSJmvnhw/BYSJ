package org.demo.filter;

import net.sf.json.JSONObject;

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
        //转换为基于http协议的servlet{
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        HttpServletResponse response = (HttpServletResponse)servletResponse;

        //获取访问的 url 链接.
        String requestURI = request.getRequestURI().substring(request.getRequestURI().indexOf("/", 1), request.getRequestURI().length());
        System.out.println( "request.getRequestURI  = "+ requestURI);
        //全路径的第一级路径，用于判断是否为 单页面应用的/web 或者 请求资源 的 /resources
        String headOfRequestURI = request.getServletPath().split("/")[1];


        List permissionList = (List)request.getSession().getAttribute("permissionList");

        if( !requestURI.equals("/") &&
                /*不拦截登录页和登录验证url*/
                !requestURI.equals("/login/logincheck") && !requestURI.equals("/web/login") &&
                /*不拦截资源请求*/
                !headOfRequestURI.equals("resources")){
                Boolean flag = false;
                for( Object url : permissionList ) {
                    if ( requestURI.equals(url.toString()) ) {
                        flag = true;
                    }
                }
                if( !flag ) {
                    if( headOfRequestURI.equals("web") ) {
                        response.sendRedirect(request.getContextPath() + "/web/login");
                        return;
                    } else {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.put("status", "no-permission");
                        response.getWriter().print(jsonObject);
                        return;
                    }
                }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    public void destroy() {

    }
}
