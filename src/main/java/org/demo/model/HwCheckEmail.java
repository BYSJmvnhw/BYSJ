package org.demo.model;

import javax.persistence.*;

/**
 * Created by peifeng on 2015/3/19.
 */
@Entity
@Table(name = "hw_checkemail", catalog = "homework")
public class HwCheckEmail {
    private Integer id;
    private String email;
    private String checkNumber;
    private Integer isValid;

    public HwCheckEmail(){}
    public HwCheckEmail(String email,String checkNumber,Integer isValid) {
        this.id = id;
        this.email = email;
        this.checkNumber = checkNumber;
        this.isValid = isValid;
    }
    @Id
    @GeneratedValue
    @Column(name = "id", unique = true, nullable = false)
    public Integer getId() {
        return this.id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "email", nullable = false, length = 50)
    public String getEmail() {
        return this.email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    @Column(name = "checknumber", nullable = false, length = 50)
    public String getCheckNumber() {
        return this.checkNumber;
    }
    public void setCheckNumber(String checkNumber) {
        this.checkNumber = checkNumber;
    }

    @Column(name = "isvalid", nullable = false)
    public Integer getIsValid() {
        return this.isValid;
    }
    public void setIsValid(Integer isValid) {
        this.isValid = isValid;
    }

}
