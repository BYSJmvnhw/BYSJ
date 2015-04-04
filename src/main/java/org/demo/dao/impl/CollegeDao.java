package org.demo.dao.impl;

import org.demo.dao.ICollegeDao;
import org.demo.model.HwCampus;
import org.demo.model.HwCollege;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */

@Repository
public class CollegeDao extends BaseDao<HwCollege> implements ICollegeDao {

    @Override
    public List<HwCollege> collegeList(HwCampus campus) {
        String hql  = "from HwCollege c where " +
                "c.hwCampus = ? ";
        return list(hql, campus);
    }
}
