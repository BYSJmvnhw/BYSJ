package org.demo.service.impl;

import net.sf.json.JSONObject;
import org.demo.dao.*;
import org.demo.model.HwCourse;
import org.demo.model.HwCourseTeaching;
import org.demo.model.HwTeacher;
import org.demo.model.HwUser;
import org.demo.tool.Page;
import org.demo.tool.UserType;
import org.demo.service.ITeacherService;
import org.demo.vo.ViewTeacher;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.*;

/**
 * Created by jzchen on 2015/1/25.
 */
@Service
public class TeacherService implements ITeacherService {

    private ITeacherDao teacherDao;
    @Resource
    public void setTeacherDao(ITeacherDao teacherDao) {
        this.teacherDao = teacherDao;
    }
    private IUserDao userDao;
    @Resource
    public void setUserDao(IUserDao userDao) {
        this.userDao = userDao;
    }
    private ICollegeDao collegeDao;
    @Resource
    public void setCollegeDao(ICollegeDao collegeDao) {
        this.collegeDao = collegeDao;
    }
    private IMajorDao majorDao;
    @Resource
    public void setMajorDao(IMajorDao majorDao) {
        this.majorDao = majorDao;
    }
    private ICampusDao campusDao;
    @Resource
    public void setCampusDao(ICampusDao campusDao) {
        this.campusDao = campusDao;
    }
    private ICourseTeachingDao courseTeachingDao;
    @Resource
    public void setCourseTeachingDao(ICourseTeachingDao courseTeachingDao) {
        this.courseTeachingDao = courseTeachingDao;
    }
    private ICourseDao courseDao;
    @Resource
    public void setCourseDao(ICourseDao courseDao) {
        this.courseDao = courseDao;
    }

    @Override
    public boolean addTeacher(JSONObject jo,HwUser createUser) {
        if(createUser == null) {
            return false;
        }
        String teacherNo = jo.getString("teacherNo");
        String trueName = jo.getString("trueName");
        String sex = jo.getString("sex");
        String email = jo.getString("email");
        String mobile = jo.getString("mobile");
        int collegeId = jo.getInt("collegeId");
        int campusId = jo.getInt("campusId");
        int majorId = jo.getInt("majorId");
        if(collegeId == 0 || campusId == 0 || majorId==0 || teacherNo == null || teacherNo.isEmpty() || trueName == null || trueName.isEmpty()){
            return false;
        }
        //先添加教师
        HwTeacher teacher;
        HwTeacher t = teacherDao.findDeletedTeacher(teacherNo);
        if(t != null) {
            teacher = t;
        }else {
            teacher = new HwTeacher();
        }
        teacher.setTeacherNo(teacherNo);
        teacher.setName(trueName);
        teacher.setSex(sex);
        teacher.setEmail(email);
        teacher.setHwCollege(collegeDao.get(collegeId));
        teacher.setHwCampus(campusDao.get(campusId));
        teacher.setHwMajor(majorDao.get(majorId));
        teacher.setDeleteFlag(false);
        if(t != null) {
            teacherDao.update(teacher);
        }else {
            teacherDao.add(teacher);
        }
        //再添加用户
        HwUser user;
        if( t != null ) {
            user = userDao.findUserByTypeId(t.getId());
        }else {
            user = new HwUser();
        }
        user.setUsername(teacherNo);  //用户名与教师号相同
        user.setPassword(teacherNo);  //默认密码与用户名相同
        user.setTrueName(trueName);
        user.setMobile(mobile);
        user.setCreateId(createUser.getId());
        user.setCreateUsername(createUser.getUsername());
        user.setCreateDate(new Timestamp(new Date().getTime()));
        user.setTypeId(teacher.getId());
        user.setUserType(UserType.TEACHER);
        user.setDeleteFlag(false);
        if( t != null ) {
            userDao.update(user);
        }else {
            userDao.add(user);
        }
        return true;
    }
    @Override
    public boolean updateTeacher(JSONObject jo){
        int teacherId = jo.getInt("teacherId");
        int userId = jo.getInt("userId");
        String teacherNo = jo.getString("teacherNo");
        if(teacherId==0 || userId==0 ||  teacherNo==null || teacherNo.isEmpty()) {
            return false;
        }
        HwTeacher oldTeacher = teacherDao.get(teacherId);
        oldTeacher.setTeacherNo(teacherNo);
        oldTeacher.setName(jo.getString("trueName"));
        oldTeacher.setSex(jo.getString("sex"));
        oldTeacher.setEmail(jo.getString("email"));
        oldTeacher.setHwCollege(collegeDao.get(jo.getInt("collegeId")));
        oldTeacher.setHwCampus(campusDao.get(jo.getInt("campusId")));
        oldTeacher.setHwMajor(majorDao.get(jo.getInt("majorId")));

        HwUser oldUser = userDao.get(userId);
        oldUser.setTrueName(jo.getString("trueName"));
        oldUser.setUsername(teacherNo);
        oldUser.setMobile(jo.getString("mobile"));

        teacherDao.update(oldTeacher);
        userDao.update(oldUser);

        return true;
    }
    @Override
    public boolean deleteTeacher(int tid) {
        HwTeacher teacher = load(tid);
        if(teacher == null) {
            return false;
        }
        teacher.setDeleteFlag(true);
        HwUser user = userDao.findUser(UserType.TEACHER, tid);
        if(user == null) {
            return false;
        }
        user.setDeleteFlag(true);
        teacherDao.update(teacher);
        userDao.update(user);
        return true;
    }
    @Override
    public HwTeacher load(Integer id) {
        return teacherDao.load(id);
    }
    @Override
    public Page<ViewTeacher> searchTeacher(Integer campusId, Integer collegeId, Integer majorId, String teacherNo, String name) {
        return teacherDao.searchTeacher(campusId,collegeId,majorId,teacherNo,name);
    }
    @Override
    public List<Map<String,Object>> courseByTeacher(int tid,int starYear,int schoolTerm) {
        List<HwCourse> courses = courseTeachingDao.getCourses(tid,starYear,schoolTerm);
        if(courses == null)return null;
        Map<String,Object> map;
        List<Map<String,Object>> middleResult = new ArrayList<Map<String, Object>>();
        for(HwCourse course : courses) {
            map = new HashMap<String, Object>();
            map.put("collegeName",course.getHwCollege().getCollegeName());
            map.put("courseNo",course.getCourseNo());
            map.put("courseName",course.getCourseName());
            middleResult.add(map);
        }
        return middleResult;
    }
    @Override
    public void addTeacherSelectCourse(int tid,int[] cids,int startYear,int schoolTerm){
        HwTeacher teacher = teacherDao.load(tid);
        for(int i = 0;i < cids.length;i++) {
            HwCourseTeaching ct = new HwCourseTeaching();
            HwCourse course = courseDao.load(cids[i]);
            ct.setHwCourse(course);
            ct.setHwTeacher(teacher);
            ct.setStartYear(startYear);
            ct.setSchoolTerm(schoolTerm);
            courseTeachingDao.add(ct);
        }
    }
    @Override
    public JSONObject getTeacher(int tid)
    {
        HwTeacher teacher = teacherDao.get(tid);
        JSONObject jsonresult = new JSONObject();
        jsonresult.clear();
        jsonresult.put("teacherId",teacher.getId());
        HwUser user = userDao.findUser(UserType.TEACHER,teacher.getId());
        jsonresult.put("userId",user.getId());
        jsonresult.put("teacherNo",teacher.getTeacherNo());
        jsonresult.put("trueName",teacher.getName());
        jsonresult.put("sex",teacher.getSex());
        jsonresult.put("email",teacher.getEmail());
        jsonresult.put("mobile",user.getMobile());
        jsonresult.put("campusId",teacher.getHwCampus().getId());
        jsonresult.put("campusName",teacher.getHwCampus().getName());
        jsonresult.put("collegeId",teacher.getHwCollege().getId());
        jsonresult.put("collegeName",teacher.getHwCollege().getCollegeName());
        jsonresult.put("majorId",teacher.getHwMajor().getId());
        jsonresult.put("majorName",teacher.getHwMajor().getName());
        return jsonresult;
    }
}
