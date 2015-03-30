package org.demo.service.impl;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.demo.dao.IHomeworkDao;
import org.demo.dao.IHomeworkInfoDao;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.service.IMessageService;
import org.demo.tool.DateJsonValueProcessor;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.*;

/**
 * Created by jzchen on 2015/3/28 0028.
 */
@Service
public class MessageService implements IMessageService{

    private IHomeworkDao homeworkDao;
    private IHomeworkInfoDao homeworkInfoDao;
    @Override
    public JSONArray unSubmitedHomeworkList(Integer sId) {
        List<HwHomework> hwList = homeworkDao.unSubmitted(sId);
        List<Map<String,Object>> hwInfoList = new ArrayList<Map<String,Object>>();
        for(HwHomework hw : hwList) {
            HwHomeworkInfo hwInfo = hw.getHwHomeworkInfo();
            Map<String,Object> hwInfoMap = new HashMap<String, Object>();
            hwInfoMap.put("hwInfoId",hwInfo.getId());
            hwInfoMap.put("courseName",hwInfo.getCourseName());
            hwInfoMap.put("title",hwInfo.getTitle());
            hwInfoMap.put("deadline",hwInfo.getDeadline());
            hwInfoList.add(hwInfoMap);
        }
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.registerJsonValueProcessor(Timestamp.class, new DateJsonValueProcessor());
        return JSONArray.fromObject(hwInfoList,jsonConfig);
    }

    @Override
    public JSONArray recentHomework(Integer sId) {
        Calendar calendar  = Calendar.getInstance();
        //一个月之内的所有为到期作业，供重复提交。
        calendar.add(Calendar.MONTH, -1);
        List<HwHomework> hwList = homeworkDao.recentHomework(sId, new java.sql.Timestamp(calendar.getTimeInMillis()));
        List<Map<String,Object>> hwInfoList = new ArrayList<Map<String, Object>>();
        for(HwHomework hw : hwList){
            HwHomeworkInfo hwInfo = hw.getHwHomeworkInfo();
            Map<String,Object> hwInfoMap = new HashMap<String, Object>();
            hwInfoMap.put("hwInfoId",hwInfo.getId());
            hwInfoMap.put("courseName",hwInfo.getCourseName());
            hwInfoMap.put("title",hwInfo.getTitle());
            hwInfoMap.put("deadline",hwInfo.getDeadline());
            hwInfoList.add(hwInfoMap);
        }
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.registerJsonValueProcessor(Timestamp.class, new DateJsonValueProcessor());
        return JSONArray.fromObject(hwInfoList,jsonConfig);
    }

    public IHomeworkDao getHomeworkDao() {
        return homeworkDao;
    }

    @Resource
    public void setHomeworkDao(IHomeworkDao homeworkDao) {
        this.homeworkDao = homeworkDao;
    }

    public IHomeworkInfoDao getHomeworkInfoDao() {
        return homeworkInfoDao;
    }

    @Resource
    public void setHomeworkInfoDao(IHomeworkInfoDao homeworkInfoDao) {
        this.homeworkInfoDao = homeworkInfoDao;
    }
}
