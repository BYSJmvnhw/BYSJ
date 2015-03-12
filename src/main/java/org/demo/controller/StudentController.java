package org.demo.controller;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;
import org.demo.model.HwCourseSelecting;
import org.demo.model.Page;
import org.demo.service.ICourseSelectingService;
import org.demo.service.ICourseTeachingService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/3/12 0012.
 */
@Controller
@RequestMapping("/student")
public class StudentController {

    private ICourseSelectingService courseSelectingService;
    private ICourseTeachingService courseTeachingService;
    /**
     *
     * @param //cid 教师授课关系 courseTeaching id
     * @return 学生选课关系json分页，包含学生信息
     */
/*    @RequestMapping(value = "/studentList", method = RequestMethod.GET)
    @ResponseBody
    public String studentList(Integer cid) {
        Page<HwCourseSelecting> cs = courseSelectingService.selectingCoursePage(cid);
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.setExcludes(new String[]{"hwCourseTeaching"});
        jsonConfig.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
        return JSONObject.fromObject(cs, jsonConfig).toString();
    }*/

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
}
