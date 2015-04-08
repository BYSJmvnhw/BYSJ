package org.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

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
//@JsonIgnoreProperties({"hwCollege","hwHomeworks","hwCourseSelectings","hwCourseTeachings"})
public class HwCourse implements java.io.Serializable {

	// Fields

	private Integer id;
	private HwCampus hwCampus;
	private HwCollege hwCollege;
	private HwMajor hwMajor;
	private String courseNo;
	private String courseName;
	private Set<HwHomework> hwHomeworks = new HashSet<HwHomework>(0);
	private Set<HwCourseTeaching> hwCourseTeachings = new HashSet<HwCourseTeaching>(0);

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
			Set<HwHomework> hwHomeworks, /*Set<HwCourseSelecting> hwCourseSelectings,*/
			/*Set<HwHomeworkInfo> hwHomeworkInfos,*/ Set<HwCourseTeaching> hwCourseTeachings) {
		this.hwCollege = hwCollege;
		this.courseNo = courseNo;
		this.courseName = courseName;
		this.hwHomeworks = hwHomeworks;
		//this.hwCourseSelectings = hwCourseSelectings;
		//this.hwHomeworkInfos = hwHomeworkInfos;
		this.hwCourseTeachings = hwCourseTeachings;
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

	//@JsonBackReference
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
	//@JsonBackReference
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCourse")
	public Set<HwHomework> getHwHomeworks() {
		return this.hwHomeworks;
	}

	public void setHwHomeworks(Set<HwHomework> hwHomeworks) {
		this.hwHomeworks = hwHomeworks;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCourse")
	public Set<HwCourseTeaching> getHwCourseTeachings() {
		return hwCourseTeachings;
	}

	public void setHwCourseTeachings(Set<HwCourseTeaching> hwCourseTeachings) {
		this.hwCourseTeachings = hwCourseTeachings;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "campus_id")
	public HwCampus getHwCampus() {
		return hwCampus;
	}

	public void setHwCampus(HwCampus hwCampus) {
		this.hwCampus = hwCampus;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "major_id")
	public HwMajor getHwMajor() {
		return hwMajor;
	}

	public void setHwMajor(HwMajor hwMajor) {
		this.hwMajor = hwMajor;
	}
}