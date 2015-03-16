package org.demo.service.impl;

import org.demo.dao.IMajorDao;
import org.demo.model.HwMajor;
import org.demo.service.IMajorService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by jzchen on 2015/3/16 0016.
 */
@Service
public class MajorService implements IMajorService{

    private IMajorDao majorDao;
    @Override
    public HwMajor load(Integer id) {
        return majorDao.load(id);
    }

    public IMajorDao getMajorDao() {
        return majorDao;
    }

    @Resource
    public void setMajorDao(IMajorDao majorDao) {
        this.majorDao = majorDao;
    }
}
