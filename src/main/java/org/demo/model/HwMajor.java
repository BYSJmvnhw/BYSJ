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
 * HwMajor entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_major", catalog = "homework")
public class HwMajor implements java.io.Serializable {

	// Fields

	private Integer id;
	private HwCollege hwCollege;
	private String name;
	private Set<HwTeacher> hwTeachers = new HashSet<HwTeacher>(0);
	private Set<HwStudent> hwStudents = new HashSet<HwStudent>(0);

	// Constructors

	/** default constructor */
	public HwMajor() {
	}

	/** minimal constructor */
	public HwMajor(String name) {
		this.name = name;
	}

	/** full constructor */
	public HwMajor(HwCollege hwCollege, String name, Set<HwTeacher> hwTeachers,
			Set<HwStudent> hwStudents) {
		this.hwCollege = hwCollege;
		this.name = name;
		this.hwTeachers = hwTeachers;
		this.hwStudents = hwStudents;
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

	@Column(name = "name", nullable = false, length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwMajor")
	public Set<HwTeacher> getHwTeachers() {
		return this.hwTeachers;
	}

	public void setHwTeachers(Set<HwTeacher> hwTeachers) {
		this.hwTeachers = hwTeachers;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwMajor")
	public Set<HwStudent> getHwStudents() {
		return this.hwStudents;
	}

	public void setHwStudents(Set<HwStudent> hwStudents) {
		this.hwStudents = hwStudents;
	}

}