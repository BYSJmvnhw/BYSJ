package org.demo.service;

import net.sf.json.JSONObject;
import org.demo.model.HwHomeworkInfo;
import org.demo.model.HwStudent;

import java.util.List;

/**
 * Created by peifeng on 2015/3/12.
 */
public interface IEmailService {

    public JSONObject saveEmail(String preFilePath);
    public void sendSimpleEmailToOne(String smptPost,String senderAddress, String senderPassword,
                                  String recipientAddress, String emailSubject ,String text) throws Exception;
    public void sendSimpleEmailToMany(String smptPost,String senderAddress, String senderPassword,
                                   List<String> recipientAddress, String emailSubject ,String text) throws Exception;
    public void sendSimpleEmailsToMany(String smptPost,String senderAddress, String senderPassword,
                                         List<String> recipientAddress, String emailSubject ,List<String> text)throws Exception;
    public JSONObject callToDo();
    public JSONObject saveHomeworkNow(int infoId, String preFilePath);
}
