package org.demo.dao;

import org.demo.model.HwHomework;
import org.demo.model.HwStudent;
import org.demo.tool.Page;

/**
 * Created by jzchen on 2015/1/13.
 */
public interface IHomeworkDao extends IBaseDao<HwHomework> {

    public Page<HwHomework>homeworkPage(Integer courseTeachingId, Integer studentId);

    public Page<HwHomework> submittedHomeworkPage(Integer hwInfoId, boolean submited);

    public HwHomework findHomework(Integer hwinfoId, HwStudent student);

    }
