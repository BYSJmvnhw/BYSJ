package org.demo.controller;

import org.apache.commons.io.FileUtils;
import org.demo.dao.IHomeworkDao;
import org.demo.model.UserType;
import org.jboss.logging.annotations.Param;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
import java.util.Properties;

/**
 * Created by jzchen on 2015/1/25.
 */
@Controller
@RequestMapping("homework")
public class HomeworkController {
    private IHomeworkDao homeworkDao;

    private String homeworkBaseDir;
    private SimpleDateFormat sdf = new SimpleDateFormat("YYYY");

    @RequestMapping(value = "/courseList", method = RequestMethod.GET)
    public String courseList(Integer startYear, Integer schoolTerm, HttpServletRequest request) {
        UserType userType = (UserType) request.getSession().getAttribute("userType");
        return null;
    }

    /*
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
}
