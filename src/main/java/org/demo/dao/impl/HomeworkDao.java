package org.demo.dao.impl;

import org.demo.dao.IHomeworkDao;
import org.demo.model.*;
import org.demo.tool.HomeworkStatus;
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
            hql =  hql+ "and hw.url != '' " +
                    //批改完的作业放后面
                    "order by hw.status asc";

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
                "hw.hwHomeworkInfo.id = ? ";
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
        //通过sql连表l查询出所需要的字段
        String sql =
                /*最后一级查询查询出其他需要的信息*/
                "SELECT hw_homework_info.id, title, course_name,  deadline, overtime , FinalTable.submitted FROM hw_homework_info\n" +
                "INNER JOIN \n" +
                /*   #二级子查询出目标课程id和教师id对应的作业信息id记录，
                并通过左连接将因分组统计而被隐藏的作业信息id记录显示出来，并将null替换为0\n*/
                "   (SELECT DISTINCT MainTable.hwinfo_id, IFNULL(SubTable.subnum,0) AS submitted \n" +
                "   FROM hw_homework AS MainTable \n" +
                "   LEFT JOIN\n" +
                       /*#第一级子查询查询出目标课程id和教师id对应的作业信息id和分组统计的已交作业对应条数，
                       已交作业数为0的作业信息 id记录将不显示 \n"*/
                "       (SELECT  hw_homework.hwinfo_id, COUNT(id) AS subnum FROM hw_homework  \n" +
                "       WHERE hw_homework.teacher_id = ? \n" +
                "       AND hw_homework.course_id = ? \n" +
                "       AND hw_homework.url != '' \n" +
                "       GROUP BY hwinfo_id) AS SubTable \n" +
                "       ON MainTable.hwinfo_id = SubTable.hwinfo_id\n" +
                "   WHERE MainTable.teacher_id = ? AND MainTable.course_id = ? ) AS FinalTable \n" +
                "   ON hw_homework_info.id = FinalTable.hwinfo_id \n" +
                "WHERE hw_homework_info.delete_flag = false \n" +
                "ORDER BY overtime ASC, deadline ASC";

        return (List<Object[]>)listWithSql(sql, new Object[]{teacherId, courseId, teacherId, courseId});
    }

    @Override
    public List<HwHomework> recentHomework(Integer sId, Timestamp time) {
        String hql = "from HwHomework  hw where " +
                "hw.hwStudent.id =  ? " +
                "and hw.hwHomeworkInfo.overtime = false " +
                "and hw.hwHomeworkInfo.deadline > ? ";
        return list(hql, new Object[]{sId, time});
    }

    @Override
    public Long countUnsubmitted(HwStudent student) {
        String hql = "select count(1) from HwHomework hw where " +
                "hw.hwStudent = ? " +
                "and hw.url = '' ";
        return count(hql, student);
    }

    @Override
    public Long countRecentHomework(HwStudent student, Timestamp timestamp) {
        String hql = "select count(1) from HwHomework hw where " +
                "hw.hwStudent = ? " +
                "and hw.hwHomeworkInfo.deadline > ? ";
        return count(hql, new Object[]{student ,timestamp});
    }

    @Override
    public Long countFeedback(HwStudent student) {
        String hql = "select count(1) from HwHomework hw where " +
                "hw.hwStudent = ? " +
                //作业已经批改完
                "and hw.status = ?  " +
                //反馈未被学生查看
                "and hw.checkedFlag = false";
        return count(hql, new Object[]{student, HomeworkStatus.MARKED});
    }
}
