package org.demo.service.impl;

import org.demo.dao.ICollegeDao;
import org.demo.dao.ICourseDao;
import org.demo.model.HwCollege;
import org.demo.model.HwCourse;
import org.demo.service.ICourseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by jzchen on 2015/2/13 0013.
 */
@Service
public class CourseService implements ICourseService {

    private ICourseDao courseDao;
    private ICollegeDao collegeDao;
    @Override
    public HwCourse load(Integer cid) {
        return courseDao.load(cid);
    }
    //添加课程
    //peifeng
    //2015-03-16下午
    public void addCourse(int collegteId,String courseNo,String courseName) {
        HwCollege college = collegeDao.get(collegteId);
        HwCourse course = new HwCourse(courseNo,courseName);
        course.setHwCollege(college);
        courseDao.add(course);
    }
    //获得指定学院的所有课程
    //peifeng
    //2015-03-16下午
    public List<Map<String,Object>> getCourseByCollege(int collegeId) {
        Map<String,Object> map;
        List<Map<String,Object>> resultList = new ArrayList<Map<String, Object>>();
        List<HwCourse> courses = courseDao.list("from HwCourse m where m.hwCollege.id=?",collegeId);
        if(courses.size() == 0) {
            return null;
        }
        for(HwCourse course : courses) {
            map = new HashMap<String, Object>();
            map.put("courseId",course.getId());
            map.put("courseNo",course.getCourseNo());
            map.put("courseName",course.getCourseName());
            resultList.add(map);
        }
        return resultList;
    }
    //修改课程信息
    public void updateCourse(int courseId,String courseNo,String courseName,int collegeId) {
        HwCourse course = courseDao.get(courseId);
        if(!course.getCourseNo().equals(courseNo)) {
            course.setCourseNo(courseNo);
        }
        if(!course.getCourseName().equals(courseName)) {
            course.setCourseName(courseName);
        }
        if(course.getHwCollege().getId() != collegeId) {
            course.setHwCollege(collegeDao.get(collegeId));
        }
        courseDao.update(course);
    }

    @Resource
    public void setCourseDao(ICourseDao courseDao) {
        this.courseDao = courseDao;
    }
    @Resource
    public void setCollegeDao(ICollegeDao collegeDao) {
        this.collegeDao = collegeDao;
    }
}
