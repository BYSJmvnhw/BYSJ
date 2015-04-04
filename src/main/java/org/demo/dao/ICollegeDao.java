package org.demo.dao;

import org.demo.model.HwCampus;
import org.demo.model.HwCollege;

import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */
public interface ICollegeDao extends IBaseDao<HwCollege>{
    public List<HwCollege> collegeList(HwCampus campus);
}
