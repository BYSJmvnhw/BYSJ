package org.demo.service.impl;

import org.demo.dao.IRoleDao;
import org.demo.model.HwRole;
import org.demo.service.IRoleService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.Serializable;

/**
 * Created by jzchen on 2015/1/26.
 */
@Service
public class RoleService implements IRoleService {

    private IRoleDao roleDao;
    @Override
    public HwRole load(Serializable id) {
        return roleDao.load(id);
    }

    public IRoleDao getRoleDao() {
        return roleDao;
    }
    @Resource
    public void setRoleDao(IRoleDao roleDao) {
        this.roleDao = roleDao;
    }
}
