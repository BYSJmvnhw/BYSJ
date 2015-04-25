package org.demo.service.impl;

import net.sf.json.JSONObject;
import org.demo.dao.*;
import org.demo.model.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.demo.service.IExportExcelService;
import org.demo.tool.GetRealPath;
import org.demo.tool.UserType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

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
    private ICampusDao campusDao;
    @Resource
    public void setCampusDao(ICampusDao campusDao) {
        this.campusDao = campusDao;
    }
    private ICollegeDao collegeDao;
    @Resource
    public void setCollegeDao(ICollegeDao collegeDao) {
        this.collegeDao = collegeDao;
    }
    private IStudentDao studentDao;
    @Resource
    public void setStudentDao(IStudentDao studentDao) {
        this.studentDao = studentDao;
    }
    private IUserDao userDao;
    @Resource
    public void setUserDao(IUserDao userDao) {
        this.userDao = userDao;
    }

    //获得某教师的某门课的所有学生
    private List<HwStudent> getStudents(int ctid) {
        String hql = "from HwCourseTeaching ct where ct.id=?";
        Integer[] param = {ctid};
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
    private List<HwCourse> getCourses(int teacherId,int startYear,int schoolTerm) {
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
    private boolean saveStudentExcel(List<HwStudent> students,String Directory) {
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
    private void saveCourseExcel(List<HwCourse> courses,String Directory,int startYear,int schoolTerm) {
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
    public JSONObject getStudentExcel(int ctid) {
        JSONObject jsonresult = new JSONObject();jsonresult.clear();
        List<HwStudent> students = getStudents(ctid);
        if(students == null || students.size() == 0) {
            jsonresult.put("status","fail");jsonresult.put("message","学生数为空");jsonresult.put("url",null);
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
            jsonresult.put("status","success");jsonresult.put("message","操作成功");jsonresult.put("url",url);
            return jsonresult;
        }else {
            jsonresult.put("status","fail");jsonresult.put("message","操作失败");jsonresult.put("url",null);
            return jsonresult;
        }
    }
    //上传excel文件
    private String saveExcelFile(HttpServletRequest request) {
       //文件保存目录
        String flodername = GetRealPath.getRealPath() + "/excel/";
        File floder = new File(flodername);
        if(!floder .exists()  && !floder .isDirectory()) {
            floder .mkdir();
        }
        //文件参数
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        MultipartFile multipartFile = multipartRequest.getFile("file");
        //获取文件名、后缀
        String suffix = multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf("."));
        String filename = System.currentTimeMillis()+"_"+ multipartFile.getOriginalFilename();
        //保存文件
        if(suffix.equals(".xlsx") || suffix.equals(".xls")){
            String fileURL = flodername + filename;
            File file = new File(fileURL);
            try {
                multipartFile.transferTo(file);
            } catch (IllegalStateException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return fileURL;
        }else{
            return null;
        }
    }
    //获取每一个格子的值
    private String getValue(HSSFCell hssfCell) {
        if (hssfCell.getCellType() == hssfCell.CELL_TYPE_BOOLEAN) {
            // 返回布尔类型的值
            return String.valueOf(hssfCell.getBooleanCellValue());
        } else if (hssfCell.getCellType() == hssfCell.CELL_TYPE_NUMERIC) {
            // 返回数值类型的值
            return String.valueOf((long)hssfCell.getNumericCellValue());
        } else {
            // 返回字符串类型的值
            return String.valueOf(hssfCell.getStringCellValue());
        }
    }
//    private String getValue(HSSFCell hssfCell) {
//        if (hssfCell.getCellType() == hssfCell.CELL_TYPE_BOOLEAN) {
//            // 返回布尔类型的值
//            return String.valueOf(hssfCell.getBooleanCellValue());
//        } else if (hssfCell.getCellType() == hssfCell.CELL_TYPE_NUMERIC) {
//            // 返回数值类型的值
//            return String.valueOf(hssfCell.getNumericCellValue());
//        } else {
//            // 返回字符串类型的值
//            return String.valueOf(hssfCell.getStringCellValue());
//        }
//    }
    //保存到数据库
    private void saveStudent(String sno,String name,String sex,String campusN,String collegeN,String grade,String cla,String email,HwUser createUser){
        //学生已经存在直接跳过
        HwStudent st = studentDao.findDeleteStudnet(sno);
        if(st != null){return;}
        /** 保存学生 **/
        HwStudent student = new HwStudent();
        student.setStudentNo(sno);
        student.setName(name);
        student.setSex(sex);
        HwCampus campus = campusDao.findObject("from HwCampus c where c.name=?",campusN);
        student.setHwCampus(campus);
        HwCollege college = collegeDao.findObject("from HwCollege c where c.collegeName=?",collegeN);
        student.setHwCollege(college);
        student.setGrade(grade);
        student.setClass_(cla);
        student.setEmail(email);
        student.setDeleteFlag(false);
        studentDao.add(student);
        /** 保存User **/
        HwUser user = new HwUser();
        user.setUsername(sno);
        user.setPassword(sno);
        user.setTrueName(name);
        user.setCreateDate(new java.sql.Timestamp(System.currentTimeMillis()));
        user.setUserType(UserType.STUDENT);
        user.setTypeId(student.getId());
        user.setCreateId(createUser.getId());
        user.setCreateUsername(createUser.getUsername());
        user.setDeleteFlag(false);
        userDao.add(user);
    }
    //由excel转为学生
    public JSONObject saveFromExcelToStudent(HttpServletRequest request,HwUser createUser) {
        JSONObject jsonresult = new JSONObject();jsonresult.clear();
        if(createUser==null){jsonresult.put("status","fail");return jsonresult;}
        String fileURL = saveExcelFile(request);
        if(fileURL == null || fileURL.isEmpty()) {
            jsonresult.put("status","fail");return jsonresult;
        }
        try {
            InputStream is = new FileInputStream(fileURL);
            HSSFWorkbook hssfWorkbook = new HSSFWorkbook(is);
            // 循环工作表Sheet
            for (int numSheet = 0; numSheet < hssfWorkbook.getNumberOfSheets(); numSheet++) {
                HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(numSheet);
                if (hssfSheet == null) {
                    continue;
                }
                // 循环行Row
                for (int rowNum = 1; rowNum <= hssfSheet.getLastRowNum(); rowNum++) {
                    HSSFRow hssfRow = hssfSheet.getRow(rowNum);
                    if (hssfRow == null) {
                        continue;
                    }
                    //学号
                    HSSFCell xh = hssfRow.getCell(0);String sno = getValue(xh);
                    //姓名
                    HSSFCell xm = hssfRow.getCell(1);String name = getValue(xm);
                    //性别
                    HSSFCell xb = hssfRow.getCell(2);String sex = getValue(xb);
                    //校区
                    HSSFCell xq = hssfRow.getCell(3);String campus = getValue(xq);
                    //学院
                    HSSFCell xy = hssfRow.getCell(4);String college = getValue(xy);
                    //年级
                    HSSFCell nj = hssfRow.getCell(5);String grade = getValue(nj);
                    //班级
                    HSSFCell bj = hssfRow.getCell(6);String cla = getValue(bj);
                    //邮箱
                    HSSFCell yx = hssfRow.getCell(7);String email = getValue(yx);

                    saveStudent(sno,name,sex,campus,college,grade,cla,email,createUser);
                }
            }
            jsonresult.put("status","success");return jsonresult;
        }catch(Exception e) {
            e.printStackTrace();
            jsonresult.put("status","fail");return jsonresult;
        }
    }
}
