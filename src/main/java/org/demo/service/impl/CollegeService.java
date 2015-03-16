package org.demo.service.impl;

import org.demo.dao.ICollegeDao;
import org.demo.model.HwCollege;
import org.demo.service.ICollegeService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/3/16 0016.
 */
@Service
public class CollegeService implements ICollegeService{

    private ICollegeDao collegeDao;

    @Override
    public HwCollege load(Integer id) {
        return collegeDao.load(id);
    }

    public ICollegeDao getCollegeDao() {
        return collegeDao;
    }

    @Resource
    public void setCollegeDao(ICollegeDao collegeDao) {
        this.collegeDao = collegeDao;
    }
}
