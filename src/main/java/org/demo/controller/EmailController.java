package org.demo.controller;

import org.demo.dao.IHomeworkDao;
import org.demo.model.HwHomework;
import org.demo.service.IEmailService;
import org.demo.service.IHomeworkService;
import org.demo.service.impl.EmailService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by peifeng on 2015/3/12.
 */
@Controller
public class EmailController {

    private IEmailService emailService;
    @Resource
    public void setEmailService(IEmailService emailService) {
        this.emailService = emailService;
    }

    private IHomeworkService homeworkService;
    @Resource
    public void setHomeworkService(IHomeworkService homeworkService) {
        this.homeworkService = homeworkService;
    }



    @RequestMapping(value = "/do", method = RequestMethod.GET)
    @ResponseBody
    public String doo() {
//        List<String> li = new ArrayList<String>();
//        li.add("377970076@qq.com");
//        li.add("592283667@qq.com");
//        return emailService.sendSimpleEmails("scnucpf@163.com","peifeng",li,"test","test");
        return emailService.updatesome().getUrl();

    }
}
