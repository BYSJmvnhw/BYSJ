package org.demo.model;

import com.sun.org.apache.xpath.internal.operations.Bool;

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

/**
 * HwTeacher entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_teacher", catalog = "homework")
public class HwTeacher implements java.io.Serializable {

	// Fields

	private Integer id;
	private HwCampus hwCampus;
	private HwMajor hwMajor;
	private HwCollege hwCollege;
	private String teacherNo;
	private String name;
	private String sex;
	//private String email;
	private Set<HwHomework> hwHomeworks = new HashSet<HwHomework>(0);
	private Set<HwCourseTeaching> hwCourseTeachings = new HashSet<HwCourseTeaching>(0);
	private Boolean deleteFlag;

	// Constructors

	/** default constructor */
	public HwTeacher() {
	}

	/** minimal constructor */
	public HwTeacher(String teacherNo, String name, String sex) {
		this.teacherNo = teacherNo;
		this.name = name;
		this.sex = sex;
	}

	/** full constructor */
	public HwTeacher(HwMajor hwMajor, HwCollege hwCollege,
			String teacherNo, String name, String sex,
			Set<HwHomework> hwHomeworks) {
		this.hwMajor = hwMajor;
		this.hwCollege = hwCollege;
		this.teacherNo = teacherNo;
		this.name = name;
		this.sex = sex;
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

	@Column(name = "teacher_no", nullable = false, length = 50)
	public String getTeacherNo() {
		return this.teacherNo;
	}

	public void setTeacherNo(String teacherNo) {
		this.teacherNo = teacherNo;
	}

	@Column(name = "name", nullable = false, length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "sex", nullable = false, length = 10)
	public String getSex() {
		return this.sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

/*	@Column(name = "email", length = 50)
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}*/

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwTeacher")
	public Set<HwHomework> getHwHomeworks() {
		return this.hwHomeworks;
	}

	public void setHwHomeworks(Set<HwHomework> hwHomeworks) {
		this.hwHomeworks = hwHomeworks;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwTeacher")
	public Set<HwCourseTeaching> getHwCourseTeachings() {
		return hwCourseTeachings;
	}

	public void setHwCourseTeachings(Set<HwCourseTeaching> hwCourseTeachings) {
		this.hwCourseTeachings = hwCourseTeachings;
	}

	@Column(name = "delete_flag", nullable = false)
	public Boolean getDeleteFlag() {
		return deleteFlag;
	}

	public void setDeleteFlag(Boolean deleteFlag) {
		this.deleteFlag = deleteFlag;
	}
}