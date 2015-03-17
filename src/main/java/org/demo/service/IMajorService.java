package org.demo.service;

import org.demo.model.HwMajor;

import java.util.List;
import java.util.Map;

/**
 * Created by jzchen on 2015/3/16 0016.
 */
public interface IMajorService {

    public HwMajor load(Integer id);
    public void addMajor(int collegeId,String name);
    public List<Map<String,Object>> getMajorByCollege(int collegeId);
    public void updateMajor(int majorId,String majorName,int collegeId);
}
