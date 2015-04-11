package org.demo.dao;

import net.sf.json.JSONObject;
import org.demo.model.HwTeacher;
import org.demo.tool.Page;
import org.demo.vo.ViewTeacher;

/**
 * Created by jzchen on 2015/1/13.
 */
public interface ITeacherDao extends IBaseDao<HwTeacher> {
    public Page<ViewTeacher> searchTeacher(Integer campusId, Integer collegeId, Integer majorId, String teacherNo, String name);
    public HwTeacher findDeletedTeacher(String teacherNo);
}
