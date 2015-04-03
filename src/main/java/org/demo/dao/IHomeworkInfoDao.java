package org.demo.dao;

import org.demo.model.HwCourseTeaching;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.HwStudent;
import org.demo.tool.Page;

import java.sql.Timestamp;
import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */
public interface IHomeworkInfoDao extends IBaseDao<HwHomeworkInfo>{

    public Page<HwHomeworkInfo> homeworListInfoPage(Integer courseTeachingId);

 //   public List<HwHomeworkInfo> recentHomework(Integer sId, Timestamp time);

    public List<Object[]> studentHomeworkLsit(HwCourseTeaching courseTeaching, HwStudent student);

}
