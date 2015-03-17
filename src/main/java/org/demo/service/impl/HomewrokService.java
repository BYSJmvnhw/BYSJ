package org.demo.service.impl;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.apache.commons.io.FileUtils;
import org.demo.dao.ICourseSelectingDao;
import org.demo.dao.ICourseTeachingDao;
import org.demo.dao.IHomeworkDao;
import org.demo.dao.IHomeworkInfoDao;
import org.demo.model.*;
import org.demo.service.IHomeworkService;
import org.demo.tool.DateJsonValueProcessor;
import org.demo.tool.ObjectJsonValueProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.nio.file.NotDirectoryException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by jzchen on 2015/1/14.
 */

@Service
public class HomewrokService implements IHomeworkService {

    private String homeworkBaseDir;
    private IHomeworkDao homeworkDao;
    private ICourseSelectingDao courseSelectingDao;
    private ICourseTeachingDao courseTeachingDao;
    private IHomeworkInfoDao homeworkInfoDao;

    @Override
    public void add(HwHomework homework) {
        if( homework != null )
            homeworkDao.add(homework);
    }

    @Override
    public JSONObject submittedHomeworkPage(Integer hwInfoId, boolean submited) {
        Page page = homeworkDao.submittedHomeworkPage(hwInfoId, submited);
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[] { "hibernateLazyInitializer", "handler","hwCourse","hwHomeworkInfo","hwTeacher","hwStudent"});
        jsonConfig.registerJsonValueProcessor(Timestamp.class, new DateJsonValueProcessor("yyyy-MM-dd HH:mm:ss"));
        return JSONObject.fromObject(page, jsonConfig);
    }

    @Override
    public void load(Integer id) {
        homeworkDao.load(id);
    }

    @Override
    public void update(HwHomework homework) {
        homeworkDao.update(homework);
    }

    @Override
    public JSONObject homeworkPage(Integer courseTeachingId, Integer studentId) {
        Page page = homeworkDao.homeworkPage(courseTeachingId, studentId);
        JsonConfig jsonConfig = new JsonConfig();
        /**过滤简单属性*/
        jsonConfig.setExcludes(new String[] {"hibernateLazyInitializer", "handler","hwCourse","hwStudent",
                "hwTeacher","hwHomeworkInfo"});
        /**过滤复杂属性 hwHomeworkInfo*/
        jsonConfig.registerJsonValueProcessor(HwHomeworkInfo.class,
                new ObjectJsonValueProcessor(new String[]{"id","title","deadline","createDate","overtime"}, HwHomework.class));
        /**自解析Timestamp属性，避免JsonObject自动解析 */
        jsonConfig.registerJsonValueProcessor(Timestamp.class,new DateJsonValueProcessor("yyyy-MM-dd"));
        return JSONObject.fromObject(page, jsonConfig);
    }

    @Override
    public JSONObject courseSelectingPage(HwStudent student, Integer startYear, Integer schoolTerm) {
        Page page =  courseSelectingDao.courseSelectingPage(student, startYear, schoolTerm);
        Page newPage = new Page();
        List<HwCourseTeaching> list = new ArrayList<HwCourseTeaching>();
        /**获取选课关系中的授课关系，构造分页类*/
        for(Object o : (List)page.getData() ) {
            HwCourseSelecting cs =  (HwCourseSelecting) o;
            list.add(cs.getHwCourseTeaching());
        }
        newPage.setData(list);
        newPage.setPageSize(page.getPageSize());
        newPage.setTotalRecord(page.getTotalRecord());
        newPage.setPageOffsset(page.getPageOffsset());

        JsonConfig jsonConfig = new JsonConfig();
        /**过滤简单属性*/
        jsonConfig.setExcludes(new String[] {"hibernateLazyInitializer", "handler",
                "hwTeacher","hwHomeworkInfos","password","hwCourseSelectings","email"});
        /**过滤复杂属性*/
        jsonConfig.registerJsonValueProcessor( HwCourse.class,
                new ObjectJsonValueProcessor(new String[] {"id","courseNo","courseName"}, HwCourse.class) );
        return JSONObject.fromObject(newPage, jsonConfig);
    }

    @Override
    public JSONObject courseTeachingPage(HwTeacher teacher, Integer startYear, Integer schoolTerm) {
        Page page =  courseTeachingDao.courseTeachingPage(teacher, startYear, schoolTerm);
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[] {"hibernateLazyInitializer", "handler",
                "hwTeacher","hwHomeworkInfos","password","hwCourseSelectings","email"});
        jsonConfig.registerJsonValueProcessor( HwCourse.class,
                new ObjectJsonValueProcessor(new String[] {"id","courseNo","courseName"}, HwCourse.class) );
        return JSONObject.fromObject(page, jsonConfig);
    }

    @Override
    public JSONObject homeworListInfoPage(Integer courseTeachingId) {
        Page page = homeworkInfoDao.homeworListInfoPage(courseTeachingId);
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[]{"hwHomeworks","hwCourseTeaching","hwDesc","email","courseName","createDate","url",
                "hibernateLazyInitializer", "handler"});
        jsonConfig.registerJsonValueProcessor(Timestamp.class,new DateJsonValueProcessor("yyyy-MM-dd HH:mm:ss"));
        return JSONObject.fromObject(page, jsonConfig);
    }

    @Override
    public JSONObject homeworkInfoDetail(Integer hwInfoId) {
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[]{"hwHomeworks","hwCourseTeaching","url",
                "hibernateLazyInitializer", "handler"});
        jsonConfig.registerJsonValueProcessor(Timestamp.class,new DateJsonValueProcessor("yyyy-MM-dd HH:mm:ss"));
        return JSONObject.fromObject(homeworkInfoDao.load(hwInfoId), jsonConfig);
    }

    @Override
    public void addHomeworkInfo(String jsonObject, HwTeacher teacher) {
        /** 将前端传递过来的json字符串解析成JsonObject对象 */
        JSONObject jo = JSONObject.fromObject(jsonObject);
        /** 构造一个新的HwHomeworkInfo对象 */
        HwHomeworkInfo hwinfo = new HwHomeworkInfo();
        /** 从前端传递过来的json中解析出参数 */
        hwinfo.setTitle(jo.getString("title"));
        hwinfo.setHwDesc(jo.getString("hwDesc"));
        hwinfo.setCourseName(jo.getString("courseName"));
        hwinfo.setDeadline(new java.sql.Timestamp(jo.getLong("deadline")));
        Integer cid = jo.getInt("cid");

        /**查询出对应的courseTeaching*/
        //HwCourse course = courseService.load(jo.getInt("courseId"));
        //HwCourseTeaching courseTeaching = courseTeachingService.findCourseTeaching(course,teacher);
        HwCourseTeaching courseTeaching = courseTeachingDao.load(cid);

        /**往HwHomeworkInfo填入其他信息*/
        hwinfo.setCreateDate(new java.sql.Timestamp(System.currentTimeMillis()));
        hwinfo.setEmail(courseTeaching.getEmail());
        hwinfo.setHwCourseTeaching(courseTeaching);
        hwinfo.setOvertime(false);
        String url = "/" + courseTeaching.getStartYear().toString()
                + "/" + courseTeaching.getSchoolTerm().toString()
                + "/" + courseTeaching.getHwCourse().getCourseNo()
                + "/" + teacher.getTeacherNo() + "/";
        //+ "/" + hwinfo.getId() + "/" ;

        hwinfo.setUrl(url);
        homeworkInfoDao.add(hwinfo);

        /**查询出所有选课的学生
         * 初始化该次作业所有选课学生的作业。
         * */
        List<HwCourseSelecting> csList = courseSelectingDao.courseSelectingList(cid);
        for (HwCourseSelecting cs : csList) {
            //构建一个新的作业对象
            HwHomework hw = new HwHomework();
            hw.setHwStudent(cs.getHwStudent());
            hw.setHwCourse(cs.getHwCourseTeaching().getHwCourse());
            hw.setCheckedFlag(false);
            hw.setHwHomeworkInfo(hwinfo);
            hw.setHwTeacher(teacher);
            hw.setStudentName(cs.getHwStudent().getName());
            hw.setStudentNo(cs.getHwStudent().getStudentNo());
            hw.setTitle(hwinfo.getTitle());
            hw.setLastModifyDate(new java.sql.Timestamp(System.currentTimeMillis()));
            homeworkDao.add(hw);
        }
    }

    @Override
    public void upload(MultipartFile hw, Integer hwinfoId,HwStudent student, String backupPath ) throws IOException {
        HwHomeworkInfo hwinfo = homeworkInfoDao.load(hwinfoId);
        /**获取后缀*/
        String hwName = student.getStudentNo() + "_" +student.getName() + hw.getOriginalFilename().substring
                (hw.getOriginalFilename().lastIndexOf("."));
        String baseUrl = hwinfo.getUrl();
        String url = baseUrl + hwinfo.getId() + "/" + hwName;

        HwCourseTeaching ct = hwinfo.getHwCourseTeaching();
        String hwNo = ct.getStartYear().toString() + ct.getSchoolTerm().toString() +  ct.getHwCourse().getCourseNo()  + student.getStudentNo();
        HwHomework homework = homeworkDao.findHomework(hwinfoId, student);
        homework.setTitle(hwinfo.getTitle());
        homework.setUrl(url);
        homework.setHwNo(hwNo);
        homework.setSubmitDate(new java.sql.Timestamp(System.currentTimeMillis()));
        homeworkDao.update(homework);

        /**判断预设的目录的是否存在，不存在则使用web应用路径下的默认目录*/
        try {
            System.out.println( "BaseDir" + homeworkBaseDir);
            /* 若指定目录不存在，则抛异常*/
            File dirname = new File(homeworkBaseDir);
            if ( !dirname.isDirectory() )
                throw new NotDirectoryException( "homeworkDir" + homeworkBaseDir + " is not found."
                        +"[ files were all putted into "+ backupPath + "]");
        } catch (NotDirectoryException e ) {
            /**使用web应用路径下的默认目录*/
            homeworkBaseDir = backupPath;
            e.printStackTrace();
        }finally {
            //String finalDir = homeworkBaseDir + "/" + sdf.format(new Date()) ;
            System.out.println(homeworkBaseDir);
            //File f = new File( homeworkBaseDir + "/" + hw.getOriginalFilename() );
            File f = new File( homeworkBaseDir + "/doc/" + url );
            FileUtils.copyInputStreamToFile(hw.getInputStream(), f);
        }
    }

    @Override
    public void deleteHomeworkInfo(Integer hwInfoId) {
        homeworkInfoDao.delete(homeworkInfoDao.load(hwInfoId));
    }


    public IHomeworkDao getHomeworkDao() {
        return homeworkDao;
    }

    @Resource
    public void setHomeworkDao(IHomeworkDao homeworkDao) {
        this.homeworkDao = homeworkDao;
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

    public IHomeworkInfoDao getHomeworkInfoDao() {
        return homeworkInfoDao;
    }

    @Resource
    public void setHomeworkInfoDao(IHomeworkInfoDao homeworkInfoDao) {
        this.homeworkInfoDao = homeworkInfoDao;
    }

    public String getHomeworkBaseDir() {
        return homeworkBaseDir;
    }

    @Value("${homeworkDir}")
    public void setHomeworkBaseDir(String homeworkBaseDir) {
        this.homeworkBaseDir = homeworkBaseDir;
    }

}
