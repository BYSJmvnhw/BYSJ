package org.demo.dao;

import org.demo.model.HwStudent;
import org.demo.tool.Page;

/**
 * Created by jzchen on 2015/1/13.
 */
public interface IStudentDao extends IBaseDao<HwStudent>{

    public HwStudent findStudnetByStudentNo(String studentNo);

    public HwStudent findDeleteStudnet(String studentNo);

    public Page<HwStudent> searchStudent(Integer campusId, Integer collegeId, Integer majorId, String studentNo, String name);
}
