package org.demo.service;

import org.demo.model.*;

/**
 * Created by jzchen on 2015/2/12 0012.
 */
public interface ICourseTeachingService {

    public Page<HwCourseTeaching> teachingCourseLsit(HwTeacher teacher, Integer startYear, Integer schoolTerm);

    public HwCourseTeaching findCourseTeaching(HwCourse course, HwTeacher teacher);

    public HwCourseTeaching load(Integer courseTeachingId);
}
