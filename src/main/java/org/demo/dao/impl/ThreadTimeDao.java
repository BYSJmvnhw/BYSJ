package org.demo.dao.impl;

import org.demo.dao.IThreadTimeDao;
import org.demo.model.HwThreadTime;
import org.springframework.stereotype.Repository;

/**
 * Created by peifeng on 2015/3/19.
 */
@Repository
public class ThreadTimeDao extends BaseDao<HwThreadTime> implements IThreadTimeDao {
}
