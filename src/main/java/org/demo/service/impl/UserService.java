package org.demo.service.impl;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.demo.dao.IStudentDao;
import org.demo.dao.ITeacherDao;
import org.demo.dao.IUserDao;
import org.demo.model.HwUser;
import org.demo.service.IUserService;
import org.demo.tool.UserType;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.Serializable;

/**
 * Created by jzchen on 2015/1/14.
 */

@Service
public class UserService implements IUserService {


    private IUserDao userDao;
    private IStudentDao studentDao;
    private ITeacherDao teacherDao;

    @Override
    public JSONObject load(Serializable id) {
        HwUser user = userDao.load(id);
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer",
                "handler","createId","createUsername","createDate","typeId","hwRoles","deleteFlag"});
        return JSONObject.fromObject(user, jsonConfig);
    }

    @Override
    public HwUser findUser(String username) {
        String hql = "from HwUser u where u.username = ?";
        return userDao.findObject(hql, username);
    }

    @Override
    public void addUser(String json) {
        //????
    }

    @Override
    public void deleteUser(Integer id) {

        HwUser user = userDao.load(id);
        user.setDeleteFlag(true);
        userDao.update(user);
    }

    @Override
    public void updateUser(String json) {
        JSONObject jsonObject  = JSONObject.fromObject(json);
        HwUser user = userDao.load(jsonObject.getInt("id"));
        user.setPassword(jsonObject.getString("password"));
        user.setMobile(jsonObject.getString("mobile"));
        user.setEmail(jsonObject.getString("email"));
        userDao.update(user);
    }

    @Override
    public Object userInfo(Integer typeId, UserType userType) {
        if( userType == UserType.STUDENT ) {
            return studentDao.load(typeId);
        } else {
            return teacherDao.load(typeId);
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
