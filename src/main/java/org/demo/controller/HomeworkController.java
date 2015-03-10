package org.demo.controller;

import net.sf.json.JSON;
import net.sf.json.JSONObject;
import org.apache.commons.io.FileUtils;
import org.demo.dao.IHomeworkDao;
import org.demo.model.*;
import org.demo.service.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.nio.file.NotDirectoryException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by jzchen on 2015/1/25.
 */
@Controller
@RequestMapping("/homework")
public class HomeworkController {

    private String homeworkBaseDir;
    private IHomeworkDao homeworkDao;
    private ICourseSelectingService courseSelectingService;
    private ICourseTeachingService courseTeachingService;
    private IHomeworkInfoService homeworkInfoService;
    private ICourseService courseService;
    private IHomeworkService homeworkService;
    private IStudentService studentService;

    private SimpleDateFormat sdf = new SimpleDateFormat("YYYY");


    /**************************************************************************************************
     * 请求课程列表jsp页面
     * */
    @RequestMapping(value = "/showCourses", method = RequestMethod.GET)
    public String showCourse() {
        return "homework/showCourses";
    }

    /**
     * 异步请求课程列表分页 json数据
     *
     * @param startYear 选课年份
     * @param schoolTerm 选课学期
     * @param request http请求
     * @return 学生返回选课列表，教师返回授课列表Json分页
     */
    @RequestMapping(value = "/courseList", method = RequestMethod.GET, produces="application/json")
    @ResponseBody
    public Page courseList(Integer startYear, Integer schoolTerm, HttpServletRequest request) {
        //System.out.println("enter hwController"+ " , " + startYear+" , " +schoolTerm);
        /** 获取用户类型，学生返回选课列表，教师返回授课列表*/
        UserType userType = (UserType) request.getSession().getAttribute("userType");
        /** 学生返回选课列表 */
        if( userType == UserType.STUDENT ) {
            HwStudent student = (HwStudent) request.getSession().getAttribute("loginStudent");
            Page page = courseSelectingService.selectingCourses(student, startYear, schoolTerm);
            return page;
        }
        /** 教师返回授课列表 */
        else {
            HwTeacher teacher = (HwTeacher)request.getSession().getAttribute("loginTeacher");
            System.out.println(teacher.getName());
            Page page = courseTeachingService.teachingCourseLsit(teacher, startYear, schoolTerm);
             return page;
        }
    }

    /************************************************************************************************
     *  请求某一课程已布置作业jsp页面
     * */
    @RequestMapping(value = "/showHomeworkInfo", method = RequestMethod.GET)
    public String showHomeworkInfo() {
        return "homework/showAssignedHomework";
    }

    /**
     * @param cid 课程id
     * @param request http请求
     * @return  学生返回布置作业列表，教师返回布置作业列表Json分页
     * */
    @RequestMapping(value = "/homeworkInfoList", method = RequestMethod.GET)
    @ResponseBody
    public Page homeworkInfoList(Integer cid, HttpServletRequest request)  {
        /** 获取用户类型，学生返回布置作业列表，教师返回布置作业列表*/
        UserType userType = (UserType) request.getSession().getAttribute("userType");
        /** 学生返回布置作业列表 */
        if( userType == UserType.STUDENT ) {
            HwCourseSelecting cs = courseSelectingService.load(cid);
            HwCourse course = cs.getHwCourse();
            HwTeacher teacher = cs.getHwTeacher();
            HwCourseTeaching ct = courseTeachingService.findCourseTeaching(course, teacher);
            return homeworkInfoService.assignedHomeworList(ct);
         }else {
            /** 教师返回布置作业列表 */
            HwCourseTeaching ct = courseTeachingService.load(cid);
            return homeworkInfoService.assignedHomeworList(ct);
        }
    }

    /*************************************************************************************************
     * 请求作业要求详细信息jsp页面
     * */
    @RequestMapping(value = "/showHomeworkInfoDetail", method = RequestMethod.GET)
    public String showHomeworkInfoDetail() {
        return "homework/showHomeworkInfoDetail";
    }

     /**
     *  @param hwInfoId 作业信息 id
     *  @return Json 作业要求详细信息
     * */
    @RequestMapping(value = "/homeworkInfoDetail", method = RequestMethod.GET)
    @ResponseBody
     public HwHomeworkInfo homeworkInfoDetail(Integer hwInfoId) {
        return homeworkInfoService.load(hwInfoId);
    }

    /*************************************************************************************************
     *  请求某次作所有学生作业jsp页面
     * */

    @RequestMapping(value = "/showHomework",  method = RequestMethod.GET)
    public String showHomework() {
        return "homework/showHomework";
    }

    /**
     * 策略：每次布置信作业都将初始化该次作业的n条记录，url为空，提交作业后在更新url，通过url筛选
     * @param hwInfoId 作业要求 id
     * @param submited 是否已经提交
     * @return Json 某次作业所有学生作业
     * */
    @RequestMapping(value = "/homeworkList",  method = RequestMethod.GET)
    @ResponseBody
    public Page<HwHomework> homeworkList(Integer hwInfoId,boolean submited) {
        HwHomeworkInfo hwInfo = homeworkInfoService.load(hwInfoId);
        System.out.println(hwInfo.getHwDesc());
        return homeworkService.submittedHomeworkList(hwInfo, submited);
    }
    /**
     * 请求布置作业,添加作业信息 jsp页面
     *
     */
    @RequestMapping(value = "/addHomeworkInfo" ,method = RequestMethod.GET)
    public String addHomeworkInfoPage() {
        return "homework/addHomeworkInfo";
    }

    /**
     * @param jsonObject 封装了参数信息Json字符串
     * 前端必须传递JSON字符串而不能传递JSON对象，SpringMVC注解负责解析字符串
     * */

     @RequestMapping(value = "/addHomeworkInfo", method = RequestMethod.POST)
     @ResponseBody
         //public void addHomeworkInfo(@RequestBody HwHomeworkInfo hwHomeworkInfo) { /*用于直接封装成 HwHomeworkInfo对象 */
    public String addHomeworkInfo(String jsonObject, HttpServletRequest request) {

            /** 从Session获取当前登陆用户类型 */
         HwTeacher teacher  = (HwTeacher) request.getSession().getAttribute("loginTeacher");
         if( teacher == null ){
             //登陆类型不是教师或者未登陆，返回登陆页面
             return "../login/loginInput";
         }

         //System.out.println(jsonObject);
         /** 将前端传递过来的json字符串解析成JsonObject对象 */
         JSONObject jo = JSONObject.fromObject(jsonObject);
         /** 构造一个新的HwHomeworkInfo对象 */
         HwHomeworkInfo hwinfo = new HwHomeworkInfo();
         /** 从前端传递过来的json中解析出参数 */
         hwinfo.setTitle(jo.getString("title"));
         hwinfo.setHwDesc(jo.getString("hwDesc"));
         hwinfo.setCourseName(jo.getString("courseName"));
         hwinfo.setDeadline( new java.sql.Timestamp( jo.getLong("deadline") ) );

         /**查询出对应的courseTeaching*/
         HwCourse course = courseService.load(jo.getInt("courseId"));
         HwCourseTeaching courseTeaching = courseTeachingService.findCourseTeaching(course,teacher);

         /**往HwHomeworkInfo填入其他信息*/
         hwinfo.setCreateDate(new java.sql.Timestamp(System.currentTimeMillis()));
         hwinfo.setEmail(courseTeaching.getEmail());
         hwinfo.setHwCourseTeaching(courseTeaching);
         hwinfo.setOvertime(false);
         String url = "/" +  courseTeaching.getStartYear().toString()
                        + "/" + courseTeaching.getSchoolTerm().toString()
                        + "/" + course.getCourseNo()
                        + "/" + teacher.getTeacherNo() + "/";
                        //+ "/" + hwinfo.getId() + "/" ;

         hwinfo.setUrl(url);
         homeworkInfoService.add(hwinfo);

         /**查询出所有选课的学生
          * 初始化该次作业所有选课学生的作业。
          * */
          List<HwCourseSelecting> csList = courseSelectingService.selectingCourses(course, courseTeaching.getStartYear(), courseTeaching.getSchoolTerm());
         for(HwCourseSelecting cs : csList) {
             //构建一个新的作业对象
             HwHomework hw = new HwHomework();
             hw.setHwStudent(cs.getHwStudent());
             hw.setHwCourse(course);
             hw.setCheckedFlag(false);
             hw.setHwHomeworkInfo(hwinfo);
             hw.setHwTeacher(teacher);
             hw.setStudentName(cs.getHwStudent().getName());
             hw.setStudentNo(cs.getHwStudent().getStudentNo());
             hw.setTitle(hwinfo.getTitle());
             hw.setLastModifyDate(new java.sql.Timestamp(System.currentTimeMillis()));
             homeworkService.add(hw);
         }
         return "showHomeworkInfoDetail";
    }

    /**
     * 删除了
     * @param id 需要删除的作业信息id
     * */
    @RequestMapping(value = "/deleteHomeworkInfo", method = RequestMethod.GET)
    public String deleteHomeworkInfo(Integer id) {
        homeworkInfoService.delete(id);
        /**同时将级联删除该次作业信息对应的所有学生作业*/
        return "redirect:showHomeworkInfo";
    }



    /**
    *  学生作业上传 Controller
    * */
    @RequestMapping(value = "/upload", method = RequestMethod.GET)
    public String upload() {
        return "homework/upload";
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public String upload(@RequestParam MultipartFile hw, Integer hwinfoId, HttpServletRequest request) throws IOException {
/*        System.out.println(hw.getName()+" , "
                + hw.getOriginalFilename()+" , "
                + hw.getContentType()+ " , "
                + hw.getSize() );*/
        /**从session中获取当前登录的学生*/
        HwStudent student = (HwStudent) request.getSession().getAttribute("loginStudent");
        if(student == null) {
           return "redirect:/login/loginInput";
        }

        HwHomeworkInfo hwinfo = homeworkInfoService.load(hwinfoId);
        /**获取后缀*/
        String hwName = student.getStudentNo() + "_" +student.getName() + hw.getOriginalFilename().substring
                (hw.getOriginalFilename().lastIndexOf("."));
        String baseUrl = hwinfo.getUrl();
        String url = baseUrl + hwinfo.getId() + "/" + hwName;

        HwCourseTeaching ct = hwinfo.getHwCourseTeaching();
        String hwNo = ct.getStartYear().toString() + ct.getSchoolTerm().toString() +  ct.getHwCourse().getCourseNo()  + student.getStudentNo();
        HwHomework homework = homeworkService.findHomework(hwinfoId,student);
        homework.setTitle(hwinfo.getTitle());
        homework.setUrl(url);
        homework.setHwNo(hwNo);
        homework.setSubmitDate(new java.sql.Timestamp(System.currentTimeMillis()));
        homeworkService.update(homework);


        /**判断预设的目录的是否存在，不存在则使用web应用路径下的默认目录*/
        try {
            System.out.println( "BaseDir" + homeworkBaseDir);
            /* 若指定目录不存在，则抛异常*/
            File dirname = new File(homeworkBaseDir);
            if ( !dirname.isDirectory() )
                throw new NotDirectoryException( "homeworkDir" + homeworkBaseDir + " is not found."
                        +"[ files were all putted into "+ request.getServletContext().getRealPath("/doc") + "]");
        } catch (NotDirectoryException e ) {
            /**使用web应用路径下的默认目录*/
            homeworkBaseDir =request.getServletContext().getRealPath("/doc");
            e.printStackTrace();
        }finally {
            //String finalDir = homeworkBaseDir + "/" + sdf.format(new Date()) ;
            System.out.println(homeworkBaseDir);
            //File f = new File( homeworkBaseDir + "/" + hw.getOriginalFilename() );
            File f = new File( homeworkBaseDir + "/doc/" + url );
            FileUtils.copyInputStreamToFile(hw.getInputStream(), f);
        }


        return "redirect:showHomework";
    }

    public IHomeworkDao getHomeworkDao() {
        return homeworkDao;
    }
    @Resource
    public void setHomeworkDao(IHomeworkDao homeworkDao) {
        this.homeworkDao = homeworkDao;
    }

    public String getHomeworkBaseDir() {
        return homeworkBaseDir;
    }

    @Value("${homeworkDir}")
    public void setHomeworkBaseDir(String homeworkBaseDir) {
        this.homeworkBaseDir = homeworkBaseDir;
    }

    public ICourseSelectingService getCourseSelectingService() {
        return courseSelectingService;
    }
    @Resource
    public void setCourseSelectingService(ICourseSelectingService courseSelectingService) {
        this.courseSelectingService = courseSelectingService;
    }

    public ICourseTeachingService getCourseTeachingService() {
        return courseTeachingService;
    }
    @Resource
    public void setCourseTeachingService(ICourseTeachingService courseTeachingService) {
        this.courseTeachingService = courseTeachingService;
    }

    public IHomeworkInfoService getHomeworkInfoService() {
        return homeworkInfoService;
    }

    @Resource
    public void setHomeworkInfoService(IHomeworkInfoService homeworkInfoService) {
        this.homeworkInfoService = homeworkInfoService;
    }

    public ICourseService getCourseService() {
        return courseService;
    }

    @Resource
    public void setCourseService(ICourseService courseService) {
        this.courseService = courseService;
    }

    public IHomeworkService getHomeworkService() {
        return homeworkService;
    }

    @Resource
    public void setHomeworkService(IHomeworkService homeworkService) {
        this.homeworkService = homeworkService;
    }

    public IStudentService getStudentService() {
        return studentService;
    }

    @Resource
    public void setStudentService(IStudentService studentService) {
        this.studentService = studentService;
    }
}
