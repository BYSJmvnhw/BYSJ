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
public class HwStudent implements java.io.Serializable {

	// Fields

	private Integer id;
	private HwUser hwUser;
	private HwMajor hwMajor;
	private HwCollege hwCollege;
	private String studentNo;
	private String name;
	private String sex;
	private String class_;
	private String grade;
	private String email;
	private Set<HwCourse> hwCourses = new HashSet<HwCourse>(0);
	private Set<HwHomework> hwHomeworks = new HashSet<HwHomework>(0);

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
	public HwStudent(HwUser hwUser, HwMajor hwMajor, HwCollege hwCollege,
			String studentNo, String name, String sex, String class_,
			String grade, String email, Set<HwCourse> hwCourses,
			Set<HwHomework> hwHomeworks) {
		this.hwUser = hwUser;
		this.hwMajor = hwMajor;
		this.hwCollege = hwCollege;
		this.studentNo = studentNo;
		this.name = name;
		this.sex = sex;
		this.class_ = class_;
		this.grade = grade;
		this.email = email;
		this.hwCourses = hwCourses;
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
	@JoinColumn(name = "user_id")
	public HwUser getHwUser() {
		return this.hwUser;
	}

	public void setHwUser(HwUser hwUser) {
		this.hwUser = hwUser;
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

	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinTable(name = "hw_course_student", catalog = "homework", joinColumns = { @JoinColumn(name = "student_id", updatable = false) }, inverseJoinColumns = { @JoinColumn(name = "course_id", updatable = false) })
	public Set<HwCourse> getHwCourses() {
		return this.hwCourses;
	}

	public void setHwCourses(Set<HwCourse> hwCourses) {
		this.hwCourses = hwCourses;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwStudent")
	public Set<HwHomework> getHwHomeworks() {
		return this.hwHomeworks;
	}

	public void setHwHomeworks(Set<HwHomework> hwHomeworks) {
		this.hwHomeworks = hwHomeworks;
	}

}