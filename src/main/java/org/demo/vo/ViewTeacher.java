package org.demo.vo;

/**
 * Created by peifeng on 2015/3/15.
 */
public class ViewTeacher {

    private Integer id;
    private String teacherNo;
    private String name;
    private String sex;
    private String email;
    private Integer collegeId;
    private Integer majorId;
    private Integer userId;

    public ViewTeacher(Integer id,String teacherNo,String name,
                     String sex,String email,Integer collegeId,Integer majorId,Integer userId) {
        this.id = id;
        this.teacherNo = teacherNo;
        this.name = name;
        this.sex = sex;
        this.email = email;
        this.collegeId = collegeId;
        this.majorId = majorId;
        this.userId = userId;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

}
