package org.demo.service.impl;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.demo.dao.*;
import org.demo.model.*;
import org.demo.service.IStudentService;
import org.demo.tool.ObjectJsonValueProcessor;
import org.demo.tool.Page;
import org.demo.tool.UserType;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/1/14.
 */

@Service
public class StudentService implements IStudentService {

    private IStudentDao studentDao;
    private IUserDao userDao;
    private ICollegeDao collegeDao;
    private IMajorDao majorDao;
    private ICourseSelectingDao courseSelectingDao;

    @Override
    public HwStudent findStudent(String studentNo) {
        return studentDao.findStudnetByStudentNo(studentNo);
    }

/*    @Override
    public HwStudent load(Integer id) {
        return studentDao.load(id);
    }*/

    @Override
    public void updateStudnetAndUser(String json) {
        JSONObject jsonObject = JSONObject.fromObject(json);
        HwStudent student = studentDao.load(jsonObject.getInt("id"));
        student.setStudentNo(jsonObject.getString("studentNo"));
        student.setName(jsonObject.getString("name"));
        student.setSex(jsonObject.getString("sex"));
        student.setClass_(jsonObject.getString("cla"));
        student.setGrade(jsonObject.getString("grade"));
        student.setHwCollege(collegeDao.load(jsonObject.getInt("collegeId")));
        student.setHwMajor(majorDao.load(jsonObject.getInt("majorId")));
        studentDao.update(student);
        HwUser user = userDao.findUserByTypeId(jsonObject.getInt("id"));
        user.setUsername(jsonObject.getString("studentNo"));
        user.setTrueName(jsonObject.getString("name"));
        userDao.update(user);
    }

    @Override
    public void deleteStudnetAndUser(Integer id) {
        HwStudent student = studentDao.load(id);
        student.setDeleteFlag(true);
        studentDao.update(student);
        HwUser user =userDao.findUserByTypeId(id);
        user.setDeleteFlag(true);
        userDao.update(user);
    }

    @Override
    public void addStrdentAndUser(JSONObject jo, HwUser createUser) {
        HwStudent student;
        HwStudent st = studentDao.findDeleteStudnet(jo.getString("studentNo"));
        if( st != null ) {
            student = st;
        }else {
            student = new HwStudent();
        }
        student.setStudentNo(jo.getString("studentNo"));
        student.setName(jo.getString("name"));
        student.setSex(jo.getString("sex"));
        student.setClass_(jo.getString("cla"));
        //student.setEmail(jo.getString("email"));
        student.setGrade(jo.getString("grade"));
        student.setHwCollege(collegeDao.load(jo.getInt("collegeId")));
        student.setHwMajor(majorDao.load(jo.getInt("majorId")));
        student.setDeleteFlag(false);
        if( st != null ) {
            studentDao.update(student);
        }else {
            studentDao.add(student);
        }

        HwUser user;
        if( st != null ) {
            user = userDao.findUserByTypeId(st.getId());
        }else {
            user = new HwUser();
        }
        user.setUsername(jo.getString("studentNo"));
        user.setPassword(jo.getString("studentNo"));
        user.setTrueName(jo.getString("name"));
        user.setCreateDate(new java.sql.Timestamp(System.currentTimeMillis()));
        user.setUserType(UserType.STUDENT);
        user.setTypeId(student.getId());
        user.setCreateId(createUser.getId());
        user.setCreateUsername(createUser.getUsername());
        user.setDeleteFlag(false);
        if( st != null ) {
            userDao.update(user);
        }else {
            userDao.add(user);
        }

    }

    @Override
    public JSONObject studentPageByCTId(Integer courseTeachingId) {
        Page cs = courseSelectingDao.courseSelectingPage(courseTeachingId);
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer", "handler"/*"hwCourseTeaching",*//*",hwStudent"*/});
        jsonConfig.registerJsonValueProcessor(HwStudent.class,
                new ObjectJsonValueProcessor(new  String[] {"id","studentNo","name"},
                        HwStudent.class));
        jsonConfig.registerJsonValueProcessor(HwCourseTeaching.class,
                new ObjectJsonValueProcessor(new  String[] {"id"},
                        HwCourseTeaching.class));
        return JSONObject.fromObject(cs, jsonConfig);
    }

    @Override
    public JSONObject studentDetail(Integer id) {
        HwStudent student = studentDao.load(id);
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer", "handler",
                "hwCourseSelectings","hwHomeworks","deleteFlag"});
        jsonConfig.registerJsonValueProcessor(HwMajor.class,
                new ObjectJsonValueProcessor(new String[]{"id","name"}, HwMajor.class));
        jsonConfig.registerJsonValueProcessor(HwCollege.class,
                new ObjectJsonValueProcessor(new String[]{"id","collegeName"},HwCollege.class));
        return JSONObject.fromObject(student, jsonConfig);
    }

    @Override
    public JSONObject addCourseSelecting(String json) {
        JSONArray jsonArray = JSONArray.fromObject(json);
        System.out.println(jsonArray.toString());
        for( Object o : jsonArray ) {
            JSONObject jsonObject = (JSONObject)o;
            System.out.println(jsonObject.getInt("cid"));
            System.out.println(jsonObject.getInt("tid"));
            HwCourseSelecting cs = new HwCourseSelecting();
            cs.setHwStudent(studentDao.load(jsonObject.getInt("sid")));
//            cs.setHwCourseTeaching();
        }

        return null;
    }

    @Override
    public JSONObject studentPage(Integer campusId, Integer collegeId, Integer majorId, String studentNo, String name) {
        Page page =  studentDao.searchStudent(campusId, collegeId, majorId, studentNo, name);
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer", "handler","hwCourseSelectings","hwHomeworks","deleteFlag"});
        jsonConfig.registerJsonValueProcessor(HwCampus.class,
                new ObjectJsonValueProcessor(new  String[] {"id","name"},
                        HwCampus.class));
        jsonConfig.registerJsonValueProcessor(HwCollege.class,
                new ObjectJsonValueProcessor(new  String[] {"id","collegeName"},
                        HwCollege.class));
        jsonConfig.registerJsonValueProcessor(HwMajor.class,
                new ObjectJsonValueProcessor(new  String[] {"id","name"},
                        HwMajor.class));
        return JSONObject.fromObject(page, jsonConfig);
    }

    public IStudentDao getStudentDao() {
        return studentDao;
    }
    @Resource
    public void setStudentDao(IStudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public IUserDao getUserDao() {
        return userDao;
    }

    @Resource
    public void setUserDao(IUserDao userDao) {
        this.userDao = userDao;
    }

    public ICollegeDao getCollegeDao() {

        return collegeDao;
    }

    @Resource
    public void setCollegeDao(ICollegeDao collegeDao) {
        this.collegeDao = collegeDao;
    }

    public IMajorDao getMajorDao() {
        return majorDao;
    }

    @Resource
    public void setMajorDao(IMajorDao majorDao) {
        this.majorDao = majorDao;
    }

    public ICourseSelectingDao getCourseSelectingDao() {
        return courseSelectingDao;
    }

    @Resource
    public void setCourseSelectingDao(ICourseSelectingDao courseSelectingDao) {
        this.courseSelectingDao = courseSelectingDao;
    }
}
