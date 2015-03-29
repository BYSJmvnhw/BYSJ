package org.demo.service;

import net.sf.json.JSONObject;
import org.demo.model.HwCourse;
import org.demo.model.HwUser;

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

    public List<Map<String,Object>> emailList(Integer startYear, Integer schoolTerm, HwUser user);
    public JSONObject updateEmail(String email,Integer ctId);
    public JSONObject updateAndcheckEmail(Integer ctId, String email, String checkNumber);
}
