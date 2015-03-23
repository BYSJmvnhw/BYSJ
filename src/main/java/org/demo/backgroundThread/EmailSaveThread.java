package org.demo.backgroundThread;

import org.demo.service.IEmailService;
import org.demo.tool.GetRealPath;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Calendar;

/**
 * Created by peifeng on 2015/3/20.
 */
@Service
public class EmailSaveThread extends Thread {
    private IEmailService emailService;
    @Resource
    public void setEmailService(IEmailService emailService) {
        this.emailService = emailService;
    }

    public static boolean run = true;
    public EmailSaveThread() {
        if(run) {
            System.out.println("加载邮件作业收取线程");
            this.start();
            run = false;
        }
    }
    public void run() {
        //每天01::00:00启动
        while(true){
            try {
                Calendar c = Calendar.getInstance();
                c.set(Calendar.HOUR_OF_DAY,2);
                c.set(Calendar.MINUTE,0);
                c.set(Calendar.SECOND, 0);
                c.set(Calendar.MILLISECOND,0);
                Long initial = c.getTime().getTime();
                Long now = System.currentTimeMillis();
                if(initial < now) {
                    c.add(Calendar.DATE, 1);
                    initial = c.getTime().getTime();
                }
                Thread.sleep(initial - now);
                System.out.println("启动邮件作业收取线程");
                emailService.saveEmail(GetRealPath.getRealPath());
                //emailService.callToDo();
                System.out.println("结束邮件作业收取线程");

            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
