package org.demo.model;


import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonRootName;

import javax.persistence.*;

/**
 * Created by jzchen on 2015/1/27.
 */
@Entity
@Table(name = "hw_course_student" , catalog = "homework")
/**
 * 实体转Json时忽略下列属性
 * */
//@JsonIgnoreProperties({"hwStudent"})
/*  自动检测 不检测类成员域和getter */
//@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.NONE, getterVisibility = JsonAutoDetect.Visibility.NONE)
@JsonRootName("hwCourseSelecting")
public class HwCourseSelecting implements java.io.Serializable{

    private Integer id;
    private HwStudent hwStudent;
    /** 用于开启了Hibernation的延迟加载时，Json序列化时忽略代理类，注解在类成员域上 */
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private HwCourseTeaching hwCourseTeaching;

    /** default constructor */
    public HwCourseSelecting() {
    }

    /** full constructor */
    public HwCourseSelecting(Integer id, HwStudent hwStudent, HwCourseTeaching hwCourseTeaching) {
        this.id = id;
        this.hwStudent = hwStudent;
        this.hwCourseTeaching = hwCourseTeaching;
    }

    @Id
    @GeneratedValue
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    //@JsonBackReference
    public HwStudent getHwStudent() {
        return hwStudent;
    }

    public void setHwStudent(HwStudent hwStudent) {
        this.hwStudent = hwStudent;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_teacher_id")
    public HwCourseTeaching getHwCourseTeaching() {
        return hwCourseTeaching;
    }

    public void setHwCourseTeaching(HwCourseTeaching hwCourseTeaching) {
        this.hwCourseTeaching = hwCourseTeaching;
    }
/*    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    public HwCourse getHwCourse() {
        return hwCourse;
    }

    public void setHwCourse(HwCourse hwCourse) {
        this.hwCourse = hwCourse;
    }

    //@JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    public HwTeacher getHwTeacher() {
        return hwTeacher;
    }

    public void setHwTeacher(HwTeacher hwTeacher) {
        this.hwTeacher = hwTeacher;
    }

    @Column(name = "start_year", insertable = false, updatable= false )
    public Integer getStartYear() {
        return startYear;
    }

    public void setStartYear(Integer startYear) {
        this.startYear = startYear;
    }

    @Column(name = "school_term")
    public Integer getSchoolTerm() {
        return schoolTerm;
    }

    public void setSchoolTerm(Integer schoolTerm) {
        this.schoolTerm = schoolTerm;
    }*/

}
