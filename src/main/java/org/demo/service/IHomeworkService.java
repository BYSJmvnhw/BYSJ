package org.demo.service;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.demo.model.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created by jzchen on 2015/1/14.
 */
public interface IHomeworkService {

    public void add(HwHomework homework);

    public HwHomework load(Integer id);

    public void update(HwHomework homework);

    public List homeworkList(Integer courseTeachingId, Integer studentId);

    public JSONObject submittedHomeworkPage(Integer hwInfoId, boolean submitted);

    public JSONObject courseSelectingPage(HwUser user, Integer startYear, Integer schoolTerm);

    public JSONObject courseTeachingPage(HwUser user, Integer startYear, Integer schoolTerm);

    public JSONArray homeworListInfo(Integer courseTeachingId, HwUser user);

    public JSONObject homeworkInfoDetail(Integer hwInfoId);

    public void addHomeworkInfo(String jsonObject, HwUser user) throws Exception;

    public void upload(MultipartFile hw, Integer hwinfoId,HwUser user, String backupPath) throws IOException;

    public void deleteHomeworkInfo(Integer hwInfoId);

    public void updateHomework(Integer I, String mark, String comment);

    public Map<String,Object> comment(Integer hwInfoId, HwUser user);

    public void updateCheckedFlag(Integer hwInfoId, HwUser user);
}
