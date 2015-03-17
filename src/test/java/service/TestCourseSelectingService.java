package service;

import org.demo.dao.ICourseSelectingDao;
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

    private ICourseSelectingDao seletingDao;
    public void test() {

    }

    public ICourseSelectingDao getSeletingDao() {
        return seletingDao;
    }
    @Resource
    public void setSeletingDao(ICourseSelectingDao seletingDao) {
        this.seletingDao = seletingDao;
    }
}
