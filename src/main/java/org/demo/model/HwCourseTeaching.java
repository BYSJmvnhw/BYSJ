package org.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by jzchen on 2015/2/12 0012.
 */

@Entity
@Table(name = "hw_course_teacher" , catalog = "homework")
@JsonIgnoreProperties({"hwTeacher","hwHomeworkInfos","password","hwCourseSelectings"})
public class HwCourseTeaching implements Serializable{

    private Integer id;
    /** 用于开启了Hibernation的延迟加载时，Json序列化时忽略代理类，注解在类成员域上 */
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private HwCourse hwCourse;
    private HwTeacher hwTeacher;
    private Integer startYear;
    private Integer schoolTerm;
    private String email;
    private String password;
    private Set<HwHomeworkInfo> hwHomeworkInfos= new HashSet<HwHomeworkInfo>(0);
    private Set<HwCourseSelecting> hwCourseSelectings = new HashSet<HwCourseSelecting>(0);

    /** default constructor */
    public HwCourseTeaching() {
    }

    /** minimal constructor */
    public HwCourseTeaching(Integer id, Integer startYear, Integer schoolTerm) {
        this.id = id;
        this.startYear = startYear;
        this.schoolTerm = schoolTerm;
    }

    /** full constructor */
    public HwCourseTeaching(Integer id, HwCourse hwCourse, HwTeacher hwTeacher, Integer startYear, Integer schoolTerm,
                            String email, String password,
                            Set<HwHomeworkInfo> hwHomeworkInfos) {
        this.id = id;
        this.hwCourse = hwCourse;
        this.hwTeacher = hwTeacher;
        this.startYear = startYear;
        this.schoolTerm = schoolTerm;
        this.email = email;
        this.password = password;
        this.hwHomeworkInfos = hwHomeworkInfos;
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
    @JoinColumn(name = "course_id")
    public HwCourse getHwCourse() {
        return hwCourse;
    }

    public void setHwCourse(HwCourse hwCourse) {
        this.hwCourse = hwCourse;
    }

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
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCourseTeaching")
    public Set<HwHomeworkInfo> getHwHomeworkInfos() {
        return hwHomeworkInfos;
    }

    public void setHwHomeworkInfos(Set<HwHomeworkInfo> hwHomeworkInfos) {
        this.hwHomeworkInfos = hwHomeworkInfos;
    }

    @Column(name = "email", insertable = false, updatable= false )
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Column(name = "password", insertable = false, updatable= false )
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCourseTeaching")

    public Set<HwCourseSelecting> getHwCourseSelectings() {
        return hwCourseSelectings;
    }

    public void setHwCourseSelectings(Set<HwCourseSelecting> hwCourseSelectings) {
        this.hwCourseSelectings = hwCourseSelectings;
    }
}
