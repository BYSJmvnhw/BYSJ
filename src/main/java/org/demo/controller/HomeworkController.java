package org.demo.controller;

import org.apache.commons.io.FileUtils;
import org.demo.dao.IHomeworkDao;
import org.demo.dao.impl.StudentDao;
import org.demo.model.*;
import org.demo.service.ICourseSelectingService;
import org.jboss.logging.annotations.Param;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.NotDirectoryException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Properties;

/**
 * Created by jzchen on 2015/1/25.
 */
@Controller
@RequestMapping("/homework")
public class HomeworkController {

    private IHomeworkDao homeworkDao;
    private ICourseSelectingService courseSelectingService;
    private String homeworkBaseDir;
    private SimpleDateFormat sdf = new SimpleDateFormat("YYYY");


    /**
     * 请求课程列表jsp页面
     * */
    @RequestMapping(value = "/showCourse", method = RequestMethod.GET)
    public String showCourse() {
        return "homework/showCourse";
    }

    /**
     * 异步请求课程列表分页 json数据
     *
     * @param startYear 选课年份
     * @param schoolTerm 选课学期
     * @param request http请求
     * @return
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
/*            System.out.println(page.getTotalRecord());
            System.out.println(page.getPageSize());
            for( HwCourseSelecting cs : (List<HwCourseSelecting>)page.getData() ){
                System.out.println(cs.getHwCourse().getCourseName());
            }*/
            return page;
        }
        /** 教师返回授课列表 */
        else {
            HwTeacher teacher = (HwTeacher)request.getSession().getAttribute("loginTeacher");
            //return page;
        }
        return new Page();
    }

    /**
    *  作业上传 Controller
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
}
