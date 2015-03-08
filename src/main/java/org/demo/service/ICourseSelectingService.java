package org.demo.service;

import org.demo.model.HwCourse;
import org.demo.model.HwCourseSelecting;
import org.demo.model.HwStudent;
import org.demo.model.Page;

import java.util.List;

/**
 * Created by jzchen on 2015/1/26.
 */
public interface ICourseSelectingService {

    public Page<HwCourseSelecting> selectingCourses(HwStudent student, Integer startYear, Integer schoolTerm);

    public HwCourseSelecting load(Integer courseSelectingId);

    public List<HwCourseSelecting> selectingCourses(HwCourse course, Integer startYear, Integer schoolTerm);
}
