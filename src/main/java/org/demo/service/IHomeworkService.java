package org.demo.service;

import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.HwStudent;
import org.demo.model.Page;

/**
 * Created by jzchen on 2015/1/14.
 */
public interface IHomeworkService {

    public void add(HwHomework homework);

    public Page<HwHomework> submittedHomeworkList(HwHomeworkInfo hwHomeworkInfo, boolean submited);

    public void load(Integer id);

    public void update(HwHomework homework);

    public HwHomework findHomework(Integer hwinfoId, HwStudent student);
}
