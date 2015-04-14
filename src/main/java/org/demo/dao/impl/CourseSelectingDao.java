package org.demo.dao.impl;

import org.demo.dao.ICourseSelectingDao;
import org.demo.model.HwCourseSelecting;
import org.demo.model.HwCourseTeaching;
import org.demo.model.HwStudent;
import org.demo.tool.Page;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jzchen on 2015/1/28.
 */
@Repository
public class CourseSelectingDao extends BaseDao<HwCourseSelecting> implements ICourseSelectingDao {
    @Override
    public Page<HwCourseSelecting> courseSelectingPage(Integer courseTeachingId) {
        String hql = "from HwCourseSelecting cs where cs.hwCourseTeaching.id = ?";
        return findPage(hql, new Object[]{courseTeachingId},null,20);
    }

    @Override
    public Page<HwCourseSelecting> courseSelectingPage(HwStudent student, Integer startYear, Integer schoolTerm) {
        String hql = "from HwCourseSelecting cs " +
                "where cs.hwStudent = ? " +
                "and cs.hwCourseTeaching.startYear = ? " +
                "and cs.hwCourseTeaching.schoolTerm = ?";
        return findPage(hql, new Object[] {student, startYear, schoolTerm});
    }

    @Override
    public List<HwCourseSelecting> courseSelectingList(Integer courseTeachingId) {
        String hql = "from HwCourseSelecting cs where cs.hwCourseTeaching.id = ?";
        return list(hql,courseTeachingId);
    }

    @Override
    public Long countByCtId(Integer ctId) {
        String hql = "select count(*) from HwCourseSelecting cs where " +
                "cs.hwCourseTeaching.id = ? ";
        return count(hql, ctId);
    }

    @Override
    public HwCourseSelecting findCSByCTAndStudent(HwCourseTeaching courseTeaching, HwStudent student) {
        String hql = "from HwCourseSelecting cs where " +
                "cs.hwCourseTeaching = ? " +
                "and cs.hwStudent = ?";
        return findObject(hql, new Object[]{courseTeaching, student});
    }

    @Override
    public List<HwCourseSelecting> courseSelectingList(Integer studentId, Integer startYear, Integer schoolTerm) {
        String hql = "from HwCourseSelecting cs where " +
                "cs.hwStudent.id = ? " +
                "and hwCourseTeaching.startYear = ? " +
                "and hwCourseTeaching.schoolTerm = ? ";
        return list(hql, new Object[] {studentId, startYear, schoolTerm});
    }

    @Override
    public Page<HwCourseSelecting> courseSelectingList(Integer courseId, Integer startYear, Integer schoolTerm, String teacherNo, String teacherName) {
        List<String> stringList = new ArrayList<String>();
        StringBuilder hql  = new StringBuilder("from HwCourseSelecting cs where " +
                "cs.hwCourseTeaching.hwCourse.id = ?  " +
                "and cs.hwCourseTeaching.startYear = ? " +
                "and cs.hwCourseTeaching.schoolTerm = ? ");
        if( teacherNo!=null && !teacherNo.equals("") ){
            hql.append("and cs.hwCourseTeaching.hwTeacher.teacherNo like ? ");
            stringList.add( "%" + teacherNo+ "%");
        }
        if( teacherName!=null && !teacherName.equals("") ){
            hql.append("and cs.hwCourseTeaching.hwTeacher.name like ?  ");
            stringList.add("%"+ teacherName + "%");
        }
        String[] stringArray = new String[stringList.size()];
        for( int i =0; i<stringArray.length; i++ ){
            stringArray[i] = stringList.get(i);
        }

        return findPage(hql.toString(), new Object[]{courseId, startYear, schoolTerm}, stringArray, 20);
    }
}
