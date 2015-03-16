package org.demo.service;

import org.demo.model.HwHomework;
import org.demo.service.impl.viewmodel;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by peifeng on 2015/3/12.
 */
public interface IEmailService {

    public String updateEmail(String preFilePath);
    public String sendSimpleEmail(String senderAddress, String senderPassword,
                                  String recipientAddress, String emailSubject ,String text);
    public String sendSimpleEmails(String senderAddress, String senderPassword,
                                   List<String> recipientAddress, String emailSubject ,String text);
    public viewmodel updatesome();
}
