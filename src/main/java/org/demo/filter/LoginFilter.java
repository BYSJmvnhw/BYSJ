package org.demo.filter;

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

        //基于http协议的servlet
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        HttpServletResponse response = (HttpServletResponse)servletResponse;

        //获取访问的 url 链接.
        String requestURI = request.getRequestURI().substring(request.getRequestURI().indexOf("/",1), request.getRequestURI().length());
        String resourceURI = request.getRequestURI().substring(request.getRequestURI().indexOf("/", 1), request.getRequestURI().indexOf("/", 2));
        System.out.println(requestURI);
        System.out.println(resourceURI);

        //请求不为 登录页面以及验证url 则进行检查用session内容,
        // 如果为登录页面就不去检查.
        if( !"/login/loginInput".equals(requestURI) && ! "/login/login".equals(requestURI)
                //不拦截资源请求
                && !"/web/login".equals(requestURI) && "/resources".equals(resourceURI))
        {
            //取得session. 如果没有session则自动会创建一个, 我们用false表示没有取得到session则设置为session为空.
            HttpSession session = request.getSession(false);
            //如果session中没有任何东西.
            if( session == null || session.getAttribute("loginUser")==null)
            {
                response.sendRedirect(request.getContextPath() + "/login/loginInput");
                return;
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
