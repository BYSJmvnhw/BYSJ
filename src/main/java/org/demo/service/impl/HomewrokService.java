package org.demo.service.impl;

import org.demo.dao.IHomeworkDao;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.HwStudent;
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
    public Page<HwHomework> submittedHomeworkPage(HwHomeworkInfo hwHomeworkInfo, boolean submited) {
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

    @Override
    public void load(Integer id) {
        homeworkDao.load(id);
    }

    @Override
    public void update(HwHomework homework) {
        homeworkDao.update(homework);
    }

    @Override
    public HwHomework findHomework(Integer hwinfoId, HwStudent student) {
        String hql = "from HwHomework hw where "+
                "hw.hwHomeworkInfo.id = ? " +
                "and hw.hwStudent = ?";
        return homeworkDao.findObject(hql, new Object[] {hwinfoId, student});
    }

    public IHomeworkDao getHomeworkDao() {
        return homeworkDao;
    }

    @Resource
    public void setHomeworkDao(IHomeworkDao homeworkDao) {
        this.homeworkDao = homeworkDao;
    }
}
