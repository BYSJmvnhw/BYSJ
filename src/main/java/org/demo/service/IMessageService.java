package org.demo.service;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.List;

/**
 * Created by jzchen on 2015/3/28 0028.
 */
public interface IMessageService {

    public JSONArray unSubmitedHomeworkList(Integer sId);

    public JSONArray recentHomework(Integer sId);
}
