package org.demo.service.impl;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.demo.dao.IStudentDao;
import org.demo.dao.ITeacherDao;
import org.demo.dao.IUserDao;
import org.demo.model.*;
import org.demo.service.IUserService;
import org.demo.tool.ObjectJsonValueProcessor;
import org.demo.tool.Page;
import org.demo.tool.UserType;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by jzchen on 2015/1/14.
 */

@Service
public class UserService implements IUserService {


    private IUserDao userDao;
    private IStudentDao studentDao;
    private ITeacherDao teacherDao;
    private SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:dd");

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
    public JSONObject userInfo(HwUser user, UserType userType) {
        /**根据用户类型获取登录学生或者老师的其他个人信息*/
        JSONObject jsonObject;
        if( userType == UserType.STUDENT ) {
            JsonConfig jsonConfig = new JsonConfig();
            jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer", "handler",
                    "hwCourseSelectings", "hwHomeworks", "deleteFlag"});
            jsonConfig.registerJsonValueProcessor(HwMajor.class,
                    new ObjectJsonValueProcessor(new String[]{"name"}, HwMajor.class));
            jsonConfig.registerJsonValueProcessor(HwCollege.class,
                    new ObjectJsonValueProcessor(new String[]{"collegeName"}, HwCollege.class));
            jsonConfig.registerJsonValueProcessor(HwCampus.class,
                    new ObjectJsonValueProcessor(new String[]{"name"},HwCampus.class));
            HwStudent student = studentDao.load(user.getTypeId());
            jsonObject = JSONObject.fromObject(student, jsonConfig);
        } else{
            JsonConfig jsonConfig = new JsonConfig();
            jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer", "handler",
                    "hwHomeworks", "hwCourseTeachings", "deleteFlag"});
            jsonConfig.registerJsonValueProcessor(HwMajor.class,
                    new ObjectJsonValueProcessor(new String[]{"name"}, HwMajor.class));
            jsonConfig.registerJsonValueProcessor(HwCollege.class,
                    new ObjectJsonValueProcessor(new String[]{"collegeName"}, HwCollege.class));
            jsonConfig.registerJsonValueProcessor(HwCampus.class,
                    new ObjectJsonValueProcessor(new String[]{"name"},HwCampus.class));
            HwTeacher teacher = teacherDao.load(user.getTypeId());
            jsonObject = JSONObject.fromObject(teacher,jsonConfig);
        }
        return jsonObject;
    }

    @Override
    public Map userEmail(HwUser user) {
        Map<String,Object> resultMap = new HashMap<String, Object>();
        resultMap.put("username",user.getUsername());
        HwUser newUser = userDao.load(user.getId());
        resultMap.put("email",newUser.getEmail());
        return resultMap;
    }

    @Override
    public JSONObject updatePassword(String oldPassword, String newPassword, HwUser user) {
        JSONObject result = new JSONObject();
        String truePassword = user.getPassword();
        if( oldPassword.equals(truePassword) ) {
            user.setPassword(newPassword);
            userDao.update(user);
            result.put("status","success");
            return result;
        } else {
            result.put("status", "error-oldPassword");
            return result;
        }
    }

    @Override
    public JSONObject updateEmail(String email, HwUser user) {
        return null;
    }

    @Override
    public Page<Map<String,Object>> serachUser(String username, String trueName, String userType) {
        Page<HwUser> userPage = userDao.userList(username, trueName, userType);
        List<HwUser> userList = userPage.getData();
        List<Map<String,Object>> userViewList = new ArrayList<Map<String, Object>>();
        for( HwUser user : userList ){
            Map<String,Object> userView = new HashMap<String, Object>();
            userView.put("userId",user.getId());
            userView.put("username",user.getUsername());
            userView.put("trueName",user.getTrueName());
            userView.put("email",user.getEmail());
            userView.put("mobile",user.getMobile());
            userView.put("userType",user.getUserType());
            userView.put("createUsername",user.getCreateUsername());
            userView.put("createDate",simpleDateFormat.format(user.getCreateDate()));
            userViewList.add(userView);
        }
        Page<Map<String,Object>> page = new Page<Map<String,Object>>();
        page.setData(userViewList);
        page.setPageOffset(userPage.getPageOffset());
        page.setPageSize(userPage.getPageSize());
        page.setTotalRecord(userPage.getTotalRecord());
        return page;
    }

    @Override
    public Map<String, Object> userDetail(Integer userId) {
        HwUser user = userDao.load(userId);
        Map<String, Object> userView = new HashMap<String, Object>();
        userView.put("userId",user.getId());
        userView.put("username",user.getUsername());
        userView.put("trueName",user.getTrueName());
        userView.put("email",user.getEmail());
        userView.put("mobile",user.getMobile());
        userView.put("userType",user.getUserType());
        userView.put("createUsername",user.getCreateUsername());
        userView.put("createDate",simpleDateFormat.format(user.getCreateDate()));
        return userView;
    }

    @Override
    public JSONObject updatePassword(Integer userId, String oldPassword, String newPassword) {
        HwUser user = userDao.load(userId);
        JSONObject jsonObject = new JSONObject();
        if( oldPassword.equals(user.getPassword()) ){
            user.setPassword(newPassword);
            userDao.update(user);
            jsonObject.put("status", "success");
            return jsonObject;
        }else {
            jsonObject.put("status","password_error");
            return jsonObject;
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
