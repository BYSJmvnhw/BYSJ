package org.demo.service;

import org.demo.model.HwCourseTeaching;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.Page;

/**
 * Created by jzchen on 2015/2/13 0013.
 */
public interface IHomeworkInfoService {

    public Page<HwHomeworkInfo> assignedHomeworList(HwCourseTeaching hwCourseTeaching);

    public HwHomeworkInfo load(Integer id);

    public void add(HwHomeworkInfo hwHomeworkInfo);

    public void delete(Integer id);

}
