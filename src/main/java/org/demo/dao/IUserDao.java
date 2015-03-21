package org.demo.dao;

import org.demo.model.HwUser;

/**
 * Created by jzchen on 2015/1/13.
 */
public interface IUserDao extends IBaseDao<HwUser> {

    public HwUser findUserByTypeId(Integer typeId);

    public HwUser findUserByUsername(String username);
}
