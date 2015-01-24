package org.demo.service;

import org.demo.dao.IStudentDao;
import org.demo.model.HwStudent;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/1/14.
 */

@Service
public class StudentService implements IStudentService{

    private IStudentDao studentDao;

    @Override
    public HwStudent findStudent(String name) {
        String hql  = "from HwStudent st where st.name = ?";
        return studentDao.findWithHql(hql,name);
    }

    public IStudentDao getStudentDao() {
        return studentDao;
    }
    @Resource
    public void setStudentDao(IStudentDao studentDao) {
        this.studentDao = studentDao;
    }
}
