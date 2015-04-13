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
    public Page<HwCourseTeaching> courseTeachingPage(Integer campusId, Integer collegeId, Integer majorId,
                                                     Integer startYear, Integer schoolTerm, String courseName, String teacherName) {
        StringBuilder hql = new StringBuilder("from HwCourseTeaching ct where 1=1 ");
        List<Object> params = new ArrayList<Object>();
        List<String> stringList = new ArrayList<String>();
        if( campusId != null ) {
            hql.append("and ct.hwCourse.hwCampus.id = ? ");
            params.add(campusId);
        }
        if( collegeId != null ){
            hql.append("and ct.hwCourse.hwCollege.id = ? " );
            params.add(collegeId);
        }
        if( majorId != null ) {
            hql.append("and ct.hwCourse.hwMajor.id = ? ");
            params.add(majorId);
        }
        if( startYear != null ) {
            hql.append("and ct.startYear = ? ");
            params.add(startYear);
        }
        if ( schoolTerm != null ) {
            hql.append("and ct.startYear = ? ");
            params.add(schoolTerm);
        }
        if( courseName != null && !courseName.equals("") ) {
            hql.append( "and ct.hwCourse.courseName like ? " );
            stringList.add("%" + courseName + "%");
        }
        if( teacherName != null && !teacherName.equals("") ) {
            hql.append("and ct.hwTeacher.name like ? ");
            stringList.add("%"+ teacherName +"%");
        }
        String[] str = new String[stringList.size()];
        for(int i=0; i<str.length; i++) {
            str[i] = stringList.get(i);
        }
        return findPage(hql.toString(), params.toArray(), str, 20);
    }

    @Override
    public List<HwCourseTeaching> courseTeachingList(Integer courseId,Integer startYear, Integer schoolTerm) {
        String hql = "from HwCourseTeaching ct where " +
                "ct.hwCourse.id = ? " +
                "and ct.startYear = ? " +
                "and ct.schoolTerm = ?";
        return list(hql, new Object[]{courseId, startYear, schoolTerm});
    }

    @Override
    public HwCourseTeaching findCourseTeaching(Integer courseId, Integer teacherId, Integer startYear, Integer schoolYear) {
        String hql = "from HwCourseTeaching ct where " +
                "ct.hwCourse.id = ? " +
                "and ct.hwTeacher.id = ? " +
                "and ct.startYear = ? " +
                "and ct.schoolTerm = ? ";
        return findObject(hql, new Object[]{courseId, teacherId, startYear, schoolYear});
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

    @Override
    public Page<HwCourseTeaching> courseTeachingPage(Integer campusId, Integer collegeId, Integer majorId, Integer startYear,
                                                     Integer schoolTerm, String teacherNo, String teacherName, String courseNo, String courseName) {
        StringBuilder hql = new StringBuilder("from HwCourseTeaching ct where 1=1 ");
        List<Object> params  = new ArrayList<Object>();
        List<String> stringList = new ArrayList<String>();
        if( campusId != null ){
            hql.append("and ct.hwCourse.hwCampus.id = ? ");
            params.add(campusId);
        }
        if( collegeId != null ){
            hql.append("and ct.hwCourse.hwCollege.id = ? ");
            params.add(collegeId);
        }
        if( majorId != null ){
            hql.append("and ct.hwCourse.hwMajor.id = ? ");
            params.add(majorId);
        }
        if( startYear != null ){
            hql.append("and ct.startYear = ? ");
            params.add(startYear);
        }
        if( schoolTerm != null ){
            hql.append("and ct.schoolTerm = ? ");
            params.add(schoolTerm);
        }
        if( teacherNo != null && !teacherNo.equals("") ){
            hql.append("and ct.hwTeacher.teacherNo like ? ");
            stringList.add("%" + teacherNo + "%");
        }if( teacherName != null && !teacherName.equals("") ){
            hql.append("and ct.heTeacher.name like ? ");
            stringList.add("%" + teacherName + "%");
        }
        if( courseNo !=  null && !courseNo.equals("") ){
            hql.append("and ct.hwCourse.courseNo like ? ");
            stringList.add("%" + courseNo + "%");
        }
        if( courseName != null && !courseName.equals("") ){
            hql.append("and ct.hwCourse.courseName like ? ");
            stringList.add("%" + courseName + "%");
        }
        String[] str = new String[stringList.size()];
        for(int i=0; i<str.length; i++) {
            str[i] = stringList.get(i);
        }
        return findPage(hql.toString(), params.toArray(), str, 20);
    }
}
