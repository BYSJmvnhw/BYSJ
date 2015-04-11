package org.demo.dao.impl;

import org.demo.dao.ICourseTeachingDao;
import org.demo.model.HwCourse;
import org.demo.model.HwCourseTeaching;
import org.demo.model.HwTeacher;
import org.demo.tool.Page;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jzchen on 2015/2/12 0012.
 */
@Repository
public class CourseTeachingDao extends BaseDao<HwCourseTeaching> implements ICourseTeachingDao {
    @Override
    public Page<HwCourseTeaching> courseTeachingPage(HwTeacher teacher, Integer startYear, Integer schoolTerm) {
        String hql = "from HwCourseTeaching ct " +
                "where ct.hwTeacher = ? " +
                "and ct.startYear = ? " +
                "and ct.schoolTerm = ?";
        return findPage(hql,new Object[] {teacher, startYear, schoolTerm});
    }

    @Override
    public List emailList(HwTeacher teacher, Integer startYear, Integer schoolTerm) {
        String hql = "select ct.id as ctId, ct.hwCourse.courseName, ct.email from HwCourseTeaching ct " +
                "where ct.hwTeacher = ? " +
                "and ct.startYear = ? " +
                "and ct.schoolTerm = ? " +
                "order by ct.email" ;
        return this.list(hql, new Object[]{teacher,startYear,schoolTerm});
    }
    @Override
    public List<HwCourse> getCourses(int tid,int year,int term) {
        String hql = "from HwCourseTeaching ct " +
                "where ct.hwTeacher.id = ? " +
                "and ct.startYear = ? " +
                "and ct.schoolTerm = ?";
        List<HwCourseTeaching> cts = list(hql,new Object[]{tid,year,term});
        if(cts==null)return null;
        List<HwCourse> courses = new ArrayList<HwCourse>();
        for(HwCourseTeaching ct : cts) {
            courses.add(ct.getHwCourse());
        }
        return courses;
    }
}
