package org.demo.controller;

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
import java.text.SimpleDateFormat;

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
     * 布置作业
     */
    @RequestMapping(value = "/addHomeworkInfo" ,method = RequestMethod.GET)
    public String addHomeworkInfoPage() {
        return "homework/addHomeworkInfo";
    }

    @RequestMapping(value = "/addHomeworkInfo", method = RequestMethod.POST)
    public void addHomeworkInfo(@RequestBody HwHomeworkInfo hwHomeworkInfo) {
        System.out.println(hwHomeworkInfo.getId());
    }



    /**
    *  学生作业上传 Controller
    * */
    @RequestMapping(value = "/{studentNo}/upload", method = RequestMethod.GET)
    public String upload() {
        return "homework/upload";
    }

    @RequestMapping(value = "/{studentNo}/upload", method = RequestMethod.POST)
    public String upload(@PathVariable String studentNo, @RequestParam MultipartFile hw, HttpServletRequest request) throws IOException {
/*        System.out.println(hw.getName()+" , "
                + hw.getOriginalFilename()+" , "
                + hw.getContentType()+ " , "
                + hw.getSize() );*/
        try {
            System.out.println( "BaseDir" + homeworkBaseDir);
            /* 若指定目录不存在，则抛异常*/
            File dirname = new File(homeworkBaseDir);
            if ( !dirname.isDirectory() )
                throw new NotDirectoryException( "homeworkDir" + homeworkBaseDir + " is not found."
                        +"[ files were all putted into "+ request.getServletContext().getRealPath("/homework") + "]");
        } catch (NotDirectoryException e ) {
            homeworkBaseDir =request.getServletContext().getRealPath("/homework");
            e.printStackTrace();
        }finally {
            //String finalDir = homeworkBaseDir + "/" + sdf.format(new Date()) ;
            System.out.println(homeworkBaseDir);
            File f = new File( homeworkBaseDir + "/" + hw.getOriginalFilename() );
            FileUtils.copyInputStreamToFile(hw.getInputStream(), f);
        }
        return "";
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
}
