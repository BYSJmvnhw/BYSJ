package org.demo.service;

import net.sf.json.JSONObject;
import org.demo.model.HwCourseSelecting;
import org.demo.model.HwStudent;
import org.demo.model.HwUser;

import java.util.List;
import java.util.Map;

/**
 * Created by jzchen on 2015/1/14.
 */
public interface IStudentService {

    public HwStudent findStudent(String studentNo);

    public HwStudent load(Integer id);

    public void updateStudnetAndUser(String json);

    public void deleteStudnetAndUser(Integer id);

    public JSONObject addStrdentAndUser(JSONObject jsonObject, HwUser createUser);

    public JSONObject studentPageByCTId(Integer courseTeachingId);

    public JSONObject studentDetail(Integer id);

    public void addCourseSelecting(Integer sId, Integer[] ctId);

    public JSONObject searchStudent(Integer campusId, Integer collegeId, Integer majorId, String studentNo, String name, String grade);

    public void addStudent(Integer ctId, Integer[] sIdArray);

    public Map<String,Object> studentMsg(Integer studentId);

}
