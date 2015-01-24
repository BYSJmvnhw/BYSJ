package org.demo.action;

import javafx.scene.input.DataFormat;
import org.apache.commons.io.FileUtils;
import org.demo.model.HwHomework;
import org.demo.model.HwStudent;
import org.demo.model.HwUser;
import org.demo.service.IHomeworkService;
import org.demo.service.IStudentService;
import org.demo.service.IUserService;
import org.springframework.stereotype.Controller;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by jzchen on 2015/1/14.
 */

@Controller
public class UploadAction extends BaseAction{

    private IUserService userService;
    private IStudentService studentService;
    private IHomeworkService homeworkService;
    private static SimpleDateFormat sdf = new SimpleDateFormat("YYYYMMdd");

    private File file;
    //获得文件名和类型的重属性
    private String fileFileName;
    private String fileContentType;

    public String uploadPage() {
        if ( logined() )
            return SUCCESS;
        else {
            getContext().put("url", "login_loginPage.action");
            getContext().getSession().put("msg", "请先登陆");
            return "redirect";
        }
    }

    public String upload() {
    //输出文件名和文件类型;
        System.out.println("文件名 --> " + fileFileName);
        System.out.println("文件类型 ---> "+ fileContentType);
        System.out.println("路径 ---> "+ file.getPath());

        if( file != null ) {
            /* 模拟当前登陆用户 */
            HwUser user = userService.findUser("cjz");
            String name = user.getTrueName();
            System.out.println("名字 ---> "+  name);
            HwStudent st = studentService.findStudent(name);
            System.out.println("学生 ---> " + st.getName());
            /*作业号用时间搓还是随机数？？？*/
            String hwNo = st.getStudentNo() + sdf.format(new Date()) + (int)(Math.random() * 100000);
            String pathname = "D:/test/" + fileFileName;
            HwHomework hw = new HwHomework(st,hwNo,st.getName(),new Timestamp(System.currentTimeMillis()),pathname);
            homeworkService.add(hw);
            try {
                FileUtils.copyFile(file, new File(pathname));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "success";
    }


    public String getFileFileName() {
        return fileFileName;
    }


    //一定要有对应的getter和setter
    //且名字要以 *FileName和*FileContentType 结尾
    public void setFileFileName(String fileFileName) {
        this.fileFileName = fileFileName;
    }

    public String getFileContentType() {
        return fileContentType;
    }

    public void setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
    }

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public IUserService getUserService() {
        return userService;
    }
    @Resource
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

    public IStudentService getStudentService() {
        return studentService;
    }
    @Resource
    public void setStudentService(IStudentService studentService) {
        this.studentService = studentService;
    }

    public IHomeworkService getHomeworkService() {
        return homeworkService;
    }
    @Resource
    public void setHomeworkService(IHomeworkService homeworkService) {
        this.homeworkService = homeworkService;
    }
}
