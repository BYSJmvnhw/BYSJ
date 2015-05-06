package org.demo.service.impl;

import net.sf.json.JSONObject;
import org.demo.dao.ICheckEmailDao;
import org.demo.dao.IThreadTimeDao;
import org.demo.model.HwCheckEmail;
import org.demo.model.HwThreadTime;
import org.demo.service.ICheckEmailService;
import org.demo.service.IEmailService;
import org.demo.service.IThreadTimeService;
import org.demo.tool.GetPost;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * Created by peifeng on 2015/3/19.
 */
@Service
public class ThreadTimeService implements IThreadTimeService {

    private IThreadTimeDao threadTimeDao;
    @Resource
    public void setThreadTimeDao(IThreadTimeDao threadTimeDao) {
        this.threadTimeDao = threadTimeDao;
    }

    private JSONObject jsonresult;

    @Override
    public List<HwThreadTime> getData() {
        List<HwThreadTime> threadtimes = threadTimeDao.list("from HwThreadTime");
        return threadtimes;
    }

    @Override
    public JSONObject updateDate(int id, int hour,int minute,int second,String name) {

        HwThreadTime threadtime = threadTimeDao.get(id);
        if(threadtime == null)
        {
            jsonresult = new JSONObject();jsonresult.put("status","fail");
            return jsonresult;
        }
        threadtime.setHour(hour);
        threadtime.setMinute(minute);
        threadtime.setSecond(second);
        threadtime.setName(name);
        threadtime.setLastModifyDate(new Timestamp(new Date().getTime()));
        threadTimeDao.update(threadtime);
        jsonresult = new JSONObject();jsonresult.put("status","fail");
        return jsonresult;
    }
    public HwThreadTime get(int id){
        return threadTimeDao.get(id);
    }
}
