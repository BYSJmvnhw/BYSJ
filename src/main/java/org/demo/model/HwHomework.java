package org.demo.model;

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
public class HwHomework implements java.io.Serializable {

	// Fields

	private Integer id;
	private HwCourse hwCourse;
	private HwStudent hwStudent;
	private HwHomeworkInfo hwHomeworkInfo;
	private HwTeacher hwTeacher;
	private String hwNo;
	private String title;
	private String url;
	private String studentName;
	private Timestamp submitDate;
	private String checkedFlag;
	private String mark;
	private Timestamp markDate;
	private String comment;
	private Timestamp lastModifyDate;

	// Constructors

	/** default constructor */
	public HwHomework() {
	}

	/** minimal constructor */
	public HwHomework(String hwNo, String url, Timestamp submitDate,
			String checkedFlag, String mark, Timestamp markDate,
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
			String checkedFlag, String mark, Timestamp markDate,
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

	@Column(name = "hw_no", nullable = false, length = 50)
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

	@Column(name = "url", nullable = false, length = 1024)
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

	@Column(name = "submit_date", nullable = false, length = 19)
	public Timestamp getSubmitDate() {
		return this.submitDate;
	}

	public void setSubmitDate(Timestamp submitDate) {
		this.submitDate = submitDate;
	}

	@Column(name = "checked_flag", nullable = false, length = 20)
	public String getCheckedFlag() {
		return this.checkedFlag;
	}

	public void setCheckedFlag(String checkedFlag) {
		this.checkedFlag = checkedFlag;
	}

	@Column(name = "mark", nullable = false, length = 50)
	public String getMark() {
		return this.mark;
	}

	public void setMark(String mark) {
		this.mark = mark;
	}

	@Column(name = "mark_date", nullable = false, length = 19)
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

}