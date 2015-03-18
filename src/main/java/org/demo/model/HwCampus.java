package org.demo.model;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * HwCampus entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_campus", catalog = "homework")
public class HwCampus implements java.io.Serializable {

	// Fields

	private Integer id;
	private String name;
	private Set<HwCollege> hwColleges = new HashSet<HwCollege>(0);
	private Set<HwStudent> hwStudents = new HashSet<HwStudent>(0);

	// Constructors

	/** default constructor */
	public HwCampus() {
	}

	/** minimal constructor */
	public HwCampus(String name) {
		this.name = name;
	}

	/** full constructor */
	public HwCampus(String name, Set<HwCollege> hwColleges) {
		this.name = name;
		this.hwColleges = hwColleges;
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

	@Column(name = "name", nullable = false, length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCampus")
	public Set<HwCollege> getHwColleges() {
		return this.hwColleges;
	}

	public void setHwColleges(Set<HwCollege> hwColleges) {
		this.hwColleges = hwColleges;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwCampus")
	public Set<HwStudent> getHwStudents() {
		return hwStudents;
	}

	public void setHwStudents(Set<HwStudent> hwStudents) {
		this.hwStudents = hwStudents;
	}
}