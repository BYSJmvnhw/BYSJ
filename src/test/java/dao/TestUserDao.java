package dao;

import org.demo.dao.IUserDao;
import org.demo.dao.impl.UserDao;
import org.demo.model.HwUser;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.Date;

/**
 * Created by jzchen on 2015/1/13.
 */

//让Junit运行在Spring的测试环境下

//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class TestUserDao {

    private ApplicationContext ctx;

    private IUserDao userDao;

    @Test
    public void testAdd() {
        ctx=new ClassPathXmlApplicationContext("/applicationContext.xml");
        System.out.println(ctx);

        userDao = (UserDao)ctx.getBean("userDao");
        System.out.println(userDao);
        System.out.println("进入test");
        //HwUser u =  new HwUser("cjz","123","abc","我",new Timestamp(1));

       /* u.setUsername("cjz");
        u.setTrueName("陈键钊");
        u.setPassword("11111");*/
       //System.out.println(u);
        //userDao.add(u);
    }

    public IUserDao getUserDao() {
        return userDao;
    }

    @Resource
    public void setUserDao(IUserDao userDao) {
        this.userDao = userDao;
    }
}
