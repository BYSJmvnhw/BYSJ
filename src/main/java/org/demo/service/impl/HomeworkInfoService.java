package org.demo.service.impl;

import org.demo.dao.IHomeworkInfoDao;
import org.demo.model.HwCourseTeaching;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.Page;
import org.demo.service.IHomeworkInfoService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/2/13 0013.
 */
@Service
public class HomeworkInfoService implements IHomeworkInfoService {

    private IHomeworkInfoDao homeworkInfoDao;

    @Override
    public Page<HwHomeworkInfo> assignedHomeworList(HwCourseTeaching hwCourseTeaching) {
        String hql = " from HwHomeworkInfo hi " +
                "where hi.hwCourseTeaching = ? ";
        return homeworkInfoDao.findPage(hql, hwCourseTeaching);
    }

    @Override
    public HwHomeworkInfo load(Integer id) {
        return homeworkInfoDao.load(id);
    }

    @Override
    public void add(HwHomeworkInfo hwHomeworkInfo) {
        homeworkInfoDao.add(hwHomeworkInfo);
    }

    @Override
    public void delete(Integer id) {
        homeworkInfoDao.delete(homeworkInfoDao.get(id));
    }

    @Override
    public void update(HwHomeworkInfo hwHomeworkInfo) {
        homeworkInfoDao.update(hwHomeworkInfo);
    }

    public IHomeworkInfoDao getHomeworkInfoDao() {
        return homeworkInfoDao;
    }

    @Resource
    public void setHomeworkInfoDao(IHomeworkInfoDao homeworkInfoDao) {
        this.homeworkInfoDao = homeworkInfoDao;
    }
}