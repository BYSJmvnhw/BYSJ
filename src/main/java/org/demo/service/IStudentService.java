package org.demo.service;

import net.sf.json.JSONObject;
import org.demo.model.HwCourseSelecting;
import org.demo.model.HwStudent;
import org.demo.model.HwUser;

import java.util.List;

/**
 * Created by jzchen on 2015/1/14.
 */
public interface IStudentService {

    public HwStudent findStudent(String studentNo);

    //public HwStudent load(Integer id);

    public void updateStudnetAndUser(String json);

    public void deleteStudnetAndUser(Integer id);

    public void addStrdentAndUser(JSONObject jsonObject, HwUser createUser);

    public JSONObject studentPageByCTId(Integer courseTeachingId);

    public JSONObject studentDetail(Integer id);

    public JSONObject addCourseSelecting(String json);

    public JSONObject studentPage(Integer campusId, Integer collegeId, Integer majorId, String studentNo, String name);

/*    public JSONObject studentPage(Integer campusId, Integer collegeId, Integer majorId, String studentNo);

    public JSONObject studentPage(Integer campusId, Integer collegeId, Integer majorId);

    public JSONObject studentPage(Integer campusId, Integer collegeId);

    public JSONObject studentPage(Integer campusId);*/

}
