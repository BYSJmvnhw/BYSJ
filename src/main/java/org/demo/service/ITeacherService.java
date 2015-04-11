package org.demo.service;

import net.sf.json.JSONObject;
import org.demo.model.HwTeacher;
import org.demo.model.HwUser;
import org.demo.tool.Page;
import org.demo.vo.ViewTeacher;

import java.util.List;
import java.util.Map;

/**
 * Created by jzchen on 2015/1/25.
 */
public interface ITeacherService {
    public boolean addTeacher(JSONObject jo,HwUser createUser);
    public boolean updateTeacher(JSONObject jo);
    public boolean deleteTeacher(int tid);
    //jianzhao
    //2015-3-21上午
    public HwTeacher load(Integer id);
    public Page<ViewTeacher> searchTeacher(Integer campusId, Integer collegeId, Integer majorId, String teacherNo, String name);
    public List<Map<String,Object>> courseByTeacher(int tid,int starYear,int schoolTerm);
    //为老师选课程
    public void addTeacherSelectCourse(int tid,int[] cids,int startYear,int schoolTerm);
}
