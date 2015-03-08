package org.demo.service.impl;

import org.demo.dao.IStudentDao;
import org.demo.model.HwCourseSelecting;
import org.demo.model.HwStudent;
import org.demo.model.Page;
import org.demo.service.IStudentService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by jzchen on 2015/1/14.
 */

@Service
public class StudentService implements IStudentService {

    private IStudentDao studentDao;

    @Override
    public HwStudent findStudent(String studentNo) {

        String hql  = "from HwStudent st where st.studentNo = ?";
        return studentDao.findObject(hql,studentNo);
    }

    public IStudentDao getStudentDao() {
        return studentDao;
    }
    @Resource
    public void setStudentDao(IStudentDao studentDao) {
        this.studentDao = studentDao;
    }
}
