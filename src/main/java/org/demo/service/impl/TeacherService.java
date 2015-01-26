package org.demo.service.impl;

import org.demo.dao.ITeacherDao;
import org.demo.model.HwTeacher;
import org.demo.service.ITeacherService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/1/25.
 */
@Service
public class TeacherService implements ITeacherService {

    private ITeacherDao teacherDao;

    public HwTeacher findTeacher(String teahcerNo) {
        String hql = " from HwTeacher t where t.teacherNo = ? ";
        return teacherDao.findObject(hql,teahcerNo);
    }

    public ITeacherDao getTeacherDao() {
        return teacherDao;
    }
    @Resource
    public void setTeacherDao(ITeacherDao teacherDao) {
        this.teacherDao = teacherDao;
    }
}
