package org.demo.action;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.ServletActionContext;
import org.demo.model.HwUser;
import org.demo.service.IUserService;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import javax.annotation.Resource;

/*
 * Created by jzchen on 2014/12/25.
 */

@Controller
@Scope("prototype")
public class LoginAction extends BaseAction /*implements ModelDriven<HwUser> */{

    private IUserService userService;

    private String username;
    private String password;

    public String loginPage() {
        System.out.println("Enter the LoginPage");
        return SUCCESS;
    }

    public String login() {
        System.out.println(username + "-->" + password );
        HwUser user = userService.findUser(username);
        if( user != null ) {
            if( user.getPassword().equals(this.password) ) {
                getContext().getSession().put("loginUser", user);
                getContext().getSession().put("msg", "登录成功");
                return SUCCESS;
            }else {
                getContext().getSession().put("msg", "密码错误");
                getContext().put("url", "login_loginPage.action");
                return "redirect";
            }
        }else {
            getContext().getSession().put("msg", "用户名不存在");
            getContext().put("url", "login_loginPage.action");
            return "redirect";
        }
    }


/*    @Override
    public HwUser getModel() {

        return null;
    }*/

    public IUserService getUserService() {
        return userService;
    }

    @Resource
    public void setUserService(IUserService userService) {
        this.userService = userService;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


}
