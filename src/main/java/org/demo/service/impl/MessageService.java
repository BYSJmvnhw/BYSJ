package org.demo.service.impl;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.demo.dao.IHomeworkDao;
import org.demo.dao.IHomeworkInfoDao;
import org.demo.dao.IStudentDao;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.HwStudent;
import org.demo.model.HwUser;
import org.demo.service.IMessageService;
import org.demo.tool.DateJsonValueProcessor;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.awt.*;
import java.sql.Timestamp;
import java.util.*;
import java.util.List;

/**
 * Created by jzchen on 2015/3/28 0028.
 */
@Service
public class MessageService implements IMessageService{

    private IHomeworkDao homeworkDao;
    private IHomeworkInfoDao homeworkInfoDao;
    private IStudentDao studentDao;
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
            hwInfoMap.put("status",hw.getStatus());
            hwInfoList.add(hwInfoMap);
        }
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.registerJsonValueProcessor(Timestamp.class, new DateJsonValueProcessor());
        return JSONArray.fromObject(hwInfoList,jsonConfig);
    }

    @Override
    public JSONArray recentHomeworkList(Integer sId) {
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
            hwInfoMap.put("status",hw.getStatus());
            hwInfoList.add(hwInfoMap);
        }
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.registerJsonValueProcessor(Timestamp.class, new DateJsonValueProcessor());
        return JSONArray.fromObject(hwInfoList,jsonConfig);
    }

    @Override
    public JSONArray feedback(Integer sId) {
        List<HwHomework> hwList = homeworkDao.feedback(sId);
        List<Map<String,Object>> hwInfoList = new ArrayList<Map<String, Object>>();
        for(HwHomework hw : hwList){
            HwHomeworkInfo hwInfo = hw.getHwHomeworkInfo();
            Map<String,Object> hwInfoMap = new HashMap<String, Object>();
            hwInfoMap.put("hwInfoId",hwInfo.getId());
            hwInfoMap.put("courseName",hwInfo.getCourseName());
            hwInfoMap.put("title",hwInfo.getTitle());
            hwInfoMap.put("deadline",hwInfo.getDeadline());
            hwInfoMap.put("status",hw.getStatus());
            hwInfoList.add(hwInfoMap);
        }
        JsonConfig jsonConfig = new JsonConfig();
        jsonConfig.registerJsonValueProcessor(Timestamp.class, new DateJsonValueProcessor());
        return JSONArray.fromObject(hwInfoList,jsonConfig);
    }

    @Override
    public Map message(HwUser user) {
        HwStudent student = studentDao.load(user.getTypeId());
        Long countUnsubmitted = homeworkDao.countUnsubmitted(student);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, -1);
        Long countRecentHomework = homeworkDao.countRecentHomework(student, new Timestamp(calendar.getTimeInMillis()));
        Long countFeedback = homeworkDao.countFeedback(student);
        Map<String,Object> resultMap = new HashMap<String, Object>();
        resultMap.put("unsubmitted",countUnsubmitted);
        resultMap.put("recentHomework",countRecentHomework);
        resultMap.put("feedback",countFeedback);
        return resultMap;
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

    public IStudentDao getStudentDao() {
        return studentDao;
    }

    @Resource
    public void setStudentDao(IStudentDao studentDao) {
        this.studentDao = studentDao;
    }
}
