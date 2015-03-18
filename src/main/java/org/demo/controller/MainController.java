package org.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by jzchen on 2015/3/18 0018.
 */
@Controller
@RequestMapping("/web")
public class MainController {

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String abc() {
        return "web/webapp";
    }
}
