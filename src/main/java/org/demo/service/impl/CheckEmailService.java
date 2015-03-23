package org.demo.service.impl;

import net.sf.json.JSONObject;
import org.demo.dao.ICheckEmailDao;
import org.demo.model.HwCheckEmail;
import org.demo.service.ICheckEmailService;
import org.demo.service.IEmailService;
import org.demo.tool.GetPost;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * Created by peifeng on 2015/3/19.
 */
@Service
public class CheckEmailService implements ICheckEmailService {

    private ICheckEmailDao checkEmailDao;
    @Resource
    public void setCheckEmailDao(ICheckEmailDao checkEmailDao) {
        this.checkEmailDao = checkEmailDao;
    }
    private IEmailService emailService;
    @Resource
    public void setEmailService(IEmailService emailService) {
        this.emailService = emailService;
    }
    private String systemEmail;
    @Value("${email}")
    public void setSystemEmail(String systemEmail) {
        this.systemEmail = systemEmail;
    }
    private String systemEmailPass;
    @Value("${password}")
    public void setSystemEmailPass(String systemEmailPass) {
        this.systemEmailPass = systemEmailPass;
    }

    private void save(HwCheckEmail checkemail) {
        checkEmailDao.add(checkemail);
    }
    private void update(HwCheckEmail checkemail) {
        checkEmailDao.update(checkemail);
    }
    //生成13位时间戳
    private String getTimestamp() {
        return System.currentTimeMillis()+"";
    }
    //判断该邮箱是否存在，存在但未验证，发送验证码，不存在，插入并发送验证码
    public JSONObject findEmailExist(String email) {
        JSONObject jsonresult = new JSONObject();jsonresult.clear();
        String smptPost = GetPost.getSmptPost(email);
        if(smptPost == null || smptPost.equals("")) {
            jsonresult.put("isChecked",false);
            jsonresult.put("message","邮箱不合法");
            return jsonresult;
        }
        HwCheckEmail checkEmail = checkEmailDao.findObject("from HwCheckEmail ce where ce.email=?",email);
        if(checkEmail == null) {
            String timestamp = getTimestamp();
            HwCheckEmail newCheckEmail = new HwCheckEmail(email,timestamp,0);
            save(newCheckEmail);
            //
            //发送验证码到邮箱
            try {
                emailService.sendSimpleEmailToOne(smptPost,systemEmail,systemEmailPass,email,"邮箱验证","验证码："+timestamp);
            } catch (Exception e) {
                e.printStackTrace();
            }
            //
            jsonresult.put("isChecked",false);
            jsonresult.put("message","该邮箱未验证，验证码已发送到此邮箱");
            return jsonresult;
        }else {
            if(checkEmail.getIsValid()==0) {
                String timestamp = checkEmail.getCheckNumber();
                //
                //发送验证码到邮箱
                try {
                    emailService.sendSimpleEmailToOne(smptPost,systemEmail,systemEmailPass,email,"邮箱验证","验证码："+timestamp);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //
                jsonresult.put("isChecked",false);
                jsonresult.put("message","该邮箱未验证，验证码已发送到此邮箱");
                return jsonresult;
            }else {
                jsonresult.put("isChecked",true);
                jsonresult.put("message","该邮箱已经验证");
                return jsonresult;
            }
        }
    }
    //输入验证码完成验证
    public JSONObject findCheck(String email,String checkNumber) {
        JSONObject jsonresult = new JSONObject();jsonresult.clear();
        String[] params = {email,checkNumber};
        HwCheckEmail checkEmail = checkEmailDao.findObject("from HwCheckEmail ce where ce.email=? and ce.checkNumber=?",params);
        if(checkEmail != null) {
            checkEmail.setIsValid(1);
            update(checkEmail);
            jsonresult.put("status","success");
            return jsonresult;
        }else {
            jsonresult.put("status","error");
            return jsonresult;
        }
    }
}
