package service;

import org.demo.dao.ICourseSeletingDao;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/1/28.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class TestCourseSelectingService {

    private ICourseSeletingDao seletingDao;
    public void test() {

    }

    public ICourseSeletingDao getSeletingDao() {
        return seletingDao;
    }
    @Resource
    public void setSeletingDao(ICourseSeletingDao seletingDao) {
        this.seletingDao = seletingDao;
    }
}
