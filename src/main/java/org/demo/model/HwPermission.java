package org.demo.model;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

/**
 * HwPermission entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_permission", catalog = "homework")
public class HwPermission implements java.io.Serializable {

	// Fields

	private Integer id;
	private String name;
	private String permissionType;
	private String url;
	private String function;
	private String method;
	private Set<HwRole> hwRoles = new HashSet<HwRole>(0);

	// Constructors

	/** default constructor */
	public HwPermission() {
	}

	/** full constructor */
	public HwPermission(String name, String permissionType, String url,
			String function, String method, Set<HwRole> hwRoles) {
		this.name = name;
		this.permissionType = permissionType;
		this.url = url;
		this.function = function;
		this.method = method;
		this.hwRoles = hwRoles;
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

	@Column(name = "name", length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "permission_type", length = 50)
	public String getPermissionType() {
		return this.permissionType;
	}

	public void setPermissionType(String permissionType) {
		this.permissionType = permissionType;
	}

	@Column(name = "url", length = 1024)
	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Column(name = "function", length = 50)
	public String getFunction() {
		return this.function;
	}

	public void setFunction(String function) {
		this.function = function;
	}

	@Column(name = "method", length = 50)
	public String getMethod() {
		return this.method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	@ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwPermissions")
	public Set<HwRole> getHwRoles() {
		return this.hwRoles;
	}

	public void setHwRoles(Set<HwRole> hwRoles) {
		this.hwRoles = hwRoles;
	}

}