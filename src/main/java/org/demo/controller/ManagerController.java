package org.demo.controller;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;
import org.demo.model.HwTeacher;
import org.demo.service.ITeacherService;
import org.demo.vo.ViewTeacher;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * Created by peifeng on 2015/3/15.
 */
@Controller
public class ManagerController {

    private ITeacherService teacherService;
    @Resource
    public void setTeacherService(ITeacherService teacherService) {
        this.teacherService = teacherService;
    }
    private JSONObject jsonresult;

    /*
     * 教师管理
     *
     */




    @RequestMapping(value="/teachertest")
    @ResponseBody
    public HwTeacher getteacher(String teacherNo) {

        HwTeacher teacher = teacherService.findTeacher(teacherNo);
        //jsonresult = JSONObject.fromObject(teacher);
        return teacher;
    }
}
