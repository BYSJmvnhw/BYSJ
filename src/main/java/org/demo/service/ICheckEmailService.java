package org.demo.service;

import net.sf.json.JSONObject;

/**
 * Created by peifeng on 2015/3/19.
 */
public interface ICheckEmailService {
    public JSONObject findEmailExist(String email);
    public JSONObject findCheck(String email,String checkNumber);
}
