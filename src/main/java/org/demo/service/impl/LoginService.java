package org.demo.service.impl;

import com.sun.org.apache.xpath.internal.operations.Bool;
import org.demo.dao.IStudentDao;
import org.demo.dao.ITeacherDao;
import org.demo.dao.IUserDao;
import org.demo.model.*;
import org.demo.service.ILoginService;
import org.demo.tool.UserType;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Created by jzchen on 2015/3/21 0021.
 */
@Service
public class LoginService implements ILoginService{

    private IUserDao userDao;
    private IStudentDao studentDao;
    private ITeacherDao teacherDao;

    @Override
    public Boolean login(String username, String password, HttpServletRequest request) {
        HwUser user = userDao.findUserByUsername(username);

        if( user != null ) {
            if( user.getPassword().equals( password) ) {

                // 登录用户所能访问的url列表
                List<String> permissionList = new ArrayList<String>();
                //登录用户的角色列表
                List<String> roleList = new ArrayList<String>();
                for(HwRole r : user.getHwRoles() ){
                    roleList.add(r.getRoleName());
                    for(HwPermission p : r.getHwPermissions()) {
                        permissionList.add(p.getUrl());
                        System.out.println(p.getUrl());
                    }
                }

                request.getSession().setAttribute("loginUser", user);
                request.getSession().setAttribute("userType",user.getUserType());
                request.getSession().setAttribute("roleList",roleList);
                request.getSession().setAttribute("permissionList", permissionList);

                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
    }

    public IUserDao getUserDao() {
        return userDao;
    }

    @Resource
    public void setUserDao(IUserDao userDao) {
        this.userDao = userDao;
    }

    public IStudentDao getStudentDao() {
        return studentDao;
    }

    @Resource
    public void setStudentDao(IStudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public ITeacherDao getTeacherDao() {
        return teacherDao;
    }

    @Resource
    public void setTeacherDao(ITeacherDao teacherDao) {
        this.teacherDao = teacherDao;
    }
}
