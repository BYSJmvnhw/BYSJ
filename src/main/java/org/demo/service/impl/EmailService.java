package org.demo.service.impl;

import net.sf.json.JSONObject;
import org.demo.dao.IBaseDao;
import org.demo.dao.IHomeworkDao;
import org.demo.dao.IHomeworkInfoDao;
import org.demo.dao.IStudentDao;
import org.demo.model.HwHomework;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.HwStudent;
import org.demo.service.IEmailService;
import org.demo.tool.GetPost;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import javax.mail.search.*;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
    //学生
    private IStudentDao studentDao;
    @Resource
    public void setStudentDao(IStudentDao studentDao) {
        this.studentDao = studentDao;
    }
    private IBaseDao baseDao;
    @Resource
    public void setBaseDao(IBaseDao baseDao) {
        this.baseDao = baseDao;
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

    //Json对象
    private JSONObject jsonResult;
    //获得homeworkinfo中的所有未过期且当前时间>=deadline的作业信息
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
    //从邮件主题获得学号(未完成)
    private String getStudentNoFromSubject(String subject) {
        String number="";
        String sp = "(\\d{10,11})";
        Pattern pattern = Pattern.compile(sp);
        Matcher matcher = pattern.matcher(subject);
        while(matcher.find()) {
            number = matcher.group(0);
        }
        return number;
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
    private Message[] getMessages(String popPost,Date startTime, Date endTime, String course, String title,
                                  String emailAddress, String emailPassword) throws Exception {
        try {
            Properties props = new Properties();
            props.setProperty("mail.store.protocol", "pop3");
            props.setProperty("mail.pop3.host", popPost);
            Session mailSession = Session.getInstance(props);
            Store mailStore = mailSession.getStore("pop3");
            mailStore.connect(popPost,emailAddress,emailPassword);
            Folder mailFolder = mailStore.getFolder("INBOX");
            mailFolder.open(Folder.READ_ONLY);
            SearchTerm searchTerm = getSearchTerm(startTime, endTime, course, title);
            Message message[] = mailFolder.search(searchTerm);
            return message;
        }catch(Exception ex) {
            System.out.println("GetMessages 出错");
            //ex.printStackTrace();
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
            //e.printStackTrace();
            throw e;
            //return midFilePath;
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
            HwHomework homework = getHomework(hwInfoId,studentNo);
            homework.setSubmitDate(new Timestamp(submitDate.getTime()));
            if(hwUrl != null && !hwUrl.equals(midFilePath)) {
                homework.setUrl(hwUrl);
            }
            homework.setComment(hwWord);
            homeworkDao.update(homework);

        } catch (Exception ex) {
            System.out.println("SaveMessage 出错");
            throw ex;
            //ex.printStackTrace();
        }
    }
    //filePath是文件存放的根目录地址
    public JSONObject saveEmail(String preFilePath) {

        jsonResult = new JSONObject();
        jsonResult.clear();

        List<HwHomeworkInfo> homeworkInfos = getHomeworkInfos();
        if(homeworkInfos == null) {
            jsonResult.put("message","没有作业信息");return jsonResult;
        }
        for(HwHomeworkInfo hwInfo : homeworkInfos) {
            String emailAddress = hwInfo.getHwCourseTeaching().getEmail();
            String popPost = GetPost.getPopPost(emailAddress);
            if(popPost == null || popPost.equals("")) {
                System.out.println("存在作业信息邮箱不合法");
                continue;
            }
            int hwInfoId = hwInfo.getId();
            Date startTime = hwInfo.getLastReceiveDate();
            Date endTime = hwInfo.getDeadline();
            String course = hwInfo.getCourseName();
            String title = hwInfo.getTitle();
            String emailPassword = hwInfo.getHwCourseTeaching().getPassword();
            String midFilePath = hwInfo.getUrl();
            //获取信息完毕，修改并更新
            hwInfo.setLastReceiveDate(new Timestamp(new Date().getTime()));
            homeworkInfoDao.update(hwInfo);
            try {
                Message messages[] = getMessages(popPost,startTime, endTime, course, title, emailAddress, emailPassword);
                if(messages == null) {
                    continue;
                }
                for(Message message : messages) {
                    saveMessage(message, preFilePath, midFilePath, hwInfoId);
                }
            }catch(Exception ex) {
                jsonResult.put("errorMessage","some error");
                ex.printStackTrace();
            }
        }
        jsonResult.put("message","完成任务");
        return jsonResult;
    }
    //向一人发送邮件
    public void sendSimpleEmailToOne(String smptPost,String senderAddress, String senderPassword,
                                  String recipientAddress, String emailSubject ,String text) throws Exception {
        if((smptPost == null || smptPost.isEmpty()) ||
                (senderAddress == null || senderAddress.isEmpty()) ||
                (senderPassword == null || senderPassword.isEmpty()) ||
                (recipientAddress == null || recipientAddress.isEmpty())) {
            return;
        }else {
            Properties props = new Properties();
            props.put("mail.smtp.host", smptPost);
            props.put("mail.smtp.auth", true);
            Session mailConnection = Session.getInstance(props, null);
            Transport trans= mailConnection.getTransport("smtp");
            trans.connect(smptPost, senderAddress, senderPassword);
            InternetAddress sender = new InternetAddress(senderAddress);
            InternetAddress recipient = new InternetAddress(recipientAddress);
            Message msg = new MimeMessage(mailConnection);
            msg.setFrom(sender);
            msg.setRecipient(Message.RecipientType.TO, recipient);
            msg.setSubject(emailSubject);  //邮件主题
            msg.setText(text);  //邮件文本内容
            msg.setSentDate(new Date());  //邮件发送时间
            msg.saveChanges();
            trans.sendMessage(msg, msg.getAllRecipients());
            trans.close();
        }
    }
    //向多人发送邮件
    public void sendSimpleEmailToMany(String smptPost,String senderAddress, String senderPassword,
                                   List<String> recipientAddress, String emailSubject ,String text) throws Exception {
        if((smptPost == null || smptPost.isEmpty()) ||
                (senderAddress == null || senderAddress.isEmpty()) ||
                (senderPassword == null || senderPassword.isEmpty()) ||
                (recipientAddress == null || recipientAddress.isEmpty())) {
            return;
        }else {
            Properties props = new Properties();
            props.put("mail.smtp.host", smptPost);
            props.put("mail.smtp.auth", true);
            Session mailConnection = Session.getInstance(props, null);
            Transport trans= mailConnection.getTransport("smtp");
            trans.connect(smptPost, senderAddress, senderPassword);
            InternetAddress sender = new InternetAddress(senderAddress);
            InternetAddress[] recipients = new InternetAddress[recipientAddress.size()];
            Message msg = new MimeMessage(mailConnection);
            for(int i = 0; i < recipientAddress.size();i++)
            {
                recipients[i] = new InternetAddress(recipientAddress.get(i));
            }
            msg.setFrom(sender);
            msg.setRecipients(Message.RecipientType.TO, recipients);
            msg.setSubject(emailSubject);  //邮件主题
            msg.setText(text);  //邮件文本内容
            msg.setSentDate(new Date());  //邮件发送时间
            msg.saveChanges();
            trans.sendMessage(msg, msg.getAllRecipients());
            trans.close();
        }
    }
    //向多人发送多份邮件
    public void sendSimpleEmailsToMany(String smptPost,String senderAddress, String senderPassword,
                                   List<String> recipientAddress, String emailSubject ,List<String> text) throws Exception {
        if((smptPost == null || smptPost.isEmpty()) ||
                (senderAddress == null || senderAddress.isEmpty()) ||
                (senderPassword == null || senderPassword.isEmpty()) ||
                (recipientAddress == null || recipientAddress.isEmpty())) {
            return;
        }
        else {
            Properties props = new Properties();
            props.put("mail.smtp.host", smptPost);
            props.put("mail.smtp.auth", true);
            Session mailConnection = Session.getInstance(props, null);
            Transport trans= mailConnection.getTransport("smtp");
            trans.connect(smptPost, senderAddress, senderPassword);
            InternetAddress sender = new InternetAddress(senderAddress);
            for(int i = 0;i < recipientAddress.size();i++) {
                InternetAddress recipient = new InternetAddress(recipientAddress.get(i));
                Message msg = new MimeMessage(mailConnection);
                msg.setFrom(sender);
                msg.setRecipient(Message.RecipientType.TO, recipient);
                msg.setSubject(emailSubject);  //邮件主题
                msg.setText(text.get(i));  //邮件文本内容
                msg.setSentDate(new Date());  //邮件发送时间
                msg.saveChanges();
                trans.sendMessage(msg, msg.getAllRecipients());
            }
            trans.close();
        }
    }
    //获得当前时间减去作业最后提交时间小于或等于3天的作业信息
    private List<HwHomeworkInfo> getHwInfoIdByDeadline() {
        String hql = "from HwHomeworkInfo hi where hi.overtime=0 and datediff(hi.deadline,Now()) between 0 and 2";
        return homeworkInfoDao.list(hql);
    }
    //获得指对应作业信息中未提交作业的学生
    private List<HwStudent> getStudentEmailByHwInfo(int hwinfoId) {
        String hql = "select h.hwStudent from HwHomework h where h.hwHomeworkInfo.id=? and (h.url is null or h.url='')";
        return studentDao.list(hql,hwinfoId);
    }
    //催缴作业
    public JSONObject callToDo() {
        jsonResult = new JSONObject();jsonResult.clear();
        String smptPost = GetPost.getSmptPost(systemEmail);
        if(smptPost == null || smptPost.equals("")){
            jsonResult.put("errorMessage","系统邮箱不合法");
            return jsonResult;
        }
        List<HwHomeworkInfo> homeworkInfos = getHwInfoIdByDeadline();
        if(homeworkInfos == null) {
            jsonResult.put("message","没有3天内的作业");
            return jsonResult;
        }
        for(HwHomeworkInfo hwinfo : homeworkInfos) {
            int infoid = hwinfo.getId();
            //String senderAddress = systemEmail;
            //String senderPassword = systemEmailPass;
            List<HwStudent> students = getStudentEmailByHwInfo(infoid);
            if(students == null) {
                continue;
            }
            List<String> studentEmails = new ArrayList<String>();
            List<String> emailTexts = new ArrayList<String>();
            for(HwStudent student : students){
                if(student.getEmail() != null && !student.getEmail().equals("")) {
                    studentEmails.add(student.getEmail());
                    String name = student.getName();
                    String number = student.getStudentNo();
                    String course = hwinfo.getCourseName();
                    String title = hwinfo.getTitle();
                    String hwEmail = hwinfo.getEmail();
                    String text = name + "（学号：" + number + "),您的课程： '" + course + "';作业： '" + title + "'还未提交。"+
                            "请登录本系统提交，或者发作业到邮箱： " + hwEmail;
                    emailTexts.add(text);
                }
            }
            //发送催缴邮件
            try {
                sendSimpleEmailsToMany("",systemEmail, systemEmailPass, studentEmails, "作业催缴" ,emailTexts);
            } catch (Exception e) {
                jsonResult.put("errorMessage","部分邮件发送出错");
                e.printStackTrace();
            }
        }
        jsonResult.put("message","完成任务");
        return jsonResult;
    }
    //获取指定作业信息
    private HwHomeworkInfo getHomeworkInfo(int infoId) {
        return homeworkInfoDao.get(infoId);
    }
    //立即收取指定课程的作业
    public JSONObject saveHomeworkNow(int infoId, String preFilePath) {
        jsonResult = new JSONObject();jsonResult.clear();
        HwHomeworkInfo hwInfo = getHomeworkInfo(infoId);
        if(hwInfo == null) {
            jsonResult.put("message","不存在错误");return jsonResult;
        }
        if(hwInfo.getDeadline().before(new Date())) {
            jsonResult.put("message","作业已过期错误");return jsonResult;
        }
        String emailAddress = hwInfo.getHwCourseTeaching().getEmail();
        String popPost = GetPost.getPopPost(emailAddress);
        if(popPost == null || popPost.equals("")) {
            jsonResult.put("message","作业信息邮箱不合法");return jsonResult;
        }
        Date startTime = hwInfo.getLastReceiveDate();
        Date endTime = hwInfo.getDeadline();
        String course = hwInfo.getCourseName();
        String title = hwInfo.getTitle();
        String emailPassword = hwInfo.getHwCourseTeaching().getPassword();
        String midFilePath = hwInfo.getUrl();
        //获取信息完毕，修改并更新
        hwInfo.setLastReceiveDate(new Timestamp(new Date().getTime()));
        homeworkInfoDao.update(hwInfo);
        try {
            Message messages[] = getMessages(popPost,startTime, endTime, course, title, emailAddress, emailPassword);
            if(messages == null) {
                jsonResult.put("message","没有新作业");return jsonResult;
            }
            for(Message message : messages) {
                saveMessage(message, preFilePath, midFilePath,infoId);
            }
        }catch(Exception ex) {
            jsonResult.put("errorMessage","some error");
            ex.printStackTrace();
        }
        jsonResult.put("message","完成任务");return jsonResult;
    }
}
