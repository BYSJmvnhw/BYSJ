package org.demo.controller;

import org.demo.dao.IRoleDao;
import org.demo.dao.ITeacherDao;
import org.demo.model.HwRole;
import org.demo.model.HwStudent;
import org.demo.model.HwTeacher;
import org.demo.model.HwUser;
import org.demo.service.IStudentService;
import org.demo.service.ITeacherService;
import org.demo.service.IUserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Created by jzchen on 2015/1/25.
 */

@Controller
@RequestMapping("/login")
public class LoginController {

    private IUserService userService;
    private IRoleDao roleDao;
    private IStudentService studentService;
    private ITeacherService teacherService;

    @RequestMapping( value = "/loginInput", method = RequestMethod.GET)
    public String login() {
        System.out.println("enter login_page!");
        return "login/loginInput";
    }

    @RequestMapping( value = "/login", method = RequestMethod.POST)
    public String login(String username, String password, Model model, HttpServletRequest request) {
        HwUser user = userService.findUser(username);

        if( user != null ) {
            if( user.getPassword().equals( password) ) {
                /* 在session中存入登录用户 */
                request.getSession().setAttribute("loginUser", user);
                /*  获取角色集合 */
                Set<HwRole> roleSet = user.getHwRoles();
                List<HwRole> roleList = new ArrayList<HwRole>(roleSet);
                /*  判断登录用户类型， */
               if(roleSet.contains(roleDao.load(2)) ) {
                    System.out.println("角色：教师");
                    request.getSession().setAttribute("userType", "教师");
                    HwTeacher teacher = teacherService.findTeacher(user.getUsername());
                    System.out.println(teacher);
                    request.getSession().setAttribute("loginTeacher", teacher);
                }
               else if( roleSet.contains(roleDao.load(1)) ) {
                   System.out.println("角色：学生");
                   request.getSession().setAttribute("userType", "学生");
                   HwStudent student = studentService.findStudent(user.getUsername());
                   System.out.println(student);
                   request.getSession().setAttribute("loginStudent", student);
               }

                model.addAttribute("msg", "登录成功");
                return "login/welcome";
            }else {
                model.addAttribute("msg", "密码错误");
                return "login/loginInput";
            }
        }else {
            model.addAttribute("msg", "用户名不存在");
            return "login/loginInput";
        }
    }

    public IUserService getUserService() {
        return userService;
    }

    @Resource
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

    public IRoleDao getRoleDao() {
        return roleDao;
    }
    @Resource
    public void setRoleDao(IRoleDao roleDao) {
        this.roleDao = roleDao;
    }

    public IStudentService getStudentService() {
        return studentService;
    }
    @Resource
    public void setStudentService(IStudentService studentService) {
        this.studentService = studentService;
    }

    public ITeacherService getTeacherService() {
        return teacherService;
    }
    @Resource
    public void setTeacherService(ITeacherService teacherService) {
        this.teacherService = teacherService;
    }
}
