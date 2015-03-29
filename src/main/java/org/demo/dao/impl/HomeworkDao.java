package org.demo.dao.impl;

import org.demo.dao.IHomeworkDao;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.HwStudent;
import org.demo.tool.Page;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.sql.Timestamp;
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
                "hw.hwHomeworkInfo.id = ?";
        return list(hql,hwInfoId);
    }

    @Override
    public List<HwHomework> unSubmitted(Integer sId) {
        String hql = "from HwHomework hw where " +
                "hw.hwStudent.id = ? " +
                "and hw.url = '' " +
                "and hw.hwHomeworkInfo.overtime = false ";
        return list(hql, sId);
    }

    @Override
    public List<Object[]> countSubmitted(int courseId, int teacherId) {

/*        String sql = "SELECT DISTINCT MainTable.hwinfo_id, IFNULL(SubTable.subnum,0) AS submitted " +
                "FROM hw_homework AS MainTable " +
                "LEFT JOIN  " +
                "(SELECT  hw_homework.hwinfo_id, COUNT(id) AS subnum FROM hw_homework  WHERE " +
                "hw_homework.teacher_id = ? " +
                "AND hw_homework.course_id = ? " +
                "AND hw_homework.url != '' " +
                "GROUP BY hwinfo_id) AS SubTable " +
                "ON MainTable.hwinfo_id = SubTable.hwinfo_id " +
                "ORDER BY MainTable.hwinfo_id DESC ";*/

        String sql= "SELECT hw_homework_info.id, title, deadline, overtime , FinalTable.submitted FROM hw_homework_info " +
                "INNER JOIN " +
                "(SELECT DISTINCT MainTable.hwinfo_id, IFNULL(SubTable.subnum,0) AS submitted " +
                "FROM hw_homework AS MainTable " +
                "LEFT JOIN " +
                "(SELECT  hw_homework.hwinfo_id, COUNT(id) AS subnum FROM hw_homework  WHERE " +
                "hw_homework.teacher_id = ? " +
                "AND hw_homework.course_id = ? " +
                "AND hw_homework.url != '' " +
                "GROUP BY hwinfo_id) AS SubTable " +
                "ON MainTable.hwinfo_id = SubTable.hwinfo_id) AS FinalTable " +
                "ON hw_homework_info.id = FinalTable.hwinfo_id " +
                "ORDER BY overtime ASC, deadline ASC";

        return (List<Object[]>)listWithSql(sql, new Object[]{teacherId, courseId}, null);
    }

    @Override
    public List<HwHomework> recentHomework(Integer sId, Timestamp time) {
        String hql = "from HwHomework  hw where " +
                "hw.hwStudent.id =  ? " +
                "and hw.hwHomeworkInfo.overtime = false " +
                "and hw.hwHomeworkInfo.deadline > ? ";
        return list(hql, new Object[]{sId, time});
    }
}
