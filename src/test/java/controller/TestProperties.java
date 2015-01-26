package controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

/**
 * Created by jzchen on 2015/1/26.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:applicationContext.xml")
public class TestProperties {

    @Value("${jdbc.driverClass}")
    private String dir;

    @Test
    public void testload() throws IOException {
/*        Properties prop = new Properties();
        prop.load(new FileInputStream(new File(dir)));
        String s = prop.getProperty("homeworkDir");
        System.out.println(s);*/

        System.out.println(dir);
    }

    @Test
    public void testString() {
        String hql = " from User ";
        String newhql = "";
        String oldSub = hql.substring(0, hql.indexOf("from"));
        if ( oldSub.trim().equals("") )
            newhql = " select count(*) "  + hql;
        else
            newhql = hql.replace( oldSub, " select count(*) ");
        System.out.println(newhql);
    }

    @Test
    public void testDir () {

        SimpleDateFormat sdf = new SimpleDateFormat("YYYY");
        System.out.println(sdf.format(new Date()));
    }
}
