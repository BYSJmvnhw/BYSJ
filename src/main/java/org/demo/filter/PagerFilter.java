package org.demo.filter;

import org.demo.model.SystemContext;

import javax.servlet.*;
import java.io.IOException;

/**
 * Created by jzchen on 2015/1/26.
 */
public class PagerFilter implements Filter{
    private int pageSize = 0;
    private int pageOffset = 0;

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        try {
            try {
                pageOffset = Integer.parseInt(request.getParameter("page.pageOffset"));
            } catch (NumberFormatException e) {
                SystemContext.setPageOffset(pageOffset);
                SystemContext.setPageSize(pageSize);

            }
        } finally {
            chain.doFilter(request, response);
            SystemContext.removePageOffset();
            SystemContext.removePageSize();
        }

    }

    @Override
    public void init(FilterConfig cfg) throws ServletException {
        try {
            /*  从applicationContext.xml 配置文件中读取初始化参数 */
            pageSize = Integer.parseInt(cfg.getInitParameter("pageSize"));
        } catch (NumberFormatException e) {
            /*  数组格式化异常设置默认值 */
            pageSize = 10;
        }
    }
}
