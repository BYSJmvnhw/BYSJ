package org.demo.dao;

import org.demo.dao.impl.BaseDao;
import org.demo.model.HwCourse;
import org.demo.tool.Page;

/**
 * Created by jzchen on 2015/1/13.
 */
public interface ICourseDao extends IBaseDao<HwCourse> {

    public Page<HwCourse> coursePage(Integer campusId, Integer collegeId, Integer majorId,  String courseNo, String courseName);
}
