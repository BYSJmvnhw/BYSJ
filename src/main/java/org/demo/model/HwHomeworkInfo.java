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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * HwHomeworkInfo entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_homework_info", catalog = "homework")
public class HwHomeworkInfo implements java.io.Serializable {

	// Fields

	private Integer id;
	private HwCourse hwCourse;
	private HwTeacher hwTeacher;
	private String title;
	private String hwDesc;
	private Timestamp deadline;
	private String email;
	private String courseName;
	private Timestamp createDate;
	private Boolean overtime;
	private Set<HwHomework> hwHomeworks = new HashSet<HwHomework>(0);

	// Constructors

	/** default constructor */
	public HwHomeworkInfo() {
	}

	/** minimal constructor */
	public HwHomeworkInfo(String title, Timestamp deadline, String email,
			Timestamp createDate) {
		this.title = title;
		this.deadline = deadline;
		this.email = email;
		this.createDate = createDate;
	}

	/** full constructor */
	public HwHomeworkInfo(HwCourse hwCourse, HwTeacher hwTeacher, String title,
			String hwDesc, Timestamp deadline, String email, String courseName,
			Timestamp createDate, Boolean overtime, Set<HwHomework> hwHomeworks) {
		this.hwCourse = hwCourse;
		this.hwTeacher = hwTeacher;
		this.title = title;
		this.hwDesc = hwDesc;
		this.deadline = deadline;
		this.email = email;
		this.courseName = courseName;
		this.createDate = createDate;
		this.overtime = overtime;
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
	@JoinColumn(name = "course_id")
	public HwCourse getHwCourse() {
		return this.hwCourse;
	}

	public void setHwCourse(HwCourse hwCourse) {
		this.hwCourse = hwCourse;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "teacher_id")
	public HwTeacher getHwTeacher() {
		return this.hwTeacher;
	}

	public void setHwTeacher(HwTeacher hwTeacher) {
		this.hwTeacher = hwTeacher;
	}

	@Column(name = "title", nullable = false, length = 50)
	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "hw_desc", length = 1024)
	public String getHwDesc() {
		return this.hwDesc;
	}

	public void setHwDesc(String hwDesc) {
		this.hwDesc = hwDesc;
	}

	@Column(name = "deadline", nullable = false, length = 19)
	public Timestamp getDeadline() {
		return this.deadline;
	}

	public void setDeadline(Timestamp deadline) {
		this.deadline = deadline;
	}

	@Column(name = "email", nullable = false, length = 50)
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "course_name", length = 50)
	public String getCourseName() {
		return this.courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	@Column(name = "create_date", nullable = false, length = 19)
	public Timestamp getCreateDate() {
		return this.createDate;
	}

	public void setCreateDate(Timestamp createDate) {
		this.createDate = createDate;
	}

	@Column(name = "overtime")
	public Boolean getOvertime() {
		return this.overtime;
	}

	public void setOvertime(Boolean overtime) {
		this.overtime = overtime;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwHomeworkInfo")
	public Set<HwHomework> getHwHomeworks() {
		return this.hwHomeworks;
	}

	public void setHwHomeworks(Set<HwHomework> hwHomeworks) {
		this.hwHomeworks = hwHomeworks;
	}

}