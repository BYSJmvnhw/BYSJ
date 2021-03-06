package org.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.demo.tool.HomeworkStatus;
import org.demo.tool.MarkType;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * HwHomework entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "hw_homework", catalog = "homework")
@JsonIgnoreProperties({"hwCourse","hwHomeworkInfo","hwTeacher","hwStudent"})
public class HwHomework implements java.io.Serializable {

	// Fields

	private Integer id;
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	private HwCourse hwCourse;
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	private HwStudent hwStudent;
	private HwHomeworkInfo hwHomeworkInfo;
	private HwTeacher hwTeacher;
	private String hwNo;
	private String title;
	private String url;
	private String studentName;
	private String studentNo;
	private Timestamp submitDate;
	private Boolean checkedFlag;
	private MarkType markType;
	private String mark;
	private Timestamp markDate;
	private String comment;
	private Timestamp lastModifyDate;
	private HomeworkStatus status;

	// Constructors

	/** default constructor */
	public HwHomework() {
	}

	/** minimal constructor */
	public HwHomework(String hwNo, String url, Timestamp submitDate,
					  Boolean checkedFlag, String mark, Timestamp markDate,
			Timestamp lastModifyDate) {
		this.hwNo = hwNo;
		this.url = url;
		this.submitDate = submitDate;
		this.checkedFlag = checkedFlag;
		this.mark = mark;
		this.markDate = markDate;
		this.lastModifyDate = lastModifyDate;
	}

	/** full constructor */
	public HwHomework(HwCourse hwCourse, HwStudent hwStudent,
			HwHomeworkInfo hwHomeworkInfo, HwTeacher hwTeacher, String hwNo,
			String title, String url, String studentName, Timestamp submitDate,
			Boolean checkedFlag, String mark, Timestamp markDate,
			String comment, Timestamp lastModifyDate) {
		this.hwCourse = hwCourse;
		this.hwStudent = hwStudent;
		this.hwHomeworkInfo = hwHomeworkInfo;
		this.hwTeacher = hwTeacher;
		this.hwNo = hwNo;
		this.title = title;
		this.url = url;
		this.studentName = studentName;
		this.submitDate = submitDate;
		this.checkedFlag = checkedFlag;
		this.mark = mark;
		this.markDate = markDate;
		this.comment = comment;
		this.lastModifyDate = lastModifyDate;
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
	@JoinColumn(name = "student_id")
	public HwStudent getHwStudent() {
		return this.hwStudent;
	}

	public void setHwStudent(HwStudent hwStudent) {
		this.hwStudent = hwStudent;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hwinfo_id")
	public HwHomeworkInfo getHwHomeworkInfo() {
		return this.hwHomeworkInfo;
	}

	public void setHwHomeworkInfo(HwHomeworkInfo hwHomeworkInfo) {
		this.hwHomeworkInfo = hwHomeworkInfo;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "teacher_id")
	public HwTeacher getHwTeacher() {
		return this.hwTeacher;
	}

	public void setHwTeacher(HwTeacher hwTeacher) {
		this.hwTeacher = hwTeacher;
	}

	@Column(name = "hw_no", length = 50)
	public String getHwNo() {
		return this.hwNo;
	}

	public void setHwNo(String hwNo) {
		this.hwNo = hwNo;
	}

	@Column(name = "title", length = 50)
	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "url", length = 1024)
	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Column(name = "student_name", length = 50)
	public String getStudentName() {
		return this.studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	@Column(name = "student_no", length = 50)
	public String getStudentNo() {
		return studentNo;
	}

	public void setStudentNo(String studentNo) {
		this.studentNo = studentNo;
	}

	@Column(name = "submit_date", length = 19)
	public Timestamp getSubmitDate() {
		return this.submitDate;
	}

	public void setSubmitDate(Timestamp submitDate) {
		this.submitDate = submitDate;
	}

	@Column(name = "checked_flag", nullable = false, length = 20)
	public Boolean getCheckedFlag() {
		return this.checkedFlag;
	}

	public void setCheckedFlag(Boolean checkedFlag) {
		this.checkedFlag = checkedFlag;
	}

	@Column(name = "mark_type")
	public MarkType getMarkType() {
		return markType;
	}

	public void setMarkType(MarkType markType) {
		this.markType = markType;
	}

	@Column(name = "mark", length = 50)
	public String getMark() {
		return this.mark;
	}

	public void setMark(String mark) {
		this.mark = mark;
	}

	@Column(name = "mark_date", length = 19)
	public Timestamp getMarkDate() {
		return this.markDate;
	}

	public void setMarkDate(Timestamp markDate) {
		this.markDate = markDate;
	}

	@Column(name = "comment", length = 1024)
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "last_modify_date", nullable = false, length = 19)
	public Timestamp getLastModifyDate() {
		return this.lastModifyDate;
	}

	public void setLastModifyDate(Timestamp lastModifyDate) {
		this.lastModifyDate = lastModifyDate;
	}

	@Column(name = "status")
	public HomeworkStatus getStatus() {
		return status;
	}

	public void setStatus(HomeworkStatus status) {
		this.status = status;
	}
}