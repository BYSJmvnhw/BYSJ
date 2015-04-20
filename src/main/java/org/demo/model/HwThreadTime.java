package org.demo.model;

import javax.persistence.*;
import java.sql.Timestamp;

/**
 * Created by peifeng on 2015/3/19.
 */
@Entity
@Table(name = "hw_threadtime", catalog = "homework")
public class HwThreadTime {
    private Integer id;
    private String name;
    private int hour;
    private int minute;
    private int second;
    private Timestamp lastModifyDate;

    public HwThreadTime(){}
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

    @Column(name = "hour", nullable = false)
    public int getHour() {
        return hour;
    }
    public void setHour(int hour) {
        this.hour = hour;
    }

    @Column(name = "minute", nullable = false)
    public int getMinute() {
        return minute;
    }
    public void setMinute(int minute) {
        this.minute = minute;
    }

    @Column(name = "second", nullable = false)
    public int getSecond() {
        return second;
    }
    public void setSecond(int second) {
        this.second = second;
    }

    @Column(name = "last_modify_date", nullable = false)
    public Timestamp getLastModifyDate() {
        return lastModifyDate;
    }
    public void setLastModifyDate(Timestamp lastModifyDate) {
        this.lastModifyDate = lastModifyDate;
    }
}
