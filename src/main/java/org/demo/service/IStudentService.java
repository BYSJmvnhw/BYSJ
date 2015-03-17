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

    public void add(HwStudent student);

    public HwStudent load(Integer id);

    public void delete(Integer id);

    public void update(HwStudent student);

    public void deleteStudnetAndUser(Integer id);

    public void addStrdentAndUser(JSONObject jsonObject, HwUser createUser);

    public JSONObject studentPage(Integer courseTeachingId);
}
