package org.demo.tool;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by peifeng on 2015/3/20.
 */
public class GetRealPath {
    public static String getRealPath() {
        String realPath = Thread.currentThread().getContextClassLoader().getResource("").toString();
        int i = realPath.lastIndexOf("/WEB-INF/classes/");
        return realPath.substring(6,i);
    }
    public static String getRealPath(HttpServletRequest request) {
        String midRealPath = request.getServletContext().getRealPath("/");
        String realPath = midRealPath.replace('\\','/');
        return realPath.substring(0,realPath.length()-1);
    }
}
