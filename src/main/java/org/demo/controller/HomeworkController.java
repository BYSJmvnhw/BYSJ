package org.demo.controller;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.demo.model.*;
import org.demo.service.*;
import org.demo.tool.UserType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.AbstractJsonpResponseBodyAdvice;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Map;

/**
 * Created by jzchen on 2015/1/25.
 */
@Controller
@RequestMapping("/homework")
public class HomeworkController {
    /**
     * 用于解决Jsonp跨域问题
     */
    @ControllerAdvice
    private static class JsonpAdvice extends AbstractJsonpResponseBodyAdvice {
        public JsonpAdvice() {
            super("callback");
        }
    }

    //private String homeworkBaseDir;
    private IHomeworkService homeworkService;
    private IStudentService studentService;
    private IHomeworkInfoService homeworkInfoService;

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
    @RequestMapping(value = "/courseList", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject courseList(Integer startYear, Integer schoolTerm, HttpServletRequest request) {
        /** 获取用户类型，学生返回选课列表，教师返回授课列表*/
        UserType userType = (UserType) request.getSession().getAttribute("userType");
        HwUser user = (HwUser) request.getSession().getAttribute("loginUser");

        try{
            /** 学生返回选课列表 */
            if( userType == UserType.STUDENT ) {
                /**查找选课关系*/
                return homeworkService.courseSelectingPage(user, startYear, schoolTerm);
            }
            /** 教师返回授课列表 */
            else {
                return  homeworkService.courseTeachingPage(user, startYear, schoolTerm);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
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
     * @param cid 教师为授课关系id
     * @param request http请求
     * @return  学生返回布置作业列表，教师返回布置作业列表Json分页
     * */
    @RequestMapping(value = "/homeworkInfoList", method = RequestMethod.GET)
    @ResponseBody
    public Object homeworkInfoList(Integer cid, HttpServletRequest request)  {
        try {
            HwUser user = (HwUser)request.getSession().getAttribute("loginUser");
            homeworkInfoService.updateOvertime(cid);
            return homeworkService.homeworListInfo(cid, user);
        } catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
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
     public JSONObject homeworkInfoDetail(Integer hwInfoId) {
        try{
            return homeworkService.homeworkInfoDetail(hwInfoId);
        }catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
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
    public JSONObject homeworkList(Integer hwInfoId,boolean submited) {
        try{
            return homeworkService.submittedHomeworkPage(hwInfoId, submited);
        }catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
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
    public JSONObject addHomeworkInfo(String jsonObject, HttpServletRequest request) {
         try {
             HwUser user = (HwUser) request.getSession().getAttribute("loginUser");
             homeworkService.addHomeworkInfo(jsonObject, user);
             return getSuccessResultJsonObject();
         } catch (Exception e) {
             e.printStackTrace();
             JSONObject result = getFailResultJsonObject();
             result.put("msg",e.getMessage());
             return result;
         }
    }

    /**
     * 删除作业信息，同时将级联删除该次作业信息对应的所有学生作业
     * @param hwInfoId 需要删除的作业信息id
     * */
    @RequestMapping(value = "/deleteHomeworkInfo", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject deleteHomeworkInfo(Integer hwInfoId) throws Exception{
        try {
            homeworkService.deleteHomeworkInfo(hwInfoId);
            return getSuccessResultJsonObject();
        }catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 为作业评分和写评语
     * @param hwId 作业id
     * @param mark 分数
     * @param comment 评语
     * @return json请求结果
     */
    @RequestMapping(value = "/markHomework", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject markHomework(Integer hwId, String mark, String comment) {
        try{
            homeworkService.updateHomework(hwId, mark, comment);
            return getSuccessResultJsonObject();
        } catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
    *  学生作业上传 Controller
    * */
    @RequestMapping(value = "/upload", method = RequestMethod.GET)
    public String upload(HttpServletRequest request) {
        return "homework/upload";
    }

    /**
     *
     * @param hw work文件
     * @param hwinfoId 作业信息id
     * @param request httpRequest
     * @return
     * @throws IOException
     */
    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject upload(@RequestParam MultipartFile hw, Integer hwinfoId, HttpServletRequest request) throws IOException {
        HwUser user = (HwUser)request.getSession().getAttribute("loginUser");
        /**备用目录*/
        String backupPath = request.getServletContext().getRealPath("/doc");
        try{
            homeworkService.upload(hw, hwinfoId, user, backupPath);
            return getSuccessResultJsonObject();
        }catch (Exception e){
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 根据作业信息id和当前登录用户获取用户该次作业评价
     * @param hwInfoId 作业信息id
     * @param request http 请求
     */
    @RequestMapping(value = "/comment", method = RequestMethod.GET)
    @ResponseBody
    public Object feedBack(Integer hwInfoId, HttpServletRequest request) {
        try {
            HwUser user = (HwUser)request.getSession().getAttribute("loginUser");
            Map resultMap =  homeworkService.comment(hwInfoId, user);
            //标记反馈为已读
            homeworkService.updateCheckedFlag(hwInfoId, user);
            return resultMap;
        } catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
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

    public IHomeworkInfoService getHomeworkInfoService() {
        return homeworkInfoService;
    }

    @Resource
    public void setHomeworkInfoService(IHomeworkInfoService homeworkInfoService) {
        this.homeworkInfoService = homeworkInfoService;
    }

    private JSONObject getFailResultJsonObject(){
        JSONObject result = new JSONObject();
        result.put("status","fail");
        return result;
    }
    private JSONObject getSuccessResultJsonObject(){
        JSONObject result = new JSONObject();
        result.put("status","success");
        return result;
    }
}
