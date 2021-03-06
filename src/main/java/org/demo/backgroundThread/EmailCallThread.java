package org.demo.backgroundThread;

import org.demo.model.HwThreadTime;
import org.demo.service.IEmailService;
import org.demo.service.IThreadTimeService;
import org.demo.tool.GetRealPath;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Calendar;

/**
 * Created by peifeng on 2015/3/20.
 */
@Service
public class EmailCallThread extends Thread {
    private IEmailService emailService;
    @Resource
    public void setEmailService(IEmailService emailService) {
        this.emailService = emailService;
    }
    private IThreadTimeService threadTimeService;
    @Resource
    public void setThreadTimeService(IThreadTimeService threadTimeService) {
        this.threadTimeService = threadTimeService;
    }
    public static boolean run = true;
    public EmailCallThread() {
        if(run) {
            System.out.println("加载邮件作业催缴线程");
            this.start();
            run = false;
        }
    }
    public void run() {
        //每天01::00:00启动
        while(true){
            try {
                Thread.sleep(10000);
                HwThreadTime threadTime = threadTimeService.get(2);
                int hour = threadTime.getHour();
                int minute = threadTime.getMinute();
                int second = threadTime.getSecond();
                Calendar c = Calendar.getInstance();
                c.set(Calendar.HOUR_OF_DAY,hour);
                c.set(Calendar.MINUTE,minute);
                c.set(Calendar.SECOND, second);
                c.set(Calendar.MILLISECOND,0);
                Long initial = c.getTime().getTime();
                Long now = System.currentTimeMillis();
                if(initial < now) {
                    c.add(Calendar.DATE, 1);
                    initial = c.getTime().getTime();
                }
                Thread.sleep(initial - now);
                System.out.println("启动邮件作业催缴线程");
                //emailService.saveEmail(GetRealPath.getRealPath());
                emailService.callToDo();
                System.out.println("结束邮件作业催缴线程");

            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
