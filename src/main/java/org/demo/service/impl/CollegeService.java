package org.demo.service.impl;

import org.demo.dao.ICampusDao;
import org.demo.dao.ICollegeDao;
import org.demo.model.HwCampus;
import org.demo.model.HwCollege;
import org.demo.service.ICollegeService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

/**
 * Created by jzchen on 2015/3/16 0016.
 */
@Service
public class CollegeService implements ICollegeService{

    private ICollegeDao collegeDao;
    private ICampusDao campusDao;

    @Override
    public HwCollege load(Integer id) {
        return collegeDao.load(id);
    }
    //增加学院
    //peifeng
    //2015-03-16下午
    public void addCollege(int campusId,String collegeName) {
        HwCollege college = new HwCollege();
        college.setCollegeName(collegeName);
        college.setHwCampus(campusDao.get(campusId));
        collegeDao.add(college);
    }
    //修改学院名和所属学校
    //peifeng
    //2015-03-16下午
    public void updateCollege(int collegeId,int campusId,String collegeName) {
        HwCollege college = collegeDao.get(collegeId);
        if(!college.getCollegeName().equals(collegeName)) {
            college.setCollegeName(collegeName);
        }
        if(college.getHwCampus().getId() != campusId) {
            college.setHwCampus(campusDao.get(campusId));
        }
        collegeDao.update(college);
    }
    //获得指定学校的所有学院信息
    //peifeng
    //2015-03-16下午
    public List<Map<String,Object>> getCollegeByCampus(int campusId) {
        HwCampus campus = campusDao.get(campusId);
        Set<HwCollege> colleges = campus.getHwColleges();
        Map<String,Object> map;
        List<Map<String,Object>> resultList = new ArrayList<Map<String, Object>>();
        //List<HwCollege> colleges = collegeDao.list("from HwCollege c where c.hwCampus.id=?",campusId);
        if(colleges.size() == 0) {
            return null;
        }
        for(HwCollege college : colleges) {
            map = new HashMap<String, Object>();
            map.put("collegeId",college.getId());
            map.put("collegeName",college.getCollegeName());
            resultList.add(map);
        }
        return resultList;
    }

    @Resource
    public void setCollegeDao(ICollegeDao collegeDao) {
        this.collegeDao = collegeDao;
    }
    @Resource
    public void setCampusDao(ICampusDao campusDao) {
        this.campusDao = campusDao;
    }
}
