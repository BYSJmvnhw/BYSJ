package org.demo.controller;

import net.sf.json.JSONObject;
import org.demo.dao.IHomeworkDao;
import org.demo.model.HwHomework;
import org.demo.model.HwThreadTime;
import org.demo.service.ICheckEmailService;
import org.demo.service.IEmailService;
import org.demo.service.IHomeworkService;
import org.demo.service.IThreadTimeService;
import org.demo.service.impl.EmailService;
import org.demo.tool.GetRealPath;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by peifeng on 2015/3/12.
 */
@Controller
@RequestMapping(value = "/Email")
public class EmailController {

    private IEmailService emailService;
    @Resource
    public void setEmailService(IEmailService emailService) {
        this.emailService = emailService;
    }

    private ICheckEmailService checkEmailService;
    @Resource
    public void setCheckEmailService(ICheckEmailService checkEmailService) {
        this.checkEmailService = checkEmailService;
    }

    private IThreadTimeService threadTimeService;
    @Resource
    public void setThreadTimeService(IThreadTimeService threadTimeService) {
        this.threadTimeService = threadTimeService;
    }

    //验证邮箱获取验证码接口
    @RequestMapping(value = "/getCheckNmuber",method = RequestMethod.GET)
    @ResponseBody
    public JSONObject getCheckNumber(String email) {
        return checkEmailService.findEmailExist(email);
    }
    //验证邮箱输入验证码接口
    @RequestMapping(value = "/inputCheckNumber",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject inputCheckNumber(String email,String checkNumber) {
        return checkEmailService.findCheck(email,checkNumber);
    }
    //指定作业信息立即收取作业
    @RequestMapping(value = "/saveHomeworkNow",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject saveHomeworkNow(int infoId) {
        return emailService.saveHomeworkNow(infoId,GetRealPath.getRealPath());
    }
    //指定作业信息立即催缴作业
    @RequestMapping(value = "/callToDoNow",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject callToDoNow(int infoId) {
        return emailService.callToDoNow(infoId);
    }

    //修改线程启动时间
    @RequestMapping(value = "/modifyThreadTime",method = RequestMethod.POST)
    @ResponseBody
    public JSONObject modifyThreadTime(int id, String name,int hour,int minute,int second) {
        return threadTimeService.updateDate(id,hour, minute, second,name);
    }
    //获取线程启动时间
    @RequestMapping(value = "/getThreadTime",method = RequestMethod.GET)
    @ResponseBody
    public List<HwThreadTime> getThreadTime() {
        return threadTimeService.getData();
    }
}
