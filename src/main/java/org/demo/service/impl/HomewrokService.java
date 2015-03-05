package org.demo.service.impl;

import org.demo.dao.IHomeworkDao;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.Page;
import org.demo.service.IHomeworkService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/1/14.
 */

@Service
public class HomewrokService implements IHomeworkService {

    private IHomeworkDao homeworkDao;


    @Override
    public void add(HwHomework homework) {
        if( homework != null )
            homeworkDao.add(homework);
    }

    @Override
    public Page<HwHomework> submittedHomeworkList(HwHomeworkInfo hwHomeworkInfo, boolean submited) {
        String hql = "from HwHomework hw " +
                "where hw.hwHomeworkInfo = ? ";
        if(submited) {
            hql =  hql+ "and hw.url != '' ";
            return homeworkDao.findPage(hql, new Object[] {hwHomeworkInfo});
        }else  {
            hql =  hql + "and hw.url = '' ";
            return homeworkDao.findPage(hql, new Object[] {hwHomeworkInfo});
        }
    }

    public IHomeworkDao getHomeworkDao() {
        return homeworkDao;
    }

    @Resource
    public void setHomeworkDao(IHomeworkDao homeworkDao) {
        this.homeworkDao = homeworkDao;
    }
}
