package org.demo.dao.impl;

import org.demo.dao.ICourseDao;
import org.demo.model.HwCourse;
import org.demo.tool.Page;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */
@Repository
public class CourseDao extends BaseDao<HwCourse> implements ICourseDao {
    @Override
    public Page<HwCourse> coursePage(Integer campusId, Integer collegeId, Integer majorId, String courseNo, String courseName) {
        StringBuilder hql = new StringBuilder("from HwCourse c where 1=1 ");
        List<Object> param = new ArrayList<Object>();
        List<String> stringList = new ArrayList<String>();
        if( campusId != null ) {
            hql.append( "and c.hwCampus.id = ? ");
            param.add(campusId);
        }
        if( collegeId != null ) {
            hql.append( "and c.hwCollege.id = ? ");
            param.add(collegeId);
        }
        if( majorId != null ) {
            hql.append( "and c.hwMajor.id = ? " );
            param.add(majorId);
        }
        if( courseNo != null && !courseNo.equals("") ){
            hql.append("and c.courseNo like ? ");
            stringList.add("%" + courseNo + "%");
        }
        if ( courseName != null && !courseName.equals("") ) {
            hql.append( "and c.courseName like ? " );
            stringList.add( "%" + courseName + "%" );
        }
        String[] str = new String[stringList.size()];
        for(int i=0; i<str.length; i++) {
            str[i] = stringList.get(i);
        }
        return findPage(hql.toString(), param.toArray(), str, 20);
    }

    @Override
    public HwCourse findCourse(String courseNo) {
        String hql = "from HwCourse c where " +
                "c.courseNo = ? " +
                "and c.deleteFlag = false ";
        return findObject(hql,courseNo);
    }

    @Override
    public HwCourse findDeleteCourse(String courseNo) {
        ;String hql = "from HwCourse c where " +
                "c.courseNo = ? " +
                "and c.deleteFlag = true ";
        return findObject(hql,courseNo);
    }
}
