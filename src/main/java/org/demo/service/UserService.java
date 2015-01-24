package org.demo.service;

import org.demo.dao.IUserDao;
import org.demo.model.HwUser;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.Serializable;

/**
 * Created by jzchen on 2015/1/14.
 */

@Service
public class UserService implements IUserService {


    private IUserDao userDao;

    @Override
    public HwUser load(Serializable id) {
        if( id!= null )
            return  userDao.load(id);
        return null;
    }

    @Override
    public HwUser findUser(String username) {
        String hql = "from HwUser u where u.username = ?";
        return userDao.findWithHql(hql, username);
    }


    public IUserDao getUserDao() {
        return userDao;
    }

    @Resource
    public void setUserDao(IUserDao userDao) {
        this.userDao = userDao;
    }
}
