package org.demo.service.impl;

import net.sf.json.JSONObject;
import org.demo.dao.ICourseTeachingDao;
import org.demo.model.HwCourse;
import org.demo.model.HwCourseSelecting;
import org.demo.model.HwCourseTeaching;
import org.demo.model.HwStudent;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.demo.service.IExportExcelService;
import org.demo.tool.GetRealPath;
import org.springframework.stereotype.Service;

/**
 * Created by peifeng on 2015/3/25.
 */
@Service
public class ExportExcelService implements IExportExcelService{

    private ICourseTeachingDao courseTeachingDao;
    @Resource
    public void setCourseTeachingDao(ICourseTeachingDao courseTeachingDao) {
        this.courseTeachingDao = courseTeachingDao;
    }


    //获得某教师的某门课的所有学生
    public List<HwStudent> getStudents(int teacherId,int courseId,int startYear,int schoolTerm) {
        String hql = "from HwCourseTeaching ct where ct.hwTeacher.id=? and ct.hwCourse.id=? and ct.startYear=? and ct.schoolTerm=?";
        Integer[] param = {teacherId,courseId,startYear,schoolTerm};
        HwCourseTeaching hct = courseTeachingDao.findObject(hql,param);
        if(hct == null) {
            return null;
        }
        List<HwCourseSelecting> hcs = new ArrayList<HwCourseSelecting>();
        hcs.addAll(hct.getHwCourseSelectings());
        if(hcs == null) {
            return null;
        }
        List<HwStudent> students = new ArrayList<HwStudent>();
        for(HwCourseSelecting cs : hcs) {
            students.add(cs.getHwStudent());
        }
        return students;
    }
    //获得该教师的所有课程
    public List<HwCourse> getCourses(int teacherId,int startYear,int schoolTerm) {
        String hql = "from HwCourseTeaching ct where ct.hwTeacher.id=? and ct.startYear=? and ct.schoolTerm=?";
        Integer[] param = {teacherId,startYear,schoolTerm};
        List<HwCourseTeaching> cts = courseTeachingDao.list(hql,param);
        if(cts == null) {
            return null;
        }
        List<HwCourse> courses = new ArrayList<HwCourse>();
        for(HwCourseTeaching ct:cts) {
            courses.add(ct.getHwCourse());
        }
        return courses;
    }
    //导出学生Excel表格
    public boolean saveStudentExcel(List<HwStudent> students,String Directory) {
        // 第一步，创建一个workbook，对应一个Excel文件
        HSSFWorkbook wb = new HSSFWorkbook();
        // 第二步，在workbook中添加一个sheet,对应Excel文件中的sheet
        HSSFSheet sheet = wb.createSheet("学生表一");
        // 第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short
        HSSFRow row = sheet.createRow(0);
        // 第四步，创建单元格，并设置值表头 设置表头居中
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式
        HSSFCell cell = row.createCell(0);cell.setCellValue("学号");cell.setCellStyle(style);
        cell = row.createCell(1);cell.setCellValue("姓名");cell.setCellStyle(style);
        cell = row.createCell(2);cell.setCellValue("性别");cell.setCellStyle(style);
        cell = row.createCell(3);cell.setCellValue("学校");cell.setCellStyle(style);
        cell = row.createCell(4);cell.setCellValue("学院");cell.setCellStyle(style);
        cell = row.createCell(5);cell.setCellValue("专业");cell.setCellStyle(style);
        cell = row.createCell(6);cell.setCellValue("年级");cell.setCellStyle(style);
        cell = row.createCell(7);cell.setCellValue("班级");cell.setCellStyle(style);
        cell = row.createCell(8);cell.setCellValue("邮箱");cell.setCellStyle(style);
        if(students == null|| students.size() == 0){return false;}
        for(int i = 0;i < students.size();i++) {
            row = sheet.createRow(i+1);
            HwStudent student = students.get(i);
            row.createCell(0).setCellValue(student.getStudentNo());
            row.createCell(1).setCellValue(student.getName());
            row.createCell(2).setCellValue(student.getSex());
            row.createCell(3).setCellValue(student.getHwCampus().getName());
            row.createCell(4).setCellValue(student.getHwCollege().getCollegeName());
            row.createCell(5).setCellValue(student.getHwMajor().getName());
            row.createCell(6).setCellValue(student.getGrade());
            row.createCell(7).setCellValue(student.getClass_());
            row.createCell(8).setCellValue(student.getEmail());
        }
        try {
            FileOutputStream writer = new FileOutputStream(Directory);
            wb.write(writer);
            writer.close();
            return true;
        }catch(Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }
    //导出课程表
    public void saveCourseExcel(List<HwCourse> courses,String Directory,int startYear,int schoolTerm) {
        // 第一步，创建一个workbook，对应一个Excel文件
        HSSFWorkbook wb = new HSSFWorkbook();
        // 第二步，在workbook中添加一个sheet,对应Excel文件中的sheet
        HSSFSheet sheet = wb.createSheet("课程表一");
        // 第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short
        HSSFRow row = sheet.createRow(0);
        // 第四步，创建单元格，并设置值表头 设置表头居中
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 创建一个居中格式
        HSSFCell cell = row.createCell(0);cell.setCellValue("课程编号");cell.setCellStyle(style);
        cell = row.createCell(1);cell.setCellValue("课程名");cell.setCellStyle(style);
        cell = row.createCell(2);cell.setCellValue("学校");cell.setCellStyle(style);
        cell = row.createCell(3);cell.setCellValue("学院");cell.setCellStyle(style);
        cell = row.createCell(4);cell.setCellValue("任课学年");cell.setCellStyle(style);
        cell = row.createCell(5);cell.setCellValue("任课学期");cell.setCellStyle(style);
        if(courses == null|| courses.size() == 0){return;}
        for(int i = 0;i < courses.size();i++) {
            row = sheet.createRow(i+1);
            HwCourse course = courses.get(i);
            row.createCell(0).setCellValue(course.getCourseNo());
            row.createCell(1).setCellValue(course.getCourseName());
            row.createCell(2).setCellValue(course.getHwCollege().getHwCampus().getName());
            row.createCell(3).setCellValue(course.getHwCollege().getCollegeName());
            row.createCell(4).setCellValue(startYear);
            row.createCell(5).setCellValue(schoolTerm);
        }
        try {
            FileOutputStream writer = new FileOutputStream(Directory);
            wb.write(writer);
            writer.close();
        }catch(Exception ex) {
            ex.printStackTrace();
        }
    }
    public JSONObject getStudentExcel(int teacherId,int courseId,int startYear,int schoolTerm) {
        JSONObject jsonresult = new JSONObject();jsonresult.clear();
        List<HwStudent> students = getStudents(teacherId,courseId,startYear,schoolTerm);
        if(students == null || students.size() == 0) {
            jsonresult.put("status",false);jsonresult.put("message","学生数为空");
            return jsonresult;
        }
        String flodername = GetRealPath.getRealPath() + "/excel/";
        File floder = new File(flodername);
        if(!floder .exists()  && !floder .isDirectory()) {
            floder .mkdir();
        }
        String filename = System.currentTimeMillis()+".xls";
        String directory = flodername + filename;
        String url = "/excel/" + filename;
        boolean result = saveStudentExcel(students,directory);
        if(result == true) {
            jsonresult.put("status",true);jsonresult.put("message","操作成功");jsonresult.put("url",url);
            return jsonresult;
        }else {
            jsonresult.put("status",false);jsonresult.put("message","操作失败");
            return jsonresult;
        }
    }
}
