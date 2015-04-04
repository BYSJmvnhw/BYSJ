package org.demo.service;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.demo.model.HwUser;

import java.util.List;
import java.util.Map;

/**
 * Created by jzchen on 2015/3/28 0028.
 */
public interface IMessageService {

    public JSONArray unSubmitedHomeworkList(Integer sId);

    public JSONArray recentHomework(Integer sId);

    public Map message(HwUser user);
}
