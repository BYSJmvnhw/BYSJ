package org.demo.filter;

import net.sf.json.JSONObject;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Created by jzchen on 2015/3/16 0016.
 */
public class LoginFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {

        //转换为基于http协议的servlet{
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        HttpServletResponse response = (HttpServletResponse)servletResponse;

        //获取访问的 url 链接.
        String requestURI = request.getRequestURI().substring(request.getRequestURI().indexOf("/",1), request.getRequestURI().length());
        //貌似这是请求解析后的链接
        //String requestURI = request.getServletPath();
        System.out.println("requestURI = " + requestURI);
        //全路径的第一级路径，用于判断是否为 单页面应用的/web 或者 请求资源 的 /resources
        String headOfRequestURI = request.getServletPath().split("/")[1];
        //System.out.println("headOfRequestURI  = " + headOfRequestURI);

        /**
         * 请求不为 登录页面以及验证登录需要跳转的url 则检查session内容
         **/
        /*不拦截首页，由index.jsp执行跳转*/
        if( !requestURI.equals("/") &&
                /*不拦截登录页和登录验证url*/
                !requestURI.equals("/login/logincheck") && !requestURI.equals("/web/login") &&
                /*不拦截资源请求*/
                !headOfRequestURI.equals("resources"))
        {
            //取得session. 如果没有session则自动会创建一个, 我们用false表示没有取得到session则设置为session为空.
            HttpSession session = request.getSession(false);
            //如果session中没有任何东西
            if( session == null || session.getAttribute("loginUser")==null)
            {
                //若为单页面应用普通的url请求，则直接重定向
                if( headOfRequestURI.equals("web") ) {
                    response.sendRedirect(request.getContextPath() + "/web/login");
                    return;
                }else {
                    //若为Ajax请求，则返回 timeout，由凯客户端执行重定向
                    //response.setContentType("application/json");
                    JSONObject result = new JSONObject();
                    result.put("status","timeout");
                    response.getWriter().print(result);
                    return;
                }
            }

        }
        //session中的内容等于登录页面, 则可以继续访问其他区资源.
        /**继续执行*/
        filterChain.doFilter(request,response);
    }

    @Override
    public void destroy() {

    }
}
