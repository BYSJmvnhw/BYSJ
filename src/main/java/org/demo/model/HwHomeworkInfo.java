package org.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonRootName;
import org.demo.tool.MarkType;

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
//@JsonIgnoreProperties({"hwHomeworks","hwCourseTeaching","hibernateLazyInitializer", "handler"})
//@JsonRootName("hwHomeworkInfo")
public class HwHomeworkInfo implements java.io.Serializable {

	// Fields

	private Integer id;
	//private HwCourse hwCourse;
	//private HwTeacher hwTeacher;
	private String title;
	private String hwDesc;
	private String url;
	private Timestamp deadline;
	private String email;
	private String courseName;
	private Timestamp createDate;
    private Timestamp lastReceiveDate;
	private Boolean overtime;
	private MarkType markType;
	private Set<HwHomework> hwHomeworks = new HashSet<HwHomework>(0);
	private HwCourseTeaching hwCourseTeaching;

	// Constructors

	/**
	 * default constructor
	 */
	public HwHomeworkInfo() {
	}

	/**
	 * minimal constructor
	 */
	public HwHomeworkInfo(String title, Timestamp deadline, String email,
						  Timestamp createDate) {
		this.title = title;
		this.deadline = deadline;
		this.email = email;
		this.createDate = createDate;
	}

	/**
	 * full constructor
	 */
	public HwHomeworkInfo( /*HwCourse hwCourse, HwTeacher hwTeacher, */String title,
						   String hwDesc, String url, Timestamp deadline, String email, String courseName,
						   Timestamp createDate, Boolean overtime, Set<HwHomework> hwHomeworks, HwCourseTeaching hwCourseTeaching) {
		//this.hwCourse = hwCourse;
		//this.hwTeacher = hwTeacher;
		this.title = title;
		this.hwDesc = hwDesc;
		this.url = url;
		this.deadline = deadline;
		this.email = email;
		this.courseName = courseName;
		this.createDate = createDate;
		this.overtime = overtime;
		this.hwHomeworks = hwHomeworks;
		this.hwCourseTeaching = hwCourseTeaching;
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

	@Column(name = "url", length = 1024)
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
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

    @Column(name = "last_receive_date")
    public Timestamp getLastReceiveDate() {
        return this.lastReceiveDate;
    }

    public void setLastReceiveDate(Timestamp lastReceiveDate) {
        this.lastReceiveDate = lastReceiveDate;
    }

	@Column(name = "overtime")
	public Boolean getOvertime() {
		return this.overtime;
	}

	public void setOvertime(Boolean overtime) {
		this.overtime = overtime;
	}

	@Column(name = "mark_type")
	public MarkType getMarkType() {
		return markType;
	}

	public void setMarkType(MarkType markType) {
		this.markType = markType;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "hwHomeworkInfo")
	public Set<HwHomework> getHwHomeworks() {
		return this.hwHomeworks;
	}

	public void setHwHomeworks(Set<HwHomework> hwHomeworks) {
		this.hwHomeworks=hwHomeworks;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "course_teacher_id")
	public HwCourseTeaching getHwCourseTeaching() {
		return hwCourseTeaching;
	}

	public void setHwCourseTeaching(HwCourseTeaching hwCourseTeaching) {
		this.hwCourseTeaching = hwCourseTeaching;
	}
}