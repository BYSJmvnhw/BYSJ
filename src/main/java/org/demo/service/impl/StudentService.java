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

    @Override
    public void add(HwStudent student) {
        studentDao.add(student);
    }

    @Override
    public HwStudent load(Integer id) {
        return studentDao.load(id);
    }

    @Override
    public void delete(Integer id) {
        studentDao.delete(studentDao.load(id));
    }

    @Override
    public void update(HwStudent student) {
        update(student);
    }

    @Override
    public void deleteStudnet(Integer id) {
        HwStudent st = studentDao.load(id);
        st.setDeleteFlag(true);
        studentDao.update(st);
    }

    public IStudentDao getStudentDao() {
        return studentDao;
    }
    @Resource
    public void setStudentDao(IStudentDao studentDao) {
        this.studentDao = studentDao;
    }
}
