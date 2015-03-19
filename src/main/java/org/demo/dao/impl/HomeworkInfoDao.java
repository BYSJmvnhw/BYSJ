package org.demo.dao.impl;

import org.demo.dao.IHomeworkInfoDao;
import org.demo.model.HwHomeworkInfo;
import org.demo.tool.Page;
import org.springframework.stereotype.Repository;

/**
 * Created by jzchen on 2015/1/13.
 */
@Repository
public class HomeworkInfoDao extends BaseDao<HwHomeworkInfo> implements IHomeworkInfoDao {
    @Override
    public Page<HwHomeworkInfo> homeworListInfoPage(Integer courseTeachingId) {
        String hql = " from HwHomeworkInfo hi " +
                "where hi.hwCourseTeaching.id = ? ";
        return findPage(hql, courseTeachingId);
    }
}
