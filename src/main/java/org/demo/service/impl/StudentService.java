package org.demo.service.impl;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.demo.dao.*;
import org.demo.model.*;
import org.demo.service.IStudentService;
import org.demo.tool.HomeworkStatus;
import org.demo.tool.ObjectJsonValueProcessor;
import org.demo.tool.Page;
import org.demo.tool.UserType;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Set;

/**
 * Created by jzchen on 2015/1/14.
 */

@Service
public class StudentService implements IStudentService {

    private IStudentDao studentDao;
    private IUserDao userDao;
    private ICampusDao campusDao;
    private ICollegeDao collegeDao;
    private IMajorDao majorDao;
    private ICourseSelectingDao courseSelectingDao;
    private ICourseTeachingDao courseTeachingDao;
    private IHomeworkInfoDao homeworkInfoDao;
    private IHomeworkDao homeworkDao;

    //根据学号查找学生
    @Override
    public HwStudent findStudent(String studentNo) {
        return studentDao.findStudnetByStudentNo(studentNo);
    }

    //根据id查找学生
    @Override
    public HwStudent load(Integer id) {
        return studentDao.load(id);
    }

    //管理员功能
    // 根据前端传递的json字符串数据更新学生已经对应的用户的信息
    @Override
    public void updateStudnetAndUser(String json) {
        JSONObject jsonObject = JSONObject.fromObject(json);
        HwStudent student = studentDao.load(jsonObject.getInt("id"));
        //student.setStudentNo(jsonObject.getString("studentNo"));
        student.setName(jsonObject.getString("name"));
        student.setSex(jsonObject.getString("sex"));
        student.setEmail(jsonObject.getString("email"));
        student.setClass_(jsonObject.getString("cla"));
        student.setGrade(jsonObject.getString("grade"));
        student.setHwCampus(campusDao.load(jsonObject.getInt("campusId")));
        student.setHwCollege(collegeDao.load(jsonObject.getInt("collegeId")));
        student.setHwMajor(majorDao.load(jsonObject.getInt("majorId")));
        studentDao.update(student);
        HwUser user = userDao.findUserByTypeId(jsonObject.getInt("id"));
       // user.setUsername(jsonObject.getString("studentNo"));
        //user.setPassword(jsonObject.getString("password"));
        user.setTrueName(jsonObject.getString("name"));
        user.setEmail(jsonObject.getString("email"));
        userDao.update(user);
    }

    //管理员
    //根据id对学生和对应的用户标记为删除
    @Override
    public void deleteStudnetAndUser(Integer id) {
        HwStudent student = studentDao.load(id);
        student.setDeleteFlag(true);
        studentDao.update(student);
        HwUser user =userDao.findUserByTypeId(id);
        user.setDeleteFlag(true);
        userDao.update(user);
    }

    //管理员
    //根据前端传递的json字符串数据新建学生和对应的用户，
    // 或恢复被标记删除的学生和对应的用户记录
    @Override
    public JSONObject addStrdentAndUser(JSONObject jo, HwUser createUser) {
        HwStudent st = this.findStudent(jo.getString("studentNo"));
        JSONObject result = new JSONObject();
        if( st != null) {
            result.put("status","existing");
            //result.put("msg","student-exists");
            return result;
        }
        //声明一个学生
        HwStudent student;
        //查看该学号对应的学生是否被标记删除，是则使用该记录，否则新建学生对象
        HwStudent deleteStudnet = studentDao.findDeleteStudnet(jo.getString("studentNo"));
        if( deleteStudnet != null ) {
            student = deleteStudnet;
        }else {
            student = new HwStudent();
        }
        student.setStudentNo(jo.getString("studentNo"));
        student.setName(jo.getString("name"));
        student.setSex(jo.getString("sex"));
        student.setGrade(jo.getString("grade"));
        student.setClass_(jo.getString("cla"));
        student.setEmail(jo.getString("email"));
        student.setHwCampus(campusDao.load(jo.getInt("campusId")));
        student.setHwCollege(collegeDao.load(jo.getInt("collegeId")));
        student.setHwMajor(majorDao.load(jo.getInt("majorId")));
        student.setDeleteFlag(false);
        if( deleteStudnet != null ) {
            studentDao.update(student);
        }else {
            studentDao.add(student);
        }

        //添加学生对应的用户
        HwUser user;
        if( deleteStudnet != null ) {
            user = userDao.findUserByTypeId(deleteStudnet.getId());
        }else {
            user = new HwUser();
        }
        user.setUsername(jo.getString("studentNo"));
        user.setPassword(jo.getString("studentNo"));
        user.setTrueName(jo.getString("name"));
        user.setEmail(jo.getString("email"));
        user.setCreateDate(new java.sql.Timestamp(System.currentTimeMillis()));
        user.setUserType(UserType.STUDENT);
        user.setTypeId(student.getId());
        user.setCreateId(createUser.getId());
        user.setCreateUsername(createUser.getUsername());
        user.setDeleteFlag(false);
        if( deleteStudnet != null ) {
            userDao.update(user);
        }else {
            userDao.add(user);
        }
        result.clear();
        result.put("status","success");
        return result;
    }

    //根据授课id查询学生分页
    @Override
    public JSONObject studentPageByCTId(Integer courseTeachingId) {
        Page cs = courseSelectingDao.courseSelectingPage(courseTeachingId);
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer", "handler","id"});
        jsonConfig.registerJsonValueProcessor(HwStudent.class,
                new ObjectJsonValueProcessor(new  String[] {"id","studentNo","name"},
                        HwStudent.class));
        jsonConfig.registerJsonValueProcessor(HwCourseTeaching.class,
                new ObjectJsonValueProcessor(new  String[] {"id"},
                        HwCourseTeaching.class));
        return JSONObject.fromObject(cs, jsonConfig);
    }

    //根据id查询学生信息详细
    @Override
    public JSONObject studentDetail(Integer id) {
        HwStudent student = studentDao.load(id);
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[]{"hibernateLazyInitializer", "handler",
                "hwCourseSelectings","hwHomeworks","deleteFlag"});
        jsonConfig.registerJsonValueProcessor(HwCampus.class,
                new ObjectJsonValueProcessor(new String[]{"id","name"}, HwCampus.class));
        jsonConfig.registerJsonValueProcessor(HwCollege.class,
                new ObjectJsonValueProcessor(new String[]{"id","collegeName"},HwCollege.class));
        jsonConfig.registerJsonValueProcessor(HwMajor.class,
                new ObjectJsonValueProcessor(new String[]{"id","name"},HwMajor.class));
        return JSONObject.fromObject(student, jsonConfig);
    }

    //管理员
    //根据学生id 和 授课id数组，为该学生增加一个或多个选课关系
    @Override
    public void addCourseSelecting(Integer sId, Integer[] ctId) {
        HwStudent student = studentDao.load(sId);
        for( Integer ctid : ctId ) {
            HwCourseTeaching ct = courseTeachingDao.load(ctid);
            HwCourseSelecting cs = courseSelectingDao.findCSByCTAndStudent(ct, student);
            if( cs == null ){
                HwCourseSelecting courseSelecting = new HwCourseSelecting();
                courseSelecting.setHwStudent(student);
                courseSelecting.setHwCourseTeaching(ct);
                courseSelectingDao.add(courseSelecting);

                //为该学生初始化补选的课程所有已布置的作业。
                Set<HwHomeworkInfo>  homeworkInfos = ct.getHwHomeworkInfos();
                for( HwHomeworkInfo hwInfo : homeworkInfos ){
                    HwHomework hw = new HwHomework();
                    hw.setHwStudent(student);
                    hw.setHwCourse(ct.getHwCourse());
                    hw.setCheckedFlag(false);
                    hw.setHwHomeworkInfo(hwInfo);
                    hw.setHwTeacher(ct.getHwTeacher());
                    hw.setStudentName(student.getName());
                    hw.setStudentNo(student.getStudentNo());
                    hw.setTitle(hwInfo.getTitle());
                    hw.setLastModifyDate(new java.sql.Timestamp(System.currentTimeMillis()));
                    hw.setMarkType(hwInfo.getMarkType());
                    hw.setUrl("");
                    hw.setStatus(HomeworkStatus.UNSUBMITTED);
                    homeworkDao.add(hw);
                }
            }
        }
    }

    //搜索学生分页
    @Override
    public JSONObject searchStudent(Integer campusId, Integer collegeId, Integer majorId, String studentNo, String name, String grade) {
        Page page =  studentDao.searchStudent(campusId, collegeId, majorId, studentNo, name, grade);
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

    //教师
    //根据授课id和学生id数组，为某课程增加学生的选课关系
    @Override
    public void addStudent(Integer ctId, Integer[] sIdArray) {
        HwCourseTeaching ct = courseTeachingDao.load(ctId);
        for( Integer sid : sIdArray){
            //查询是否已经存在该选课关系
            HwCourseSelecting cs = courseSelectingDao.findCSByCTAndStudent(ct, studentDao.load(sid));
            if( cs == null ) {
                //若不存在该选课关系则增加
                HwCourseSelecting courseSelecting = new HwCourseSelecting();
                courseSelecting.setHwCourseTeaching(ct);
                HwStudent student = studentDao.load(sid);
                courseSelecting.setHwStudent(student);
                courseSelectingDao.add(courseSelecting);

                //为每个补选课的学生初始化该课程所有已布置的作业。
                Set<HwHomeworkInfo>  homeworkInfos = ct.getHwHomeworkInfos();
                for( HwHomeworkInfo hwInfo : homeworkInfos ){
                    HwHomework hw = new HwHomework();
                    hw.setHwStudent(student);
                    hw.setHwCourse(ct.getHwCourse());
                    hw.setCheckedFlag(false);
                    hw.setHwHomeworkInfo(hwInfo);
                    hw.setHwTeacher(ct.getHwTeacher());
                    hw.setStudentName(student.getName());
                    hw.setStudentNo(student.getStudentNo());
                    hw.setTitle(hwInfo.getTitle());
                    hw.setLastModifyDate(new java.sql.Timestamp(System.currentTimeMillis()));
                    hw.setMarkType(hwInfo.getMarkType());
                    hw.setUrl("");
                    hw.setStatus(HomeworkStatus.UNSUBMITTED);
                    homeworkDao.add(hw);
                }
            }
        }

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

    public ICourseTeachingDao getCourseTeachingDao() {
        return courseTeachingDao;
    }

    @Resource
    public void setCourseTeachingDao(ICourseTeachingDao courseTeachingDao) {
        this.courseTeachingDao = courseTeachingDao;
    }

    public ICampusDao getCampusDao() {
        return campusDao;
    }

    @Resource
    public void setCampusDao(ICampusDao campusDao) {
        this.campusDao = campusDao;
    }

    public IHomeworkInfoDao getHomeworkInfoDao() {
        return homeworkInfoDao;
    }

    @Resource
    public void setHomeworkInfoDao(IHomeworkInfoDao homeworkInfoDao) {
        this.homeworkInfoDao = homeworkInfoDao;
    }

    public IHomeworkDao getHomeworkDao() {
        return homeworkDao;
    }

    @Resource
    public void setHomeworkDao(IHomeworkDao homeworkDao) {
        this.homeworkDao = homeworkDao;
    }
}
