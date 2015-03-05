package org.demo.service.impl;

import org.demo.dao.ICourseDao;
import org.demo.model.HwCourse;
import org.demo.service.ICourseService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/2/13 0013.
 */
@Service
public class CourseService implements ICourseService {

    private ICourseDao courseDao;
    @Override
    public HwCourse load(Integer cid) {
        return courseDao.load(cid);
    }

    public ICourseDao getCourseDao() {
        return courseDao;
    }

    @Resource
    public void setCourseDao(ICourseDao courseDao) {
        this.courseDao = courseDao;
    }
}
