package org.demo.service;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by jzchen on 2015/3/21 0021.
 */
public interface ILoginService {
    public Boolean login(String username, String password, HttpServletRequest request);
}
