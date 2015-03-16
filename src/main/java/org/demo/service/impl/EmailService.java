package org.demo.service.impl;

import net.sf.json.JSONObject;
import org.demo.dao.IBaseDao;
import org.demo.dao.IHomeworkDao;
import org.demo.dao.IHomeworkInfoDao;
import org.demo.dao.impl.HomeworkDao;
import org.demo.dao.impl.HomeworkInfoDao;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.service.IEmailService;
import org.demo.service.IHomeworkService;
import org.springframework.stereotype.*;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import javax.mail.search.*;
import javax.servlet.http.HttpServletRequest;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Properties;
/**
 * Created by peifeng on 2015/1/31.
 */
@Service
public class EmailService implements IEmailService {

    //作业
    private IHomeworkDao homeworkDao;
    @Resource
    public void setHomeworkDao(IHomeworkDao homeworkDao) {
        this.homeworkDao = homeworkDao;
    }
    //作业信息
    private IHomeworkInfoDao homeworkInfoDao;
    @Resource
    public void setHomeworkInfoDao(IHomeworkInfoDao homeworkInfoDao) {
        this.homeworkInfoDao = homeworkInfoDao;
    }

    private IBaseDao baseDao;
    @Resource
    public void setBaseDao(IBaseDao baseDao) {
        this.baseDao = baseDao;
    }
    public viewmodel updatesome() {
        String hql = "select new org.demo.service.impl.viewmodel(hw.hwCourse.courseNo) from HwHomework hw where hw.id = 1";
        return (viewmodel)baseDao.findObject(hql);
    }


    //Json对象
    private JSONObject jsonResult;
    //获得homeworkinfo中的所有未过期且当前时间<=deadline的作业信息
    private List<HwHomeworkInfo> getHomeworkInfos() {
        Date date = new Date();
        String hql = "from HwHomeworkInfo hi where hi.overtime=0 and hi.deadline>='" + new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date) + "'";
        return homeworkInfoDao.list(hql);
    }
    //获取一个已经生成的作业
    private HwHomework getHomework(int hwInfoId, String studentNo) {
        String hql = "from HwHomework h where h.hwHomeworkInfo.id=? and h.studentNo=?";
        Object[] args = {hwInfoId,studentNo};
        return homeworkDao.findObject(hql,args);
    }
    //从邮件主题获得学号
    private String getStudentNoFromSubject(String subject) {
        return "20112100182";
    }
    //根据作业信息生成查询条件
    private SearchTerm getSearchTerm(Date startTime, Date endTime, String course, String title) {
        SearchTerm dateGE = new SentDateTerm(ComparisonTerm.GE,startTime);
        SearchTerm dateLE = new SentDateTerm(ComparisonTerm.LE,endTime);
        SearchTerm Course = new SubjectTerm(course);
        SearchTerm Title = new SubjectTerm(title);
        SearchTerm searchDate = new AndTerm(dateGE,dateLE);
        SearchTerm searchSubject = new AndTerm(Course,Title);
        SearchTerm searchTerm = new AndTerm(searchDate,searchSubject);
        return searchTerm;
    }
    //获得Message,调用查询条件函数
    private Message[] getMessages(Date startTime, Date endTime, String course, String title,
                                  String emailAddress, String emailPassword) throws Exception {
        try {
            Properties props = new Properties();
            props.setProperty("mail.store.protocol", "pop3");
            props.setProperty("mail.pop3.host", "pop3.163.com");
            Session mailSession = Session.getInstance(props);
            Store mailStore = mailSession.getStore("pop3");
            mailStore.connect("pop3.163.com",emailAddress,emailPassword);
            Folder mailFolder = mailStore.getFolder("INBOX");
            mailFolder.open(Folder.READ_ONLY);
            SearchTerm searchTerm = getSearchTerm(startTime, endTime, course, title);
            Message message[] = mailFolder.search(searchTerm);
            return message;
        }catch(Exception ex) {
            System.out.println("GetMessages 出错");
//            ex.printStackTrace();
            throw ex;
        }
    }
    //保存附件
    private String saveAttachment(Part part, String preFilePath, String midFilePath) throws Exception {
        try {
            //get name of untreated attachment
            String filename = part.getFileName();
            //to decode the filename
            filename = MimeUtility.decodeText(filename);
            //文件在磁盘的保存位置
            String Directory = preFilePath + midFilePath + filename;
            InputStream in = part.getInputStream();
            FileOutputStream writer = new FileOutputStream(Directory);
            byte[] content= new byte[512];
            while(in.read(content) != -1) {
                writer.write(content);
            }
            writer.close();
            in.close();
            String url = midFilePath + filename;
            return url;
        } catch (Exception e) {
            System.out.println("SaveAttachment 出错");
//            e.printStackTrace();
            throw e;
//            return midFilePath;
        }
    }
    //保存邮件，调用保存附件函数和从邮件主题获得学号函数
    private void saveMessage(Message message, String preFilePath, String midFilePath, int hwInfoId) throws Exception {
        try {
            String hwUrl = midFilePath;
            String hwWord = null;
            //保存附件，默认情况只会有一份
            Multipart mtp = (Multipart)message.getContent();
            for(int j =0; j < mtp.getCount(); j++) {
                Part part = mtp.getBodyPart(j);
                String disposition = part.getDisposition();
                //have attach,save the attachment
                if( disposition != null && (disposition.equals(Part.ATTACHMENT) || disposition.equals(Part.INLINE))) {
                    //save file
                    hwUrl = saveAttachment(part, preFilePath, midFilePath);
                }
                //not attachment.only display the text content
                else {
                    hwWord = part.getContent().toString();
                }
            }
            //获取当前学生对应这份作业信息的作业
            Date submitDate = message.getSentDate();
            String subject = message.getSubject();
            String studentNo = getStudentNoFromSubject(subject);
            System.out.println(submitDate + "  " + subject + "  " + hwInfoId + "  " +studentNo);
            System.out.println(hwUrl);
            HwHomework homework = getHomework(hwInfoId,studentNo);
            homework.setSubmitDate(new Timestamp(submitDate.getTime()));
            if(hwUrl != null && !hwUrl.equals(midFilePath)) {
                homework.setUrl(hwUrl);
            }
            homework.setComment(hwWord);
            System.out.println(homework.getId() + "  " + homework.getUrl() + "  " + homework.getSubmitDate());
            homeworkDao.update(homework);  //这里不执行

        } catch (Exception ex) {
            System.out.println("SaveMessage 出错");
            throw ex;
//            ex.printStackTrace();
        }
    }
    //filePath是文件存放的根目录地址
    public String updateEmail(String preFilePath) {

        System.out.println("  @:  " + preFilePath);
        jsonResult = new JSONObject();
        jsonResult.clear();

        List<HwHomeworkInfo> homeworkInfos = getHomeworkInfos();
        for(HwHomeworkInfo hwInfo : homeworkInfos) {
            int hwInfoId = hwInfo.getId();
            Date startTime = hwInfo.getCreateDate();
            Date endTime = hwInfo.getDeadline();
            String course = hwInfo.getCourseName();
            String title = hwInfo.getTitle();
            String emailAddress = hwInfo.getHwCourseTeaching().getEmail();
            String emailPassword = hwInfo.getHwCourseTeaching().getPassword();
            String midFilePath = hwInfo.getUrl();
            System.out.println("  @:  " + hwInfoId + "  @:  " + midFilePath);
            try {
                Message messages[] = getMessages(startTime, endTime, course, title, emailAddress, emailPassword);
                if(messages != null) {
                    for(Message message : messages) {
                        saveMessage(message, preFilePath, midFilePath, hwInfoId);
                    }
                    jsonResult.put("status",1);
                    jsonResult.put("message","success");
                }else {
                    jsonResult.put("status",-1);
                    jsonResult.put("message","no email message");
                }

            }catch(Exception ex) {
                ex.printStackTrace();
                jsonResult.put("status",-1);
                jsonResult.put("message","some error");
            }
        }
        return jsonResult.toString();
    }
    //向一人发送邮件
    public String sendSimpleEmail(String senderAddress, String senderPassword,
                                  String recipientAddress, String emailSubject ,String text) {
        jsonResult = new JSONObject();
        jsonResult.clear();
        if((senderAddress == null || senderAddress.isEmpty()) ||
                (senderPassword == null || senderPassword.isEmpty()) ||
                ( recipientAddress == null || recipientAddress.isEmpty())) {
            jsonResult.put("status","-2");  //邮件发、收件人信息不全
        }else {
            try{
                Properties props = new Properties();
                props.put("mail.smtp.host", "smtp.163.com");
                props.put("mail.smtp.auth", true);
                Session mailConnection = Session.getInstance(props, null);
                Message msg = new MimeMessage(mailConnection);
                InternetAddress sender = new InternetAddress(senderAddress);
                msg.setFrom(sender);
                InternetAddress recipient = new InternetAddress(recipientAddress);
                msg.setRecipient(Message.RecipientType.TO, recipient);
                msg.setSubject(emailSubject);  //邮件主题
                msg.setText(text);  //邮件文本内容
                msg.setSentDate(new Date());  //邮件发送时间
                msg.saveChanges();
                Transport trans= mailConnection.getTransport("smtp");
                trans.connect("smtp.163.com", senderAddress, senderPassword);
                trans.sendMessage(msg, msg.getAllRecipients());
                trans.close();
                jsonResult.put("status","1");  //邮件发送成功
            } catch(Exception ex) {
                ex.printStackTrace();
                jsonResult.put("status","-1");  //邮件发送失败
            }
        }
        return jsonResult.toString();
    }
    //向多人发送邮件
    public String sendSimpleEmails(String senderAddress, String senderPassword,
                                   List<String> recipientAddress, String emailSubject ,String text) {
        jsonResult = new JSONObject();
        jsonResult.clear();
        if((senderAddress == null || senderAddress.isEmpty()) ||
                (senderPassword == null || senderPassword.isEmpty()) ||
                ( recipientAddress == null || recipientAddress.isEmpty())) {
            jsonResult.put("status","-2");  //邮件发、收件人信息不全
        }else {
            try{
                Properties props = new Properties();
                props.put("mail.smtp.host", "smtp.163.com");
                props.put("mail.smtp.auth", true);
                Session mailConnection = Session.getInstance(props, null);
                Message msg = new MimeMessage(mailConnection);
                InternetAddress sender = new InternetAddress(senderAddress);
                msg.setFrom(sender);
                InternetAddress[] recipients = new InternetAddress[recipientAddress.size()];
                for(int i = 0; i < recipientAddress.size();i++)
                {
                    recipients[i] = new InternetAddress(recipientAddress.get(i));
                }
                msg.setRecipients(Message.RecipientType.TO, recipients);
                msg.setSubject(emailSubject);  //邮件主题
                msg.setText(text);  //邮件文本内容
                msg.setSentDate(new Date());  //邮件发送时间
                msg.saveChanges();
                Transport trans= mailConnection.getTransport("smtp");
                trans.connect("smtp.163.com", senderAddress, senderPassword);
                trans.sendMessage(msg, msg.getAllRecipients());
                trans.close();
                jsonResult.put("status","1");  //邮件发送成功
            } catch(Exception ex) {
                ex.printStackTrace();
                jsonResult.put("status","-1");  //邮件发送失败
            }
        }
        return jsonResult.toString();
    }
}
