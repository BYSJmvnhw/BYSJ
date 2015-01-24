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
import javax.persistence.Table;

/**
 * HwRole entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_role", catalog = "homework")
public class HwRole implements java.io.Serializable {

	// Fields

	private Integer id;
	private String roleInfo;
	private String roleName;
	private Integer userId;
	private String username;
	private Timestamp createDate;
	private Set<HwPermission> hwPermissions = new HashSet<HwPermission>(0);
	private Set<HwUser> hwUsers = new HashSet<HwUser>(0);

	// Constructors

	/** default constructor */
	public HwRole() {
	}

	/** minimal constructor */
	public HwRole(String roleName, Timestamp createDate) {
		this.roleName = roleName;
		this.createDate = createDate;
	}

	/** full constructor */
	public HwRole(String roleInfo, String roleName, Integer userId,
			String username, Timestamp createDate,
			Set<HwPermission> hwPermissions, Set<HwUser> hwUsers) {
		this.roleInfo = roleInfo;
		this.roleName = roleName;
		this.userId = userId;
		this.username = username;
		this.createDate = createDate;
		this.hwPermissions = hwPermissions;
		this.hwUsers = hwUsers;
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

	@Column(name = "role_info", length = 50)
	public String getRoleInfo() {
		return this.roleInfo;
	}

	public void setRoleInfo(String roleInfo) {
		this.roleInfo = roleInfo;
	}

	@Column(name = "role_name", nullable = false, length = 50)
	public String getRoleName() {
		return this.roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	@Column(name = "user_id")
	public Integer getUserId() {
		return this.userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	@Column(name = "username", length = 50)
	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Column(name = "create_date", nullable = false, length = 19)
	public Timestamp getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Timestamp createDate) {
		this.createDate = createDate;
	}

	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JoinTable(name = "hw_permission_role", catalog = "homework", joinColumns = { @JoinColumn(name = "role_id", updatable = false) }, inverseJoinColumns = { @JoinColumn(name = "permission_id", updatable = false) })
	public Set<HwPermission> getHwPermissions() {
		return this.hwPermissions;
	}

	public void setHwPermissions(Set<HwPermission> hwPermissions) {
		this.hwPermissions = hwPermissions;
	}

	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwRoles")
	public Set<HwUser> getHwUsers() {
		return this.hwUsers;
	}

	public void setHwUsers(Set<HwUser> hwUsers) {
		this.hwUsers = hwUsers;
	}

}