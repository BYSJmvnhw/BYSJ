package dao;

import org.demo.dao.impl.StudentDao;
import org.demo.dao.impl.TeacherDao;
import org.demo.model.HwStudent;
import org.demo.tool.Page;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/1/27.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class TestStudentDao {

    private  StudentDao studentDao;
    private TeacherDao teacherDao;

    @Test
    public void testLoadCourseSelecting() {


        HwStudent student = studentDao.get(1);
        String hql = "from HwStudent s where s.id = 1 ";
        Page<HwStudent> p = studentDao.findPage(hql);
        for( HwStudent s : p.getData() ) {
            s.getName();
        }
        //System.out.println(student.getHwCourseSelectings());
       // System.out.println(student);
       // System.out.println(teacherDao.get(1));
    }

    public StudentDao getStudentDao() {
        return studentDao;
    }

    @Resource
    public void setStudentDao(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public TeacherDao getTeacherDao() {
        return teacherDao;
    }

    @Resource
    public void setTeacherDao(TeacherDao teacherDao) {
        this.teacherDao = teacherDao;
    }
}
