package org.demo.dao.impl;

import org.demo.dao.ICourseDao;
import org.demo.model.HwCourse;
import org.springframework.stereotype.Repository;

/**
 * Created by jzchen on 2015/1/13.
 */
@Repository
public class CourseDao extends BaseDao<HwCourse> implements ICourseDao {
}
