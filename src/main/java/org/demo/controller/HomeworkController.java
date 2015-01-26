package org.demo.controller;

import org.apache.commons.io.FileUtils;
import org.demo.dao.IHomeworkDao;
import org.jboss.logging.annotations.Param;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.NotDirectoryException;
import java.util.Properties;

/**
 * Created by jzchen on 2015/1/25.
 */
@Controller
public class HomeworkController {
    private IHomeworkDao homeworkDao;

    private String homeworkDir;

    @RequestMapping(value = "/{username}/upload", method = RequestMethod.GET)
    public String upload() {
        return "homework/upload";
    }

    @RequestMapping(value = "/{studentNo}/upload", method = RequestMethod.POST)
    public String upload(@PathVariable String studentNo, @RequestParam MultipartFile hw, HttpServletRequest request) throws IOException {
        System.out.println(hw.getName()+" , "
                + hw.getOriginalFilename()+" , "
                + hw.getContentType()+ " , "
                + hw.getSize() );
        try {
            System.out.println(homeworkDir);
            /* 若指定目录不存在，则抛异常*/
            File dirname = new File(homeworkDir);
            if ( !dirname.isDirectory() )
                throw new NotDirectoryException( "homeworkDir" + homeworkDir + " is not found."
                        +"[ files were all putted into "+ request.getServletContext().getRealPath("/homework/upload") + "]");
        } catch (NotDirectoryException e ) {
            homeworkDir =request.getServletContext().getRealPath("/homework/upload");
            e.printStackTrace();
        }finally {
            System.out.println(homeworkDir);
            File f = new File( homeworkDir + "/" + hw.getOriginalFilename() );
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

    public String getHomeworkDir() {
        return homeworkDir;
    }
    //@Value("#{config['homeworkDir']}")
    @Value("${homeworkDir}")
    public void setHomeworkDir(String homeworkDir) {
        this.homeworkDir = homeworkDir;
    }
}
