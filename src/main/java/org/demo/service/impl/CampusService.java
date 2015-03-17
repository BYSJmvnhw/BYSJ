package org.demo.service.impl;

import org.demo.dao.ICampusDao;
import org.demo.model.HwCampus;
import org.demo.service.ICampusService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by peifeng on 2015/3/16.
 */
@Service
public class CampusService implements ICampusService {
    private ICampusDao campusDao;
    @Resource
    public void setCampusDao(ICampusDao campusDao) {
        this.campusDao = campusDao;
    }
    //增加学校
    //peifeng
    //2015-03-16下午
    public void addCampus(String name) {
        HwCampus campus = new HwCampus();
        campus.setName(name);
        campusDao.add(campus);
    }
    //修改学校名
    //peifeng
    //2015-03-16下午
    public void updateCampus(int id,String name) {
        HwCampus campus = campusDao.get(id);
        campus.setName(name);
        campusDao.update(campus);
;    }
    public List<Map<String,Object>> getAllCampus() {
        Map<String,Object> map;
        List<Map<String,Object>> resultList = new ArrayList<Map<String, Object>>();
        List<HwCampus> campuses = campusDao.list("from HwCampus");
        if(campuses == null) {
            return null;
        }
        for(HwCampus campus : campuses) {
            map = new HashMap<String, Object>();
            map.put("campusId",campus.getId());
            map.put("campusName",campus.getName());
            resultList.add(map);
        }
        return resultList;
    }
}
