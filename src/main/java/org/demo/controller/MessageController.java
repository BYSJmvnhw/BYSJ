package org.demo.controller;

import net.sf.json.JSONObject;
import org.demo.model.HwUser;
import org.demo.service.IMessageService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.persistence.OneToMany;
import javax.servlet.http.HttpServletRequest;

/**
 * Created by jzchen on 2015/3/28 0028.
 */
@Controller
@RequestMapping("/message")
public class MessageController {

    private IMessageService messageService;

    /**
     * 学生登录提示信息，获取未提交作业信息接口
     * @param request HttpRequest请求，用于获取当前登录用户
     * @return
     */
    @RequestMapping(value = "/unSubmited", method = RequestMethod.GET)
    @ResponseBody
    public Object unSubmited(HttpServletRequest request) {
        try {
            HwUser user = (HwUser) request.getSession().getAttribute("loginUser");
            return messageService.unSubmitedHomeworkList(user.getTypeId());
        }catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    /**
     * 学生登录提示信息，获取最近作业信息接口，用于提交作业或者重新提交
     * @param request HttpRequest请求，用于获取当前登录用户
     * @return
     */
    @RequestMapping(value = "/recentHomework" , method = RequestMethod.GET)
    @ResponseBody
    public Object recentHomework(HttpServletRequest request){
        try{
            HwUser user = (HwUser)request.getSession().getAttribute("loginUser");
            return messageService.recentHomework(user.getTypeId());
        }catch (Exception e) {
            e.printStackTrace();
            return getFailResultJsonObject();
        }
    }

    public IMessageService getMessageService() {
        return messageService;
    }

    @Resource
    public void setMessageService(IMessageService messageService) {
        this.messageService = messageService;
    }

    private JSONObject getFailResultJsonObject(){
        JSONObject result = new JSONObject();
        result.put("status","fail");
        return result;
    }
    private JSONObject getSuccessResultJsonObject(){
        JSONObject result = new JSONObject();
        result.put("status","success");
        return result;
    }
}
