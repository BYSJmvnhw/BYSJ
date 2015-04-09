package org.demo.tool;

import java.util.regex.Pattern;

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
        if(Pattern.matches("\\w[.]\\w+@163.com",email)) {
            return smptPost163;
        }
        if(Pattern.matches("\\w+@qq.com",email)) {
            return smptPostQQ;
        }
        if(Pattern.matches("\\w+@sina.com",email)) {
            return smptPostSina;
        }
        if(Pattern.matches("\\w+@sohu.com",email)) {
            return smptPostSohu;
        }else {
            return "";
        }
    }
    public static String getPopPost(String email) {
        if(Pattern.matches("\\w+@163.com",email)) {
            return popPost163;
        }
        if(Pattern.matches("\\w+@qq.com",email)) {
            return popPostQQ;
        }
        if(Pattern.matches("\\w+@sina.com",email)) {
            return popPostSina;
        }
        if(Pattern.matches("\\w+@sohu.com",email)) {
            return popPostSohu;
        }else {
            return "";
        }
    }
}
