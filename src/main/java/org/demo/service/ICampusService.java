package org.demo.service;

import org.demo.model.HwCampus;

import java.util.List;
import java.util.Map;

/**
 * Created by peifeng on 2015/3/16.
 */
public interface ICampusService {
    public void addCampus(String name);
    public void updateCampus(int id, String name);
    public List<Map<String,Object>> getAllCampus();
}
