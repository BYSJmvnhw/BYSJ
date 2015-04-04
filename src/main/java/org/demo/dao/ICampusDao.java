package org.demo.dao;

import org.demo.model.HwCampus;

import java.util.List;

/**
 * Created by jzchen on 2015/1/25.
 */


public interface ICampusDao extends IBaseDao<HwCampus> {

    public List<HwCampus> allCampus();
}
