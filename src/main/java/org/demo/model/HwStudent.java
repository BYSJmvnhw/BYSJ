package org.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * HwStudent entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_student", catalog = "homework", uniqueConstraints = @UniqueConstraint(columnNames = "student_no"))
@JsonIgnoreProperties({"hwUser","hwMajor","hwCollege","hwCourseSelectings","hwHomeworks"})
public class HwStudent implements java.io.Serializable {

	// Fields

	private Integer id;
	private HwCampus hwCampus;
	private HwMajor hwMajor;
	private HwCollege hwCollege;
	private String studentNo;
	private String name;
	private String sex;
	private String class_;
	private String grade;
	private String email;
	private Set<HwCourseSelecting> hwCourseSelectings = new HashSet<HwCourseSelecting>(0);
	private Set<HwHomework> hwHomeworks = new HashSet<HwHomework>(0);
	private Boolean deleteFlag;

	// Constructors

	/** default constructor */
	public HwStudent() {
	}

	/** minimal constructor */
	public HwStudent(String studentNo, String name, String sex, String class_,
			String grade) {
		this.studentNo = studentNo;
		this.name = name;
		this.sex = sex;
		this.class_ = class_;
		this.grade = grade;
	}

	/** full constructor */
	public HwStudent(Integer id, HwMajor hwMajor, HwCollege hwCollege,
					 String studentNo, String name, String sex, String class_, String grade,
					 Set<HwCourseSelecting> hwCourseSelectings, Set<HwHomework> hwHomeworks) {
		this.id = id;
		this.hwMajor = hwMajor;
		this.hwCollege = hwCollege;
		this.studentNo = studentNo;
		this.name = name;
		this.sex = sex;
		this.class_ = class_;
		this.grade = grade;
		//this.email = email;
		this.hwCourseSelectings = hwCourseSelectings;
		this.hwHomeworks = hwHomeworks;
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
		return this.hwMajor;
	}

	public void setHwMajor(HwMajor hwMajor) {
		this.hwMajor = hwMajor;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "college_id")
	public HwCollege getHwCollege() {
		return this.hwCollege;
	}

	public void setHwCollege(HwCollege hwCollege) {
		this.hwCollege = hwCollege;
	}

	@Column(name = "student_no", unique = true, nullable = false, length = 50)
	public String getStudentNo() {
		return this.studentNo;
	}

	public void setStudentNo(String studentNo) {
		this.studentNo = studentNo;
	}

	@Column(name = "name", nullable = false, length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "sex", nullable = false, length = 50)
	public String getSex() {
		return this.sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	@Column(name = "class", nullable = false, length = 50)
	public String getClass_() {
		return this.class_;
	}

	public void setClass_(String class_) {
		this.class_ = class_;
	}

	@Column(name = "grade", nullable = false, length = 50)
	public String getGrade() {
		return this.grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	@Column(name = "email", length = 50)
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwStudent")
	public Set<HwCourseSelecting> getHwCourseSelectings() {
		return hwCourseSelectings;
	}

	public void setHwCourseSelectings(Set<HwCourseSelecting> hwCourseSelectings) {
		this.hwCourseSelectings = hwCourseSelectings;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwStudent")
	public Set<HwHomework> getHwHomeworks() {
		return this.hwHomeworks;
	}

	public void setHwHomeworks(Set<HwHomework> hwHomeworks) {
		this.hwHomeworks = hwHomeworks;
	}

	@Column(name = "delete_flag", nullable = false)
	public Boolean getDeleteFlag() {
		return deleteFlag;
	}

	public void setDeleteFlag(Boolean deleteFlag) {
		this.deleteFlag = deleteFlag;
	}

}