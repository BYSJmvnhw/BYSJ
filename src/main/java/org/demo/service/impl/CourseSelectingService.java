package org.demo.service.impl;

import org.demo.dao.ICourseSeletingDao;
import org.demo.dao.IStudentDao;
import org.demo.model.HwCourse;
import org.demo.model.HwCourseSelecting;
import org.demo.model.HwStudent;
import org.demo.model.Page;
import org.demo.service.ICourseSelectingService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by jzchen on 2015/1/26.
 */

@Service
public class CourseSelectingService implements ICourseSelectingService {

    private IStudentDao studentDao;
    private ICourseSeletingDao courseSeletingDao;
    @Override
    public Page<HwCourseSelecting> selectingCourses(HwStudent student, Integer startYear, Integer schoolTerm) {

        //HwStudent student = studentDao.load(studentId);

        String hql = "from HwCourseSelecting cs " +
                "where cs.hwStudent = ? " +
                "and cs.hwCourseTeaching.startYear = ? " +
                "and cs.hwCourseTeaching.schoolTerm = ?";
        return courseSeletingDao.findPage(hql,new Object[] {student, startYear, schoolTerm});

    }

    @Override
    public HwCourseSelecting load(Integer courseSelectingId) {
        return courseSeletingDao.load(courseSelectingId);
    }

    @Override
    public  List<HwCourseSelecting> selectingCourses(HwCourse course, Integer startYear, Integer schoolTerm) {
        String hql = "from HwCourseSelecting cs where cs.hwCourse = ? " +
                "and startYear = ? " +
                "and schoolTerm = ? ";
        return courseSeletingDao.list(hql,new Object[] {course, startYear, schoolTerm});
    }


    public IStudentDao getStudentDao() {
        return studentDao;
    }
    @Resource
    public void setStudentDao(IStudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public ICourseSeletingDao getCourseSeletingDao() {
        return courseSeletingDao;
    }
    @Resource
    public void setCourseSeletingDao(ICourseSeletingDao courseSeletingDao) {
        this.courseSeletingDao = courseSeletingDao;
    }
}
