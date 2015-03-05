package org.demo.service.impl;

import org.demo.dao.ICourseTeachingDao;
import org.demo.dao.IHomeworkInfoDao;
import org.demo.dao.ITeacherDao;
import org.demo.model.*;
import org.demo.service.ICourseTeachingService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/2/12 0012.
 */
@Service
public class CourseTeachingService implements ICourseTeachingService {

    private ICourseTeachingDao courseTeachingDao;
    private ITeacherDao teacherDao;


    @Override
    public Page<HwCourseTeaching> teachingCourseLsit(HwTeacher teacher, Integer startYear, Integer schoolTerm) {
        String hql = "from HwCourseTeaching ct " +
                "where ct.hwTeacher = ? " +
                "and ct.startYear = ? " +
                "and ct.schoolTerm = ?";

        return courseTeachingDao.findPage(hql,new Object[] {teacher, startYear, schoolTerm});
    }

    @Override
    public HwCourseTeaching findCourseTeaching(HwCourse course, HwTeacher teacher) {
        String hql = " from HwCourseTeaching ct "+
                "where ct.hwCourse = ? " +
                "and ct.hwTeacher = ?";
        return courseTeachingDao.findObject(hql,new Object[] {course, teacher});
    }

    @Override
    public HwCourseTeaching load(Integer courseTeachingId) {
        return courseTeachingDao.load(courseTeachingId);
    }


    public ICourseTeachingDao getCourseTeachingDao() {
        return courseTeachingDao;
    }

    @Resource
    public void setCourseTeachingDao(ICourseTeachingDao courseTeachingDao) {
        this.courseTeachingDao = courseTeachingDao;
    }

    public ITeacherDao getTeacherDao() {
        return teacherDao;
    }

    @Resource
    public void setTeacherDao(ITeacherDao teacherDao) {
        this.teacherDao = teacherDao;
    }


}
