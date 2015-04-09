package org.demo.service;

import net.sf.json.JSONObject;
import org.demo.model.HwCourse;
import org.demo.model.HwCourseSelecting;
import org.demo.model.HwCourseTeaching;
import org.demo.model.HwUser;
import org.demo.tool.Page;

import java.util.ArrayList;
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

    //ChenJianzhao
    public List<Map<String,Object>> emailList(Integer startYear, Integer schoolTerm, HwUser user);

    public JSONObject updateEmail(String email, String password, Integer ctId);

    public JSONObject updateAndcheckEmail(Integer ctId, String email, String password, String checkNumber);

    public Page searchCourse(Integer campustId, Integer collegeId, Integer MajorId,  String courseNo, String courseName);

    public Page searchCourseTeaching(Integer campustId, Integer collegeId, Integer MajorId,
                                     Integer startYear, Integer schoolTerm, String courseName, String teacherName );

    public JSONObject addCourse(Integer campusId, Integer collegeId, Integer majorId, String courseNo, String courseName);

    public void deleteCourse(Integer courseId);

    public void updateCourse(Integer courseId, Integer campusId, Integer collegeId, Integer majorId, String courseName);

    public List<Map<String, Object>> courseTeachingList(Integer courseId,Integer startYear, Integer schoolTerm );

    public void addCourseTeaching(Integer courseId, Integer[] teacherId, Integer startYear, Integer schoolTerm);

    public List<Map<String,Object>> courseList(Integer studentId, Integer startYear, Integer schoolTerm);

    public Page<Map<String, Object>> studentList(Integer courseId,Integer startYear, Integer schoolTerm,String teacherNo, String teacherName );

    public List<Map<String,Object>> searchCourseTeaching(Integer courseId, Integer startYear, Integer schoolTerm );

    public void addCourseSelecting(Integer studentId, Integer[] courseTeachingId);
}
