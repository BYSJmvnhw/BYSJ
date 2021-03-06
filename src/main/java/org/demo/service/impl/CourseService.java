package org.demo.service.impl;

import net.sf.json.JSONObject;
import org.demo.dao.*;
import org.demo.dao.impl.BaseDao;
import org.demo.model.*;
import org.demo.service.ICourseService;
import org.demo.service.IEmailService;
import org.demo.tool.GetPost;
import org.demo.tool.HomeworkStatus;
import org.demo.tool.Page;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by jzchen on 2015/2/13 0013.
 */
@Service
public class CourseService implements ICourseService {

    private ICourseDao courseDao;
    private ICollegeDao collegeDao;
    private ITeacherDao teacherDao;
    private ICourseTeachingDao courseTeachingDao;
    private ICheckEmailDao checkEmailDao;
    private IEmailService emailService;
    private String systemEmail;
    private String systemEmailPass;
    private ICampusDao campusDao;
    private IMajorDao majorDao;
    private ICourseSelectingDao courseSelectingDao;
    private IStudentDao studentDao;
    private IHomeworkDao homeworkDao;

    @Override
    public HwCourse load(Integer cid) {
        return courseDao.load(cid);
    }
    //添加课程
    //peifeng
    //2015-03-16下午
    public void addCourse(int collegteId,String courseNo,String courseName) {
        HwCollege college = collegeDao.get(collegteId);
        HwCourse course = new HwCourse(courseNo,courseName);
        course.setHwCollege(college);
        courseDao.add(course);
    }
    //获得指定学院的所有课程
    //peifeng
    //2015-03-16下午
    public List<Map<String,Object>> getCourseByCollege(int collegeId) {
        Map<String,Object> map;
        List<Map<String,Object>> resultList = new ArrayList<Map<String, Object>>();
        List<HwCourse> courses = courseDao.list("from HwCourse m where m.hwCollege.id=?",collegeId);
        if(courses.size() == 0) {
            return null;
        }
        for(HwCourse course : courses) {
            map = new HashMap<String, Object>();
            map.put("courseId",course.getId());
            map.put("courseNo",course.getCourseNo());
            map.put("courseName",course.getCourseName());
            resultList.add(map);
        }
        return resultList;
    }
    //修改课程信息
    public void updateCourse(int courseId,String courseNo,String courseName,int collegeId) {
        HwCourse course = courseDao.get(courseId);
        if(!course.getCourseNo().equals(courseNo)) {
            course.setCourseNo(courseNo);
        }
        if(!course.getCourseName().equals(courseName)) {
            course.setCourseName(courseName);
        }
        if(course.getHwCollege().getId() != collegeId) {
            course.setHwCollege(collegeDao.get(collegeId));
        }
        courseDao.update(course);
    }

    //查询某教师任教所有课程课程名和邮箱列表
    @Override
    public List<Map<String,Object>> emailList(Integer startYear, Integer schoolTerm, HwUser user) {
        HwTeacher teacher = teacherDao.load(user.getTypeId());
        List resultList = courseTeachingDao.emailList(teacher,startYear,schoolTerm);
        List<Map<String,Object>> emailList = new ArrayList<Map<String, Object>>();
        for(Object object : resultList ){
            Object[] o = (Object[])object;
            Map<String,Object> emailmap = new HashMap<String,Object>();
            emailmap.put("ctId",o[0]);
            emailmap.put("courseName",o[1]);
            emailmap.put("email",o[2]);
            emailList.add(emailmap);
        }
        return emailList;
    }
    private String getTimestamp() {
        //return System.currentTimeMillis()+"";
        Random random = new Random();
        String result="";
        for(int i=0;i<6;i++){
            result+=random.nextInt(10);
        }
        return result;
    }
    //未验证的邮箱获取验证码
    // 已经验证的邮箱更新邮箱和密码
    @Override
    public JSONObject updateEmail(String email, String password, Integer ctId) {
        JSONObject jsonresult = new JSONObject();
        jsonresult.clear();
        String smptPost = GetPost.getSmptPost(email);
        if( smptPost == null || smptPost.equals("")) {
            jsonresult.put("status","illegal_email");
           // jsonresult.put("msg","邮箱格式不合法");
            return jsonresult;
        }
        HwCheckEmail checkEmail = checkEmailDao.findObject("from HwCheckEmail ce where ce.email=?",email);
        //邮箱不存在
        if(checkEmail == null) {
            String timestamp = getTimestamp();//String.valueOf(System.currentTimeMillis()) ;
            //添加邮箱记录，标记为未验证，同时发送验证码
            HwCheckEmail newCheckEmail = new HwCheckEmail(email,timestamp,0);
            checkEmailDao.add(newCheckEmail);
            //发送验证码到邮箱
            try {
                emailService.sendSimpleEmailToOne(smptPost,systemEmail,systemEmailPass,email,"邮箱验证","验证码："+timestamp);
            } catch (Exception e) {
                e.printStackTrace();
            }
            jsonresult.put("status","no_validated");
            //jsonresult.put("msg","");
            return jsonresult;
        }else { //邮箱存在
            //但邮箱未验证
            if(checkEmail.getIsValid()==0) {
                String timestamp = checkEmail.getCheckNumber();
                //发送验证码到邮箱
                try {
                    emailService.sendSimpleEmailToOne(smptPost,systemEmail,systemEmailPass,email,"邮箱验证","验证码："+timestamp);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //
                jsonresult.put("status","no_validated");
                //jsonresult.put("msg","该邮箱未验证，验证码已发送到此邮箱");
                return jsonresult;
            }else {
                //邮箱此前已经验证过，更新邮箱
                try{
                    HwCourseTeaching ct = courseTeachingDao.load(ctId);
                    System.out.println(ct.getEmail());
                    ct.setEmail(email);
                    ct.setPassword(password);
                    courseTeachingDao.update(ct);
                    jsonresult.put("status", "success");
                    return jsonresult;
                } catch (Exception e) {
                    e.printStackTrace();
                    jsonresult.put("status","fail");
                    return jsonresult;
                }
            }
        }
    }

    //使用验证码更新邮箱和密码
    @Override
    public JSONObject updateAndcheckEmail(Integer ctId, String email, String password,  String checkNumber) {
        JSONObject jsonresult = new JSONObject();
        jsonresult.clear();
        String[] params = {email,checkNumber};
        HwCheckEmail checkEmail = checkEmailDao.findObject("from HwCheckEmail ce where ce.email=? and ce.checkNumber=?",params);
        if(checkEmail != null) {
            checkEmail.setIsValid(1);
            checkEmailDao.update(checkEmail);
            HwCourseTeaching ct = courseTeachingDao.get(ctId);
            ct.setEmail(email);
            ct.setPassword(password);
            courseTeachingDao.update(ct);
            jsonresult.put("status","success");
            return jsonresult;
        }else {
            jsonresult.put("status","verification_code_error");
            return jsonresult;
        }
    }

    //搜索课程
    @Override
    public Page searchCourse(Integer campusId, Integer collegeId, Integer majorId,  String courseNo, String courseName) {
        Page<HwCourse> coursePage = courseDao.coursePage(campusId, collegeId, majorId, courseNo, courseName);
        List<HwCourse> courseList = coursePage.getData();
        List  courseViewList = new ArrayList();
        for( HwCourse course : courseList ){
            Map<String,Object> courseView = new HashMap<String, Object>();
            courseView.put("courseId", course.getId());
            courseView.put("campusName", course.getHwCampus().getName());
            courseView.put("collegeName", course.getHwCollege().getCollegeName());
            courseView.put("majorName", course.getHwMajor().getName());
            courseView.put("courseNo",course.getCourseNo());
            courseView.put("courseName", course.getCourseName());
            courseViewList.add(courseView);
        }
        coursePage.setData(courseViewList);
        return coursePage;
    }

    //搜索授课关系
    @Override
    public Page searchCourseTeaching(Integer campusId, Integer collegeId, Integer majorId,
                                     Integer startYear, Integer schoolTerm, String courseName, String teacherName) {
        Page<HwCourseTeaching> courseTeachingPage =
                courseTeachingDao.courseTeachingPage(campusId, collegeId, majorId, startYear, schoolTerm, courseName, teacherName);
        List<HwCourseTeaching> courseTeachingList = courseTeachingPage.getData();
        List ctViewList = new ArrayList();
        for( HwCourseTeaching ct : courseTeachingList ){
            Map<String,Object> ctViewMap = new HashMap<String, Object>();
            ctViewMap.put("ctId",ct.getId());
            ctViewMap.put("campusName",ct.getHwCourse().getHwCampus().getName());
            ctViewMap.put("collegeName",ct.getHwCourse().getHwCollege().getCollegeName());
            ctViewMap.put("majorName",ct.getHwCourse().getHwMajor().getName());
            ctViewMap.put("startYear",ct.getStartYear());
            ctViewMap.put("schoolTerm",ct.getSchoolTerm());
            ctViewMap.put("courseName",ct.getHwCourse().getCourseName());
            ctViewMap.put("teacherName",ct.getHwTeacher().getName());
            ctViewList.add(ctViewMap);
        }
        courseTeachingPage.setData(ctViewList);
        return courseTeachingPage;
    }

    //添加课程
    @Override
    public JSONObject addCourse(Integer campusId, Integer collegeId, Integer majorId, String courseNo, String courseName) {
        JSONObject result = new JSONObject();
        HwCourse c = courseDao.findCourse(courseNo);
        if( c != null){
            result.put("status","existing");
            return result;
        }else {
            HwCourse course;
            HwCourse deleteCourse = courseDao.findDeleteCourse(courseNo);
            if( deleteCourse != null  ){
                course = deleteCourse;
            }else {
                course = new HwCourse();
            }
            course.setDeleteFlag(false);
            course.setHwCampus(campusDao.load(campusId));
            course.setHwCollege(collegeDao.load(collegeId));
            course.setHwMajor(majorDao.load(majorId));
            course.setCourseNo(courseNo);
            course.setCourseName(courseName);
            if( deleteCourse != null  ){
                courseDao.update(course);
            }else {
                courseDao.add(course);
            }
            result.clear();
            result.put("status","success");
            return result;
        }
    }

    //标记删除课程
    @Override
    public void deleteCourse(Integer courseId) {
        HwCourse course = courseDao.load(courseId);
        course.setDeleteFlag(true);
        courseDao.update(course);
    }

    //更新课程
    @Override
    public void updateCourse(Integer courseId,Integer campusId, Integer collegeId, Integer majorId, String courseName) {
        HwCourse course = courseDao.load(courseId);
        course.setHwCampus(campusDao.load(campusId));
        course.setHwCollege(collegeDao.load(collegeId));
        course.setHwMajor(majorDao.load(majorId));
        course.setCourseName(courseName);
        courseDao.update(course);
    }

    //查询授课关系列表
    @Override
    public List<Map<String, Object>> courseTeachingList(Integer courseId,Integer startYear, Integer schoolTerm) {
        List<HwCourseTeaching> ctList = courseTeachingDao.courseTeachingList(courseId, startYear, schoolTerm);
        List<Map<String, Object>> teacherViewList = new ArrayList<Map<String, Object>>();
        for( HwCourseTeaching ct : ctList ){
            HwTeacher teacher = ct.getHwTeacher();
            Map<String,Object> teacherView = new HashMap<String, Object>();
            teacherView.put("teacherId",teacher.getId());
            teacherView.put("campusName",teacher.getHwCampus().getName());
            teacherView.put("collegeName",teacher.getHwCollege().getCollegeName());
            teacherView.put("majorName",teacher.getHwMajor().getName());
            teacherView.put("teacherNo",teacher.getTeacherNo());
            teacherView.put("name",teacher.getName());
            teacherView.put("sex",teacher.getSex());
            teacherView.put("ctId",ct.getId());
            teacherViewList.add(teacherView);
        }
        return teacherViewList;
    }

    //添加授课关系
    @Override
    public void addCourseTeaching(Integer courseId, Integer[] teacherId,Integer startYear, Integer schoolTerm) {
        HwCourse course = courseDao.load(courseId);
        for( Integer tid : teacherId ){
            HwCourseTeaching ct = courseTeachingDao.findCourseTeaching(courseId, tid, startYear, schoolTerm);
            if( ct == null ){
                HwCourseTeaching courseTeaching = new HwCourseTeaching();
                courseTeaching.setEmail("");
                courseTeaching.setPassword("");
                courseTeaching.setSchoolTerm(schoolTerm);
                courseTeaching.setStartYear(startYear);
                courseTeaching.setHwCourse(course);
                courseTeaching.setHwTeacher(teacherDao.load(tid));
                courseTeachingDao.add(courseTeaching);
            }
        }
    }

    //查询课程列表
    @Override
    public List<Map<String,Object>> courseList(Integer studentId, Integer startYear, Integer schoolTerm) {
        List<HwCourseSelecting> csList = courseSelectingDao.courseSelectingList(studentId, startYear, schoolTerm);
        List<Map<String,Object>> courseViewList = new ArrayList<Map<String, Object>>();
        for( HwCourseSelecting cs : csList ){
            Map<String, Object> courseView = new HashMap<String, Object>();
            HwCourse course = cs.getHwCourseTeaching().getHwCourse();
            courseView.put("courseId",course.getId());
            courseView.put("courseNo",course.getCourseNo());
            courseView.put("courseName",course.getCourseName());
            courseView.put("campusName",course.getHwCampus().getName());
            courseView.put("collegeName",course.getHwCollege().getCollegeName());
            courseView.put("majorName",course.getHwMajor().getName());
            courseView.put("csId",cs.getId());
            courseViewList.add(courseView);
        }
        return courseViewList;
    }

    //查询学生列表
    @Override
    public Page<Map<String, Object>> studentList(Integer courseTeachingId) {
        Page<HwCourseSelecting> csPage = courseSelectingDao.courseSelectingPage(courseTeachingId);
        List<HwCourseSelecting> csList = csPage.getData();
        List<Map<String,Object>> studentViewList = new ArrayList<Map<String, Object>>();
        for( HwCourseSelecting cs : csList  ){
            HwStudent student = cs.getHwStudent();
            Map<String,Object> studentView = new HashMap<String, Object>();
            studentView.put("studentId",student.getId());
            studentView.put("campusName",student.getHwCampus().getName());
            studentView.put("collegeName",student.getHwCollege().getCollegeName());
            studentView.put("majorName",student.getHwMajor().getName());
            studentView.put("grade",student.getGrade());
            studentView.put("cla",student.getClass_());
            studentView.put("studentName",student.getName());
            studentView.put("studentNo",student.getStudentNo());
            studentView.put("sex",student.getSex());
            studentView.put("csId",cs.getId());
            studentViewList.add(studentView);
        }
        Page<Map<String,Object>> page = new Page<Map<String,Object>>();
        page.setData(studentViewList);
        page.setPageOffset(csPage.getPageOffset());
        page.setPageSize(csPage.getPageSize());
        page.setTotalRecord(csPage.getTotalRecord());
        return page;
    }

    //搜索授课关系
    @Override
    public List<Map<String,Object>> searchCourseTeaching(Integer courseId, Integer startYear, Integer schoolTerm) {
        List<HwCourseTeaching> ctList = courseTeachingDao.courseTeachingList(courseId, startYear, schoolTerm);
        List<Map<String,Object>> ctViewList = new ArrayList<Map<String, Object>>();
        for( HwCourseTeaching ct : ctList ){
            Map<String,Object> ctView = new HashMap<String, Object>();
            ctView.put("ctId",ct.getId());
            ctView.put("courseName",ct.getHwCourse().getCourseName());
            ctView.put("teacherName",ct.getHwTeacher().getName());
            ctView.put("startYear",ct.getStartYear());
            ctView.put("schoolTerm",ct.getSchoolTerm());
            ctViewList.add(ctView);
        }
        return ctViewList;
    }

    //添加选课关系
    @Override
    public void addCourseSelecting(Integer courseTeachingId, Integer[] studentId) {
        HwCourseTeaching ct = courseTeachingDao.load(courseTeachingId);
        Set<HwHomeworkInfo> homeworkInfos = ct.getHwHomeworkInfos();
        for (Integer sid : studentId) {
            HwStudent student = studentDao.load(sid);
            HwCourseSelecting cs = courseSelectingDao.findCSByCTAndStudent(ct, student);
            if (cs == null) {
                HwCourseSelecting courseSelecting = new HwCourseSelecting();
                courseSelecting.setHwCourseTeaching(ct);
                courseSelecting.setHwStudent(student);
                courseSelectingDao.add(courseSelecting);

                // 为每个新加入课程的学生，初始化该课程所有已布置作业的对象。
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

    @Override
    public void deleteCourseTeaching(Integer courseTeachingId) {
        courseTeachingDao.delete(courseTeachingDao.load(courseTeachingId));
    }

    @Override
    public Page<Map<String,Object>> searchCourseTeaching(Integer campusId, Integer collegeId, Integer majorId, Integer startYear,
                                     Integer schoolTerm, String teacherNo, String teacherName, String courseNo, String courseName) {
        Page<HwCourseTeaching> ctPage = courseTeachingDao.courseTeachingPage(campusId, collegeId, majorId, startYear, schoolTerm,
                teacherNo, teacherName, courseNo, courseName);
        List<HwCourseTeaching> ctLsit = ctPage.getData();
        List<Map<String,Object>> ctViewList = new ArrayList<Map<String, Object>>();
        for( HwCourseTeaching ct : ctLsit ){
            Map<String,Object> ctView = new HashMap<String, Object>();
            ctView.put("ctId",ct.getId());
            ctView.put("startYear",ct.getStartYear());
            ctView.put("schoolTerm",ct.getSchoolTerm());
            ctView.put("campusName",ct.getHwCourse().getHwCampus().getName());
            ctView.put("collegeName",ct.getHwCourse().getHwCollege().getCollegeName());
            ctView.put("majorName",ct.getHwCourse().getHwMajor().getName());
            ctView.put("courseName",ct.getHwCourse().getCourseName());
            ctView.put("courseNo",ct.getHwCourse().getCourseNo());
            ctView.put("teacherNo",ct.getHwTeacher().getTeacherNo());
            ctView.put("teacherName",ct.getHwTeacher().getName());
            ctView.put("sex",ct.getHwTeacher().getSex());
            ctViewList.add(ctView);
        }
        Page<Map<String,Object>> page  = new Page<Map<String,Object>>();
        page.setData(ctViewList);
        page.setPageOffset(ctPage.getPageOffset());
        page.setPageSize(ctPage.getPageSize());
        page.setTotalRecord(ctPage.getTotalRecord());
        return page;
    }

    @Override
    public void deleteCourseSelecting(Integer courseSelectingId) {
        courseSelectingDao.delete(courseSelectingDao.load(courseSelectingId));
    }

    @Override
    public Map<String, Object> courseDetail(Integer courseId) {
        HwCourse course = courseDao.load(courseId);
        Map<String,Object> courseView = new HashMap<String, Object>();
        courseView.put("courseId",course.getId());
        courseView.put("courseNo",course.getCourseNo());
        courseView.put("courseName",course.getCourseName());
        courseView.put("campusId",course.getHwCampus().getId());
        courseView.put("campusName",course.getHwCampus().getName());
        courseView.put("collegeId",course.getHwCollege().getId());
        courseView.put("collegeName",course.getHwCollege().getCollegeName());
        courseView.put("majorId",course.getHwMajor().getId());
        courseView.put("majorId",course.getHwMajor().getName());
        return courseView;
    }

    @Override
    public List<Map<String,Object>> courseTeachingListByTId(int tid,int startYear,int schoolTerm){
        List<HwCourseTeaching> ctList = courseTeachingDao.courseTeachingListByTId(tid, startYear, schoolTerm);
        List<Map<String,Object>> courseViewList = new ArrayList<Map<String, Object>>();
        for( HwCourseTeaching ct : ctList ){
            Map<String, Object> courseView = new HashMap<String, Object>();
            HwCourse course = ct.getHwCourse();
            courseView.put("courseId",course.getId());
            courseView.put("courseNo",course.getCourseNo());
            courseView.put("courseName",course.getCourseName());
            courseView.put("campusName",course.getHwCampus().getName());
            courseView.put("collegeName",course.getHwCollege().getCollegeName());
            courseView.put("majorName",course.getHwMajor().getName());
            courseView.put("ctId",ct.getId());
            courseViewList.add(courseView);
        }
        return courseViewList;
    }

    @Resource
    public void setCourseDao(ICourseDao courseDao) {
        this.courseDao = courseDao;
    }
    @Resource
    public void setCollegeDao(ICollegeDao collegeDao) {
        this.collegeDao = collegeDao;
    }
    @Resource
    public void setTeacherDao(ITeacherDao teacherDao) {
        this.teacherDao = teacherDao;
    }
    @Resource
    public void setCourseTeachingDao(ICourseTeachingDao courseTeachingDao) {
        this.courseTeachingDao = courseTeachingDao;
    }

    public ICourseTeachingDao getCourseTeachingDao() {
        return courseTeachingDao;
    }

    @Resource
    public void setCheckEmailDao(ICheckEmailDao checkEmailDao) {
        this.checkEmailDao = checkEmailDao;
    }
    @Resource
    public void setEmailService(IEmailService emailService) {
        this.emailService = emailService;
    }
    @Value("${email}")
    public void setSystemEmail(String systemEmail) {
        this.systemEmail = systemEmail;
    }
    @Value("${password}")
    public void setSystemEmailPass(String systemEmailPass) {
        this.systemEmailPass = systemEmailPass;
    }

    public ICampusDao getCampusDao() {
        return campusDao;
    }

    @Resource
    public void setCampusDao(ICampusDao campusDao) {
        this.campusDao = campusDao;
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

    public IStudentDao getStudentDao() {
        return studentDao;
    }

    @Resource
    public void setStudentDao(IStudentDao studentDao) {
        this.studentDao = studentDao;
    }

    @Resource
    public void setHomeworkDao(IHomeworkDao homeworkDao) {
        this.homeworkDao = homeworkDao;
    }
}
