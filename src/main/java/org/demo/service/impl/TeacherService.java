package org.demo.service.impl;

import org.demo.dao.IBaseDao;
import org.demo.dao.ITeacherDao;
import org.demo.model.HwTeacher;
import org.demo.model.Page;
import org.demo.service.ITeacherService;
import org.demo.vo.ViewTeacher;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by jzchen on 2015/1/25.
 */
@Service
public class TeacherService implements ITeacherService {

    private ITeacherDao teacherDao;
    @Resource
    public void setTeacherDao(ITeacherDao teacherDao) {
        this.teacherDao = teacherDao;
    }

    private IBaseDao baseDao;
    @Resource
    public void setBaseDao(IBaseDao baseDao) {
        this.baseDao = baseDao;
    }
    public HwTeacher findTeacher(String teahcerNo) {
        String hql = " from HwTeacher t where t.teacherNo = ? ";
        return teacherDao.findObject(hql,teahcerNo);
    }

    //peifeng
    public ViewTeacher findViewTeacher(String teahcerNo) {
        String hql = "select new org.demo.vo.ViewTeacher(t.id,t.teacherNo,t.name,\n" +
                "                     t.sex,t.email,t.hwCollege.id,t.hwMajor.id,t.hwUser.id) from HwTeacher t where t.teacherNo = ? ";
        return (ViewTeacher)baseDao.findObject(hql,teahcerNo);
    }
    //通过教师号或者教师名字查询，因为名字可能相同，所以返回列表
    public List<HwTeacher> findTeacherByNameNo(String queryParameter) {
        String hql = "from HwTeacher t where t.teacherNo = ? or t.name = ?";
        String param1 = queryParameter,param2 = queryParameter;
        Object[] args = {param1,param2};
        return teacherDao.list(hql,args);
    }
    //分页获取教师
    public Page<HwTeacher> findTeacherByPage() {
        String hql = "from HwTeacher";
        return teacherDao.findPage(hql);
    }



}
