package org.demo.dao.impl;

import org.demo.dao.IHomeworkInfoDao;
import org.demo.model.HwCourseTeaching;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.HwStudent;
import org.demo.tool.Page;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */
@Repository
public class HomeworkInfoDao extends BaseDao<HwHomeworkInfo> implements IHomeworkInfoDao {
    @Override
    public Page<HwHomeworkInfo> homeworListInfoPage(Integer courseTeachingId) {
        String hql = " from HwHomeworkInfo hi " +
                "where hi.hwCourseTeaching.id = ? " +
                "order by hi.id desc ";
        return findPage(hql, courseTeachingId);
    }

    @Override
    public List studentHomeworkLsit(HwCourseTeaching courseTeaching, HwStudent student) {
        String hql = "select hwInfo.id, hwInfo.title, hwInfo.overtime, hwInfo.deadline, hw.status, hwInfo.courseName  from HwHomework hw " +
                "join  hw.hwHomeworkInfo hwInfo " +
                //"on hw.hwHomeworkInfo.id = hwInfo.id " +
                "where " +
                "hwInfo.deleteFlag = false " +
                "and hwInfo.hwCourseTeaching = ? " +
                "and hw.hwStudent = ? " +
                "order by hwInfo.overtime asc, hw.status asc, hwInfo.deadline asc";
        return list(hql, new Object[] {courseTeaching, student});
    }

}
