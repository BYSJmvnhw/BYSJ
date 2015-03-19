package org.demo.dao;

import org.demo.model.HwCourseTeaching;
import org.demo.model.HwTeacher;
import org.demo.tool.Page;

/**
 * Created by jzchen on 2015/2/12 0012.
 */
public interface ICourseTeachingDao extends IBaseDao<HwCourseTeaching>{

    public Page<HwCourseTeaching> courseTeachingPage(HwTeacher teacher, Integer startYear, Integer schoolTerm);

}
