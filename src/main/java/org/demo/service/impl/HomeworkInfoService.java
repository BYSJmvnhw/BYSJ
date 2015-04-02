package org.demo.service.impl;

import org.demo.dao.ICourseTeachingDao;
import org.demo.dao.IHomeworkInfoDao;
import org.demo.model.HwCourseTeaching;
import org.demo.model.HwHomeworkInfo;
import org.demo.service.IHomeworkInfoService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Created by jzchen on 2015/4/2 0002.
 */
@Service
public class HomeworkInfoService implements IHomeworkInfoService {

    private IHomeworkInfoDao homeworkInfoDao;
    private ICourseTeachingDao courseTeachingDao;

    @Override
    public void updateOvertime(Integer ctId) {
        HwCourseTeaching courseTeaching = courseTeachingDao.load(ctId);
        //取出该任教关系的所有的作业布置信息。
        Set<HwHomeworkInfo> hwInfos = courseTeaching.getHwHomeworkInfos();
        //将作业的deadline和当前时间比较，过期的作业标记为过期
        Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());
        for(HwHomeworkInfo hwInfo : hwInfos) {
            if( hwInfo.getDeadline().compareTo(now) <0)  {
                hwInfo.setOvertime(true);
                homeworkInfoDao.update(hwInfo);
            }
        }
    }

    public IHomeworkInfoDao getHomeworkInfoDao() {
        return homeworkInfoDao;
    }

    @Resource
    public void setHomeworkInfoDao(IHomeworkInfoDao homeworkInfoDao) {
        this.homeworkInfoDao = homeworkInfoDao;
    }

    public ICourseTeachingDao getCourseTeachingDao() {
        return courseTeachingDao;
    }

    @Resource
    public void setCourseTeachingDao(ICourseTeachingDao courseTeachingDao) {
        this.courseTeachingDao = courseTeachingDao;
    }
}
