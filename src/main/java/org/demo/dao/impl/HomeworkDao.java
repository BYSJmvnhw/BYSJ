package org.demo.dao.impl;

import org.demo.dao.IHomeworkDao;
import org.demo.model.HwHomework;
import org.demo.model.HwStudent;
import org.demo.tool.Page;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by jzchen on 2015/1/13.
 */
@Repository
public class HomeworkDao extends BaseDao<HwHomework> implements IHomeworkDao {
    @Override
    public Page<HwHomework> homeworkPage(Integer courseTeachingId, Integer studentId) {
        String hql = "from HwHomework hw where " +
                "hw.hwHomeworkInfo.hwCourseTeaching.id = ? " +
                "and hw.hwStudent.id = ?";
        return findPage(hql, new Object[]{courseTeachingId, studentId});
    }

    @Override
    public Page<HwHomework> submittedHomeworkPage(Integer hwInfoId, boolean submited) {
        String hql = "from HwHomework hw " +
                "where hw.hwHomeworkInfo.id = ? ";
        if(submited) {
            hql =  hql+ "and hw.url != '' ";
            return findPage(hql, new Object[] {hwInfoId});
        }else  {
            hql =  hql + "and hw.url = '' ";
            return findPage(hql, new Object[] {hwInfoId});
        }
    }

    @Override
    public HwHomework findHomework(Integer hwinfoId, HwStudent student) {
        String hql = "from HwHomework hw where "+
                "hw.hwHomeworkInfo.id = ? " +
                "and hw.hwStudent = ?";
        return findObject(hql, new Object[] {hwinfoId, student});
    }

    @Override
    public List<HwHomework> homeworkList(Integer hwInfoId) {
        String hql = "from HwHomework hw where " +
                "hwHomeworkInfo.id = ?";
        return list(hql,hwInfoId);
    }
}
