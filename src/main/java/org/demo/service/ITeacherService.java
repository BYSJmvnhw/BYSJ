package org.demo.service;

import org.demo.model.HwTeacher;
import org.demo.model.Page;
import org.demo.vo.ViewTeacher;

import java.util.List;

/**
 * Created by jzchen on 2015/1/25.
 */
public interface ITeacherService {
    public HwTeacher findTeacher(String teahcerNo);

    public List<ViewTeacher> findTeacherByNameNo(String queryParameter);
    //peifeng
    //2015-03-15晚上
    public Page<ViewTeacher> findTeacherList();
    //peifeng
    //2015-03-16上午
    public boolean addTeacher(int collegeId,int majorId,String teacherNo,String trueName,String sex,String mobile,String email,int createId,String createName);
    //peifeng
    //2015-03-16上午
    public boolean updateTeacher(int collegeId,int majorId,int userId,int teacherId,String trueName,String sex,String email);
    //peifeng
    //2015-3-16晚上
    public Page<ViewTeacher> findTeacherByCollege(int collegeId);
    //peifeng
    //2015-3-16晚上
    public Page<ViewTeacher> findTeacherByMajor(int majorId);
    //peifeng
    //2015-3-16晚上
    public ViewTeacher findTeacherByNo(String teacherNo);
}
