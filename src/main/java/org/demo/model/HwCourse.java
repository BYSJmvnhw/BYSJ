package org.demo.model;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * HwCourse entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_course", catalog = "homework")
public class HwCourse implements java.io.Serializable {

	// Fields

	private Integer id;
	private HwCollege hwCollege;
	private String courseNo;
	private String courseName;
	private Set<HwHomework> hwHomeworks = new HashSet<HwHomework>(0);
	private Set<HwCourseSelecting> hwCourseSelectings = new HashSet<HwCourseSelecting>(0);
	private Set<HwHomeworkInfo> hwHomeworkInfos = new HashSet<HwHomeworkInfo>(0);
	private Set<HwTeacher> hwTeachers = new HashSet<HwTeacher>(0);

	// Constructors

	/** default constructor */
	public HwCourse() {
	}

	/** minimal constructor */
	public HwCourse(String courseNo, String courseName) {
		this.courseNo = courseNo;
		this.courseName = courseName;
	}

	/** full constructor */
	public HwCourse(HwCollege hwCollege, String courseNo, String courseName,
			Set<HwHomework> hwHomeworks, Set<HwCourseSelecting> hwCourseSelectings,
			Set<HwHomeworkInfo> hwHomeworkInfos, Set<HwTeacher> hwTeachers) {
		this.hwCollege = hwCollege;
		this.courseNo = courseNo;
		this.courseName = courseName;
		this.hwHomeworks = hwHomeworks;
		this.hwCourseSelectings = hwCourseSelectings;
		this.hwHomeworkInfos = hwHomeworkInfos;
		this.hwTeachers = hwTeachers;
	}

	// Property accessors
	@Id
	@GeneratedValue
	@Column(name = "id", unique = true, nullable = false)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "college_id")
	public HwCollege getHwCollege() {
		return this.hwCollege;
	}

	public void setHwCollege(HwCollege hwCollege) {
		this.hwCollege = hwCollege;
	}

	@Column(name = "course_no", nullable = false, length = 50)
	public String getCourseNo() {
		return this.courseNo;
	}

	public void setCourseNo(String courseNo) {
		this.courseNo = courseNo;
	}

	@Column(name = "course_name", nullable = false, length = 50)
	public String getCourseName() {
		return this.courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCourse")
	public Set<HwHomework> getHwHomeworks() {
		return this.hwHomeworks;
	}

	public void setHwHomeworks(Set<HwHomework> hwHomeworks) {
		this.hwHomeworks = hwHomeworks;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCourse")
	public Set<HwCourseSelecting> getHwCourseSelectings() {
		return this.hwCourseSelectings;
	}

	public void setHwCourseSelectings(Set<HwCourseSelecting> hwCourseSelectings) {
		this.hwCourseSelectings = hwCourseSelectings;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCourse")
	public Set<HwHomeworkInfo> getHwHomeworkInfos() {
		return this.hwHomeworkInfos;
	}

	public void setHwHomeworkInfos(Set<HwHomeworkInfo> hwHomeworkInfos) {
		this.hwHomeworkInfos = hwHomeworkInfos;
	}

	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCourses")
	public Set<HwTeacher> getHwTeachers() {
		return this.hwTeachers;
	}

	public void setHwTeachers(Set<HwTeacher> hwTeachers) {
		this.hwTeachers = hwTeachers;
	}


}