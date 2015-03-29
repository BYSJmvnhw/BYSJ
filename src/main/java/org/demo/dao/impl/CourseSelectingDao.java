package org.demo.dao.impl;

import org.demo.dao.ICourseSelectingDao;
import org.demo.model.HwCourseSelecting;
import org.demo.model.HwStudent;
import org.demo.tool.Page;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by jzchen on 2015/1/28.
 */
@Repository
public class CourseSelectingDao extends BaseDao<HwCourseSelecting> implements ICourseSelectingDao {
    @Override
    public Page<HwCourseSelecting> courseSelectingPage(Integer courseTeachingId) {
        String hql = "from HwCourseSelecting cs where cs.hwCourseTeaching.id = ?";
        return findPage(hql, courseTeachingId);
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
}
