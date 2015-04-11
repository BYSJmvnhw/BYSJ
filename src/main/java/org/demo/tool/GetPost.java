package org.demo.tool;

/**
 * Created by peifeng on 2015/3/21.
 */
//根据邮件名获取邮局
public class GetPost {
    private static final String smptPost163 = "smtp.163.com";
    private static final String smptPostQQ = "smtp.qq.com";
    private static final String smptPostSina = "smtp.sina.com";
    private static final String smptPostSohu = "smtp.sohu.com";
    private static final String popPost163 = "pop.163.com";
    private static final String popPostQQ = "pop.qq.com";
    private static final String popPostSina = "pop.sina.com";
    private static final String popPostSohu = "pop.sohu.com";
    public static String getSmptPost(String email) {
        String smptpost = email.substring(email.lastIndexOf("@"));
        if("@163.com".equals(smptpost)) {
            return smptPost163;
        }
        if("@qq.com".equals(smptpost)) {
            return smptPostQQ;
        }
        if("@sina.com".equals(smptpost)) {
            return smptPostSina;
        }
        if("@sohu.com".equals(smptpost)) {
            return smptPostSohu;
        }else {
            return "";
        }
    }
    public static String getPopPost(String email) {
        String poppost = email.substring(email.lastIndexOf("@"));
        if("@163.com".equals(poppost)) {
            return popPost163;
        }
        if("@qq.com".equals(poppost)) {
            return popPostQQ;
        }
        if("@sina.com".equals(poppost)) {
            return popPostSina;
        }
        if("@sohu.com".equals(poppost)) {
            return popPostSohu;
        }else {
            return "";
        }
    }
}
