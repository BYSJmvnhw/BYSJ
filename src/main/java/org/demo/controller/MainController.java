package org.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by jzchen on 2015/3/18 0018.
 */

/**
 * 用于单页面应用的拦截
 */
@Controller
public class MainController {

    @RequestMapping(value = "/web/**", method = RequestMethod.GET)
    public String webApp() {
        return "web/webapp";
    }

    @RequestMapping(value = "/manage/**", method = RequestMethod.GET)
    public String manegeApp() {
        return "manage/manageapp";
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index2() {
        return "redirect:/web/login";
    }


}
