package org.demo.dao.impl;

import org.demo.dao.ICampusDao;
import org.demo.model.HwCampus;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by jzchen on 2015/1/25.
 */

@Repository
public class CampusDao extends BaseDao<HwCampus> implements ICampusDao {
    @Override
    public List<HwCampus> allCampus() {
        String hql = "from HwCampus";
        return list(hql);
    }
}
