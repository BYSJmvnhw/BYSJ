package org.demo.service;

import net.sf.json.JSONObject;
import org.demo.model.HwCourse;
import org.demo.model.HwStudent;

import java.util.List;

/**
 * Created by peifeng on 2015/3/25.
 */
public interface IExportExcelService {
    public List<HwStudent> getStudents(int teacherId, int courseId, int startYear, int schoolTerm);
    public List<HwCourse> getCourses(int teacherId, int startYear, int schoolTerm);
    //导出学生Excel表格
    public boolean saveStudentExcel(List<HwStudent> students, String Directory);
    //导出课程表
    public void saveCourseExcel(List<HwCourse> courses, String Directory, int startYear, int schoolTerm);
    public JSONObject getStudentExcel(int teacherId,int courseId,int startYear,int schoolTerm);
}
