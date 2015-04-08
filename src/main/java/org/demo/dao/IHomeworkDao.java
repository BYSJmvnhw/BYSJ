package org.demo.dao;

import org.demo.model.*;
import org.demo.tool.Page;

import java.sql.Timestamp;
import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */
public interface IHomeworkDao extends IBaseDao<HwHomework> {

    public  List homeworkList(Integer courseTeachingId, Integer studentId);

    public Page<HwHomework> submittedHomeworkPage(Integer hwInfoId, boolean submited);

    public HwHomework findHomework(Integer hwinfoId, HwStudent student);

    public List<HwHomework> homeworkList(Integer hwInfoId);

    public List<Object[]> countSubmitted(Integer courseId, Integer teacherId);

    public List<HwHomework>  unSubmitted(Integer sId);

    public List<HwHomework> recentHomework(Integer sId, Timestamp time);

    public List<HwHomework> feedback(Integer sId);

    public Long countUnsubmitted(HwStudent student);

    public Long countRecentHomework(HwStudent student ,Timestamp timestamp);

    public Long countFeedback(HwStudent student);

    public Object feedbackDetail(Integer hwInfoId, HwStudent student);

}
