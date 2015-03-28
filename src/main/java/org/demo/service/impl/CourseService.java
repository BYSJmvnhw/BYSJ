package org.demo.service.impl;

import net.sf.json.JSONObject;
import org.demo.dao.*;
import org.demo.dao.impl.BaseDao;
import org.demo.model.*;
import org.demo.service.ICourseService;
import org.demo.service.IEmailService;
import org.demo.tool.GetPost;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Override
    public JSONObject updateEmail(String email,Integer ctId) {
        JSONObject jsonresult = new JSONObject();
        jsonresult.clear();
        String smptPost = GetPost.getSmptPost(email);
        if( smptPost == null || smptPost.equals("")) {
            jsonresult.put("status","fail");
            jsonresult.put("msg","邮箱格式不合法");
            return jsonresult;
        }
        HwCheckEmail checkEmail = checkEmailDao.findObject("from HwCheckEmail ce where ce.email=?",email);
        //邮箱不存在
        if(checkEmail == null) {
            String timestamp = String.valueOf(System.currentTimeMillis()) ;
            //添加邮箱记录，标记为未验证，同时发送验证码
            HwCheckEmail newCheckEmail = new HwCheckEmail(email,timestamp,0);
            checkEmailDao.add(newCheckEmail);
            //发送验证码到邮箱
            try {
                emailService.sendSimpleEmailToOne(smptPost,systemEmail,systemEmailPass,email,"邮箱验证","验证码："+timestamp);
            } catch (Exception e) {
                e.printStackTrace();
            }
            jsonresult.put("status","fail");
            jsonresult.put("msg","该邮箱未验证，验证码已发送到此邮箱");
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
                jsonresult.put("status","fail");
                jsonresult.put("msg","该邮箱未验证，验证码已发送到此邮箱");
                return jsonresult;
            }else {
                //邮箱此前已经验证过，更新邮箱
                try{
                    HwCourseTeaching ct = courseTeachingDao.load(ctId);
                    System.out.println(ct.getEmail());
                    ct.setEmail(email);
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

    @Override
    public JSONObject updateAndcheckEmail(Integer ctId, String email, String checkNumber) {
        JSONObject jsonresult = new JSONObject();
        jsonresult.clear();
        String[] params = {email,checkNumber};
        HwCheckEmail checkEmail = checkEmailDao.findObject("from HwCheckEmail ce where ce.email=? and ce.checkNumber=?",params);
        if(checkEmail != null) {
            checkEmail.setIsValid(1);
            checkEmailDao.update(checkEmail);
            HwCourseTeaching ct = courseTeachingDao.get(ctId);
            ct.setEmail(email);
            courseTeachingDao.update(ct);
            jsonresult.put("status","success");
            return jsonresult;
        }else {
            jsonresult.put("status","fail");
            return jsonresult;
        }
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
}
