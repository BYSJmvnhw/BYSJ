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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * HwCollege entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_college", catalog = "homework")
public class HwCollege implements java.io.Serializable {

	// Fields

	private Integer id;
	private HwCampus hwCampus;
	private String collegeName;
	private Set<HwTeacher> hwTeachers = new HashSet<HwTeacher>(0);
	private Set<HwCourse> hwCourses = new HashSet<HwCourse>(0);
	private Set<HwStudent> hwStudents = new HashSet<HwStudent>(0);
	private Set<HwMajor> hwMajors = new HashSet<HwMajor>(0);

	// Constructors

	/** default constructor */
	public HwCollege() {
	}

	/** minimal constructor */
	public HwCollege(String collegeName) {
		this.collegeName = collegeName;
	}

	/** full constructor */
	public HwCollege(HwCampus hwCampus, String collegeName,
			Set<HwTeacher> hwTeachers, Set<HwCourse> hwCourses,
			Set<HwStudent> hwStudents, Set<HwMajor> hwMajors) {
		this.hwCampus = hwCampus;
		this.collegeName = collegeName;
		this.hwTeachers = hwTeachers;
		this.hwCourses = hwCourses;
		this.hwStudents = hwStudents;
		this.hwMajors = hwMajors;
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
		return this.hwCampus;
	}

	public void setHwCampus(HwCampus hwCampus) {
		this.hwCampus = hwCampus;
	}

	@Column(name = "college_name", nullable = false, length = 50)
	public String getCollegeName() {
		return this.collegeName;
	}

	public void setCollegeName(String collegeName) {
		this.collegeName = collegeName;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCollege")
	public Set<HwTeacher> getHwTeachers() {
		return this.hwTeachers;
	}

	public void setHwTeachers(Set<HwTeacher> hwTeachers) {
		this.hwTeachers = hwTeachers;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCollege")
	public Set<HwCourse> getHwCourses() {
		return this.hwCourses;
	}

	public void setHwCourses(Set<HwCourse> hwCourses) {
		this.hwCourses = hwCourses;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCollege")
	public Set<HwStudent> getHwStudents() {
		return this.hwStudents;
	}

	public void setHwStudents(Set<HwStudent> hwStudents) {
		this.hwStudents = hwStudents;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCollege")
	public Set<HwMajor> getHwMajors() {
		return this.hwMajors;
	}

	public void setHwMajors(Set<HwMajor> hwMajors) {
		this.hwMajors = hwMajors;
	}

}