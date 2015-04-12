package org.demo.service;

import net.sf.json.JSONObject;
import org.demo.model.HwUser;
import org.demo.tool.Page;
import org.demo.tool.UserType;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * Created by jzchen on 2015/1/14.
 */
public interface IUserService {

    public JSONObject load(Serializable id);

    public HwUser findUser(String username);

    public void addUser(String json);

    public void deleteUser(Integer id);

    public void updateUser(String json);

    public JSONObject userInfo(HwUser user,UserType userType);

    public Map userEmail(HwUser user);

    public JSONObject updatePassword(String oldPassword, String newPassword, HwUser user);

    public JSONObject updateEmail(String email, HwUser user);

    public Page<Map<String,Object>> serachUser(String username, String trueName, String userType);

    public Map<String,Object> userDetail(Integer userId);

    public JSONObject updatePassword(Integer userId, String oldPassword, String newPassword);

}
