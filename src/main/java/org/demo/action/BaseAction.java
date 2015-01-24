package org.demo.action;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import org.springframework.stereotype.Controller;

/**
 * Created by jzchen on 2015/1/14.
 */

@Controller
public class BaseAction extends ActionSupport{

    protected ActionContext actionContext;

    public ActionContext getContext() {
        if( actionContext == null )
            actionContext = ActionContext.getContext();
        return  actionContext;
    }

    protected boolean logined() {
        System.out.println( "context" + getContext());
        System.out.println( "session" + getContext().getSession());
        System.out.println( "session" + getContext().getSession().get("loginUser"));


        if ( getContext().getSession().get("loginUser") != null )
            return true;
        else
            return false;
    }

}
