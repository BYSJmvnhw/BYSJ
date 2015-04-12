package org.demo.dao;

import org.demo.model.HwUser;
import org.demo.tool.Page;

import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */
public interface IUserDao extends IBaseDao<HwUser> {

    public HwUser findUserByTypeId(Integer typeId);

    public HwUser findUserByUsername(String username);

    public Page<HwUser> userList(String username, String trueName, String userType);
}
