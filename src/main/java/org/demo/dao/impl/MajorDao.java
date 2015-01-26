package org.demo.dao.impl;

import org.demo.dao.IMajorDao;
import org.demo.model.HwMajor;
import org.springframework.stereotype.Repository;

/**
 * Created by jzchen on 2015/1/25.
 */

@Repository
public class MajorDao extends BaseDao<HwMajor> implements IMajorDao {
}
