package org.demo.dao;

import org.demo.model.HwHomeworkInfo;
import org.demo.tool.Page;

/**
 * Created by jzchen on 2015/1/13.
 */
public interface IHomeworkInfoDao extends IBaseDao<HwHomeworkInfo>{

    public Page<HwHomeworkInfo> homeworListInfoPage(Integer courseTeachingId);
}
