package org.demo.service;

import org.demo.model.HwCourse;

import java.util.List;
import java.util.Map;

/**
 * Created by jzchen on 2015/2/13 0013.
 */
public interface ICourseService {
    public HwCourse load(Integer cid);
    public void addCourse(int collegteId,String courseNo,String courseName);
    public List<Map<String,Object>> getCourseByCollege(int collegeId);
    public void updateCourse(int courseId,String courseNo,String courseName,int collegeId);
}
