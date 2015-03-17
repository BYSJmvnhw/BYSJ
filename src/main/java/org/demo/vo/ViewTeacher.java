package org.demo.vo;

/**
 * Created by peifeng on 2015/3/15.
 */
public class ViewTeacher {

    //用户Id
    private Integer userId;
    //用户帐号
    private String userName;
    //用户信息
    private String name;
    private String sex;
    private String email;
    //教师Id
    private Integer teacherId;
    //教师号
    private String teacherNo;
    private Integer collegeId;
    private String collegeName;
    private Integer majorId;
    private String majorName;
    private Integer campusId;
    private String campusName;

    public ViewTeacher(Integer userId,String userName,String name,String sex,String email,
                       Integer teacherId,String teacherNo,Integer collegeId,String collegeName,Integer majorId,String majorName,
                       Integer campusId,String campusName) {
        this.userId = userId;
        this.userName = userName;
        this.name = name;
        this.sex = sex;
        this.email = email;
        this.teacherId = teacherId;
        this.teacherNo = teacherNo;
        this.collegeId = collegeId;
        this.collegeName = collegeName;
        this.majorId = majorId;
        this.majorName = majorName;
        this.campusId = campusId;
        this.campusName = campusName;
    }
    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public Integer getTeacherId() {
        return teacherId;
    }
    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }
    public String getCollegeName() {
        return collegeName;
    }
    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }
    public String getMajorName() {
        return majorName;
    }
    public void setMajorName(String majorName) {
        this.majorName = majorName;
    }
    public Integer getCampusId() {
        return campusId;
    }
    public void setCampusId(Integer campusId) {
        this.campusId = campusId;
    }
    public String getCampusName() {
        return campusName;
    }
    public void setCampusName(String campusName) {
        this.campusName = campusName;
    }
    public String getTeacherNo() {
        return teacherNo;
    }
    public void setTeacherNo(String teacherNo) {
        this.teacherNo = teacherNo;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getSex() {
        return sex;
    }
    public void setSex(String sex) {
        this.sex = sex;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Integer getCollegeId() {
        return collegeId;
    }
    public void setCollegeId(Integer collegeId) {
        this.collegeId = collegeId;
    }
    public Integer getMajorId() {
        return majorId;
    }
    public void setMajorId(Integer majorId) {
        this.majorId = majorId;
    }

}
