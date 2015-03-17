package org.demo.service.impl;

import org.demo.dao.ICollegeDao;
import org.demo.dao.IMajorDao;
import org.demo.model.HwCollege;
import org.demo.model.HwMajor;
import org.demo.service.IMajorService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

/**
 * Created by jzchen on 2015/3/16 0016.
 */
@Service
public class MajorService implements IMajorService{

    private IMajorDao majorDao;
    private ICollegeDao collegeDao;
    @Override
    public HwMajor load(Integer id) {
        return majorDao.load(id);
    }
    //增加专业
    //peifeng
    //2015-03-16下午
    public void addMajor(int collegeId,String name) {
        HwCollege college = collegeDao.get(collegeId);
        HwMajor major = new HwMajor();
        major.setName(name);
        major.setHwCollege(college);
        majorDao.add(major);
    }
    //获取指定学院的所有专业
    //peifeng
    //2015-03-16下午
    public List<Map<String,Object>> getMajorByCollege(int collegeId) {
        HwCollege college = collegeDao.get(collegeId);
        Set<HwMajor> majors = college.getHwMajors();
        Map<String,Object> map;
        List<Map<String,Object>> resultList = new ArrayList<Map<String, Object>>();
        //List<HwMajor> majors = majorDao.list("from HwMajor m where m.hwCollege.id=?",collegeId);
        if(majors.size() == 0) {
            return null;
        }
        for(HwMajor major : majors) {
            map = new HashMap<String, Object>();
            map.put("majorId",major.getId());
            map.put("majorName",major.getName());
            resultList.add(map);
        }
        return resultList;
    }
    public void updateMajor(int majorId,String majorName,int collegeId) {
        HwMajor major = majorDao.get(majorId);
        if(!major.getName().equals(majorName)) {
            major.setName(majorName);
        }
        if(major.getHwCollege().getId() != collegeId) {
            major.setHwCollege(collegeDao.get(collegeId));
        }
        majorDao.update(major);
    }

    @Resource
    public void setMajorDao(IMajorDao majorDao) {
        this.majorDao = majorDao;
    }
    @Resource
    public void setCollegeDao(ICollegeDao collegeDao) {
        this.collegeDao = collegeDao;
    }
}
