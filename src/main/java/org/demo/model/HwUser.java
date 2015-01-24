package org.demo.model;

import java.sql.Timestamp;
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
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * HwUser entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_user", catalog = "homework")
public class HwUser implements java.io.Serializable {

	// Fields

	private Integer id;
	private String username;
	private String password;
	private String trueName;
	private String sex;
	private String mobile;
	private String email;
	private Integer createId;
	private String createUsername;
	private Timestamp createDate;
	private Set<HwStudent> hwStudents = new HashSet<HwStudent>(0);
	private Set<HwRole> hwRoles = new HashSet<HwRole>(0);
	private Set<HwTeacher> hwTeachers = new HashSet<HwTeacher>(0);

	// Constructors

	/** default constructor */
	public HwUser() {
	}

	/** minimal constructor */
	public HwUser(String username, String password, Integer createId,
			String createUsername, Timestamp createDate) {
		this.username = username;
		this.password = password;
		this.createId = createId;
		this.createUsername = createUsername;
		this.createDate = createDate;
	}

	/** full constructor */
	public HwUser(String username, String password, String trueName,
			String sex, String mobile, String email, Integer createId,
			String createUsername, Timestamp createDate,
			Set<HwStudent> hwStudents, Set<HwRole> hwRoles,
			Set<HwTeacher> hwTeachers) {
		this.username = username;
		this.password = password;
		this.trueName = trueName;
		this.sex = sex;
		this.mobile = mobile;
		this.email = email;
		this.createId = createId;
		this.createUsername = createUsername;
		this.createDate = createDate;
		this.hwStudents = hwStudents;
		this.hwRoles = hwRoles;
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

	@Column(name = "username", nullable = false, length = 50)
	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Column(name = "password", nullable = false, length = 50)
	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "true_name", length = 50)
	public String getTrueName() {
		return this.trueName;
	}

	public void setTrueName(String trueName) {
		this.trueName = trueName;
	}

	@Column(name = "sex", length = 10)
	public String getSex() {
		return this.sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	@Column(name = "mobile", length = 50)
	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Column(name = "email", length = 50)
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "create_id", nullable = false)
	public Integer getCreateId() {
		return this.createId;
	}

	public void setCreateId(Integer createId) {
		this.createId = createId;
	}

	@Column(name = "create_username", nullable = false, length = 50)
	public String getCreateUsername() {
		return this.createUsername;
	}

	public void setCreateUsername(String createUsername) {
		this.createUsername = createUsername;
	}

	@Column(name = "create_date", nullable = false, length = 19)
	public Timestamp getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Timestamp createDate) {
		this.createDate = createDate;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwUser")
	public Set<HwStudent> getHwStudents() {
		return this.hwStudents;
	}

	public void setHwStudents(Set<HwStudent> hwStudents) {
		this.hwStudents = hwStudents;
	}

	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinTable(name = "hw_user_role", catalog = "homework", joinColumns = { @JoinColumn(name = "user_id", updatable = false) }, inverseJoinColumns = { @JoinColumn(name = "role_id", updatable = false) })
	public Set<HwRole> getHwRoles() {
		return this.hwRoles;
	}

	public void setHwRoles(Set<HwRole> hwRoles) {
		this.hwRoles = hwRoles;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwUser")
	public Set<HwTeacher> getHwTeachers() {
		return this.hwTeachers;
	}

	public void setHwTeachers(Set<HwTeacher> hwTeachers) {
		this.hwTeachers = hwTeachers;
	}

}