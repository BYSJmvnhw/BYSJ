package org.demo.dao;

import org.demo.model.HwCourseTeaching;
import org.demo.model.HwTeacher;
import org.demo.tool.Page;

import java.util.List;

/**
 * Created by jzchen on 2015/2/12 0012.
 */
public interface ICourseTeachingDao extends IBaseDao<HwCourseTeaching>{

    public Page<HwCourseTeaching> courseTeachingPage(HwTeacher teacher, Integer startYear, Integer schoolTerm);

    public List emailList(HwTeacher teacher, Integer startYear, Integer schoolTerm);

    public Page<HwCourseTeaching> courseTeachingPage(Integer campusId, Integer collegeId, Integer majorId,
                                                     Integer startYear, Integer schoolTerm, String courseName, String teacherName);

    public List<HwCourseTeaching> courseTeachingList(Integer courseId, Integer startYear, Integer schoolTerm);

    public HwCourseTeaching findCourseTeaching(Integer courseId, Integer teacherId,Integer startYear, Integer schoolYear);


}
