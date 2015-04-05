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

        //转换为基于http协议的servlet
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        HttpServletResponse response = (HttpServletResponse)servletResponse;

        //获取访问的 url 链接.
        String requestURI = request.getRequestURI().substring(request.getRequestURI().indexOf("/",1), request.getRequestURI().length());
        String resourceURI = "";
        String singlePageURI = "";
        //若链接长度大于10，则截取20个字符的子串
        if( request.getRequestURI().length() - request.getRequestURI().indexOf("/",1) > 10 ) {
            resourceURI = request.getRequestURI().substring( request.getRequestURI().indexOf("/", 1),
                    request.getRequestURI().indexOf( "/", 1)+ 10  );
        }
        if( request.getRequestURI().length() - request.getRequestURI().indexOf("/",1) > 4 ) {
            singlePageURI = request.getRequestURI().substring( request.getRequestURI().indexOf("/", 1),
                    request.getRequestURI().indexOf( "/", 1)+4  );
        }
        //String onePageAppURI =  request.getRequestURI().substring(request.getRequestURI().indexOf("/", 1),
         //       request.getRequestURI().indexOf("/", 1) + 4);

        System.out.println(requestURI);
        System.out.println(resourceURI);

        /**
         * 请求不为 登录页面以及验证登录需要跳转的url 则检查session内容
         **/
        if( !"/login/loginInput".equals(requestURI) && ! "/login/login".equals(requestURI) && !requestURI.equals("/login/logincheck")
                //不拦截资源请求
                && !requestURI.equals("/web/login") && /* !onePageAppURI .equals("/web") && */!resourceURI.equals("/resources"))
        {
            //取得session. 如果没有session则自动会创建一个, 我们用false表示没有取得到session则设置为session为空.
            HttpSession session = request.getSession(false);
            //如果session中没有任何东西
            if( session == null || session.getAttribute("loginUser")==null)
            {
                if( singlePageURI.equals("/web") ) {
                    response.sendRedirect(request.getContextPath() + "/web/login");
                    return;
                }else {
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
